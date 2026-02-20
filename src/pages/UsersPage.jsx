import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  selectFilteredUsers,
  selectUsersStatus,
  selectUsersError,
  selectSearchQuery,
  selectSortBy,
  setSearchQuery,
  setSortBy,
} from '../features/users/usersSlice';
import UserCard from '../components/ui/UserCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import UserFormModal from '../components/ui/UserFormModal';

const PAGE_SIZE = 8;

const SORT_OPTIONS = [
  { value: 'default', label: 'Recently Added' },
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'company', label: 'Company' },
];

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectFilteredUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);
  const searchQuery = useSelector(selectSearchQuery);
  const sortBy = useSelector(selectSortBy);

  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null); // user being edited (null = closed)
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsers());
  }, [status, dispatch]);

  // Reset to page 1 when search/sort changes
  useEffect(() => { setPage(1); }, [searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paged = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isLoading = status === 'loading';
  const isFailed = status === 'failed';

  return (
    <>
      {/* ── Header ─────────────────────────────── */}
      <header className="h-20 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            User Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your workspace members and their access levels.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 h-10 bg-primary text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add User
        </button>
      </header>

      {/* ── Filters bar ────────────────────────── */}
      <div className="px-8 py-4 bg-white/50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl leading-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className="h-10 px-4 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">sort</span>
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
          </button>
          {showSortMenu && (
            <div className="absolute top-12 right-0 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 w-48">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    dispatch(setSortBy(opt.value));
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    sortBy === opt.value
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable grid ────────────────────── */}
      <div className="flex-1 overflow-y-auto p-8">
        {isFailed && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            Failed to load users: {error}
            <button
              onClick={() => dispatch(fetchUsers())}
              className="ml-auto underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
            : paged.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={(u) => setEditUser(u)}
              />
            ))}
        </div>

        {!isLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3">search_off</span>
            <p className="text-sm font-medium">No users found matching your search.</p>
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="mt-3 text-primary text-sm font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* ── Footer / Pagination ─────────────────── */}
      <footer className="h-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-8 flex items-center justify-between shrink-0">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {Math.min(paged.length, PAGE_SIZE)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {users.length}
          </span>{' '}
          users
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={
                  n === page
                    ? 'px-2 text-xs font-bold text-primary'
                    : 'px-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        )}
      </footer>

      {/* ── Modals ─────────────────────────────── */}
      {showAddModal && (
        <UserFormModal mode="add" onClose={() => setShowAddModal(false)} />
      )}
      {editUser && (
        <UserFormModal mode="edit" user={editUser} onClose={() => setEditUser(null)} />
      )}
    </>
  );
}
