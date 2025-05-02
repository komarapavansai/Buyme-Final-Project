USE buyme;

CREATE TABLE IF NOT EXISTS auction_participants (
    auction_id INT NOT NULL,
    seller_id INT NOT NULL,
    PRIMARY KEY (auction_id, seller_id),
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
