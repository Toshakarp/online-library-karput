/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, minLength: 3, example: bookworm }
 *               password: { type: string, minLength: 6, example: secret123 }
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: "eyJhbGci..." }
 *                     user: { $ref: '#/components/schemas/UserProfile' }
 *       400:
 *         description: Ошибка валидации входных данных
 *       409:
 *         description: Имя пользователя уже занято
 *
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему (аутентификация)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string, example: bookworm }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: "eyJhbGci..." }
 *                     user: { $ref: '#/components/schemas/UserProfile' }
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Неверные учетные данные
 *
 * /api/auth/change-password:
 *   patch:
 *     summary: Смена пароля текущего пользователя
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string, example: oldSecret123 }
 *               newPassword: { type: string, minLength: 6, example: newSecret123 }
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Текущий пароль указан неверно
 */
export const authSwagger = {};
