# 📚 Online Library (Full-Stack Monorepo)

A production-grade web application for discovering books via the Open Library API, managing personal reading shelves, saving favorites, posting reviews, and customizing user profiles.

---

## Tech Stack

| Domain | Technology / Libraries |
| :--- | :--- |
| **Monorepo** | npm / bun workspaces (`backend/`, `frontend/`, `packages/shared-types/`) |
| **Language** | TypeScript (strict type checking across backend, frontend, and shared contracts) |
| **Backend** | Node.js LTS, Express.js (Layered Architecture: Route → Middleware → Controller → Service → Repository → DB) |
| **Database** | Supabase PostgreSQL + native `ENUM` + composite indexes + cascading foreign keys |
| **Authentication** | Custom Stateless Auth: bcryptjs (10+ salt rounds) + JSON Web Token (`Authorization: Bearer <token>`) |
| **Validation** | Zod schemas via request validation middleware |
| **Caching** | `node-cache` (In-memory Singleton, normalized keys, 30-minute TTL) |
| **Throttling** | FIFO request queue limiting external calls to Open Library API to **1 req/sec** |
| **Documentation** | OpenAPI 3.0 / Swagger UI (`swagger-jsdoc`, `swagger-ui-express`) at `/api/docs` |
| **Frontend** | React 19, Vite, TypeScript, React Router 7 |
| **State Management** | Zustand 5 (Session store in `app/store`, business entities in `entities/*/model`) |
| **Architecture** | Feature-Sliced Design (`app → pages → widgets → features → entities → shared`) |
| **Styling** | SCSS Modules (`.module.scss`), Flexbox-only layouts, strict token variables (No inline styles) |
| **Networking** | Native `fetch` wrapped in typed `apiClient.ts` with error normalization |
| **Code Quality** | ESLint (`eslint.config.js`) + Prettier (`.prettierrc`) |

---

## 🏛️ System Architecture

```
                               ┌────────────────────────┐
                               │   Frontend (React 19)  │
                               │ http://localhost:3000  │
                               └───────────┬────────────┘
                                           │ HTTP / JSON (Bearer JWT)
                                           ▼
                               ┌────────────────────────┐
                               │  Express.js API Layer  │
                               │  http://localhost:3001 │
                               └───────────┬────────────┘
                ┌──────────────────────────┼──────────────────────────┐
                ▼                          ▼                          ▼
     ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
     │   User / Auth / DB   │   │ In-Memory Cache (TTL)│   │ Throttled Queue      │
     │   Repository Layer   │   │ (node-cache: 30 min) │   │ (FIFO: 1 req/sec)    │
     └──────────┬───────────┘   └──────────────────────┘   └──────────┬───────────┘
                │ SQL Queries                                         │ HTTPS Fetch
                ▼                                                     ▼
     ┌──────────────────────┐                              ┌──────────────────────┐
     │  Supabase PostgreSQL │                              │   Open Library API   │
     │  (users, books, etc.)│                              │ (Metadata & Covers)  │
     └──────────────────────┘                              └──────────────────────┘
```

---


## ⚙️ Environment Configuration

The monorepo contains pre-configured `.env.example` templates in both `backend/` and `frontend/`.

### 1. Backend (`backend/.env`)

Create `backend/.env` from the example template:
```bash
cp backend/.env.example backend/.env
```

Configured variables:
```env
# Server Port (default: 3001)
PORT=3001

# Supabase PostgreSQL database URL and service role key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# JWT authentication secret and token lifespan
JWT_SECRET=your-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=1d

# Open Library external API base URL
OPEN_LIBRARY_BASE_URL=https://openlibrary.org

# Frontend origin allowed by CORS middleware (default: http://localhost:3000)
FRONTEND_ORIGIN=http://localhost:3000
```

### 2. Frontend (`frontend/.env`)

Create `frontend/.env` from the example template:
```bash
cp frontend/.env.example frontend/.env
```

Configured variables:
```env
# Backend API Base URL
# In local development, requests are directed to the backend on port 3001
VITE_API_BASE_URL=http://localhost:3001
```

*(Note: The Vite frontend dev server and preview run on port 3000).*

---

## 🚀 Installation & Running

### 1. Install All Dependencies
From the repository root:
```bash
npm install
```
---

### 2. Unified Commands (Root `package.json`)

