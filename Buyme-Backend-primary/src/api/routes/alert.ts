import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import AlertService from '../../services/alertService';

const route = Router();

export default (app: Router) => {
  app.use('/alert', route);
  const alertService = Container.get(AlertService);

  route.get('/:id?', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = alertService.buildGetAlertoDto(req);
      const { data } = await alertService.getAllAlertsForUser(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.post('/', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = alertService.buildAlertCRUDdto(req, false);
      const { data } = await alertService.createAlert(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.put('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = alertService.buildAlertCRUDdto(req, true);
      const { data } = await alertService.updateAlert(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

  route.delete('/:id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = alertService.buildGetAlertoDto(req);
      const { data } = await alertService.deleteAlert(dto);
      return res.json({ data });
    }
    catch (e) {
      return res.status(500).json({ 'error': `${e.message.toString()}` });
    }
  });

};