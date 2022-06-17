import { Router } from 'express';
import AuthController from '../controllers/UserController.js';

const router = Router();

router.post('/signup', AuthController.SignUp, (req, res) => {
  return res.status(200).json(res.locals.user);
});

// TODO: complete this with the right user object
router.post('/login', AuthController.Login, (req, res) => {
  return res.status(200).json(res.locals.user);
});

export default router;
