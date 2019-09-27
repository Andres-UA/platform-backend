import express from 'express';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import serviceRoutes from './routes/service';
import bcService from './routes/bc.service';

const app = express();

// settings
app.set('port', process.env.PORT || 4000);

// middleware
app.use(morgan('dev'));
app.use(express.json());

// routes
app.use('/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/service', serviceRoutes);
app.use('/service', bcService);

export default app;
