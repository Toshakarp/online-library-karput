/**
 * @openapi
 * /api/books/search:
 *   get:
 *     summary: Поиск книг через Open Library API с кэшированием и статусами
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         example: The Lord of the Rings
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Результаты поиска книг
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/BookWithUserInteraction' }
 *                     total: { type: integer, example: 142 }
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 10 }
 *
 * /api/books/{olid}:
 *   get:
 *     summary: Получение детальной информации о книге по Open Library ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     parameters:
 *       - in: path
 *         name: olid
 *         required: true
 *         schema: { type: string }
 *         example: OL27448W
 *     responses:
 *       200:
 *         description: Детальная информация о книге
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/BookDetails' }
 *       404:
 *         description: Книга не найдена
 */
export const bookSwagger = {};
