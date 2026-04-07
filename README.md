# Blog MVC

A full-stack blog platform built with the MVC architecture pattern. Users can register, write posts, save drafts, publish, and like posts.

## Tech Stack

**Server** — Express 5, TypeScript, Prisma ORM, PostgreSQL 19, JWT + bcrypt auth

**Client** — React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router

## Project Structure

```
blog-mvc/
├── client/                 # React SPA
│   └── src/
│       ├── components/     # Navbar
│       ├── lib/            # Axios instance
│       └── pages/          # Home, Post, CreatePost, MyPosts, Login, Register
└── server/                 # Express API
    └── src/
        ├── controllers/    # user.controller, post.controller
        ├── middleware/     # JWT auth
        ├── routes/         # user.routes, post.routes
        └── lib/            # Prisma client singleton
```

## Data Model

- **User** — id, email, username, password (hashed), name, avatar
- **Post** — id, slug, title, content, banner, status (DRAFT/PUBLISHED/ARCHIVED), readCount, impressions
- **Like** — composite key [userId, postId]

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL

### Server

```bash
cd server
cp .env.example .env
pnpm install
pnpm prisma migrate dev
pnpm dev
```

### Client

```bash
cd client
cp .env.example .env.local
pnpm install
pnpm dev
```

## API Endpoints

### Auth

| Method | Endpoint              | Auth | Description      |
| ------ | --------------------- | ---- | ---------------- |
| POST   | `/api/users/register` | No   | Create account   |
| POST   | `/api/users/login`    | No   | Login, get JWT   |
| GET    | `/api/users/:id`      | No   | Get user profile |

### Posts

| Method | Endpoint              | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| GET    | `/api/posts`          | No   | List published posts |
| GET    | `/api/posts/:slug`    | No   | Get post by slug     |
| GET    | `/api/posts/mine`     | Yes  | Get your posts       |
| POST   | `/api/posts`          | Yes  | Create post          |
| PUT    | `/api/posts/:id`      | Yes  | Update post          |
| DELETE | `/api/posts/:id`      | Yes  | Delete post          |
| POST   | `/api/posts/:id/like` | Yes  | Toggle like          |
