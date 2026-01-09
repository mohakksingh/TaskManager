import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend URLs
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('TaskManager API is running');
});

// Routes will be added here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
