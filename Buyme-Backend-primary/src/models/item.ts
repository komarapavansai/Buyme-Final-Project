import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { auctionItems } from './auctionItems';
import { User } from './user';

export class Item extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        Item.init({
            item_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            seller_id: { type: DataTypes.INTEGER, allowNull: false },
            item_name: { type: DataTypes.STRING },
            item_desc: { type: DataTypes.STRING },
            start_price: { type: DataTypes.FLOAT },
            reserve_price: { type: DataTypes.FLOAT },
            sub_category: { type: DataTypes.STRING },
            category: { type: DataTypes.STRING },
            image_url: { type: DataTypes.STRING },
        }, {
            sequelize,
            modelName: 'Item',
            tableName: 'items',
            timestamps: false,
        });
    }

    public static associate(): void {
        Item.belongsTo(User, { foreignKey: 'seller_id' }); // seller of item
        Item.hasMany(auctionItems, { foreignKey: 'item_id' }); // in case item is reused in multiple auctions
    }


}
