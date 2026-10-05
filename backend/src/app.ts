import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger.config.js';
import routes from '@/routes/index.js';
import { errorMiddleware } from '@/middlewares/error.middleware.js';
import { env } from '@/config/env.config.js';
import path from 'path';

export const app = express();

app.use(cors({ origin: env.FRONTEND_ORIGIN }));

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.redirect('/api/docs');
});

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use(errorMiddleware);
