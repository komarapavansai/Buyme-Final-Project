import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import { AuctionCreateDto, AuctionDeleteDto, AuctionGetDto, AuctionParticipateDto, IAuction } from '../interfaces/AuctionDto';
import { Auction } from '../models/auction';
import { Op, Sequelize } from 'sequelize';
import { auctionParticipants } from '../models/auctionParticipants';
import { Bids } from '../models/bids';
import { auctionItems } from '../models/auctionItems';
import NotificationService from './notificationService';
import { Item } from '../models/item';

@Service()
export default class AuctionService {
    private helperService: HelperService;
    private notificationService: NotificationService;

    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
        this.notificationService = Container.get(NotificationService);
    }

    public buildParticipateAuctionDto(req: any): AuctionParticipateDto {
        const dto = new AuctionParticipateDto();
        dto.participant_id = +req.claims.user_id;
        dto.auction_id = req.params.auction_id;

        return dto;
    }

    public buildDeleteAuctionDto(req: any): AuctionDeleteDto {
        const dto = new AuctionDeleteDto();
        dto.is_ivoker_cust_repr = req.claims.is_customer_repr;
        dto.seller_id = +req.claims.user_id;
        dto.auction_id = req.params.id;

        if (!dto.auction_id) throw new Error("Auction Id required to delete!");

        return dto;
    }

    public buildAuctionGetDto(req: any): AuctionGetDto {
        const dto = new AuctionGetDto();
        dto.max = req.query.hasOwnProperty('max') ? req.query.max : 10;
        dto.page = req.query.hasOwnProperty('page') ? req.query.page : 0;
        dto.search = req.query.hasOwnProperty('search') ? req.query.search : '';
        dto.seller_id = req.query.hasOwnProperty('seller_id') ? +req.query.seller_id : undefined;
        dto.auction_id = req.params.hasOwnProperty('id') ? req.params.id : undefined;

        return dto;
    }

    public buildAuctionCreateOrUpdateDto(req: any, isUpdate: boolean): AuctionCreateDto {
        const dto = new AuctionCreateDto();
        if (isUpdate) {
            dto.auction_id = req.params.id;
            if (!dto.auction_id) throw new Error("Auction Id required to update!");
        }

        dto.is_ivoker_cust_repr = req.claims.is_customer_repr;
        dto.seller_id = req.claims.user_id;

        dto.auction_title = req.body.hasOwnProperty('auction_title') ? req.body.auction_title : undefined;
        dto.auction_desc = req.body.hasOwnProperty('auction_desc') ? req.body.auction_desc : undefined;
        dto.start_date = req.body.hasOwnProperty('start_date') ? req.body.start_date : undefined;
        dto.end_date = req.body.hasOwnProperty('end_date') ? req.body.end_date : undefined;
        dto.category = req.body.hasOwnProperty('category') ? req.body.category : undefined;
        dto.image_url = req.body.hasOwnProperty('image_url') ? req.body.image_url : undefined;

        if (!dto.auction_title || !dto.auction_desc) throw new Error("Give a title and description to the auction!");

        HelperService.validateDateRange(dto.start_date, dto.end_date);

        return dto;
    }

    public async concludeTodaysAuctions(auction_id?: number): Promise<{ data: any }> {
        const { auctionIds } = await this.getAuctionsThatEndToday(auction_id);
        const { items, bidList, participantMap, availabilityMap } = await this.getHighestBidsForItemsOfAuctions(auctionIds);
        const { auctionMap, winningBidderList } = this.getAuctionMapAndWinningBidders(items, bidList, participantMap, availabilityMap);

        await this.markAuctionsAndWinners(winningBidderList, auctionIds);
        await this.notificationService.notifyAuctionResultsToParticipants(auctionMap);

        return { data: { auctionMap } };
    }

    public async getAuctionParticipants(dto: AuctionParticipateDto): Promise<{ data: any }> {
        try {
            const addUserToAuction = await auctionParticipants.findAll({ where: { auction_id: dto.auction_id } });

            return { data: addUserToAuction };
        } catch (error) {
            throw error;
        }
    }

    public async participateInAuction(dto: AuctionParticipateDto): Promise<{ data: any }> {
        try {
            const addUserToAuction = await auctionParticipants.create({ ...dto });

            return { data: addUserToAuction };
        } catch (error) {
            throw error;
        }
    }

    public async getAuctionByIdOrList(dto: AuctionGetDto): Promise<{ data: any }> {
        let auctionData = null;

        if (dto.auction_id) {
            auctionData = await Auction.findByPk(dto.auction_id);
        } else {
            const whereOps = {
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('auction_title')), {
                        [Op.like]: `%${dto.search.toLowerCase()}%`
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('auction_desc')), {
                        [Op.like]: `%${dto.search.toLowerCase()}%`
                    })
                ]
            };
            if (dto.seller_id) {
                whereOps[Op.and] = [
                    Sequelize.where(Sequelize.col('seller_id'), {
                        [Op.eq]: dto.seller_id
                    })
                ]
            }

            auctionData = await Auction.findAll({
                where: whereOps,
                limit: dto.max,
                offset: dto.page * dto.max
            });
        }

        return { data: auctionData };
    }

    public async createAuction(dto: AuctionCreateDto): Promise<{ data: any }> {
        try {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);

            const auction = await Auction.create({ ...dto });

            return { data: auction };
        } catch (error) {
            console.error('Error creating auction:', error);
            throw error;
        }
    }

    public async updateAuction(dto: AuctionCreateDto): Promise<{ data: any }> {
        try {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);


            const auction = await Auction.findByPk(dto.auction_id);
            if (auction.dataValues.seller_id != dto.seller_id) {
                throw new Error("You cannot update other seller's Auctions!");
            }

            const updatedAuction = await Auction.update(
                { ...dto },
                {
                    where: { auction_id: dto.auction_id, seller_id: dto.seller_id },
                    returning: true
                }
            );

            return { data: updatedAuction };
        } catch (error) {
            console.error('Error creating auction:', error);
            throw error;
        }
    }

    public async deleteUserAuction(dto: AuctionDeleteDto): Promise<any> {
        try {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);

            const auction = await Auction.findByPk(dto.auction_id);
            if (auction.dataValues.seller_id != dto.seller_id) {
                throw new Error("You cannot delete other seller's Auctions!");
            }

            const result = await this.deleteAuction(dto.auction_id);
            const data = { message: "Auction deleted successfully!" };

            return { data };
        } catch (error) {
            console.error('Error deleting auction:', error);
            throw error;
        }
    }

    private async deleteAuction(id: number) {
        try {
            const deletedCount = await Auction.destroy({
                where: { auction_id: id },
            });

            if (deletedCount === 0) {
                throw new Error(`Auction with id ${id} not found`);
            }

            return { message: `Auction with id ${id} deleted successfully` };
        } catch (error) {
            console.error('Error deleting auction:', error);
            throw error;
        }
    }

    private async markAuctionsAndWinners(
        winningBidderList: { item_id: number; bidder_id: number }[],
        auctionIds: number[]
    ): Promise<void> {
        await Auction.update(
            { is_over: true },
            { where: { auction_id: { [Op.in]: auctionIds } } }
        );

        const conditions = winningBidderList.map(({ item_id, bidder_id }) => ({ item_id, bidder_id }));

        await Bids.update(
            { is_won: true },
            { where: { [Op.or]: conditions } }
        );
    }

    private getAuctionMapAndWinningBidders(
        items: any,
        bids: any,
        participantMap: Record<number, number[]>,
        availabilityMap: Record<number, boolean>
    ): { auctionMap: any; winningBidderList: any; } {
        const auctionMap: Record<number, { item_id: number; participants: number[]; winner_id: number; is_available: boolean }[]> = {};
        const winningBidderList = [];

        for (const item of items) {
            const itemData = item.dataValues;
            const winningBid = (bids as any[]).find(b => b.item_id === itemData.item_id);
            const participants = participantMap[itemData.item_id] || [];
            const isAvailable = availabilityMap[itemData.item_id] ?? false;

            if (winningBid) {
                if (!auctionMap[itemData.auction_id]) {
                    auctionMap[itemData.auction_id] = [];
                }

                auctionMap[itemData.auction_id].push({
                    item_id: itemData.item_id,
                    participants,
                    winner_id: winningBid.bidder_id,
                    is_available: isAvailable,
                });

                winningBidderList.push({ item_id: itemData.item_id, bidder_id: winningBid.bidder_id });
            }
        }

        return { auctionMap, winningBidderList };
    }

    private async getHighestBidsForItemsOfAuctions(auctionIds: number[]): Promise<{ items: any; bidList: any; participantMap: Record<number, number[]>; availabilityMap: Record<number, boolean> }> {
        if (auctionIds.length === 0) return { items: [], bidList: [], participantMap: {}, availabilityMap: {} };

        const items = await auctionItems.findAll({
            where: { auction_id: { [Op.in]: auctionIds } },
            attributes: ['auction_id', 'item_id'],
        });

        const itemIds = items.map(i => i.dataValues.item_id);

        // Fetch reserve prices from the Item model
        const itemModels = await Item.findAll({
            where: { item_id: { [Op.in]: itemIds } },
            attributes: ['item_id', 'reserve_price'],
        });

        const reservePriceMap: Record<number, number> = {};
        itemModels.forEach(i => {
            reservePriceMap[i.dataValues.item_id] = i.dataValues.reserve_price;
        });

        const [results] = await Bids.sequelize!.query(`
            SELECT b.item_id, b.bidder_id, b.curr_investment
            FROM bids b
            INNER JOIN (
              SELECT item_id, MAX(curr_investment) as max_bid
              FROM bids
              WHERE item_id IN (:itemIds)
              GROUP BY item_id
            ) as top_bids
            ON b.item_id = top_bids.item_id AND b.curr_investment = top_bids.max_bid
        `, {
            replacements: { itemIds },
        });

        const allBids = await Bids.findAll({
            where: { item_id: { [Op.in]: itemIds } },
            attributes: ['item_id', 'bidder_id'],
        });

        const participantMap: Record<number, number[]> = {};
        for (const bidData of allBids) {
            const bid = bidData.dataValues;
            if (!participantMap[bid.item_id]) {
                participantMap[bid.item_id] = [];
            }
            if (!participantMap[bid.item_id].includes(bid.bidder_id)) {
                participantMap[bid.item_id].push(bid.bidder_id);
            }
        }

        const availabilityMap: Record<number, boolean> = {};
        for (const bid of results as any[]) {
            const reservePrice = reservePriceMap[bid.item_id];
            availabilityMap[bid.item_id] = bid.curr_investment >= reservePrice;
        }

        return { items, bidList: results, participantMap, availabilityMap };
    }

    private async getAuctionsThatEndToday(auction_id?: number): Promise<{ auctionIds: any }> {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const auctions = await Auction.findAll({
            where: {
                auction_id: { [Op.in]: [auction_id] } // for testing
                // end_date: { [Op.between]: [todayStart, todayEnd] },
                // is_over: false,
            },
        });

        const auctionIds = auctions.map(a => a.dataValues.auction_id);
        return { auctionIds };
    }


}