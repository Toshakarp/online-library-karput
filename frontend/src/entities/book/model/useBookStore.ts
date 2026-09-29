import { create } from 'zustand';
import { BookWithUserInteraction, BookDetails, GetUserBooksQueryDto, PaginatedResponse, ReadingStatus } from 'shared-types';
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

interface BookState {
  books: BookWithUserInteraction[];
  currentBook: BookDetails | null;
  pagination: { page: number; total: number; limit: number };
  isLoading: boolean;
  error: string | null;

  setBooks: (payload: PaginatedResponse<BookWithUserInteraction>) => void;
  setCurrentBook: (book: BookDetails | null) => void;
  searchBooks: (params: SearchBooksParams) => Promise<void>;
  fetchUserBooks: (params?: GetUserBooksQueryDto) => Promise<void>;
  fetchBookByOlid: (olid: string) => Promise<void>;
  patchBookInteraction: (
    olid: string,
    patch: { isLiked?: boolean; status?: ReadingStatus | null; likesCountDelta?: number }
  ) => void;
  reset: () => void;
}

const initialPagination = { page: 1, total: 0, limit: 10 };

export const useBookStore = create<BookState>((set, get) => {
  const loadBooksList = async (
    fetcher: () => Promise<PaginatedResponse<BookWithUserInteraction>>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetcher();
      set({
        books: data.items,
        pagination: { page: data.page, total: data.total, limit: data.limit },
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load books' });
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    books: [],
    currentBook: null,
    pagination: initialPagination,
    isLoading: false,
    error: null,

    setBooks: (payload) => {
      set({
        books: payload.items,
        pagination: { page: payload.page, total: payload.total, limit: payload.limit },
      });
    },

    setCurrentBook: (book) => set({ currentBook: book }),

    searchBooks: (params) => loadBooksList(() => bookApi.search(params)),

    fetchUserBooks: (params) =>
      loadBooksList(() =>
        userBookApi.getUserBooks(params ?? { page: 1, limit: initialPagination.limit })
      ),

  fetchBookByOlid: async (olid) => {
    set({ isLoading: true, error: null });
    try {
      const book = await bookApi.getByOlid(olid);
      set({ currentBook: book });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load book' });
    } finally {
      set({ isLoading: false });
    }
  },

  patchBookInteraction: (olid, patch) => {
    const applyPatch = (book: BookWithUserInteraction): BookWithUserInteraction => {
      if (book.olid !== olid) return book;
      const prev = book.userInteraction ?? { isLiked: false, status: null };
      const nextIsLiked = patch.isLiked !== undefined ? patch.isLiked : prev.isLiked;
      const nextStatus = patch.status !== undefined ? patch.status : prev.status;
      const nextLikesCount = book.likesCount + (patch.likesCountDelta ?? 0);

      if (!nextIsLiked && nextStatus === null) {
        return { ...book, likesCount: nextLikesCount, userInteraction: undefined };
      }
      return {
        ...book,
        likesCount: nextLikesCount,
        userInteraction: { isLiked: nextIsLiked, status: nextStatus },
      };
    };

    const { books, currentBook } = get();
    const updatedBooks = books.map(applyPatch);

    let updatedCurrentBook = currentBook;
    if (currentBook && currentBook.olid === olid) {
      updatedCurrentBook = applyPatch(currentBook) as BookDetails;
    }

    set({ books: updatedBooks, currentBook: updatedCurrentBook });
  },

  reset: () => set({ books: [], currentBook: null, pagination: initialPagination, isLoading: false, error: null }),
  };
});
