import { Router } from 'express';
import test from './routes/test';
import user from './routes/user';
import auth from './routes/auth';
import auction from './routes/auction';
import item from './routes/item';
import bid from './routes/bid';
import question from './routes/question';
import admin from './routes/admin';
import alert from './routes/alert';

export default () => {
	const app = Router();
	test(app);
	user(app);
	auth(app);
	auction(app);
	item(app);
	bid(app);
	question(app);
	admin(app);
	alert(app);
	

	return app
}