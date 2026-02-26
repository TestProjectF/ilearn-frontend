import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/admin/AdminPage';

import './index.css';

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={
            <ProtectedLayout><CoursesPage /></ProtectedLayout>
          } />
          <Route path="/courses/:id" element={
            <ProtectedLayout><CourseDetailPage /></ProtectedLayout>
          } />
          <Route path="/lessons/:id" element={
            <ProtectedLayout><LessonPage /></ProtectedLayout>
          } />
          <Route path="/profile" element={
            <ProtectedLayout><ProfilePage /></ProtectedLayout>
          } />
          <Route path="/admin" element={
            <ProtectedLayout><AdminPage /></ProtectedLayout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);