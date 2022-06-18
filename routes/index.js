import AuthRoute from './AuthRoute.js';

import { Router } from 'express';

const router = Router();

router.use('/Auth', AuthRoute);
router.get('/Auth', (req, res) => {
  res.send({ status: 200 });
});

export default router;
