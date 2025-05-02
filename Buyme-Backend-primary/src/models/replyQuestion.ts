import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';

export class ReplyQuestion extends SequelizeModel {
  public reply_id!: number;
  public question_id!: number;
  public answer_text!: string;
  public rep_id!: number;
  public replied_at!: Date;

  public static initModel(sequelize: Sequelize): void {
    ReplyQuestion.init(
      {
        reply_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        question_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rep_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        answer_text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        replied_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'reply_question',
        timestamps: false,
      }
    );
  }
}
