export class AddItemToAuctionDto {
    auction_id: number;
    item_id: number;
    seller_id: number;
    is_ivoker_cust_repr: boolean;
}

export class ItemGetDto {
    max: number;
    page: number;
    search: string;
    keyword: string;
    item_id: number;
    user_id: number;
}

export class ItemCreateOrUpdateDto {
    item_id: number;
    seller_id: number;
    item_name: string;
    item_desc: string;
    start_price: number;
    reserve_price: number;
    sub_category: string;
    category: string;
    is_ivoker_cust_repr: boolean;
    image_url: string;
}

export interface IItem {
    item_id: number;
    seller_id: number;
    item_name: string;
    item_desc: string;
    start_price: number;
    reserve_price: number;
    sub_category: string;
    category: string;
    is_ivoker_cust_repr: boolean;
    image_url: string;
}

export class ItemDeleteDto {
    seller_id: number;
    item_id: number;
}