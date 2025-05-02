import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import { BidNotificationDto, BidNotifyDto } from '../interfaces/IBid';
import { BidNotification } from '../models/bidNotification';
import { UserNotification } from '../models/userNotification';
import { Op } from 'sequelize';
import { MultiNotificationDto } from '../interfaces/IMultiNotification';

@Service()
export default class BidService {
    private helperService: HelperService;

    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
    }

    public buildNotifyBidInfoDto(req: any): BidNotifyDto {
        const dto = new BidNotifyDto();
        dto.user_id = req.claims.user_id;

        return dto
    }

    public buildGetItemBidInfoDto(req: any): BidNotificationDto {
        const dto = new BidNotificationDto();
        dto.id = req.body.hasOwnProperty('id') ? req.body.id : undefined;
        dto.title = req.body.hasOwnProperty('title') ? req.body.title : undefined;
        dto.description = req.body.hasOwnProperty('description') ? req.body.description : undefined;
        dto.userList = req.body.hasOwnProperty('userList') ? req.body.userList : undefined;
        dto.is_sent = req.body.hasOwnProperty('is_sent') ? req.body.is_sent : undefined;

        if (!dto.title) throw new Error("title not found!");
        if (!dto.description) throw new Error("description not found!");
        if (!dto.userList) throw new Error("userList not found!");

        return dto;
    }

    public buildPostMultipleNotificationDto(req: any): MultiNotificationDto {
        const dto = new MultiNotificationDto();
        dto.userList = req.body.hasOwnProperty('userList') ? req.body.userList : undefined;
        dto.notificationList = req.body.hasOwnProperty('notificationList') ? req.body.notificationList : undefined;

        if (!dto.userList) throw new Error("userList not found!");
        if (!dto.notificationList) throw new Error("notificationList not found!");

        return dto;
    }

    public async createNotificationJobForUsers(dto: BidNotificationDto): Promise<{ data: any; }> {
        try {
            const dtoList = [];
            for (let i = 0; i < dto.userList.length; i++) {
                const userId = dto.userList[i];
                dtoList.push({ ...dto, receiver_id: userId });
            }

            const numRecords = await BidNotification.bulkCreate(dtoList);
            return { data: numRecords };
        } catch (error) {
            throw error;
        }
    }

    public async createMultipleNotificationsForUsers(dto: MultiNotificationDto): Promise<{ data: any; }> {
        try {
            const dtoList = [];
            for (let i = 0; i < dto.userList.length; i++) {
                const { title, description } = dto.notificationList[i];
                const user_id = dto.userList[i];
                const topic = 'ALERT';

                dtoList.push({ title, description, user_id, topic });
            }

            const numRecords = await UserNotification.bulkCreate(dtoList);
            return { data: numRecords };
        } catch (error) {
            throw error;
        }
    }

    public async notifyBidToUsers(): Promise<{ data: any; }> {
        try {
            let numSent = 0;
            while (true) {
                const limit = 5
                const recList = await BidNotification.findAll({
                    where: { is_sent: false },
                    limit: limit,
                });

                if (recList.length == 0) break;
                else {
                    numSent += recList.length;
                }

                const user_notification_list = [];
                for (let i = 0; i < recList.length; i++) {
                    const { receiver_id, title, description } = recList[i].dataValues;
                    user_notification_list.push({ user_id: receiver_id, title, description, topic: 'Bid' })
                }

                await UserNotification.bulkCreate(user_notification_list);
                await BidNotification.update(
                    { is_sent: true },
                    { where: { id: { [Op.in]: recList.map((e) => e.dataValues.id) } } }
                );
            }

            return { data: `Sent to ${numSent} people!` };
        } catch (error) {
            throw error;
        }
    }

    public async getNotificationsForUser(dto: BidNotifyDto): Promise<{ data: any; }> {
        try {
            const userNotificationList = await UserNotification.findAll({
                where: { user_id: dto.user_id }
            });

            return { data: userNotificationList };
        } catch (error) {
            throw error;
        }
    }
}
