export class AlertInputDto {
    alert_id: number;
    user_id: number;
    item_category: string;
}

export class AlertCrudDto {
    alert_id: number;
    user_id: number;
    item_category: string;
    prize_lt: number;
    prize_gt: number;
}
