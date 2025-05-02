import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import { Item } from '../models/item';
import { AddItemToAuctionDto as AuctionItemDto, ItemCreateOrUpdateDto, ItemDeleteDto, ItemGetDto } from '../interfaces/IItem';
import { auctionItems } from '../models/auctionItems';
import { Op, Sequelize } from 'sequelize';
import { Auction } from '../models/auction';
import { Alerts } from '../models/alert';
import NotificationService from './notificationService';

@Service()
export default class ItemService {
    private helperService: HelperService;
    private notificationService: NotificationService;

    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
        this.notificationService = Container.get(NotificationService);
    }

    public buildDeleteItemDto(req: any): ItemDeleteDto {
        const dto = new ItemDeleteDto();
        dto.seller_id = req.claims.user_id;
        dto.item_id = req.params.id;

        if (!dto.item_id) throw new Error("Item Id required to delete!");

        return dto;
    }

    public buildAuctionItemDto(req: any, isUpsert: boolean): AuctionItemDto {
        const dto = new AuctionItemDto();
        dto.seller_id = req.claims.user_id;
        dto.is_ivoker_cust_repr = req.claims.is_customer_repr;
        dto.item_id = req.params.hasOwnProperty('item_id') ? +req.params.item_id : undefined;
        dto.auction_id = req.params.hasOwnProperty('auction_id') ? +req.params.auction_id : undefined;

        if (isUpsert && (!dto.item_id || !dto.auction_id)) throw new Error("Auction Id as well as item id needed!");

        return dto;
    }

    public buildItemGetDto(req: any): ItemGetDto {
        const dto = new ItemGetDto();
        dto.max = req.query.hasOwnProperty('max') ? req.query.max : 10;
        dto.page = req.query.hasOwnProperty('page') ? req.query.page : 0;
        dto.search = req.query.hasOwnProperty('search') ? req.query.search : '';
        dto.keyword = req.query.hasOwnProperty('keyword') ? req.query.keyword : '';
        dto.item_id = req.params.hasOwnProperty('id') ? req.params.id : undefined;
        dto.user_id = req.claims.user_id;

        return dto;
    }

    public buildItemCreateOrUpdateDto(req: any, isUpdate: boolean): ItemCreateOrUpdateDto {
        const dto = new ItemCreateOrUpdateDto();
        dto.seller_id = req.claims.user_id;
        dto.is_ivoker_cust_repr = req.claims.is_customer_repr;
        dto.item_id = req.params.hasOwnProperty('id') ? +req.params.id : undefined;
        dto.item_name = req.body.hasOwnProperty('item_name') ? req.body.item_name : undefined;
        dto.item_desc = req.body.hasOwnProperty('item_desc') ? req.body.item_desc : undefined;
        dto.start_price = req.body.hasOwnProperty('start_price') ? req.body.start_price : undefined;
        dto.reserve_price = req.body.hasOwnProperty('reserve_price') ? req.body.reserve_price : undefined;
        dto.sub_category = req.body.hasOwnProperty('sub_category') ? req.body.sub_category : undefined;
        dto.category = req.body.hasOwnProperty('category') ? req.body.category : undefined;
        dto.image_url = req.body.hasOwnProperty('image_url') ? req.body.image_url : undefined;

        if (isUpdate && !dto.item_id) {
            throw new Error("Item Id required to update!");
        }

        return dto;
    }

    public async getItemsInAuction(dto: AuctionItemDto): Promise<{ data: any }> {
        try {
            const item = await auctionItems.findAll({
                where: { auction_id: dto.auction_id }
            });

            return { data: item };
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    public async addItemToAuction(dto: AuctionItemDto): Promise<{ data: any }> {
        try {
            const auction = await Auction.findByPk(dto.auction_id);
            if (auction.dataValues.seller_id != dto.seller_id) {
                throw new Error("You cannot add items to someone elses' auction!");
            }
            const item = await auctionItems.create({ ...dto });
            await this.notifyUsersWithAlert(dto.item_id, auction);

            return { data: item };
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    public async removeItemFromAuction(dto: AuctionItemDto): Promise<{ data: any }> {
        try {
            const auctionItem = await auctionItems.findOne({ where: { auction_id: dto.auction_id, item_id: dto.item_id } });
            if (auctionItem.dataValues.seller_id != dto.seller_id) throw new Error("You cannot remove items from other seller!");

            const item = await auctionItems.create({ ...dto });

            return { data: item };
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    public async getItemByIdOrList(dto: ItemGetDto): Promise<{ data: any }> {
        let itemData = null;

        if (dto.item_id) {
            itemData = await Item.findByPk(dto.item_id);
        } else {
            itemData = await Item.findAll({
                where: {
                    [Op.or]: [
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('item_name')), {
                            [Op.like]: `%${dto.search.toLowerCase()}%`
                        }),
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('item_desc')), {
                            [Op.like]: `%${dto.search.toLowerCase()}%`
                        })
                    ]
                },
                limit: dto.max,
                offset: dto.page * dto.max
            });
        }

        return { data: itemData };
    }

    public async getItemsForUser(dto: ItemGetDto): Promise<{ data: any }> {
        const itemData = await Item.findAll({
            where: { seller_id: dto.user_id },
            limit: dto.max,
            offset: dto.page * dto.max
        });
        return { data: itemData };
    }

    public async createItem(dto: ItemCreateOrUpdateDto): Promise<{ data: any }> {
        try {
            const item = await Item.create({ ...dto });

            return { data: item };
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    public async updateItem(dto: ItemCreateOrUpdateDto): Promise<{ data: any }> {
        try {
            const item = await Item.findByPk('1');
            if (item.dataValues.seller_id != dto.seller_id) {
                throw new Error("You cannot update other seller's Items!");
            }

            const updatedItem = await Item.update(
                { ...dto },
                {
                    where: { item_id: dto.item_id, seller_id: dto.seller_id },
                    returning: true
                }
            );

            return { data: updatedItem };
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    public async deleteUserItem(dto: ItemDeleteDto): Promise<any> {
        try {
            const item = await Item.findByPk(dto.item_id);
            if (!item) throw new Error(`Item with id ${dto.item_id} not found!`);

            if (item.dataValues.seller_id != dto.seller_id) {
                throw new Error("You cannot delete other seller's Items!");
            }

            const result = await this.deleteItem(dto.item_id);
            const data = { message: "Item deleted successfully!" };

            return { data };
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

    private async notifyUsersWithAlert(item_id: number, auction: Auction) {
        try {
            const item = await Item.findOne({
                where: { item_id: item_id }
            });

            const alerts = await Alerts.findAll({
                where: {
                    [Op.or]: [
                        { item_category: item.dataValues.category },
                        { item_category: item.dataValues.sub_category }
                    ]
                }
            });

            const dataList = alerts
                .filter((alert) =>
                    alert.dataValues.item_category === item.dataValues.category ||
                    alert.dataValues.item_category === item.dataValues.sub_category
                )
                .map((alert) => ({
                    user_id: alert.dataValues.user_id,
                    category: alert.dataValues.item_category,
                    auction_title: auction.dataValues.auction_title,
                    is_budget_met: +item.dataValues.start_price >= alert.dataValues.prize_lt &&
                        +item.dataValues.start_price <= alert.dataValues.prize_gt
                }));

            const { userList, notificationList } = this.curateDataListForUsers(dataList);
            await this.notificationService.notifyItemDetailsToUsersWithAlert(userList, notificationList);
        } catch (error) {
            throw error;
        }
    }

    private curateDataListForUsers(dataList: { user_id: any; auction_title: any; category: string, is_budget_met: boolean; }[]): { userList: any; notificationList: any; } {
        const userList = [];
        const notificationList = [];

        for (let i = 0; i < dataList.length; i++) {
            const { user_id, auction_title, category, is_budget_met } = dataList[i];
            let description = `Dear User, an item of type ${category} has been added to Auction:${auction_title}!`;
            if (is_budget_met) {
                description += "Thankfully, the start price is within your budget!";
            } else {
                description += "Unfortunately, the start price is not your budget!";
            }
            description += `You are getting this notification because you set an alert! Keep an eye or Participate in the auction so you do not miss it!`;

            userList.push(user_id);
            const title = `Good News!An item of category ${category} is up for auction!`;
            notificationList.push({ title, description });
        }

        return { userList, notificationList };
    }

    private async deleteItem(id: number) {
        try {
            const deletedCount = await Item.destroy({
                where: { item_id: id },
            });

            if (deletedCount === 0) {
                throw new Error(`Item with id ${id} not found`);
            }

            return { message: `Item with id ${id} deleted successfully` };
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

}