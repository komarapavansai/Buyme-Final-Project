use buyme;

CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_category VARCHAR(50) NOT NULL,
    prize_lt INT NOT NULL,
    prize_gt INT NOT NULL
);