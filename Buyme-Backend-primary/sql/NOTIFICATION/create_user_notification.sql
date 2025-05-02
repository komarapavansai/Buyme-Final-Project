USE buyme;

CREATE TABLE IF NOT EXISTS user_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    topic VARCHAR(255) DEFAULT 'false'
);
