USE buyme;

CREATE TABLE IF NOT EXISTS auction_participants (
    auction_id INT NOT NULL,
    participant_id INT NOT NULL,
    PRIMARY KEY (auction_id, participant_id),
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
