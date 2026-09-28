import { commentRepository } from '@/repositories/comment.repository.js';
import { bookService } from './book.service.js';
import type { CreateCommentDto, UpdateCommentDto, Comment, PaginatedResponse } from 'shared-types';
import { ForbiddenError, NotFoundError } from '@/errors/app.errors.js';

export const commentService = {
    async addComment(userId: string, dto: CreateCommentDto): Promise<Comment> {
        await bookService.ensureBookExists(dto);
        return await commentRepository.create(userId, dto);
    },

    async getByBook(olid: string, page: number, limit: number): Promise<PaginatedResponse<Comment>> {
        const { items, total } = await commentRepository.findByBookOlid(olid, page, limit);
        return { items, total, page, limit };
    },

    async getByUser(userId: string, page: number, limit: number): Promise<PaginatedResponse<Comment>> {
        const { items, total } = await commentRepository.findByUserId(userId, page, limit);
        return { items, total, page, limit };
    },

    async updateComment(userId: string, commentId: string, dto: UpdateCommentDto): Promise<Comment> {
        const updated = await commentRepository.update(commentId, userId, dto.content);

        if (!updated) {
            const ownerId = await commentRepository.findOwnerId(commentId);
            if (!ownerId) throw new NotFoundError('Comment not found');
            throw new ForbiddenError('You can only edit your own comments');
        }

        return updated;
    },

    async deleteComment(userId: string, commentId: string): Promise<void> {
        const deleted = await commentRepository.delete(commentId, userId);

        if (!deleted) {
            const ownerId = await commentRepository.findOwnerId(commentId);
            if (!ownerId) throw new NotFoundError('Comment not found');
            throw new ForbiddenError('You can only delete your own comments');
        }
    }
};