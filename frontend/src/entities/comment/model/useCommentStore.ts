import { create } from 'zustand';
import { Comment, PaginatedResponse, PaginationQueryDto } from 'shared-types';
import { commentApi } from '../api/commentApi';

interface CommentState {
  comments: Comment[];
  pagination: { page: number; total: number; limit: number };
  isLoading: boolean;
  error: string | null;

  setComments: (payload: PaginatedResponse<Comment>) => void;
  fetchBookComments: (olid: string, params?: PaginationQueryDto) => Promise<void>;
  fetchUserComments: (params?: PaginationQueryDto) => Promise<void>;
  addComment: (comment: Comment) => void;
  patchComment: (id: string, content: string, updatedAt?: string) => void;
  removeComment: (id: string) => void;
  reset: () => void;
}

const initialPagination = { page: 1, total: 0, limit: 10 };

export const useCommentStore = create<CommentState>((set) => {
  const loadCommentsList = async (
    fetcher: () => Promise<PaginatedResponse<Comment>>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetcher();
      set({
        comments: data.items,
        pagination: { page: data.page, total: data.total, limit: data.limit },
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load comments' });
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    comments: [],
    pagination: initialPagination,
    isLoading: false,
    error: null,

    setComments: (payload) => {
      set({
        comments: payload.items,
        pagination: { page: payload.page, total: payload.total, limit: payload.limit },
      });
    },

    fetchBookComments: (olid, params) =>
      loadCommentsList(() => commentApi.getByBook(olid, params)),

    fetchUserComments: (params) =>
      loadCommentsList(() => commentApi.getByUser(params)),

    addComment: (comment) =>
      set((state) => ({
        comments: [comment, ...state.comments],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
      })),

    patchComment: (id, content, updatedAt) =>
      set((state) => ({
        comments: state.comments.map((c) =>
          c.id === id ? { ...c, content, updatedAt: updatedAt ?? new Date().toISOString() } : c
        ),
      })),

    removeComment: (id) =>
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== id),
        pagination: { ...state.pagination, total: Math.max(0, state.pagination.total - 1) },
      })),

    reset: () => set({ comments: [], pagination: initialPagination, isLoading: false, error: null }),
  };
});
