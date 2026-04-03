import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkToken = async () => {
            if (!token) {
                setIsValid(false);
                setIsChecking(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    setIsValid(true);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsValid(false);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsValid(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkToken();
    }, [token]);

    if (isChecking) {
        return <div className="min-h-screen flex justify-center items-center text-white">Loading...</div>;
    }

    if (!isValid) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;