import { create } from 'zustand';
import {
  BookWithUserInteraction,
  BookDetails,
  GetUserBooksQueryDto,
  PaginatedResponse,
  ReadingStatus,
} from 'shared-types';
import { ApiError } from '@/shared/api/apiClient';
import { bookApi, SearchBooksParams } from '../api/bookApi';
import { userBookApi } from '../api/userBookApi';

export const READING_STATUS_OPTIONS: {
  value: ReadingStatus;
  label: string;
  colorAccent: 'yellow' | 'purple' | 'green';
}[] = [
  { value: 'WANT_TO_READ', label: 'Want to Read', colorAccent: 'yellow' },
  { value: 'READING', label: 'Reading', colorAccent: 'purple' },
  { value: 'COMPLETED', label: 'Completed', colorAccent: 'green' },
];

interface InteractionPatch {
  isLiked?: boolean;
  status?: ReadingStatus | null;
  likesCountDelta?: number;
}

interface BookState {
  books: BookWithUserInteraction[];
  currentBook: BookDetails | null;
  pagination: { page: number; total: number; limit: number };
  isLoading: boolean;
  error: string | null;

  setCurrentBook: (book: BookDetails | null) => void;
  searchBooks: (params: SearchBooksParams) => Promise<void>;
  fetchUserBooks: (params?: GetUserBooksQueryDto) => Promise<void>;
  fetchBookByOlid: (olid: string) => Promise<void>;
  patchBookInteraction: (olid: string, patch: InteractionPatch) => void;
  reset: () => void;
}

const initialState = {
  books: [] as BookWithUserInteraction[],
  currentBook: null as BookDetails | null,
  pagination: { page: 1, total: 0, limit: 10 },
  isLoading: false,
  error: null as string | null,
};

const applyInteractionPatch = <T extends BookWithUserInteraction>(
  book: T,
  olid: string,
  patch: InteractionPatch,
): T => {
  if (book.olid !== olid) return book;

  const prev = book.userInteraction ?? { isLiked: false, status: null };
  const isLiked = patch.isLiked ?? prev.isLiked;
  const status = patch.status !== undefined ? patch.status : prev.status;
  const likesCount = book.likesCount + (patch.likesCountDelta ?? 0);

  return {
    ...book,
    likesCount,
    userInteraction: isLiked || status !== null ? { isLiked, status } : undefined,
  };
};

export const useBookStore = create<BookState>((set) => {
  const loadList = async (fetcher: () => Promise<PaginatedResponse<BookWithUserInteraction>>) => {
    set({ isLoading: true, error: null });
    try {
      const { items, page, total, limit } = await fetcher();
      set({ books: items, pagination: { page, total, limit } });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load books' });
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    ...initialState,

    setCurrentBook: (currentBook) => set({ currentBook, error: null, isLoading: false }),

    searchBooks: (params) => loadList(() => bookApi.search(params)),

    fetchUserBooks: (params) =>
      loadList(() =>
        userBookApi.getUserBooks(params ?? { page: 1, limit: initialState.pagination.limit }),
      ),

    fetchBookByOlid: async (olid) => {
      set({ isLoading: true, error: null });
      try {
        const currentBook = await bookApi.getByOlid(olid);
        set({ currentBook });
      } catch (err) {
        const apiErr = err as Partial<ApiError>;
        const isNotFound = apiErr?.status === 404 || apiErr?.code === 'NOT_FOUND';
        set({
          currentBook: null,
          error: isNotFound
            ? 'NOT_FOUND'
            : err instanceof Error
              ? err.message
              : 'Failed to load book',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    patchBookInteraction: (olid, patch) =>
      set((state) => ({
        books: state.books.map((book) => applyInteractionPatch(book, olid, patch)),
        currentBook: state.currentBook
          ? applyInteractionPatch(state.currentBook, olid, patch)
          : null,
      })),

    reset: () => set(initialState),
  };
});
