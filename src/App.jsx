import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: redirect "/" to "/users" */}
        <Route path="/" element={<Navigate to="/users" replace />} />

        {/* Main shell wraps the sidebar layout */}
        <Route
          path="/users"
          element={
            <AppShell>
              <UsersPage />
            </AppShell>
          }
        />

        {/* User detail — full-page layout (no sidebar) */}
        <Route path="/users/:id" element={<UserDetailPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
