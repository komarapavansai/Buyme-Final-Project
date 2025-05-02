USE buyme;

CREATE TABLE IF NOT EXISTS session_data (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    email VARCHAR(40),
    token VARCHAR(500),
    is_signed_in BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
