import dotenv from 'dotenv';
dotenv.config();

import express, { urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import destinationsRouter from './routes/destinations';
import bookingsRouter from './routes/bookings';
import authRouter from './routes/auth';


const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cors({
  origin: [ process.env.FRONTEND_URL || "http://localhost:5173"],
  credentials: true
}))

app.get('/', (req, res) => {
  res.send('The Backend is working fine!');
})

app.use('/api/destinations', destinationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);

const server = app.listen(port, async () => {
  console.log(`Backend server is running on ${port}`)
})
