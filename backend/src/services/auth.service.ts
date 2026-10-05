import { userRepository } from '@/repositories/user.repository.js';
import { passwordUtil } from '@/utils/password.util.js';
import { jwtUtil } from '@/utils/jwt.util.js';
import type { RegisterDto, LoginDto, ChangePasswordDto, AuthResponse } from 'shared-types';
import { UnauthorizedError, ForbiddenError } from '@/errors/app.errors.js';

export const authService = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const passwordHash = await passwordUtil.hash(dto.password);
    const user = await userRepository.create({ username: dto.username, passwordHash });
    const token = jwtUtil.sign({ userId: user.id });
    return { token, user };
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const userWithHash = await userRepository.findByUsername(dto.username);
    if (!userWithHash) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const isValid = await passwordUtil.compare(dto.password, userWithHash.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }
    const token = jwtUtil.sign({ userId: userWithHash.id });
    const { password_hash, ...user } = userWithHash;
    return { token, user };
  },

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const userWithHash = await userRepository.findById(userId);
    if (!userWithHash) throw new UnauthorizedError('User not found');

    const isValid = await passwordUtil.compare(dto.currentPassword, userWithHash.password_hash);
    if (!isValid) throw new ForbiddenError('Invalid current password');

    const newHash = await passwordUtil.hash(dto.newPassword);
    await userRepository.updatePasswordHash(userId, newHash);
  },
};
