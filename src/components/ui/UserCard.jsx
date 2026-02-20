import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteUser } from '../../features/users/usersSlice';

// Cycle through distinct badge colour schemes
const BADGE_SCHEMES = [
  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
];

function getAvatarUrl(name) {
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&size=128&bold=true`;
}

export default function UserCard({ user, onEdit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOnline = user.id % 2 === 0;
  const badgeClass = BADGE_SCHEMES[user.id % BADGE_SCHEMES.length];

  function handleDelete(e) {
    e.stopPropagation();
    if (confirmDelete) {
      dispatch(deleteUser(user.id));
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  function handleEdit(e) {
    e.stopPropagation();
    onEdit(user);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/users/${user.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/users/${user.id}`)}
      className="user-card relative group p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Hover action buttons */}
      <div className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 flex gap-1 transition-opacity z-10">
        <button
          aria-label="Edit user"
          onClick={handleEdit}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <button
          aria-label={confirmDelete ? 'Click again to confirm delete' : 'Delete user'}
          onClick={handleDelete}
          title={confirmDelete ? 'Click again to confirm' : 'Delete'}
          className={`p-1.5 rounded-lg transition-colors ${
            confirmDelete
              ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
              : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {confirmDelete ? 'warning' : 'delete'}
          </span>
        </button>
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <img
            src={getAvatarUrl(user.name)}
            alt={`Avatar for ${user.name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-700"
            loading="lazy"
          />
          {/* Online indicator */}
          <div
            className={`absolute bottom-0 right-0 h-4 w-4 border-2 border-white dark:border-slate-800 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-500'
            }`}
          />
        </div>

        {/* Name */}
        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base leading-snug mb-0.5">
          {user.name}
        </h3>

        {/* Email */}
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 truncate w-full px-1">
          {user.email}
        </p>

        {/* Company badge */}
        <span
          className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase tracking-wider ${badgeClass}`}
        >
          {user.company?.name ?? '—'}
        </span>
      </div>
    </div>
  );
}
