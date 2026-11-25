import 'dotenv/config';
import taskRoutes from './routes/taskRoutes.js';
import express from 'express';
import connectDB from './config/db.js';

const app = express();
app.use(express.json()); 
app.use('/api/tasks', taskRoutes);

connectDB();

app.listen(process.env.PORT || 5000, () => console.log('Server running'));