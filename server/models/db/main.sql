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
    unique_name VARCHAR(512) NOT NULL UNIQUE,
    quantity INT UNSIGNED NOT NULL,
    user_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id)
		REFERENCES users(id)
			ON UPDATE CASCADE
            ON DELETE CASCADE
);

INSERT INTO users (username, email, password) VALUES ("admin", "admin@gmail.com", "aaaa");

DELETE FROM sessions WHERE sessions.user_id = 2;

SELECT * FROM sessions;

SELECT * FROM sessions WHERE token = "2384ea4d5d8598cb3a02c7f092fc84664681ffb93103ff380dc2b6c2512cb842";

SELECT * FROM components;