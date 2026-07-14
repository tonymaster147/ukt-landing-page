-- Run this ONCE against your WordPress database to create the table
-- that stores quote-form submissions (phpMyAdmin → SQL tab, or the mysql CLI).
--
-- The table name here (ukt_quote_requests) must match DB_TABLE in config.php.
-- It is a standalone table and does not touch any WordPress core tables.

CREATE TABLE IF NOT EXISTS `ukt_quote_requests` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(150)  NOT NULL,
  `email`         VARCHAR(190)  NOT NULL,
  `phone`         VARCHAR(50)   DEFAULT NULL,
  `from_language` VARCHAR(120)  DEFAULT NULL,
  `to_language`   VARCHAR(120)  DEFAULT NULL,
  `purpose`       VARCHAR(255)  DEFAULT NULL,
  `description`   TEXT          DEFAULT NULL,
  `files`         TEXT          DEFAULT NULL,   -- JSON array of stored file URLs
  `ip_address`    VARCHAR(45)   DEFAULT NULL,
  `user_agent`    VARCHAR(255)  DEFAULT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
