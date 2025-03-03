import express from 'express';
import mongoose from 'mongoose';
import appealRoutes from './routes/appealRoutes';

const app = express();

app.use(express.json());
app.use('/api', appealRoutes);

mongoose.connect('mongodb://localhost:27017/appeals-system', {
  // Уберите устаревшие опции
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

export default app;