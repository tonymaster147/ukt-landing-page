<?php
/**
 * UKT landing page — quote form handler.
 *
 * Receives the multipart POST from the React form, stores any uploaded documents
 * in ./files_upload/, inserts the submission into the database, optionally emails
 * a notification, and returns JSON. The React app redirects to the thank-you page
 * when { "success": true } is returned.
 */

require __DIR__ . '/config.php';
require __DIR__ . '/smtp_mailer.php';

/* ------------------------------------------------------------------ */
/*  Never leak errors/credentials to the client — always return JSON.  */
/* ------------------------------------------------------------------ */
error_reporting(E_ALL);
ini_set('display_errors', '0');
mysqli_report(MYSQLI_REPORT_OFF); // PHP 8.1+ throws by default; we check errors manually.

set_exception_handler(function ($e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    error_log('[quote-submit] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    exit;
});

/* ------------------------------------------------------------------ */
/*  Headers / CORS                                                     */
/* ------------------------------------------------------------------ */
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

/* ------------------------------------------------------------------ */
/*  Read + validate fields                                             */
/* ------------------------------------------------------------------ */
function field($key)
{
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

$name        = field('name');
$email       = field('email');
$phone       = field('phone');
$from        = field('from');
$to          = field('to');
$purpose     = field('purpose');
$description = field('description');
$captcha     = field('captcha');
$captchaA    = (int) field('captcha_a');
$captchaB    = (int) field('captcha_b');

$errors = [];
if ($name === '') {
    $errors[] = 'Name is required.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email is required.';
}
// Math captcha: answer must equal the two operands presented to the user.
if (
    $captchaA < 1 || $captchaA > 9 ||
    $captchaB < 1 || $captchaB > 9 ||
    (int) $captcha !== $captchaA + $captchaB
) {
    $errors[] = 'The captcha answer is incorrect.';
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

/* ------------------------------------------------------------------ */
/*  Handle uploaded files                                              */
/* ------------------------------------------------------------------ */
$allowedExt = [
    'pdf', 'doc', 'docx', 'odt', 'rtf', 'txt',
    'jpg', 'jpeg', 'png', 'webp', 'gif',
    'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'zip',
];

$uploadDir = __DIR__ . '/files_upload';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$storedFiles = []; // public URLs (saved in the DB)
$storedPaths = []; // local paths + names (attached to the email)

if (!empty($_FILES['files']) && is_array($_FILES['files']['name'])) {
    $count = count($_FILES['files']['name']);
    for ($i = 0; $i < $count && count($storedFiles) < MAX_FILES; $i++) {
        if ($_FILES['files']['error'][$i] !== UPLOAD_ERR_OK) {
            continue;
        }
        $orig = $_FILES['files']['name'][$i];
        $tmp  = $_FILES['files']['tmp_name'][$i];
        $size = (int) $_FILES['files']['size'][$i];
        $ext  = strtolower(pathinfo($orig, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowedExt, true)) {
            continue;
        }
        if ($size <= 0 || $size > MAX_FILE_BYTES) {
            continue;
        }
        if (!is_uploaded_file($tmp)) {
            continue;
        }

        // Build a safe, unique filename.
        $base = preg_replace('/[^A-Za-z0-9_-]/', '_', pathinfo($orig, PATHINFO_FILENAME));
        $base = substr($base, 0, 60);
        $safe = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $base . '.' . $ext;
        $dest = $uploadDir . '/' . $safe;

        if (move_uploaded_file($tmp, $dest)) {
            @chmod($dest, 0644);
            $storedFiles[] = rtrim(FILES_PUBLIC_URL, '/') . '/' . $safe;
            $storedPaths[] = ['path' => $dest, 'name' => $orig];
        }
    }
}

/* ------------------------------------------------------------------ */
/*  Save to the database                                               */
/* ------------------------------------------------------------------ */
$port    = defined('DB_PORT') ? DB_PORT : null;
$mysqli  = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, $port ?? (int) ini_get('mysqli.default_port'));

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}
$mysqli->set_charset('utf8mb4');

$filesJson = json_encode($storedFiles, JSON_UNESCAPED_SLASHES);
$phoneFull = $phone !== '' ? '+44 ' . $phone : '';
$ip        = substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45);
$ua        = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

$sql = 'INSERT INTO ' . DB_TABLE
    . ' (name, email, phone, from_language, to_language, purpose, description, files, ip_address, user_agent)'
    . ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error (prepare). Is the table created?']);
    exit;
}
$stmt->bind_param(
    'ssssssssss',
    $name, $email, $phoneFull, $from, $to, $purpose, $description, $filesJson, $ip, $ua
);
$ok       = $stmt->execute();
$insertId = $stmt->insert_id;
$stmt->close();
$mysqli->close();

