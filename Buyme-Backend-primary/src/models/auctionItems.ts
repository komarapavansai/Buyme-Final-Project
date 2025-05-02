import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { Auction } from './auction';
import { Item } from './item';

export class auctionItems extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        auctionItems.init({
            id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
            auction_id: { type: DataTypes.INTEGER, allowNull: false },
            item_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
            seller_id: { type: DataTypes.INTEGER, allowNull: false },
        }, {
            sequelize,
            modelName: 'auctionItems',
            tableName: 'auction_items',
            timestamps: false
        });
    }

    public static associate(): void {   
        // auctionItems.belongsTo(Auction, { foreignKey: 'auction_id' });
        // auctionItems.belongsTo(Item, { foreignKey: 'item_id' });
    }
}
