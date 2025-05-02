import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import AxiosService from '../utils/axiosService';
import { auctionParticipants } from '../models/auctionParticipants';
import { User } from '../models/user';
import { Item } from '../models/item';
import config from '../config';

@Service()
export default class NotificationService {
    private helperService: HelperService;

    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
    }

    public async notifyAuctioneers(auction_id: number, latest_bidder_id: number, item_id: number, item: Item, newInvestmentAmount: number) {
        try {
            const latestBidder = await User.findByPk(latest_bidder_id);
            const recepients = await auctionParticipants.findAll({
                where: { auction_id }
            });
            const title = `A new bid has been made by ${latestBidder.dataValues.first_name} on ${item.dataValues.item_name}!`;
            const description = `${latestBidder.dataValues.first_name} ${latestBidder.dataValues.last_name} `
                + `has recently topped the bid with the amount ${newInvestmentAmount}. Bid again to claim the highest spot!`;
            const userList = recepients.map((e) => e.dataValues.participant_id);

            await this.postNotifications(title, description, userList);
        } catch (error) {
            throw error;
        }
    }

    public async notifyAuctionResultsToParticipants(
        auctionMap: Record<number, { item_id: number; participants: number[]; winner_id: number; is_available: boolean }[]>
    ): Promise<void> {
        for (const [auctionId, itemDataList] of Object.entries(auctionMap)) {
            const allParticipantsSet = new Set<number>();
            const itemSummaries: string[] = [];

            for (const item of itemDataList) {
                const status = `was won by User ${item.winner_id} ${item.is_available ? '' : `, but was not sold as the reserve price was not met`}`;
                itemSummaries.push(`Item ${item.item_id} ${status}`);
                item.participants.forEach(p => allParticipantsSet.add(p));
            }

            const title = `Results of Auction #${auctionId}`;
            const description = itemSummaries.join(', ');
            const userList = Array.from(allParticipantsSet);

            await this.postNotifications(title, description, userList);
        }
    }

    public async notifyItemDetailsToUsersWithAlert(userList: number[], notificationList: any[] ) {
        try {
            const url = `${config.notificationService}/bid/notification/many`;
            const payload = { userList, notificationList };
            const header = HelperService.getTokenHeader();
            const { data } = await AxiosService.remoteServerPostAPI(payload, url, header);

            return { data };
        } catch (error) {
            throw error;
        }
    }

    private async postNotifications(title, description, userList) {
        try {
            const url = `${config.notificationService}/bid/notification`;
            const payload = { title, description, userList };
            const header = HelperService.getTokenHeader();
            const { data } = await AxiosService.remoteServerPostAPI(payload, url, header);

            return { data };
        } catch (error) {
            throw error;
        }
    }

}