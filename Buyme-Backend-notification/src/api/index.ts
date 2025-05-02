import { Router } from 'express';
import test from './routes/test';
import bid from './routes/bid';

export default () => {
	const app = Router();
	test(app);
	bid(app);

	return app
}