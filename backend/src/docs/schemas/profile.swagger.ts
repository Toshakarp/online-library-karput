/**
 * @openapi
 * /api/profile/me:
 *   get:
 *     summary: Получение профиля текущего авторизованного пользователя
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/UserProfile' }
 *       401:
 *         description: Не авторизован
 *   patch:
 *     summary: Обновление данных профиля (отображаемое имя и аватар)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName: { type: string, example: New Display Name }
 *               avatarUrl: { type: string, nullable: true, example: null }
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 *       401:
 *         description: Не авторизован
 *
 * /api/profile/me/username:
 *   patch:
 *     summary: Смена логина (username) пользователя
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newUsername]
 *             properties:
 *               newUsername: { type: string, minLength: 3, example: updated_username }
 *     responses:
 *       200:
 *         description: Имя пользователя успешно изменено
 *       409:
 *         description: Новое имя пользователя уже занято
 *
 * /api/profile/me/avatar:
 *   post:
 *     summary: Загрузка изображения аватара
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Аватар успешно загружен
 *       401:
 *         description: Не авторизован
 */
export const profileSwagger = {};