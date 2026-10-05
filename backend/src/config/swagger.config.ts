import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.config.js';
import path from 'path';

import '../docs/schemas/auth.swagger.js';
import '../docs/schemas/book.swagger.js';
import '../docs/schemas/comment.swagger.js';
import '../docs/schemas/profile.swagger.js';
import '../docs/schemas/userBook.swagger.js';

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
        description: 'Development Server',
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
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Invalid input' },
              },
            },
          },
          required: ['success'],
        },
        ReadingStatus: {
          type: 'string',
          enum: ['WANT_TO_READ', 'READING', 'COMPLETED'],
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string', example: 'bookworm' },
            displayName: { type: 'string', example: 'Book Worm' },
            avatarUrl: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/avatar.jpg',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'username', 'displayName', 'createdAt', 'updatedAt'],
        },
        CachedBook: {
          type: 'object',
          properties: {
            olid: { type: 'string', example: 'OL12345W' },
            title: { type: 'string', example: 'The Hobbit' },
            authorName: { type: 'string', example: 'J.R.R. Tolkien' },
            coverUrl: {
              type: 'string',
              nullable: true,
              example: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
            },
            likesCount: { type: 'integer', example: 42 },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['olid', 'title', 'authorName', 'likesCount', 'createdAt'],
        },
        BookWithUserInteraction: {
          allOf: [
            { $ref: '#/components/schemas/CachedBook' },
            {
              type: 'object',
              properties: {
                userInteraction: {
                  type: 'object',
                  properties: {
                    isLiked: { type: 'boolean', example: true },
                    status: {
                      $ref: '#/components/schemas/ReadingStatus',
                      nullable: true,
                    },
                  },
                },
              },
            },
          ],
        },
        BookDetails: {
          allOf: [
            { $ref: '#/components/schemas/BookWithUserInteraction' },
            {
              type: 'object',
              properties: {
                description: { type: 'string', example: 'An epic high-fantasy adventure...' },
              },
            },
          ],
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            bookOlid: { type: 'string', example: 'OL12345W' },
            content: { type: 'string', example: 'Amazing book, read it in one sitting!' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            author: { $ref: '#/components/schemas/UserProfile' },
          },
          required: ['id', 'userId', 'bookOlid', 'content', 'createdAt', 'updatedAt'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(import.meta.dirname, '../docs/schemas/*.swagger.ts'),
    path.join(import.meta.dirname, '../docs/schemas/*.swagger.js'),
    './src/docs/schemas/*.swagger.ts',
    './dist/docs/schemas/*.swagger.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
