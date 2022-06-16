import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { StreamChat } from 'stream-chat';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

console.log('current state of node environment is -> ', process.env.NODE_ENV);

process.env.NODE_ENV === 'production' &&
  app.use('/build', express.static(path.join(__dirname, '../build')));

const serverClient = new StreamChat.getInstance(
  process.env.KEY,
  process.env.SECRET
);

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

app.post('/signup', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hashPassword(password, 10);
  const token = serverClient.createToken(userId);
  res
    .status(200)
    .json({ token, userId, firstName, lastName, username, hashedPassword });
});

app.post('/login', (req, res) => {});

app.listen(3000, () => console.log('listening on port ' + 3000)); //listens on port 3000 -> http://localhost:3000/
