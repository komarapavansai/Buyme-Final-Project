USE buyme;

CREATE TABLE IF NOT EXISTS items (
        item_id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT,
        item_name VARCHAR(255) NOT NULL,
        item_desc TEXT,
        start_price DECIMAL(10, 2) NOT NULL,
        reserve_price DECIMAL(10, 2),
        sub_category VARCHAR(100),
        image_url VARCHAR(255),
        FOREIGN KEY (seller_id) REFERENCES users(user_id)
);