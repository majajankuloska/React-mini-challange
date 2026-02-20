# User Management App — Frontend Internship Challenge

A React SaaS admin dashboard for managing users, built with:
- **React 18** + **Create React App**
- **Redux Toolkit** (async thunk · CRUD reducers · memoised selectors)
- **React Router v6** (list page `/users` · detail page `/users/:id`)
- **Tailwind CSS v3** (dark-mode `class` strategy · custom design tokens)
- **JSONPlaceholder API** — `https://jsonplaceholder.typicode.com/users`

---

## Prerequisites

> Node.js **v18+** is required.  
> Download from **https://nodejs.org** (LTS version recommended).

---

## Getting Started

```bash
# 1. Enter the project folder
cd user-management

# 2. Install all dependencies  (~1–2 min on first run)
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000** automatically.

---

## Features

| Feature | Details |
|---|---|
| **User list** | Grid of cards fetched from the API; skeleton loading state; error banner with retry |
| **Search** | Real-time filter by name, email, or company |
| **Sort** | Recently Added · Name A→Z · Name Z→A · Company |
| **Add User** | Modal form with validation (required name/email, email format) |
| **Edit User** | Same modal pre-populated; updates Redux store |
| **Delete User** | Two-click confirmation (card & detail page) |
| **User Detail** | Full profile: contact info, company details, address, activity stats |
| **Dark mode** | Toggle in sidebar & detail header; persisted to `localStorage` |
| **Pagination** | 8 cards per page; adapts to search results |

---

## Project Structure

```
src/
├── app/
│   └── store.js                  Redux configureStore
├── features/
│   └── users/
│       └── usersSlice.js         Async thunk + CRUD reducers + selectors
├── hooks/
│   └── useDarkMode.js            Dark mode toggle hook
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx          Sidebar + main content wrapper
│   │   └── Sidebar.jsx           Left nav, dark mode button, PRO plan card
│   └── ui/
│       ├── UserCard.jsx          Card with avatar, badge, hover actions
│       ├── UserFormModal.jsx     Add / Edit modal with validation
│       └── SkeletonCard.jsx      Animated loading placeholder
├── pages/
│   ├── UsersPage.jsx             Main grid page (stitch 1)
│   └── UserDetailPage.jsx        Full profile page (stitch 3)
├── App.jsx                       Router setup
└── index.js                      Entry point + dark mode init
```
