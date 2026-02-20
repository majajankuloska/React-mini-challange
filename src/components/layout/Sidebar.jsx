import React from 'react';
import { NavLink } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode';

const navItems = [
  { icon: 'grid_view', label: 'Dashboard', to: '#' },
  { icon: 'group', label: 'Users', to: '/users', exact: true },
  { icon: 'diversity_3', label: 'Teams', to: '#' },
  { icon: 'verified_user', label: 'Roles', to: '#' },
];

const systemItems = [
  { icon: 'settings', label: 'Settings', to: '#' },
];

export default function Sidebar() {
  const { isDark, toggle } = useDarkMode();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-tight">
            SaaS Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ icon, label, to, exact }) => (
          <NavLink
            key={label}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive && to !== '#'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span
              className={`text-sm ${
                label === 'Users' ? 'font-semibold' : 'font-medium'
              }`}
            >
              {label}
            </span>
          </NavLink>
        ))}

        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          System
        </div>

        {systemItems.map(({ icon, label, to }) => (
          <a
            key={label}
            href={to}
            className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
          </a>
        ))}

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </nav>


    </aside>
  );
}
