import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';
import { User } from './user';

export class Question extends SequelizeModel {
    public question_id!: number;
    public user_id!: number;
    public rep_id?: number;
    public question_text!: string;
    public answer_text?: string;
    public asked_at?: Date;
    public answered_at?: Date;

    public static initModel(sequelize: Sequelize): void {
        Question.init({
            question_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rep_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            question_text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            answer_text: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            asked_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            answered_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'Question',
            tableName: 'questions',
            timestamps: false,
        });
    }

    public static associate(): void {
        Question.belongsTo(User, { foreignKey: 'user_id', as: 'asker' });
        Question.belongsTo(User, { foreignKey: 'rep_id', as: 'responder' });
    }
}

export default Question;
