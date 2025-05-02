import { Service } from 'typedi';
import { Sequelize } from 'sequelize';
import { Bids } from '../models/bids';
import { Item } from '../models/item';

@Service()
export default class AdminService {
  public async getSalesReports(): Promise<{ data: any }> {
    // 1. Total earnings from winning bids
    const totalEarnings = await Bids.sum('curr_investment', {
      where: { is_won: true }
    });

    // 2. Earnings per item
    const earningsPerItem = await Bids.findAll({
      attributes: ['item_id', [Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'total']],
      where: { is_won: true },
      group: ['item_id']
    });

    // 3. Earnings per category
    const earningsPerCategory = await Bids.findAll({
      attributes: [
        [Sequelize.col('Item.category'), 'category'],
        [Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'total']
      ],
      where: { is_won: true },
      include: [{ model: Item, attributes: [] }],
      group: ['Item.category']
    });

    // 4. Earnings per seller
    const earningsPerSeller = await Bids.findAll({
      attributes: [
        [Sequelize.col('Item.seller_id'), 'seller_id'],
        [Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'total']
      ],
      where: { is_won: true },
      include: [{ model: Item, attributes: [] }],
      group: ['Item.seller_id']
    });

    // 5. Top 5 best buyers
    const bestBuyers = await Bids.findAll({
      attributes: ['bidder_id', [Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'total']],
      where: { is_won: true },
      group: ['bidder_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'DESC']],
      limit: 5
    });

    // 6. Earnings per item type (category)
    const earningsPerItemType = await Bids.findAll({
      attributes: [
        [Sequelize.col('Item.category'), 'category'],
        [Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'total']
      ],
      where: { is_won: true },
      include: [{ model: Item, attributes: [] }],
      group: ['Item.category']
    });


    // Best-selling items (by total earnings)
    const bestSellingItems = await Bids.findAll({
      attributes: [
        'item_id',
        [Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'total']
      ],
      where: { is_won: true },
      group: ['item_id'],
      order: [[Sequelize.fn('SUM', Sequelize.col('curr_investment')), 'DESC']],
      limit: 5
    });



    return {
      data: {
        totalEarnings,
        earningsPerItem,
        earningsPerCategory,
        earningsPerSeller,
        bestBuyers,
        earningsPerItemType,
        bestSellingItems,
      }
    };
  }
}
