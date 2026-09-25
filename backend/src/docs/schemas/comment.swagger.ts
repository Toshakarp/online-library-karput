/**
 * @openapi
 * /api/comments/book/{olid}:
 *   get:
 *     summary: Получение списка комментариев к указанной книге
 *     tags: [Comments]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: olid
 *         required: true
 *         schema: { type: string, example: OL27448W }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Список комментариев к книге
 *
 * /api/comments/user:
 *   get:
 *     summary: Получение всех комментариев текущего пользователя
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Список комментариев текущего пользователя
 *
 * /api/comments:
 *   post:
 *     summary: Добавление нового комментария к книге
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookOlid, content, title, authorName]
 *             properties:
 *               bookOlid: { type: string, example: OL27448W }
 *               content: { type: string, example: "Отличная книга!" }
 *               title: { type: string, example: The Lord of the Rings }
 *               authorName: { type: string, example: J.R.R. Tolkien }
 *               coverUrl: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Комментарий успешно создан
 *
 * /api/comments/{id}:
 *   patch:
 *     summary: Редактирование текста комментария (только автор)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, example: "Обновленный отзыв" }
 *     responses:
 *       200:
 *         description: Комментарий успешно обновлен
 *       403:
 *         description: Нет прав на редактирование чужого комментария
 *   delete:
 *     summary: Удаление комментария (только автор)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Комментарий успешно удален
 *       403:
 *         description: Нет прав на удаление чужого комментария
 */
export const commentSwagger = {};