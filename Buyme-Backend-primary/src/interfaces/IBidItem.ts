export class BidItemDto {
    id: number;
    item_id: number;
    bidder_id: number;
    auto_increment_percent: number;
    curr_investment: number;
    max_investment: number;
    is_won: boolean;
}

export class BidInputDto {
    bid_id: number;
    bidder_id: number;
    auction_id: number;
    item_id: number;
    max_investment: number;
    manual_investment_amount: number;
    auto_increment_percent: number;
    is_auto_increment_present: boolean;
    is_auto_increment: boolean;
    is_ivoker_cust_repr: boolean;
}