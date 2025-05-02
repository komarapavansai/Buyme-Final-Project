import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import { BidInputDto, BidItemDto } from '../interfaces/IBidItem';
import { Bids } from '../models/bids';
import { Item } from '../models/item';
import { Op } from 'sequelize';
import { max } from 'lodash';
import { auctionItems } from '../models/auctionItems';
import AxiosService from '../utils/axiosService';
import NotificationService from './notificationService';
import { auctionParticipants } from '../models/auctionParticipants';
import { Request } from 'express';

@Service()
export default class BidService {
    private helperService: HelperService;
    private notificationService: NotificationService;

    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
        this.notificationService = Container.get(NotificationService);
    }

    public buildGetItemBidInfoDto(req: any) {
        const dto = new BidItemDto();
        dto.bidder_id = req.claims.user_id;
        dto.item_id = req.params.hasOwnProperty('item_id') ? +req.params.item_id : undefined;

        return dto;
    }

    public buildBidItemDto(req: any): BidInputDto {
        const dto = new BidInputDto();
        dto.bid_id = req.params.bid_id;
        dto.bidder_id = req.claims.user_id;
        dto.is_ivoker_cust_repr = req.claims.is_customer_repr;

        dto.is_auto_increment_present = req.body.hasOwnProperty('is_auto_increment');
        if (dto.is_auto_increment_present) {
            dto.is_auto_increment = req.body.is_auto_increment.toString().toLowerCase() == 'true';
        }

        dto.auction_id = req.body.hasOwnProperty('auction_id') ? +req.body.auction_id : undefined;
        dto.item_id = req.params.hasOwnProperty('item_id') ? +req.params.item_id : undefined;
        dto.manual_investment_amount = req.body.hasOwnProperty('manual_investment_amount') ? +req.body.manual_investment_amount : undefined;
        dto.auto_increment_percent = req.body.hasOwnProperty('auto_increment_percent') ? +req.body.auto_increment_percent : undefined;
        dto.max_investment = req.body.hasOwnProperty('max_investment') ? +req.body.max_investment : undefined;

        if (!dto.auction_id) throw new Error("Auction Id required!");
        if (!dto.item_id) throw new Error("Choose an item id to bid!");
        if (dto.is_auto_increment_present && dto.is_auto_increment && !dto.auto_increment_percent) throw new Error("Define the auto increment percent!");
        if (!dto.manual_investment_amount && !dto.auto_increment_percent) {
            throw new Error("Define a manual investment amount or a percent to auto increment current amount!");
        }
        if (!dto.max_investment) throw new Error("Max investment required!");

        return dto;
    }

    public async getAllBidsForItem(dto: BidItemDto): Promise<{ data: any }> {
        try {
            const bidList = await Bids.findAll({
                where: { item_id: dto.item_id }
            });

            return { data: bidList };
        } catch (error) {
            throw error;
        }
    }

    public async getAllBidsForUser(dto: BidItemDto): Promise<{ data: any }> {
        try {
            const bidList = await Bids.findAll({
                where: { bidder_id: dto.bidder_id }
            });

            return { data: bidList };
        } catch (error) {
            throw error;
        }
    }

    public async bidItem(dto: BidInputDto): Promise<{ data: any }> {
        try {
            const { itemData, userBid, highestBid } = await this.getItemAndBidInformation(dto);
            const { newInvestmentAmount } = this.getNextBidAmount(dto, itemData, userBid, highestBid);

            const data = await Bids.upsert({
                item_id: dto.item_id,
                bidder_id: dto.bidder_id,
                auto_increment_percent: dto.auto_increment_percent,
                curr_investment: newInvestmentAmount,
                max_investment: dto.max_investment,
            });

            await this.notificationService.notifyAuctioneers(dto.auction_id, dto.bidder_id, dto.item_id, itemData, newInvestmentAmount);

            return { data };
        } catch (error) {
            throw error;
        }
    }

    public async deleteBid(dto: BidInputDto): Promise<{ data: any }> {
        try {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);

            const data = await Bids.destroy({
                where: { id: dto.bid_id },
            });

            return { data };
        } catch (error) {
            throw error;
        }
    }

    private async getItemAndBidInformation(dto: BidInputDto): Promise<{ itemData, userBid, highestBid }> {
        try {
            await this.verifyAuctionParticipation(dto);
            const auctionItem = await auctionItems.findOne({
                where: { item_id: dto.item_id, auction_id: dto.auction_id }
            });
            if (!auctionItem) throw new Error("Auction does not contain the item that is being bid on!");

            const itemData = await Item.findByPk(dto.item_id);
            const { highestBid } = await this.getHighestBid(dto)
            const latest_user_bid = await Bids.findOne({
                where: { item_id: dto.item_id, bidder_id: dto.bidder_id }
            });

            const userBid = latest_user_bid ? latest_user_bid : null;
            return { itemData, userBid, highestBid };
        } catch (error) {
            throw error;
        }
    }

    private async verifyAuctionParticipation(dto: BidInputDto) {
        const auctionParticipant = await auctionParticipants.findOne({
            where: { auction_id: dto.auction_id, participant_id: dto.bidder_id }
        });
        if (!auctionParticipant) throw new Error("Register in the auction first to bid on this item!");
    }

    private async getHighestBid(dto: BidInputDto): Promise<{ highestBid: any; }> {
        const bidList = await Bids.findAll({
            where: { item_id: dto.item_id },
            order: [['curr_investment', 'DESC']],
            limit: 1,
        });

        let highestBid = null;
        if (bidList.length > 0) {
            if (bidList[0].dataValues.bidder_id == dto.bidder_id) {
                throw new Error("You already have the highest bid!");
            } else {
                highestBid = bidList[0];
            }
        }

        return { highestBid };
    }

    private getNextBidAmount(dto: BidInputDto, itemData: Item, existingBid?: Bids, highest_bid?: Bids): { newInvestmentAmount: number } {
        let newInvestmentAmount = 0;
        const is_auto_increment = dto.is_auto_increment_present ? dto.is_auto_increment : existingBid?.dataValues.is_auto_increment;
        const current_highest_investment = max([+itemData.dataValues.start_price, existingBid?.dataValues.curr_investment ?? 0, highest_bid?.dataValues.curr_investment ?? 0]);

        if (!is_auto_increment) {
            newInvestmentAmount = dto.manual_investment_amount;
        } else {
            const newInvestmentPercentIncrease = dto.auto_increment_percent || existingBid?.dataValues.auto_increment_percent;
            newInvestmentAmount = current_highest_investment + (current_highest_investment * newInvestmentPercentIncrease / 100);
        }

        if (newInvestmentAmount <= current_highest_investment) {
            throw new Error("New Proposed bid is lesser than the current highest bid!");
        }

        if (newInvestmentAmount > (dto.max_investment || existingBid?.dataValues.max_investment || 0)) {
            throw new Error("New Bid will overflow the max budget for this bidding instance!");
        }

        return { newInvestmentAmount };
    } 
}
