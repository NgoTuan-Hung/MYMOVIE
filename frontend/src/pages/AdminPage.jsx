import { useAuth } from '../context/AuthContext';
import '../styles/admin-page.css';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminMovieList from '../components/admin/AdminMovieList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalViews: 0,
    });
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Mock stats - in real implementation, fetch from backend
    useEffect(() => {
        // TODO: Implement actual stats API
        setStats({
            totalMovies: 150,
            totalUsers: 42,
            totalViews: 12580,
        });
    }, []);

    // No need to check isAdmin here - ProtectedRoute handles it

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-title-section">
                    <h1 className="admin-title">🛡️ Admin Dashboard</h1>
                    <p className="admin-subtitle">Welcome, {user?.email}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="admin-tabs">
                <button
                    className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Dashboard
                </button>
                <button
                    className={`tab ${activeTab === 'movies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('movies')}
                >
                    Movie Management
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' ? (
                <AdminDashboard stats={stats} />
            ) : (
                <AdminMovieList />
            )}
        </div>
    );
}