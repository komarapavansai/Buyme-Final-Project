import expressLoader from './express';
import { sqlLoader } from './sql';
import Logger from './logger';
import { Container } from 'typedi/Container';
import LoggerInstance from './logger';
import { getSQLConnection } from './sql';
import squelizeDependencyInjector from './squelizeDependencyInjector';
import { BidNotification } from '../models/bidNotification';
import { UserNotification } from '../models/userNotification';
//We have to import at least all the events once so they can be triggered

export default async ({ expressApp }) => {
  const sqlLoaderObj = await sqlLoader();
  Container.set('logger', LoggerInstance);
  Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  Logger.info('✌️ Dependency Injector loaded');
  const sqlConnection = getSQLConnection();
  const { logger } = squelizeDependencyInjector({
    sqlConnection,
    models: [
      BidNotification,
      UserNotification
    ],
  });

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
