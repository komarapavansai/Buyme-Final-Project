import { Sequelize, Model } from "sequelize";

export default abstract class SequelizeModel extends Model {
    public static initModel(sequelize: Sequelize) { }
    public static associate() { };
}
