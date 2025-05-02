USE buyme;

CREATE TABLE IF NOT EXISTS auction_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auction_id INT NOT NULL,
    seller_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE KEY (item_id)
);
