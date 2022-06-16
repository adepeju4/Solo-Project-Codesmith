import User from '../models/Auth.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { StreamChat } from 'stream-chat';
import validateFields, { createError } from '../utils/validateFields.js';
import dotenv from 'dotenv';

dotenv.config();

// TODO: Clear token at specific time
const AuthController = {
  SignUp: async function (req, res, next) {
    try {
      const { firstName, lastName, userName, password } = req.body;

      const validationResult = validateFields('signup', {
        firstName,
        lastName,
        userName,
        password,
      });

      if (validationResult.length) {
        return next(createError(validationResult));
      } else {
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        const serverClient = new StreamChat.getInstance(
          process.env.KEY,
          process.env.SECRET
        );
        const token = serverClient.createToken(userId);
        res.locals.user = {
          token,
          userId,
          firstName,
          lastName,
          userName,
          password: hashedPassword,
        };

        await User.create({
          firstName,
          lastName,
          userName,
          password: hashedPassword,
        });

        return next();
      }
    } catch (error) {
      return next(createError(error));
    }
  },

  //TODO: complete authentication
  Login: function (req, res, next) {
    try {
      const { username, password } = req.body;

      const validationResult = validateFields('signup', {
        firstName,
        lastName,
        username,
        password,
      });

      if (validationResult.length) return next(createError(validationResult));
      else console.log('pending');
    } catch (error) {
      return next(createError(error));
    }
  },
};

export default AuthController;
