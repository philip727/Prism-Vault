USE main;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE,
    username VARCHAR(35) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE sessions (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE,
    token VARCHAR(512) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    expiry BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id)
		REFERENCES users(id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

CREATE TABLE components (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE,
    unique_name VARCHAR(512) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    user_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id)
		REFERENCES users(id)
			ON UPDATE CASCADE
            ON DELETE CASCADE
);

SELECT * FROM users;
