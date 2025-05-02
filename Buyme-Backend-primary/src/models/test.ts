import { DataTypes, Sequelize } from 'sequelize';
import SequelizeModel from '../utils/sequelizeModels';

export class TestModel extends SequelizeModel {
  public static initModel(sequelize: Sequelize): void {
    TestModel.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      seller_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    }, {
      sequelize,
      modelName: 'testModel',
      tableName: 'test_model',
      timestamps: false,
    });
  }
}
