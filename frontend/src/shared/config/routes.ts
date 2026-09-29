export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  BOOK_DETAILS: '/books/:olid',
  PROFILE: '/profile',
  MY_BOOKS: '/profile/my-books',
  MY_COMMENTS: '/profile/comments',
  CHANGE_PASSWORD: '/profile/change-password',
  BOOK_PATH: (olid: string) => `/books/${olid}`,
  MY_BOOKS_CATEGORY: (category: 'liked' | 'reading_list') =>
    `/profile/my-books?category=${category}`,
};
