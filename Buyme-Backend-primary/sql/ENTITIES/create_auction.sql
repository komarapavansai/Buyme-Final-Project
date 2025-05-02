USE buyme;

CREATE TABLE IF NOT EXISTS auctions (
    auction_id INT AUTO_INCREMENT PRIMARY KEY,
    auction_title VARCHAR(30) NOT NULL,
    auction_desc VARCHAR(100) NOT NULL,
    seller_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_over BOOLEAN DEFAULT FALSE,
    winner_id INT DEFAULT NULL,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);
