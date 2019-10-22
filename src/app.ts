import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import serviceRoutes from './routes/service';
import bcServiceRoutes from './routes/bc.service';
import userRoutes from './routes/user';

const app = express();

// settings
app.set('port', process.env.PORT || 4000);

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/service', serviceRoutes);
app.use('/service', bcServiceRoutes);

export default app;
