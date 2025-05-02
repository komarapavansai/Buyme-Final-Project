USE buyme;

CREATE TABLE IF NOT EXISTS bid_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receiver_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE
);
