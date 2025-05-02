import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';

export class BidNotification extends SequelizeModel {
  public static initModel(sequelize: Sequelize): void {
    BidNotification.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      receiver_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      is_sent: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
      sequelize,
      modelName: 'bidNotification',
      tableName: 'bid_notification',
      timestamps: false,
    });
  }
}
