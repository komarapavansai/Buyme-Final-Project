export class AuctionParticipateDto {
    participant_id: number;
    auction_id: number;
}

export class AuctionGetDto {
    max: number;
    page: number;
    search: string;
    auction_id: number;
    seller_id: number;
}

export class AuctionCreateDto {
    auction_title: string;
    auction_desc: string;
    auction_id?: number;
    seller_id: number;
    start_date: number;
    end_date: number;
    category: string;
    image_url: string;
    is_over: boolean;
    winner_id: number;

    is_ivoker_cust_repr: boolean;
}

export interface IAuction {
    auction_title: string;
    auction_desc: string;
    auction_id: number;
    seller_id: number;
    start_date: number;
    end_date: number;
    category: string;
    image_url: string;
    is_over: boolean;
    winner_id: number;
}

export class AuctionDeleteDto {
    is_ivoker_cust_repr: boolean;
    seller_id: number;
    auction_id: number;
}