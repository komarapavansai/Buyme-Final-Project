import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { auctionParticipants } from './auctionParticipants';
import { auctionItems } from './auctionItems';
import { Auction } from './auction';
import { Item } from './item';
import { Bids } from './bids';

export class User extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        User.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            first_name: { type: DataTypes.STRING },
            last_name: { type: DataTypes.STRING },
            email: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            phone: { type: DataTypes.NUMBER },
            countrycode: { type: DataTypes.NUMBER },
            is_customer_repr: { type: DataTypes.BOOLEAN, defaultValue: false },
            is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
            sessionToken: { type: DataTypes.STRING }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: false,
        });
    }

    public static associate(): void {
        User.hasMany(auctionParticipants, { foreignKey: 'participant_id' });
        User.hasMany(auctionItems, { foreignKey: 'seller_id' });
        User.hasMany(Item, { foreignKey: 'seller_id' });
        User.hasMany(Auction, { foreignKey: 'seller_id' });
        User.hasMany(Bids, { foreignKey: 'bidder_id' });
    }
    
}
