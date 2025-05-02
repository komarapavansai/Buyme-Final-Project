import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import AdminService from '../../services/adminService';

const route = Router();

export default (app: Router) => {
  app.use('/admin', route);
 
  route.get('/report/earnings', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      if (!req.claims?.is_admin) {
        return res.status(403).json({ error: "Unauthorized" });
      }
  
      const adminService = Container.get(AdminService) as AdminService;
      const { data } = await adminService.getSalesReports();
  
      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
  
};
