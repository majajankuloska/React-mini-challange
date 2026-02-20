import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserById, deleteUser } from '../features/users/usersSlice';
import UserFormModal from '../components/ui/UserFormModal';
import useDarkMode from '../hooks/useDarkMode';

// Generate initials from a full name
function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function DetailRow({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="text-slate-900 dark:text-slate-100 font-medium">{children}</div>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggle } = useDarkMode();

  const user = useSelector(selectUserById(id));
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
        <span className="material-symbols-outlined text-5xl mb-3">person_search</span>
        <p className="text-lg font-semibold mb-1">User not found</p>
        <p className="text-sm mb-4">This user may have been deleted.</p>
        <button
          onClick={() => navigate('/users')}
          className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          Back to Users
        </button>
      </div>
    );
  }

  function handleDelete() {
    if (confirmDelete) {
      dispatch(deleteUser(user.id));
      navigate('/users');
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased flex flex-col">

      {/* ── Top Nav ──────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101922]/80 backdrop-blur-md px-6 py-4 md:px-10">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">manage_accounts</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">SaaS Admin</h2>
        </div>

        <div className="flex flex-1 justify-end gap-6 items-center">
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => {}} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">
              Dashboard
            </button>
            <span
              role="button"
              tabIndex={0}
              onClick={() => navigate('/users')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/users')}
              className="text-primary text-sm font-medium cursor-pointer"
            >
              Users
            </span>
            <button onClick={() => {}} className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">
              Settings
            </button>
          </nav>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />

          <div className="flex items-center gap-3 pl-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center size-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="material-symbols-outlined">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button className="flex items-center justify-center size-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            {/* Admin avatar */}
            <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-slate-800 shadow-sm">
              A
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-10 py-8 md:py-12">

        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg mr-1 group-hover:-translate-x-1 transition-transform">
              chevron_left
            </span>
            Back to Users List
          </button>
        </div>

        {/* Profile header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            {/* Initials avatar */}
            <div className="size-20 md:size-24 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-lg flex items-center justify-center text-white text-3xl md:text-4xl font-bold ring-4 ring-white dark:ring-slate-800">
              {getInitials(user.name)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                  Active
                </span>
                <span className="text-sm">•</span>
                <span className="text-sm">User ID: #{String(user.id).padStart(6, '0')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold shadow-sm transition-colors ${
                confirmDelete
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {confirmDelete ? 'warning' : 'delete'}
              </span>
              <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Detail cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Information */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">contact_mail</span>
                  Contact Information
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <DetailRow label="Email Address">
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {user.email}
                  </a>
                </DetailRow>
                <DetailRow label="Phone Number">
                  <a
                    href={`tel:${user.phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {user.phone}
                  </a>
                </DetailRow>
                <DetailRow label="Website">
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    {user.website}
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </DetailRow>
                <DetailRow label="Username">
                  <span>{user.username}</span>
                </DetailRow>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">work</span>
                  Professional Details
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    <span className="material-symbols-outlined text-2xl">apartment</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {user.company?.name}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {user.company?.catchPhrase}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Business Strategy
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium">
                      {user.company?.bs}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Catchphrase
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium italic">
                      "{user.company?.catchPhrase}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column (1/3) ── */}
          <div className="space-y-6">

            {/* Address */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden h-fit">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  Address
                </h3>
              </div>
              {/* Map placeholder */}
              <div className="w-full h-40 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-600 dark:to-slate-700" />
                {/* Grid lines to look map-like */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(0deg, #94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">my_location</span>
                    Lat: {user.address?.geo?.lat}, Lng: {user.address?.geo?.lng}
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-400 mt-0.5 text-xl">home</span>
                  <div>
                    <p className="text-slate-900 dark:text-slate-100 font-medium leading-snug">
                      {user.address?.street}, {user.address?.suite}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {user.address?.city}, {user.address?.zipcode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Snapshot */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  Activity Snapshot
                </h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { value: 24, label: 'Active Tasks' },
                  { value: 12, label: 'Projects' },
                  { value: 5, label: 'Teams Managed', wide: true },
                ].map(({ value, label, wide }) => (
                  <div
                    key={label}
                    className={`bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg text-center border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors cursor-default group${wide ? ' col-span-2' : ''}`}
                  >
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit modal */}
      {showEdit && (
        <UserFormModal mode="edit" user={user} onClose={() => setShowEdit(false)} />
      )}
    </div>
  );
}
