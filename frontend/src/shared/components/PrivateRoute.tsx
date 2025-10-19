import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactElement;
  requiredRoles?: string[];
}

/**
 * PrivateRoute component
 * Protects routes by requiring authentication
 * Optionally checks for specific roles
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements if specified
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return (
        <div className="unauthorized-container">
          <div className="unauthorized-message">
            <i className="fas fa-lock"></i>
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <p>Required role: {requiredRoles.join(', ')}</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default PrivateRoute;
