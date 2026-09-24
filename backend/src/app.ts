import express from 'express';

import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '@/config/swagger.config.js';

import { errorMiddleware } from '@/middlewares/error.middleware.js';

import { env } from '@/config/env.config.js';

export const app = express();

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.redirect('/api/docs');
});

app.use(errorMiddleware);