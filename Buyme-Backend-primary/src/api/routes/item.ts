import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import ItemService from '../../services/itemService';

const route = Router();

export default (app: Router) => {
  app.use('/item', route);
  const itemService = Container.get(ItemService);

  route.get('/auction/:auction_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildAuctionItemDto(req, false);
      const { data } = await itemService.getItemsInAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.get('/user', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildItemGetDto(req);
      const { data } = await itemService.getItemsForUser(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/auction/:auction_id/item/:item_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildAuctionItemDto(req, false);
      const { data } = await itemService.addItemToAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.delete('/auction/:auction_id/item/:item_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildAuctionItemDto(req, false);
      const { data } = await itemService.removeItemFromAuction(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.get('/:id?', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildItemGetDto(req);
      const { data } = await itemService.getItemByIdOrList(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildItemCreateOrUpdateDto(req, false);
      const { data } = await itemService.createItem(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.put('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildItemCreateOrUpdateDto(req, true);
      const { data } = await itemService.updateItem(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.delete('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = itemService.buildDeleteItemDto(req);
      const { data } = await itemService.deleteUserItem(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

};