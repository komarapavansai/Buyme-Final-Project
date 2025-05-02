import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';

export class Alerts extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        Alerts.init({
            alert_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: { type: DataTypes.NUMBER },
            item_category: { type: DataTypes.STRING },
            prize_lt: { type: DataTypes.NUMBER },
            prize_gt: { type: DataTypes.NUMBER }
        }, {
            sequelize,
            modelName: 'Alert',
            tableName: 'alerts',
            timestamps: false,
        });
    }

    public static associate(): void {
    }
}
