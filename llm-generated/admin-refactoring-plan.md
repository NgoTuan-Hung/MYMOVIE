# Admin Page Refactoring Plan

## Issues Identified

1. **Tab styling**: Selected tab indication is not clear, selected text is too dark, doesn't match overall theme
2. **Dashboard**: Should be extracted into a separate component
3. **Movie Management**: Should be renamed to something related to admin (e.g., "AdminMovieList" or with admin-themed styling)
4. **Theme mismatch**: Admin page is very white, contrasts with overall dark theme
5. **Hard-coded image URL**: In `MovieList.jsx` line 121, image URL is hardcoded to `http://localhost:8080`
6. **Pagination**: Should be reusable - currently inline in `MovieList.jsx` (lines 170-188) and duplicates the separate `Pagination.jsx` component

---

## Implementation Plan

### 1. Create Dashboard Component
- Create `frontend/src/components/admin/AdminDashboard.jsx`
- Move dashboard content (stats, quick actions, recent activity) from `AdminPage.jsx`
- Add proper theming to match dark theme

### 2. Create AdminPagination Component  
- Create `frontend/src/components/admin/AdminPagination.jsx`
- Wrap existing `Pagination.jsx` with admin-styled container
- Include the pagination info text and controls

### 3. Rename MovieList to AdminMovieList
- Rename `frontend/src/components/admin/MovieList.jsx` → `AdminMovieList.jsx`
- Update internal class names to use admin-prefixed names

### 4. Fix Image URL
- Use a constant or env variable for API base URL
- Or use a relative path with configured API endpoint

### 5. Fix Admin Page CSS
- Update tab styling with clearer indication using theme colors
- Darken background for admin sections to match overall theme
- Update stat cards, action cards to use dark theme

---

## Code Changes

### File: `frontend/src/components/admin/AdminDashboard.jsx` (NEW)

```jsx
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ stats }) {
    const navigate = useNavigate();

    return (
        <>
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
        </>
    );
}
```

### File: `frontend/src/components/admin/AdminPagination.jsx` (NEW)

```jsx
import Pagination from '../filter/Pagination';
import '../../styles/movie-list.css';

export default function AdminPagination({ page, totalPages, totalElements, onPageChange }) {
    const size = 10;
    
    return (
        <div className="admin-pagination">
            <span className="pagination-info">
                Showing {page * size + 1} - {Math.min((page + 1) * size, totalElements)} of {totalElements}
            </span>
            <div className="pagination-controls-wrapper">
                <Pagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={onPageChange} 
                />
            </div>
        </div>
    );
}
```

### File: Rename `MovieList.jsx` → `AdminMovieList.jsx`

Changes needed in the file:
1. Rename component function to `AdminMovieList`
2. Import `AdminPagination` instead of inline pagination
3. Fix image URL - use constant

```jsx
import { useState, useEffect } from 'react';
import { fetchAdminMovies, deleteMovie } from '../../hooks/adminApi';
import MovieModal from './MovieModal';
import AdminPagination from './AdminPagination';
import '../../styles/movie-list.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function AdminMovieList() {
    // ... existing state ...
    
    // In the render, replace inline pagination with:
    <AdminPagination 
        page={page} 
        totalPages={totalPages} 
        totalElements={totalElements}
        onPageChange={handlePageChange}
    />
    
    // Fix image URL at line ~121:
    <img
        src={`${API_BASE_URL}/api/image/${movie.posterUrl}`}
        alt={movie.displayName}
        className="movie-poster"
    />
}
```

### File: `frontend/src/pages/AdminPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-page.css';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminMovieList from '../components/admin/AdminMovieList';

export default function AdminPage() {
    // ... existing code ...
    
    // Replace the tab content section:
    {activeTab === 'dashboard' ? (
        <AdminDashboard stats={stats} />
    ) : (
        <AdminMovieList />
    )}
}
```

### File: `frontend/src/styles/admin-page.css`

Update tab styles for better indication:

```css
.admin-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    border-radius: 8px 8px 0 0;
    overflow: hidden;
}

.admin-tabs .tab {
    padding: 14px 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: all 0.2s ease;
    position: relative;
}

.admin-tabs .tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    transition: all 0.2s ease;
}

.admin-tabs .tab:hover {
    color: var(--text-secondary);
    background: var(--bg-input);
}

.admin-tabs .tab.active {
    color: var(--accent);
    background: var(--bg-card);
}

.admin-tabs .tab.active::after {
    background: var(--accent);
}
```

Add admin-specific dark theme sections:

```css
/* Admin section backgrounds to match dark theme */
.admin-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
}

.admin-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

.admin-pagination .pagination-info {
    color: var(--text-muted);
    font-size: 14px;
}

.pagination-controls-wrapper .pagination {
    padding: 0;
}
```

---

## Summary of Changes

| Task | Action |
|------|--------|
| Extract Dashboard | Create `AdminDashboard.jsx` component |
| Create AdminPagination | Create `AdminPagination.jsx` using existing `Pagination.jsx` |
| Rename MovieList | Rename to `AdminMovieList.jsx` |
| Fix image URL | Use environment variable for API base URL |
| Fix tab styling | Update CSS with proper accent color indication and dark theme |
| Theme consistency | Add dark background to admin sections |