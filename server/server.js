import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

console.log('current state of node environment is -> ', process.env.NODE_ENV);

// statically serve everything in the build folder on the route '/build'
process.env.NODE_ENV === 'production' &&
  app.use('/build', express.static(path.join(__dirname, '../build')));

// serve index.html on the route '/'
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

app.listen(3000, () => console.log('listening on port ' + 3000)); //listens on port 3000 -> http://localhost:3000/
