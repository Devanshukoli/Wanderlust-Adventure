import express, { urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))

app.get('/', (req, res) => {
  res.send('The Backend is working fine!');
})

const server = app.listen(port, async () => {
  console.log(`Backend server is running on ${port}`)
})