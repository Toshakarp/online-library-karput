import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.config.js';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Online Library API',
            version: '1.0.0',
            description: 'API documentation for the Online Library project',
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);