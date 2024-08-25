CREATE TABLE `users` (
    `id` INT(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'artist_manager', 'artist') DEFAULT 'super_admin' ,
    `phone` VARCHAR(20) DEFAULT NULL,
    `dob` DATETIME DEFAULT NULL,
    `gender` ENUM('m', 'f', 'o'),
    `address` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    CHECK (deleted_at IS NULL OR deleted_at > created_at),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `artists` (
    `id` INT(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` vARCHAR(255),
    `dob` DATETIME DEFAULT NULL,
    `gender` ENUM('m', 'f', 'o'),
    `address` vARCHAR(255) DEFAULT NULL,
    `first_year_release` YEAR,
    `no_of_albums_released` INT unsigned,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    CHECK (deleted_at IS NULL OR deleted_at > created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `musics` (
    `id` INT(10) unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `artist_id` INT(10) UNSIGNED DEFAULT NULL,
    `title` VARCHAR(255),
    `album_name` VARCHAR(255),
    `genre` ENUM('rnb', 'country', 'classic', 'rock', 'jazz'),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME NULL,
    FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE SET NULL,
    CHECK (deleted_at IS NULL OR deleted_at > created_at),
    INDEX `idx_musics_artist_id` (`artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `blacklisted_tokens` (
    `token` VARCHAR(255) PRIMARY KEY,
    `expires_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `activitylogs` (
  `id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) unsigned,
  `url` VARCHAR(255),
  `action` VARCHAR(20),
  `status` VARCHAR(20),
  `request_data` TEXT,
  `response_data` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;