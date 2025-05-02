import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import BidService from '../../services/bidService';

const route = Router();

export default (app: Router) => {
  app.use('/bid', route);
  const bidService = Container.get(BidService);
  route.get('/user', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildGetItemBidInfoDto(req);
      const { data } = await bidService.getAllBidsForUser(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.get('/:item_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildGetItemBidInfoDto(req);
      const { data } = await bidService.getAllBidsForItem(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/:item_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildBidItemDto(req);
      const { data } = await bidService.bidItem(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.delete('/:bid_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = bidService.buildBidItemDto(req);
      const { data } = await bidService.deleteBid(dto);

      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  
};