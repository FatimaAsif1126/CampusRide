import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    
    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/" replace />;
    }
    
    // If token exists, render the protected page
    return children;
}

export default ProtectedRoute;