import { create } from 'zustand';
import { Comment, PaginatedResponse, PaginationQueryDto } from 'shared-types';
import { commentApi } from '../api/commentApi';

interface CommentState {
  comments: Comment[];
  pagination: { page: number; total: number; limit: number };
  isLoading: boolean;
  error: string | null;

  fetchBookComments: (olid: string, params?: PaginationQueryDto) => Promise<void>;
  fetchUserComments: (params?: PaginationQueryDto) => Promise<void>;
  addComment: (comment: Comment) => void;
  patchComment: (id: string, content: string, updatedAt?: string) => void;
  removeComment: (id: string) => void;
  reset: () => void;
}

const initialState = {
  comments: [] as Comment[],
  pagination: { page: 1, total: 0, limit: 10 },
  isLoading: false,
  error: null as string | null,
};

export const useCommentStore = create<CommentState>((set) => {
  const loadList = async (fetcher: () => Promise<PaginatedResponse<Comment>>) => {
    set({ isLoading: true, error: null });
    try {
      const { items, page, total, limit } = await fetcher();
      set({ comments: items, pagination: { page, total, limit } });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load comments' });
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    ...initialState,

    fetchBookComments: (olid, params) => loadList(() => commentApi.getByBook(olid, params)),

    fetchUserComments: (params) => loadList(() => commentApi.getByUser(params)),

    addComment: (comment) =>
      set((state) => ({
        comments:
          state.pagination.page === 1
            ? [comment, ...state.comments].slice(0, state.pagination.limit)
            : state.comments,
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
      })),

    patchComment: (id, content, updatedAt = new Date().toISOString()) =>
      set((state) => ({
        comments: state.comments.map((c) => (c.id === id ? { ...c, content, updatedAt } : c)),
      })),

    removeComment: (id) =>
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== id),
        pagination: { ...state.pagination, total: Math.max(0, state.pagination.total - 1) },
      })),

    reset: () => set(initialState),
  };
});
