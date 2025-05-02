import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UserService from '../../services/userService';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);
  const userService = Container.get(UserService);

  route.get('/:id?', async (req: Request, res: Response) => {
    try {
      const dto = userService.buildGetUserDto(req);
      const { data } = await userService.getUserByIdOrList(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/', middlewares.attachUserIfPresent, async (req: Request, res: Response) => {
    try {
      const dto = userService.buildCreateOrUpdateUserDto(req, false);
      const { data } = await userService.createUser(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });


  route.put('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = userService.buildCreateOrUpdateUserDto(req, true);
      const { data } = await userService.updateUser(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.delete('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = userService.buildCreateOrUpdateUserDto(req, true);
      const { data } = await userService.deleteUser(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

};