| Command | Action | Ports |
| :--- | :--- | :--- |
| `npm run dev` | Runs **both** Backend (`tsx watch`) and Frontend (`vite`) concurrently | Frontend: `3000`<br>Backend: `3001` |
| `npm run build` | Compiles **both** Backend (TypeScript `tsc` → `dist/`) and Frontend (`vite build` → `dist/`) | — |
| `npm start` | Launches **both** production builds concurrently (`node dist/server.js` + `vite preview`) | Frontend: `3000`<br>Backend: `3001` |
| `npm run lint` | Runs ESLint across all packages and services | — |
| `npm run format` | Formats all files with Prettier | — |

---

### 3. Service-Specific Commands (Workspaces)

You can also run backend or frontend independently:

#### Backend
- `npm run b-dev` — Start backend in watch mode via `tsx`
- `npm run b-build` — Compile backend TypeScript into `backend/dist/`
- `npm run b-start` — Run compiled backend from `backend/dist/server.js`

#### Frontend
- `npm run f-dev` — Start Vite dev server on `http://localhost:3000`
- `npm run f-build` — Build production bundle into `frontend/dist/`
- `npm run f-preview` — Preview production bundle on `http://localhost:3000`

---

## 📖 API Documentation (Swagger UI)

Interactive OpenAPI 3.0 documentation is automatically generated from JSDoc route annotations and available at:

👉 **`http://localhost:3001/api/docs`**

### Available Endpoint Groups:
- **`Auth`** (`/api/auth/*`): User registration, login, and password change.
- **`Profile`** (`/api/profile/*`): Profile fetch, username change, display name update, and avatar upload to Supabase Storage.
- **`Books`** (`/api/books/*`): Catalog search with pagination, Open Library integration, and detailed work metadata.
- **`User-Books`** (`/api/user-books/*`): Personal reading shelves (`WANT_TO_READ`, `READING`, `COMPLETED`), likes, and filters.
- **`Comments`** (`/api/comments/*`): Public comments for books, user review history with book covers, inline editing, and deletion.

---

## 📂 Repository Structure

```
.
├── backend/                       # Express.js REST API
│   ├── src/
│   │   ├── config/                # Environment variables, Supabase client, Swagger
│   │   ├── controllers/           # HTTP Request/Response handlers
│   │   ├── errors/                # Standardized domain error classes
│   │   ├── middlewares/           # Auth, OptionalAuth, Zod validation, Error handler
│   │   ├── repositories/          # Pure DB & external API access
│   │   ├── routes/                # Route definitions & OpenAPI annotations
│   │   ├── services/              # Business logic (Auth, Book, Comment, etc.)
│   │   ├── utils/                 # NodeCache Singleton, RateLimiter, JWT, bcrypt
│   │   ├── app.ts                 # Express application configuration
│   │   └── server.ts              # HTTP server entry point
│   ├── .env.example               # Backend environment template
│   ├── tsconfig.json              # Backend TypeScript config (outDir: ./dist)
│   └── package.json
├── frontend/                      # React 19 Client
│   ├── src/
│   │   ├── app/                   # Providers, ProtectedRoute, AppRouter, AuthStore
│   │   ├── entities/              # Business entities (BookCard, CommentItem, stores)
│   │   ├── features/              # Feature modules (AuthForm, Like, Status, Search)
│   │   ├── pages/                 # Composable page views (Home, Details, Profile, etc.)
│   │   ├── shared/                # UI kit, apiClient, hooks, variables.scss
│   │   └── widgets/               # Complex widgets (Header, BookDetails, CommentsSection)
│   ├── .env.example               # Frontend environment template
│   ├── vite.config.ts             # Vite configuration with SCSS & API proxies
│   └── package.json
├── packages/
│   └── shared-types/              # Shared DTOs and database contracts
│       ├── types/                 # User, Book, Comment, UserBook, Status, API types
│       └── index.ts               # Unified re-export entrypoint
├── .env.example                   # Monorepo combined environment reference
└── package.json                   # Monorepo workspace configuration
```

---

## 🛡️ Security & Reliability Highlights

1. **Password Safety:** Passwords are never stored or logged in plain text. Salted bcrypt hashing with 10+ rounds is strictly enforced.
2. **Token Security:** JWT tokens are verified statelessly on every protected route. `password_hash` is stripped at the repository boundary and never crosses the API.
3. **Open Library Protection:** 
   - **Throttling:** An internal FIFO queue ensures no more than 1 request per second hits Open Library, preventing 429 Too Many Requests.
   - **Caching:** Search results and book details are stored in memory for 30 minutes. Repeated queries resolve in under 5 ms without network overhead.
4. **Relational Data Integrity:** Foreign keys are guarded with `ON DELETE CASCADE`. Unique constraints prevent race conditions and duplicate user-book interactions.