if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save your request. Please try again.']);
    exit;
}

/* ------------------------------------------------------------------ */
/*  Email notification via GSuite SMTP (with attachments)              */
/* ------------------------------------------------------------------ */
if (defined('NOTIFY_EMAIL') && NOTIFY_EMAIL !== '' && defined('SMTP_HOST')) {
    $esc = function ($v) {
        return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
    };

    $filesHtml = '(none)';
    if (!empty($storedFiles)) {
        $filesHtml = '<ul style="margin:6px 0;padding-left:18px">';
        foreach ($storedFiles as $u) {
            $filesHtml .= '<li><a href="' . $esc($u) . '">' . $esc($u) . '</a></li>';
        }
        $filesHtml .= '</ul>';
    }

    $rows = [
        ['Name', $name],
        ['Email', $email],
        ['Phone', $phoneFull],
        ['From language', $from],
        ['To language', $to],
        ['Purpose', $purpose],
    ];
    $rowsHtml = '';
    foreach ($rows as $r) {
        $rowsHtml .= '<tr>'
            . '<td style="padding:6px 12px;border:1px solid #eee;font-weight:bold;background:#fafafa">' . $esc($r[0]) . '</td>'
            . '<td style="padding:6px 12px;border:1px solid #eee">' . $esc($r[1] !== '' ? $r[1] : '—') . '</td>'
            . '</tr>';
    }

    $html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;max-width:640px">'
        . '<h2 style="color:#E8382B;margin:0 0 12px">New Free Quote Request #' . $insertId . '</h2>'
        . '<table style="border-collapse:collapse;width:100%">' . $rowsHtml . '</table>'
        . '<p style="margin:16px 0 4px;font-weight:bold">Description</p>'
        . '<p style="margin:0;white-space:pre-wrap">' . $esc($description !== '' ? $description : '(none)') . '</p>'
        . '<p style="margin:16px 0 4px;font-weight:bold">Uploaded files</p>'
        . $filesHtml
        . '<p style="margin:18px 0 0;color:#888;font-size:12px">Submitted from the translations.co.uk landing page on ' . date('d M Y H:i') . '.</p>'
        . '</div>';

    $smtpCfg = [
        'host'       => SMTP_HOST,
        'port'       => SMTP_PORT,
        'user'       => SMTP_USER,
        'pass'       => SMTP_PASS,
        'from_email' => SMTP_FROM_EMAIL,
        'from_name'  => SMTP_FROM_NAME,
    ];
    $attachments = (defined('EMAIL_ATTACH_FILES') && EMAIL_ATTACH_FILES) ? $storedPaths : [];

    $mailErr = null;
    $sent = smtp_send_mail(
        $smtpCfg,
        NOTIFY_EMAIL,
        'New Free Quote Request #' . $insertId . ' — translations.co.uk',
        $html,
        $email, // Reply-To the customer
        $attachments,
        $mailErr
    );
    if (!$sent) {
        error_log('[quote-submit] SMTP send failed: ' . $mailErr);
    }

    /* -------- Confirmation ("thank you") email to the customer -------- */
    if (defined('SEND_CONFIRMATION') && SEND_CONFIRMATION) {
        $greeting = $name !== '' ? 'Hi ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ',' : 'Hello,';
        $confirmHtml = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:560px">'
            . '<p style="margin:0 0 14px">' . $greeting . '</p>'
            . '<p style="margin:0 0 14px">Thanks for submitting your translation request. '
            . 'Our operators are looking for the best price and will email you shortly with a custom quote.</p>'
            . '<p style="margin:18px 0 0">Kind regards,<br><strong>' . htmlspecialchars(SMTP_FROM_NAME, ENT_QUOTES, 'UTF-8') . '</strong><br>'
            . '<a href="https://www.translations.co.uk" style="color:#E8382B">translations.co.uk</a></p>'
            . '</div>';

        $confErr = null;
        $confSent = smtp_send_mail(
            $smtpCfg,
            $email,
            CONFIRM_SUBJECT,
            $confirmHtml,
            NOTIFY_EMAIL, // customer replies go to your inbox
            [],
            $confErr
        );
        if (!$confSent) {
            error_log('[quote-submit] confirmation email failed: ' . $confErr);
        }
    }
}

echo json_encode(['success' => true, 'id' => $insertId]);
