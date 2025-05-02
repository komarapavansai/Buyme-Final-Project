import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';

export class Session extends SequelizeModel {
    public static initModel(sequelize: Sequelize): void {
        Session.init({
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: { type: DataTypes.STRING },
            email: { type: DataTypes.STRING },
            token: { type: DataTypes.STRING },
            is_signed_in : { type: DataTypes.BOOLEAN },
            created_at: { type: DataTypes.DATE },
        }, {
            sequelize,
            modelName: 'Session',
            tableName: 'session_data',
            timestamps: false,
        });
    }
}
