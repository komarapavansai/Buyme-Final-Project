import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { Auction } from './auction';
import { User } from './user';

export class auctionParticipants extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        auctionParticipants.init(
            {
                auction_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    references: {
                        model: 'auctions',
                        key: 'auction_id',
                    },
                },
                participant_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'user_id',
                    },
                },
            },
            {
                sequelize,
                modelName: 'auctionParticipants',
                tableName: 'auction_participants',
                timestamps: false
            }
        );
    }

    public static associate(): void {
        // auctionParticipants.belongsTo(Auction, { foreignKey: 'auction_id' });
        // auctionParticipants.belongsTo(User, { foreignKey: 'user_id' });
    }
}
