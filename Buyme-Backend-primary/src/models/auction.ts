import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { auctionParticipants } from './auctionParticipants';
import { auctionItems } from './auctionItems';
import { User } from './user';

export class Auction extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        Auction.init({
            auction_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            auction_title: { type: DataTypes.STRING, allowNull: false },
            auction_desc: { type: DataTypes.STRING, allowNull: false },
            seller_id: { type: DataTypes.INTEGER, allowNull: false },
            start_date: { type: DataTypes.DATE },
            end_date: { type: DataTypes.DATE },
            category: { type: DataTypes.STRING },
            image_url: { type: DataTypes.STRING },
            is_over: { type: DataTypes.BOOLEAN, defaultValue: false },
            winner_id: { type: DataTypes.NUMBER, defaultValue: null }
        }, {
            sequelize,
            modelName: 'Auction',
            tableName: 'auctions',
            timestamps: false,
        });
    }

    public static associate(): void {
        Auction.hasMany(auctionParticipants, { foreignKey: 'auction_id' });
        Auction.hasMany(auctionItems, { foreignKey: 'auction_id' });
        Auction.belongsTo(User, { foreignKey: 'seller_id' });
    }
}
