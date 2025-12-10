# GitHub Copilot Instructions for "Gestion de Ligas"

## Project Context
This is a monorepo project for a Sports League Management System.
- **Root:** Contains project documentation and shared configs.
- **Backend (`/backend`):** Node.js/Express API.
- **Frontend (`/frontend`):** Nuxt 3 (Vue 3) application.

## Architecture & Core Patterns

### Backend (`/backend`)
- **Framework:** Express.js with a hybrid database approach.
- **Databases:**
  - **MySQL:** Primary relational data (Users, Leagues, Tournaments).
  - **MongoDB:** Auxiliary data (Activity Logs, Comments).
- **Data Access Pattern (CRITICAL):**
  - **No ORM for MySQL:** The project uses **raw SQL queries** directly inside Controllers.
  - **Connection:** Use `getPool()` from `src/config/mysql.js` to execute queries.
  - **Example:** `const [rows] = await pool.query('SELECT * FROM leagues WHERE id = ?', [id]);`
  - **MongoDB:** Uses Mongoose models located in `src/models/`.
- **Authentication:** JWT-based auth with Google Login support.

### Frontend (`/frontend`)
- **Framework:** Nuxt 3 with TypeScript.
- **State Management:** Pinia stores in `stores/`.
- **Styling:** Tailwind CSS.
- **API Interaction:**
  - Use the custom plugin `$api` or the composable `useApiCall`.
  - **Do not** use `fetch` or `axios` directly in components.
  - **Example:** `const { data } = await useApiCall(() => $api.get('/leagues'))`

## Critical Workflows

### Development
- **Backend:** Run `npm run dev` in `/backend`. (Port 3001)
- **Frontend:** Run `npm run dev` in `/frontend`. (Port 3000)

### Database Management
- **Schema:** MySQL tables are automatically created by `createTables()` in `src/config/mysql.js` on startup if they don't exist.
- **Modifications:** To modify schema, you must update the `createTables` SQL **AND** create a migration script if preserving data is needed.

## Coding Conventions

### Backend
- **SQL Security:** ALWAYS use parameterized queries (`?`) to prevent SQL injection. Never concatenate strings for values.
- **Error Handling:** Wrap controller logic in `try/catch` blocks and return standardized JSON responses (`{ success: boolean, data: any, message: string }`).
- **Role Management:** Check `src/utils/roleHelper.js` for logic regarding user role upgrades (e.g., User -> Organizer).

### Frontend
- **Components:** Use Vue 3 Composition API (`<script setup lang="ts">`).
- **UI Components:** Prefer creating reusable components in `components/` over repeating Tailwind classes.
- **Internationalization:** Use `useI18n()` for all text content. Keys are in `i18n/locales/`.

## Key Files
- **Backend Config:** `backend/src/config/mysql.js` (DB connection & Schema definition).
- **API Routes:** `backend/src/routes/` (Define endpoints).
- **Frontend API Client:** `frontend/composables/useApiCall.ts` (Request wrapper).
- **Frontend Config:** `frontend/nuxt.config.ts`.
