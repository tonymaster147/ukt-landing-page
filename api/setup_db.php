<?php
/**
 * One-time table creator. Upload, hit once over HTTP, then DELETE this file.
 * Idempotent: safe to run more than once (CREATE TABLE IF NOT EXISTS).
 */
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
mysqli_report(MYSQLI_REPORT_OFF);

$mysqli = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB connect failed: ' . $mysqli->connect_error]);
    exit;
}
$mysqli->set_charset('utf8mb4');

$sql = 'CREATE TABLE IF NOT EXISTS `' . DB_TABLE . '` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(150)  NOT NULL,
  `email`         VARCHAR(190)  NOT NULL,
  `phone`         VARCHAR(50)   DEFAULT NULL,
  `from_language` VARCHAR(120)  DEFAULT NULL,
  `to_language`   VARCHAR(120)  DEFAULT NULL,
  `purpose`       VARCHAR(255)  DEFAULT NULL,
  `description`   TEXT          DEFAULT NULL,
  `files`         TEXT          DEFAULT NULL,
  `ip_address`    VARCHAR(45)   DEFAULT NULL,
  `user_agent`    VARCHAR(255)  DEFAULT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

if ($mysqli->query($sql) === true) {
    echo json_encode(['success' => true, 'message' => 'Table ' . DB_TABLE . ' is ready.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Create failed: ' . $mysqli->error]);
}
$mysqli->close();
