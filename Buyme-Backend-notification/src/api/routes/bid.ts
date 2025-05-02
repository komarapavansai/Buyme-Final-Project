import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import BidService from '../../services/bidService';
import Container from 'typedi';
  
const route = Router();

export default (app: Router) => {
  app.use('/bid', route);
  const bidService = Container.get(BidService);

  route.post('/notify', async (req: Request, res: Response) => {
    try {
      const { data } = await bidService.notifyBidToUsers();

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.get('/notification', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildNotifyBidInfoDto(req);
      const { data } = await bidService.getNotificationsForUser(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/notification', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildGetItemBidInfoDto(req);
      const { data } = await bidService.createNotificationJobForUsers(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/notification/many', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildPostMultipleNotificationDto(req);
      const { data } = await bidService.createMultipleNotificationsForUsers(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

};  