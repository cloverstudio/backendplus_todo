CREATE TABLE IF NOT EXISTS `1592282495599_todo` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task` varchar(255) CHARACTER SET utf8,
  `duedate` date,
  `description` text CHARACTER SET utf8,
  `user_id` int(11) DEFAULT 0,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `1592282495599_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `token` varchar(32) DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO
  `1592282495599_users` (username, password) value(
    'admin',
    '3d04c6e2f0bebc25dd0c835713bc542b9944fa8ccb0e28116b8afdff8dca0f46'
  );