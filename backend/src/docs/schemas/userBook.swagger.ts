/**
 * @openapi
 * /api/user-books/like:
 *   post:
 *     summary: Установка или снятие отметки «Нравится» (лайк) для книги
 *     tags: [User Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookOlid, liked, title, authorName]
 *             properties:
 *               bookOlid: { type: string, example: OL27448W }
 *               liked: { type: boolean, example: true }
 *               title: { type: string, example: The Lord of the Rings }
 *               authorName: { type: string, example: J.R.R. Tolkien }
 *               coverUrl: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Лайк успешно обновлен
 *
 * /api/user-books/status:
 *   post:
 *     summary: Установка или сброс статуса чтения книги (Хочу прочитать, Читаю, Прочитано)
 *     tags: [User Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookOlid, status, title, authorName]
 *             properties:
 *               bookOlid: { type: string, example: OL27448W }
 *               status: { $ref: '#/components/schemas/ReadingStatus', nullable: true }
 *               title: { type: string, example: The Lord of the Rings }
 *               authorName: { type: string, example: J.R.R. Tolkien }
 *               coverUrl: { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: Статус чтения успешно обновлен
 *
 * /api/user-books:
 *   get:
 *     summary: Получение персонального списка книг пользователя (библиотека, избранное, списки чтения)
 *     tags: [User Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [liked, reading_list, all] }
 *       - in: query
 *         name: status
 *         schema: { $ref: '#/components/schemas/ReadingStatus' }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Список сохраненных книг пользователя
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
 *                     total: { type: integer, example: 5 }
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 10 }
 */
export const userBookSwagger = {};
