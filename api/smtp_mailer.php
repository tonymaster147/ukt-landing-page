<?php
/**
 * Minimal, dependency-free SMTP mailer (STARTTLS + AUTH LOGIN) with attachments.
 * Built for Gmail / Google Workspace using an App Password.
 *
 * Returns true on success. On failure returns false and sets $error.
 *
 * @param array  $cfg  ['host','port','user','pass','from_email','from_name']
 * @param string|array $to
 * @param string $subject
 * @param string $htmlBody
 * @param string $replyTo
 * @param array  $attachments  list of ['path' => '/abs/path', 'name' => 'file.pdf']
 * @param string &$error
 */
function smtp_send_mail($cfg, $to, $subject, $htmlBody, $replyTo = '', $attachments = [], &$error = null)
{
    $timeout = 30;
    $recipients = is_array($to) ? $to : [$to];

    $fp = @stream_socket_client(
        'tcp://' . $cfg['host'] . ':' . $cfg['port'],
        $errno,
        $errstr,
        $timeout,
        STREAM_CLIENT_CONNECT
    );
    if (!$fp) {
        $error = "Connection failed: $errstr ($errno)";
        return false;
    }
    stream_set_timeout($fp, $timeout);

    $read = function () use ($fp) {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            // A space in the 4th char marks the final line of a multiline reply.
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };
    $put = function ($cmd) use ($fp) {
        fwrite($fp, $cmd . "\r\n");
    };
    $expect = function ($resp, $codes) use (&$error) {
        $code = substr((string) $resp, 0, 3);
        if (!in_array($code, (array) $codes, true)) {
            $error = 'SMTP error: ' . trim((string) $resp);
            return false;
        }
        return true;
    };

    $ehloName = $_SERVER['SERVER_NAME'] ?? 'localhost';

    if (!$expect($read(), '220')) { fclose($fp); return false; }
    $put("EHLO $ehloName");
    if (!$expect($read(), '250')) { fclose($fp); return false; }

    // Upgrade to TLS
    $put('STARTTLS');
    if (!$expect($read(), '220')) { fclose($fp); return false; }
    $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
        $crypto |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT;
    }
    if (!stream_socket_enable_crypto($fp, true, $crypto)) {
        $error = 'Failed to start TLS encryption.';
        fclose($fp);
        return false;
    }
    $put("EHLO $ehloName");
    if (!$expect($read(), '250')) { fclose($fp); return false; }

    // Authenticate
    $put('AUTH LOGIN');
    if (!$expect($read(), '334')) { fclose($fp); return false; }
    $put(base64_encode($cfg['user']));
    if (!$expect($read(), '334')) { fclose($fp); return false; }
    $put(base64_encode($cfg['pass']));
    if (!$expect($read(), '235')) { fclose($fp); return false; }

    // Envelope
    $put('MAIL FROM:<' . $cfg['from_email'] . '>');
    if (!$expect($read(), '250')) { fclose($fp); return false; }
    foreach ($recipients as $rcpt) {
        $put('RCPT TO:<' . $rcpt . '>');
        if (!$expect($read(), ['250', '251'])) { fclose($fp); return false; }
    }

    // Message body (DATA)
    $put('DATA');
    if (!$expect($read(), '354')) { fclose($fp); return false; }

    $encName = '=?UTF-8?B?' . base64_encode($cfg['from_name']) . '?=';
    $boundary = '=_mime_' . bin2hex(random_bytes(12));

    $headers = [];
    $headers[] = 'Date: ' . date('r');
    $headers[] = 'From: ' . $encName . ' <' . $cfg['from_email'] . '>';
    $headers[] = 'To: ' . implode(', ', $recipients);
    if ($replyTo !== '') {
        $headers[] = 'Reply-To: <' . $replyTo . '>';
    }
    $headers[] = 'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=';
    $headers[] = 'MIME-Version: 1.0';

    $hasAttachments = !empty($attachments);
    if ($hasAttachments) {
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
    } else {
        $headers[] = 'Content-Type: text/html; charset=UTF-8';
        $headers[] = 'Content-Transfer-Encoding: base64';
    }

    $body = '';
    if ($hasAttachments) {
        $body .= '--' . $boundary . "\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";

        foreach ($attachments as $att) {
            if (empty($att['path']) || !is_file($att['path'])) {
                continue;
            }
            $data = @file_get_contents($att['path']);
            if ($data === false) {
                continue;
            }
            $fname = $att['name'] ?? basename($att['path']);
            $body .= '--' . $boundary . "\r\n";
            $body .= 'Content-Type: application/octet-stream; name="' . $fname . "\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= 'Content-Disposition: attachment; filename="' . $fname . "\"\r\n\r\n";
            $body .= chunk_split(base64_encode($data)) . "\r\n";
        }
        $body .= '--' . $boundary . "--\r\n";
    } else {
        $body .= chunk_split(base64_encode($htmlBody));
    }

    $message = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    // SMTP dot-stuffing: any line starting with "." must be escaped as "..".
    $message = preg_replace('/^\./m', '..', $message);

    fwrite($fp, $message . "\r\n.\r\n");
    if (!$expect($read(), '250')) { fclose($fp); return false; }

    $put('QUIT');
    fclose($fp);
    return true;
}
