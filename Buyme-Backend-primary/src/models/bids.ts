import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { Item } from './item';
import { User } from './user';

export class Bids extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        Bids.init({
            id: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
            item_id: { type: DataTypes.NUMBER },
            bidder_id: { type: DataTypes.NUMBER },
            auto_increment_percent: { type: DataTypes.NUMBER },
            curr_investment: { type: DataTypes.NUMBER },
            max_investment: { type: DataTypes.NUMBER },
            is_won: { type: DataTypes.BOOLEAN, defaultValue: false },
        }, {
            sequelize,
            modelName: 'bids',
            tableName: 'bids',
            timestamps: false,
        });
    }
    public static associate(): void {
        Bids.belongsTo(Item, { foreignKey: 'item_id' });   // Bid belongs to Item
        Bids.belongsTo(User, { foreignKey: 'bidder_id' }); // Bid belongs to Bidder (User)
    }
}
