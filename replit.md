# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── flye/               # Flye React frontend (at /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Flye — Social Fitness Platform

Flye is a social fitness platform with a Solo Leveling-inspired leveling system.

### Features
- User signup/login (session-based with cookies)
- Social feed with workout posts (calisthenics, gym, power)
- XP and rank system: D → C → B → A → S
- Leaderboard by XP
- "Do Workout" button on posts to gain XP from others' workouts
- Profile page with XP bar and rank badge

### Rank Thresholds
- D: 0 XP (Novice)
- C: 1,000 XP (Beginner)
- B: 3,000 XP (Intermediate)
- A: 7,000 XP (Advanced)
- S: 15,000 XP (Elite Hunter)

### XP Per Workout Type
- Calisthenics: 50 XP
- Gym: 40 XP
- Power: 60 XP

### Future Placeholders
- Territory capture: linked via `location` field on posts
- Camera verification: placeholder route in POST /api/posts (ready for video attachment)
- Leaderboard: fully functional, expandable for territory-based scoring

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes:
- `GET /api/healthz` — health check
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — login
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — current user
- `GET /api/posts` — social feed
- `POST /api/posts` — create workout post (requires auth)
- `POST /api/posts/:postId/workout` — log workout (requires auth)
- `GET /api/users/:username` — public profile
- `GET /api/leaderboard` — top users by XP

### `artifacts/flye` (`@workspace/flye`)

React + Vite frontend at `/`. Dark gaming aesthetic.

### `lib/db` (`@workspace/db`)

Schema:
- `usersTable` — id, username, passwordHash, xp, rank, totalWorkouts, createdAt
- `postsTable` — id, userId, workoutType, description, xpEarned, location, createdAt
- `sessionsTable` — id, sessionToken, userId, createdAt, expiresAt
