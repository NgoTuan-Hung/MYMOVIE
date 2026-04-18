import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Guards routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string[]} props.requiredRoles - Optional array of required roles (e.g., ['ADMIN'])
 * @param {string} props.redirectTo - Where to redirect if unauthorized (default: '/login')
 */
export default function ProtectedRoute({
    children,
    requiredRoles = [],
    redirectTo = '/login'
}) {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated()) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role requirements
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(user?.role);
        if (!hasRequiredRole) {
            // User is authenticated but doesn't have required role
            return <Navigate to="/" replace />;
        }
    }

    return children;
}