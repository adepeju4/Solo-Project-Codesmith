import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import allRoutes from '../routes/index.js';
import startDB from '../database/db.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);

process.env.NODE_ENV === 'production' &&
  app.use(
    '/build',
    express.static(path.join(path.dirname(__filename), '../build'))
  );

app.use('/api', allRoutes.AuthRoute);

app.get('/', (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(path.dirname(__filename), '../index.html'));
});

// Unknown route handler
app.use((req, res) => res.sendStatus(404));

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(err, errorObj.log, errorObj.message);
  return res.status(errorObj.status).json(errorObj.message);
});

console.log('current state of node environment is -> ', process.env.NODE_ENV);
startDB(); // starting mongodb database
app.listen(3000, () => console.log('listening on port ' + 3000)); //listens on port 3000 -> http://localhost:3000/
