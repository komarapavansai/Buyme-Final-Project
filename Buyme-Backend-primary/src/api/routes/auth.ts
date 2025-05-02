import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import AuthService from '../../services/authService';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);
  const authService = Container.get(AuthService);

  route.post('/login/token', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = authService.buildLoggedInAuthDto(req);
      const data = await authService.loginWithToken(dto);

      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/login', async (req: Request, res: Response) => {
    try {
      const dto = authService.buildAuthDto(req, false);
      const data = await authService.loginWithEmailAndPassword(dto);

      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/logout', async (req: Request, res: Response) => {
    try {
      const dto = authService.buildAuthDto(req, true);
      const { data } = await authService.logout(dto.token);

      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

};