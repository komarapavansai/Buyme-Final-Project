USE buyme;

CREATE TABLE IF NOT EXISTS bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    bidder_id INT NOT NULL,
    auto_increment_percent INT,
    curr_investment INT,
    max_investment INT,
    is_won BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY (item_id, bidder_id)
);
