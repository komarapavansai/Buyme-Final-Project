export class BidNotificationDto {
  id?: number;
  title: string;
  description: string;
  receiver_id: number;
  userList: number[];
  is_sent: boolean;
}

export class BidNotifyDto {
  user_id: number;
}