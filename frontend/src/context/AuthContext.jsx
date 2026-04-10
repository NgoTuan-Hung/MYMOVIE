import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');

        if (token && role) {
            setUser({ token, role, email });
        }
        setLoading(false);
    }, []);

    const login = (token, role, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        setUser({ token, role, email });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setUser(null);
    };

    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    const isAuthenticated = () => {
        return !!user?.token;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}