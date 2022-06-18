import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connection.on('disconnected', (error) => {
  console.warn(`lost database connection`);
});

mongoose.connection.on('reconnect', () => {
  console.log('-> database reconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(`Could not connect because of ${error}`);
  process.exit(-1);
});

const startDB = () => {
  mongoose.connect(process.env.CONNECT_API, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('connected', () => {
    console.log('Database connected');
  });
};

export default startDB;
