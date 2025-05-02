import { Container } from 'typedi';
import LoggerInstance from './logger';
import SequelizeModel from '../utils/sequelizeModels';
import { Sequelize } from 'sequelize';

export default ({ sqlConnection, models }: { sqlConnection: Sequelize; models: Array<typeof SequelizeModel> }) => {
  try {
    Container.set('logger', LoggerInstance);
    models.forEach(m => {
      m.initModel(sqlConnection); // static call
    });

    models.forEach(m => {
      m.associate(); // static call
    });

    return { logger: LoggerInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};