import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Not logged in, redirect to home page
        return <Navigate to="/" replace />;
    }
    
    // Logged in, show the page
    return children;
}

export default ProtectedRoute;