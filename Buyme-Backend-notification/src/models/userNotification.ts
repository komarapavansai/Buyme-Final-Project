import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';

export class UserNotification extends SequelizeModel {
  public static initModel(sequelize: Sequelize): void {
    UserNotification.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: { type: DataTypes.NUMBER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      topic: { type: DataTypes.STRING, defaultValue: false }
    }, {
      sequelize,
      modelName: 'userNotification',
      tableName: 'user_notification',
      timestamps: false,
    });
  }
}
