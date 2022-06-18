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

        const serverClient = StreamChat.getInstance(
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

        await User.create(res.locals.user);

        return next();
      }
    } catch (error) {
      return next(createError(error));
    }
  },

  //TODO: complete authentication
  Login: async function (req, res, next) {
    try {
      const { userName, password } = req.body;

      const validationResult = validateFields('login', {
        userName,
        password,
      });

      if (validationResult.length) return next(createError(validationResult));
      else {
        const serverClient = StreamChat.getInstance(
          process.env.KEY,
          process.env.SECRET
        );
        const { users } = await serverClient.queryUsers({ name: userName });

        const userExists = await User.findOne({ userName });
        if (users && userExists) {
          const passwordMatch =
            (await bcrypt.compare(password, users[0].hashedPassword)) ===
            (await bcrypt.compare(password, userExists.password));

          if (passwordMatch) {
            const token = serverClient.createToken(userExists.userId);
            res.locals.user = { token, ...userExists._doc };
            return next();
          } else {
            next(createError('Password or UserName is incorrrect'));
          }
        } else return next(createError('User not found!'));
      }
    } catch (error) {
      return next(createError(error));
    }
  },
};

export default AuthController;
