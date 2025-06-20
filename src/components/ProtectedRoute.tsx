import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: loading=', loading, 'user=', user, 'userRole=', userRole, 'allowedRoles=', allowedRoles);

  if (loading) {
    console.log('ProtectedRoute: Still loading, showing loading message');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading...</p>
          <p className="text-sm text-muted-foreground">Please wait while we authenticate you</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('ProtectedRoute: User role not allowed, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: User authenticated and authorized, rendering children');
  return <>{children}</>;
} 