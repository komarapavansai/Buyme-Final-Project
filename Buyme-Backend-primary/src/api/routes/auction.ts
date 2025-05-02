import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import AuctionService from '../../services/auctionService';

const route = Router();

export default (app: Router) => {
  app.use('/auction', route);
  const auctionService = Container.get(AuctionService);

  route.post('/conclude/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const auction_id = req.params.hasOwnProperty('id') ? +req.params.id : null;
      if(!auction_id) throw new Error("Auction Id required!");

      const { data } = await auctionService.concludeTodaysAuctions(auction_id);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.get('/participants/:auction_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = auctionService.buildParticipateAuctionDto(req);
      const { data } = await auctionService.getAuctionParticipants(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/participate/:auction_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = auctionService.buildParticipateAuctionDto(req);
      const { data } = await auctionService.participateInAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.get('/:id?', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = auctionService.buildAuctionGetDto(req);
      const { data } = await auctionService.getAuctionByIdOrList(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = auctionService.buildAuctionCreateOrUpdateDto(req, false);
      const { data } = await auctionService.createAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.put('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = auctionService.buildAuctionCreateOrUpdateDto(req, true);
      const { data } = await auctionService.updateAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.delete('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = auctionService.buildDeleteAuctionDto(req);
      const { data } = await auctionService.deleteUserAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

};