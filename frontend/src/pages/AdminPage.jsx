import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-page.css';

export default function AdminPage() {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalViews: 0,
    });

    useEffect(() => {
        // Redirect if not admin
        if (!isAdmin()) {
            navigate('/login');
        }
    }, [isAdmin, navigate]);

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

    if (!isAdmin()) {
        return null;
    }

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

            {/* Stats Cards */}
            <section className="stats-section">
                <h2 className="section-title">📊 Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🎬</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalMovies}</span>
                            <span className="stat-label">Total Movies</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalUsers}</span>
                            <span className="stat-label">Registered Users</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👁️</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.totalViews.toLocaleString()}</span>
                            <span className="stat-label">Total Views</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="actions-section">
                <h2 className="section-title">⚡ Quick Actions</h2>
                <div className="actions-grid">
                    <button className="action-card" onClick={() => navigate('/movie')}>
                        <span className="action-icon">🎬</span>
                        <span className="action-label">Browse Movies</span>
                    </button>

                    <button className="action-card" onClick={() => navigate('/')}>
                        <span className="action-icon">🏠</span>
                        <span className="action-label">Go to Homepage</span>
                    </button>

                    <button className="action-card" onClick={() => alert('User management coming soon!')}>
                        <span className="action-icon">👤</span>
                        <span className="action-label">Manage Users</span>
                    </button>

                    <button className="action-card" onClick={() => alert('Settings coming soon!')}>
                        <span className="action-icon">⚙️</span>
                        <span className="action-label">Settings</span>
                    </button>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="activity-section">
                <h2 className="section-title">📋 Recent Activity</h2>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-time">Today, 10:30 AM</span>
                        <span className="activity-text">New user registered</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">Today, 9:15 AM</span>
                        <span className="activity-text">Movie "Inception" viewed 50 times</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">Yesterday</span>
                        <span className="activity-text">Server backup completed</span>
                    </div>
                </div>
            </section>
        </div>
    );
}