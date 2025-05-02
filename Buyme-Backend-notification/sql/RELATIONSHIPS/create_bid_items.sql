USE buyme;

CREATE TABLE IF NOT EXISTS bid_items (
    bid_item_id INT AUTO_INCREMENT UNIQUE,
    auction_item_id INT NOT NULL,
    bidder_id INT NOT NULL,
    is_auto_increment BOOLEAN DEFAULT TRUE,
    manual_investment_amount INT,
    auto_increment_percent INT,
    curr_investment INT,
    max_investment INT,
    is_won BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (auction_item_id, bidder_id)
);
