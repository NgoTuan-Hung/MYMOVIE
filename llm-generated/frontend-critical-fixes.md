# Frontend Critical Fixes Plan

## Overview

This document outlines critical errors, bugs, security vulnerabilities, and bad design patterns found in the frontend codebase that need to be addressed. Each issue is categorized by severity and includes detailed code changes.

---

## Table of Contents

1. [CRITICAL: Security Vulnerabilities](#1-critical-security-vulnerabilities)
2. [CRITICAL: Authentication Flow Issues](#2-critical-authentication-flow-issues)
3. [HIGH: API Error Handling](#3-high-api-error-handling)
4. [HIGH: React Hooks Issues](#4-high-react-hooks-issues)
5. [MEDIUM: Missing Protected Route Component](#5-medium-missing-protected-route-component)
6. [MEDIUM: Image Error Handling](#6-medium-image-error-handling)
7. [MEDIUM: Hardcoded Values](#7-medium-hardcoded-values)
8. [LOW: Code Quality Improvements](#8-low-code-quality-improvements)

---

## 1. CRITICAL: Security Vulnerabilities

### 1.1 No Token Expiration Validation

**File:** `frontend/src/context/AuthContext.jsx`

**Problem:** The authentication context stores tokens in localStorage but never validates if the token is expired. This can lead to authenticated requests failing silently or security vulnerabilities where expired tokens are considered valid.

**Current Code (lines 9-18):**
```jsx
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
```

**Fix:** Add JWT token expiration checking and proper token validation.

```jsx
useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    if (token && role) {
        // Check if token is expired
        if (isTokenExpired(token)) {
            // Token expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            setUser(null);
        } else {
            setUser({ token, role, email });
        }
    }
    setLoading(false);
}, []);

// Add this helper function
function isTokenExpired(token) {
    try {
        // JWT tokens have three parts separated by dots
        const payload = token.split('.')[1];
        if (!payload) return true;
        
        const decoded = JSON.parse(atob(payload));
        // exp is in seconds, Date.now() is in milliseconds
        return decoded.exp * 1000 < Date.now();
    } catch (e) {
        // If we can't decode the token, consider it expired
        return true;
    }
}
```

---

### 1.2 Sensitive Token Storage in localStorage

**File:** `frontend/src/context/AuthContext.jsx`

**Problem:** Storing JWT tokens in localStorage makes them vulnerable to XSS attacks. Any malicious JavaScript (including compromised npm packages) can access localStorage.

**Recommended Solution:** Use HTTP-only cookies for token storage. This requires backend changes to set cookies securely.

**Alternative (without backend changes):** Add token refresh mechanism and reduce token lifetime.

**Note:** This is a medium-term architectural change that requires coordination with backend.

---

## 2. CRITICAL: Authentication Flow Issues

### 2.1 Admin Page Redirect Race Condition

**File:** `frontend/src/pages/AdminPage.jsx`

**Problem:** The admin page checks `isAdmin()` before the authentication state is fully loaded. This causes a race condition where users might be incorrectly redirected.

**Current Code (lines 18-23, 40-42):**
```jsx
useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
        navigate('/login');
    }
}, [isAdmin, navigate]);

if (!isAdmin()) {
    return null;
}
```

**Issue:** If `loading` is `true` in AuthContext, `isAdmin()` returns `false` even for valid admin users, causing premature redirect.

**Fix:**
```jsx
const { user, isAdmin, logout, loading } = useAuth();
const navigate = useNavigate();
// ... rest of state

useEffect(() => {
    // Wait for auth to finish loading before checking
    if (loading) return;
    
    // Redirect if not authenticated or not admin
    if (!user || !isAdmin()) {
        navigate('/login');
    }
}, [user, isAdmin, loading, navigate]);

// Show loading state while checking auth
if (loading) {
    return <div className="loading">Checking authorization...</div>;
}

if (!user || !isAdmin()) {
    return null;
}
```

**Also update AuthContext to expose `loading` state:**

File: `frontend/src/context/AuthContext.jsx` (line 44):
```jsx
// Already exposed - just need to use it in AdminPage
<AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAuthenticated }}>
```

---

### 2.2 No Redirect After Login for Protected Routes

**File:** `frontend/src/pages/AuthPage.jsx`

**Problem:** After login, users are always redirected to `/` or `/admin`, not to the original page they tried to access.

**Fix:** Use `location.state` to preserve the intended destination.

**Updated AuthPage.jsx:**
```jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi, register as registerApi } from '../hooks/myMovieApi';
import '../styles/auth-page.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the intended destination or default to home
    const from = location.state?.from?.pathname || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation (unchanged)
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isLogin && password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            let response;
            if (isLogin) {
                response = await loginApi(email, password);
            } else {
                response = await registerApi(email, password);
            }

            login(response.token, response.role, email);

            // Redirect to intended page or default based on role
            if (from) {
                navigate(from, { replace: true });
            } else if (response.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };
    
    // ... rest of component unchanged
```

---

## 3. HIGH: API Error Handling

### 3.1 Missing Error Handling in Multiple API Calls

**Files:** 
- `frontend/src/hooks/myMovieApi.js`
- `frontend/src/pages/MovieDetail.jsx`
- `frontend/src/pages/HomePage.jsx`

**Problem:** Many fetch calls don't handle network errors, timeouts, or invalid responses properly.

#### Fix for `myMovieApi.js`:

Add a base fetch wrapper with proper error handling:

```javascript
const BASE_URL = "http://localhost:8080";
const MOVIE_URL = `${BASE_URL}/api/movie`;

// Timeout wrapper
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

// Generic error handler
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorText = await response.text();
            if (errorText) {
                errorMessage = errorText;
            }
        } catch (e) {
            // Ignore parsing errors
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export { BASE_URL, MOVIE_URL };

export async function fetchMovies() {
    try {
        const res = await fetchWithTimeout(`${MOVIE_URL}`);
        return handleResponse(res);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

export async function fetchHotMovies(limit = 10) {
    try {
        const res = await fetchWithTimeout(`${MOVIE_URL}/hot?limit=${limit}`);
        return handleResponse(res);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

export function getPosterUrl(fileName) {
    return `${BASE_URL}/api/image/${fileName}`;
}

export function getMovieUrl() {
    return `${MOVIE_URL}`;
}

export async function fetchMoviesByFilter(filters = {}, page = 0, limit = 10) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (filters.name) params.append('name', filters.name);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    if (filters.releaseYear) params.append('releaseYear', filters.releaseYear);
    if (filters.type) params.append('type', filters.type);

    try {
        const res = await fetchWithTimeout(`${MOVIE_URL}/filter?${params.toString()}`);
        return handleResponse(res);
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

// ... rest of the functions with similar error handling
```

#### Fix for `MovieDetail.jsx`:

**Current Code (lines 11-15):**
```jsx
useEffect(() => {
    fetch(`${MOVIE_URL}/${id}`)
        .then(res => res.json())
        .then(setMovie);
}, [id]);
```

**Fix:**
```jsx
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchMovie = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${MOVIE_URL}/${id}`);
            if (!res.ok) {
                throw new Error(`Failed to fetch movie: ${res.status}`);
            }
            const data = await res.json();
            setMovie(data);
        } catch (err) {
            console.error("Error fetching movie:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    fetchMovie();
}, [id]);

if (loading) return <div className="loading">Loading movie details...</div>;
if (error) return <div className="error">Error: {error}</div>;
if (!movie) return <div className="error">Movie not found</div>;
```

---

## 4. HIGH: React Hooks Issues

### 4.1 Stale Closure in MovieWatchPage

**File:** `frontend/src/pages/MovieWatchPage.jsx`

**Problem:** The `loadFirstEpisode` function is defined inside the component but used in `useEffect`, causing stale closure issues. The function captures values from the initial render.

**Current Code (lines 62-66, 68-74):**
```jsx
useEffect(() => {
    if (selectedProvider && files.length > 0) {
        loadFirstEpisode();
    }
}, [selectedProvider]);

const loadFirstEpisode = () => {
    const file = files[0];
    const source = file.sources.find(s => s.provider === selectedProvider);
    if (source) {
        setCurrentVideoUrl(source.url);
    }
};
```

**Fix:** Move `loadFirstEpisode` inside the useEffect or use `useCallback`:

```jsx
// Option 1: Move logic into useEffect
useEffect(() => {
    if (selectedProvider && files.length > 0) {
        const file = files[0];
        const source = file.sources.find(s => s.provider === selectedProvider);
        if (source) {
            setCurrentVideoUrl(source.url);
        }
    }
}, [selectedProvider, files]);

// Option 2: Use useCallback with proper dependencies
const loadFirstEpisode = useCallback(() => {
    if (files.length > 0 && selectedProvider) {
        const file = files[0];
        const source = file.sources.find(s => s.provider === selectedProvider);
        if (source) {
            setCurrentVideoUrl(source.url);
        }
    }
}, [files, selectedProvider]);

useEffect(() => {
    loadFirstEpisode();
}, [selectedProvider, loadFirstEpisode]);
```

---

### 4.2 useEffect Dependency Warning in useMovieFilter

**File:** `frontend/src/hooks/useMovieFilter.js`

**Problem:** Using `searchParams.toString()` in useEffect dependency causes unnecessary re-renders and potential infinite loops.

**Current Code (line 49):**
```jsx
}, [searchParams.toString()]);
```

**Fix:** Use `useMemo` to stabilize the dependency:

```jsx
// Add useMemo import
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMoviesByFilter } from './myMovieApi';

export const useMovieFilter = () => {
    const [searchParams] = useSearchParams();
    
    // Memoize the serialized params
    const paramsKey = useMemo(() => {
        return JSON.stringify({
            name: searchParams.get('name') || '',
            sort: searchParams.get('sort') || '',
            category: searchParams.get('category') || '',
            country: searchParams.get('country') || '',
            releaseYear: searchParams.get('releaseYear') || '',
            type: searchParams.get('type') || ''
        });
    }, [searchParams]);

    // ... rest unchanged

    // Sync filters when URL search params change
    useEffect(() => {
        const params = JSON.parse(paramsKey);
        setFilters(prev => {
            if (
                prev.name !== params.name ||
                prev.sort !== params.sort ||
                prev.category !== params.category ||
                prev.country !== params.country ||
                prev.releaseYear !== params.releaseYear ||
                prev.type !== params.type
            ) {
                return params;
            }
            return prev;
        });
    }, [paramsKey]);
    
    // ... rest unchanged
```

---

### 4.3 DropdownMenu Timeout Cleanup Issue

**File:** `frontend/src/components/DropdownMenu.jsx`

**Problem:** The `closeTimeoutRef` is declared with `useRef` but initialized with `null` using `let` instead of properly typed.

**Current Code (line 7):**
```jsx
let closeTimeoutRef = useRef(null);
```

**Fix:** Use proper typing for useRef:

```jsx
import { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";

export default function DropdownMenu({ triggerLabel, items, onItemClick, ariaLabel }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const closeTimeoutRef = useRef<number | null>(null);

    // ... rest unchanged
```

For JavaScript (no TypeScript):
```jsx
const closeTimeoutRef = useRef(null);
```

---

## 5. MEDIUM: Missing Protected Route Component

### 5.1 Create ProtectedRoute Component

**Problem:** There's no reusable protected route component. Admin protection is done manually in AdminPage.jsx, and other routes might need protection in the future.

**New File:** `frontend/src/components/ProtectedRoute.jsx`

```jsx
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
```

**Update `App.jsx` to use ProtectedRoute:**

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import MovieDetail from "./pages/MovieDetail";
import MovieFilterPage from "./components/filter/MovieFilterPage";
import MovieWatchPage from "./pages/MovieWatchPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                    <NavigationBar />
                    <main style={{ flex: 1, padding: "20px" }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<AuthPage />} />
                            <Route 
                                path="/admin" 
                                element={
                                    <ProtectedRoute requiredRoles={['ADMIN']}>
                                        <AdminPage />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route path="/movie" element={<MovieFilterPage />} />
                            <Route path="/movie/:id" element={<MovieDetail />} />
                            <Route path="/movie/:id/watch" element={<MovieWatchPage />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

**Simplified AdminPage.jsx (remove manual auth check):**

```jsx
import { useAuth } from '../context/AuthContext';
import '../styles/admin-page.css';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminMovieList from '../components/admin/AdminMovieList';
import { useState } from 'react';
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
            {/* ... rest unchanged */}
        </div>
    );
}
```

---

## 6. MEDIUM: Image Error Handling

### 6.1 Missing Image Fallback in MovieCard

**File:** `frontend/src/components/filter/MovieCard.jsx`

**Problem:** Images that fail to load show a broken image icon instead of a proper fallback.

**Current Code (lines 8-20):**
```jsx
{movie.posterUrl ? (
    <img
        src={getPosterUrl(movie.posterUrl)}
        alt={movie.displayName}
        className="movie-poster"
        loading="lazy"
    />
) : (
    <div className="movie-poster-placeholder">
        <span>🎬</span>
    </div>
)}
```

**Fix:** Add `onError` handler for image loading failures:

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { getPosterUrl } from "../../hooks/myMovieApi";
import "../../styles/movie-card.css";

export default function MovieCard({ movie }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = (e) => {
        setImageError(true);
    };

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-poster-container">
                {movie.posterUrl && !imageError ? (
                    <img
                        src={getPosterUrl(movie.posterUrl)}
                        alt={movie.displayName}
                        className="movie-poster"
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="movie-poster-placeholder">
                        <span>🎬</span>
                    </div>
                )}
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.displayName}</h3>
                <div className="movie-meta">
                    <span className="meta-item">
                        {movie.releaseYear || "N/A"}
                    </span>
                    {movie.duration && (
                        <span className="meta-item">
                            {movie.duration} min
                        </span>
                    )}
                    {movie.episodeCount > 1 && (
                        <span className="meta-item">
                            {movie.episodeCount} episodes
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
```

---

### 6.2 Missing Image Error Handling in MovieDetail

**File:** `frontend/src/pages/MovieDetail.jsx`

**Problem:** Same issue - no fallback for broken images.

**Current Code (lines 26-37):**
```jsx
<img
    src={getPosterUrl(movie.posterUrl)}
    alt={movie.displayName}
    style={{
        width: "300px",
        height: "450px",
        objectFit: "cover",
        borderRadius: "8px"
    }}
/>
```

**Fix:** Add error handling:

```jsx
const [posterError, setPosterError] = useState(false);

// In JSX:
{movie.posterUrl && !posterError ? (
    <img
        src={getPosterUrl(movie.posterUrl)}
        alt={movie.displayName}
        style={{
            width: "300px",
            height: "450px",
            objectFit: "cover",
            borderRadius: "8px"
        }}
        onError={() => setPosterError(true)}
    />
) : (
    <div style={{
        width: "300px",
        height: "450px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2c3e50",
        borderRadius: "8px"
    }}>
        <span style={{ fontSize: "4rem" }}>🎬</span>
    </div>
)}
```

---

## 7. MEDIUM: Hardcoded Values

### 7.1 Hardcoded API URL

**Files:**
- `frontend/src/hooks/myMovieApi.js` (line 1)
- `frontend/src/hooks/adminApi.js` (uses BASE_URL from myMovieApi)

**Problem:** API URL is hardcoded to `http://localhost:8080`, making it difficult to switch between development/production environments.

**Fix:** Use environment variables:

```javascript
// In myMovieApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const MOVIE_URL = `${BASE_URL}/api/movie`;

export { BASE_URL, MOVIE_URL };
```

**Create/Update `frontend/.env.development`:**
```
VITE_API_URL=http://localhost:8080
```

**Create/Update `frontend/.env.production`:**
```
VITE_API_URL=https://api.yourdomain.com
```

**Add to `.gitignore`:**
```
.env.local
```

---

### 7.2 Hardcoded Thumbnails in VideoPlayer

**File:** `frontend/src/components/player/VideoPlayer.jsx`

**Problem:** Hardcoded external URL for thumbnails (line 64).

**Current Code:**
```jsx
<DefaultVideoLayout
    thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
    icons={defaultLayoutIcons}
/>
```

**Fix:** Either remove thumbnails or make it configurable:

```jsx
export default function VideoPlayer({
    src,
    poster = null,
    title = "",
    textTracks = [],
    thumbnails = null, // Add prop
}) {
    // ... existing code

    return (
        <MediaPlayer
            // ... existing props
        >
            <MediaProvider>
                <Poster className="vds-poster" />
                {textTracks.map(track => (
                    <Track {...track} key={track.src} />
                ))}
            </MediaProvider>
            <DefaultVideoLayout
                thumbnails={thumbnails}
                icons={defaultLayoutIcons}
            />
        </MediaPlayer>
    );
}
```

---

### 7.3 Mock Data in AdminDashboard

**File:** `frontend/src/components/admin/AdminDashboard.jsx`

**Problem:** Static mock data for "Recent Activity" that doesn't come from backend.

**Current Code (lines 66-80):**
```jsx
{/* Recent Activity */}
<section className="activity-section">
    <h2 className="section-title">📋 Recent Activity</h2>
    <div className="activity-list">
        <div className="activity-item">
            <span className="activity-time">Today, 10:30 AM</span>
            <span className="activity-text">New user registered</span>
        </div>
        {/* ... more mock items */}
    </div>
</section>
```

**Fix:** Either remove the section or add a TODO/prop for real data:

```jsx
{/* Recent Activity - TODO: Connect to backend API */}
{false && ( // Disable until backend ready
    <section className="activity-section">
        <h2 className="section-title">📋 Recent Activity</h2>
        <div className="activity-list">
            {/* Activity items will be fetched from backend */}
            <div className="activity-item">
                <span className="activity-time">No recent activity</span>
            </div>
        </div>
    </section>
)}
```

Or better, make it data-driven:

```jsx
export default function AdminDashboard({ stats, recentActivity = [] }) {
    // ... existing code

    return (
        <>
            {/* Stats Cards - unchanged */}
            
            {/* Quick Actions - unchanged */}
            
            {/* Recent Activity */}
            <section className="activity-section">
                <h2 className="section-title">📋 Recent Activity</h2>
                <div className="activity-list">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <span className="activity-time">{activity.time}</span>
                                <span className="activity-text">{activity.text}</span>
                            </div>
                        ))
                    ) : (
                        <div className="activity-item">
                            <span className="activity-text">No recent activity to display</span>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
```

---

### 7.4 Static Filter Options

**File:** `frontend/src/hooks/myMovieApi.js`

**Problem:** Filter options (categories, countries, years) are hardcoded and won't reflect actual data from the database.

**Current Code (lines 48-60):**
```javascript
export const FILTER_OPTIONS = {
    sort: [
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'viewCount', label: 'Most Popular' }
    ],
    categories: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'],
    countries: ['US', 'UK', 'Japan', 'South Korea', 'France', 'Germany', 'Canada'],
    releaseYears: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'],
    types: [
        { value: 'movie', label: 'Movies' },
        { value: 'series', label: 'TV Shows' }
    ]
};
```

**Recommendation:** Create an API endpoint to fetch dynamic filter options. For now, add a comment:

```javascript
// TODO: These should be fetched from the backend to reflect actual database values
// Consider creating an endpoint: GET /api/movie/filter-options
export const FILTER_OPTIONS = {
    // ... existing values
};
```

---

## 8. LOW: Code Quality Improvements

### 8.1 Inline Styles in MovieDetail

**File:** `frontend/src/pages/MovieDetail.jsx`

**Problem:** Using inline styles instead of CSS classes makes maintenance difficult and prevents theme consistency.

**Current Code:** Multiple inline styles throughout the component.

**Fix:** Move to CSS classes in a dedicated stylesheet:

**Create `frontend/src/styles/movie-detail.css`:**
```css
.movie-detail-container {
    padding: 40px;
}

.movie-detail-top {
    display: flex;
    gap: 30px;
}

.movie-poster-wrapper {
    flex-shrink: 0;
}

.movie-poster {
    width: 300px;
    height: 450px;
    object-fit: cover;
    border-radius: 8px;
}

.movie-info {
    flex: 1;
}

.movie-title {
    font-size: 2rem;
    margin-bottom: 20px;
}

.movie-meta-item {
    margin-bottom: 8px;
}

.movie-meta-label {
    font-weight: bold;
    color: var(--text-secondary);
}

.watch-button-wrapper {
    margin-top: 30px;
}

.watch-button {
    padding: 12px 32px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.2s ease;
}

.watch-button:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
}

.movie-description {
    margin-top: 40px;
}

.movie-description h2 {
    margin-bottom: 16px;
}

/* Responsive */
@media (max-width: 768px) {
    .movie-detail-top {
        flex-direction: column;
        align-items: center;
    }
    
    .movie-info {
        text-align: center;
    }
}
```

**Updated MovieDetail.jsx:**
```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosterUrl, MOVIE_URL } from "../hooks/myMovieApi";
import { useNavigate } from "react-router-dom";
import "../styles/movie-detail.css";

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posterError, setPosterError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${MOVIE_URL}/${id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch movie: ${res.status}`);
                }
                const data = await res.json();
                setMovie(data);
            } catch (err) {
                console.error("Error fetching movie:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMovie();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!movie) return <div className="error">Movie not found</div>;

    return (
        <div className="movie-detail-container">
            <div className="movie-detail-top">
                <div className="movie-poster-wrapper">
                    {movie.posterUrl && !posterError ? (
                        <img
                            src={getPosterUrl(movie.posterUrl)}
                            alt={movie.displayName}
                            className="movie-poster"
                            onError={() => setPosterError(true)}
                        />
                    ) : (
                        <div className="movie-poster-placeholder-large">
                            <span>🎬</span>
                        </div>
                    )}
                </div>

                <div className="movie-info">
                    <h1 className="movie-title">{movie.displayName}</h1>

                    <p className="movie-meta-item">
                        <strong>Year:</strong> {movie.releaseYear || 'N/A'}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Duration:</strong> {movie.duration ? `${movie.duration} min` : 'N/A'}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Status:</strong> {movie.status}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Episodes:</strong> {movie.episodeCount || 1}
                    </p>

                    <p className="movie-meta-item">
                        <strong>Actors:</strong> {movie.actors?.join(', ') || 'N/A'}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Directors:</strong> {movie.directors?.join(', ') || 'N/A'}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Categories:</strong> {movie.categories?.join(', ') || 'N/A'}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Countries:</strong> {movie.countries?.join(', ') || 'N/A'}
                    </p>
                    <p className="movie-meta-item">
                        <strong>Languages:</strong> {movie.languages?.join(', ') || 'N/A'}
                    </p>

                    <div className="watch-button-wrapper">
                        <button
                            onClick={() => navigate(`/movie/${id}/watch`, { state: { movie } })}
                            className="watch-button"
                        >
                            ▶ WATCH NOW
                        </button>
                    </div>
                </div>
            </div>

            <div className="movie-description">
                <h2>Description</h2>
                <p>
                    This is a placeholder description. Later you can extend your backend
                    to include a "description" field in DetailMovieResponse.
                </p>
            </div>
        </div>
    );
}
```

---

### 8.2 Missing PropTypes or TypeScript

**Problem:** No type checking for props across all components. This can lead to runtime errors when wrong props are passed.

**Recommendation:** Either add PropTypes or migrate to TypeScript.

**Example with PropTypes for MovieCard:**

```jsx
import PropTypes from 'prop-types';

// ... component code

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        displayName: PropTypes.string.isRequired,
        posterUrl: PropTypes.string,
        releaseYear: PropTypes.number,
        duration: PropTypes.number,
        episodeCount: PropTypes.number,
    }).isRequired,
};
```

**For TypeScript migration:** Create a `types.ts` file:

```typescript
// frontend/src/types/movie.ts

export interface Movie {
    id: number | string;
    originalName: string;
    displayName: string;
    posterUrl?: string;
    releaseYear?: number;
    duration?: number;
    status: 'RELEASED' | 'ON_GOING' | 'FINISH';
    episodeCount: number;
    weeklyViews?: number;
    actors?: string[];
    directors?: string[];
    categories?: string[];
    countries?: string[];
    languages?: string[];
}

export interface MovieFile {
    episode?: number;
    title?: string;
    sources: VideoSource[];
}

export interface VideoSource {
    provider: string;
    url: string;
    quality?: string;
}

export interface User {
    token: string;
    role: 'ADMIN' | 'USER';
    email: string;
}

export interface FilterParams {
    name?: string;
    sort?: string;
    category?: string;
    country?: string;
    releaseYear?: string;
    type?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}
```

---

### 8.3 Missing Accessibility Attributes

**Files:** Multiple components

**Problem:** Some interactive elements lack proper accessibility attributes.

**Fixes:**

**SearchBar.jsx:** Add aria-label and type to button:
```jsx
<button type="submit" className="search-button" aria-label="Submit search">
    Search
</button>
```

**MovieCard.jsx:** Already has alt attribute (good), but add aria-label:
```jsx
<Link to={`/movie/${movie.id}`} className="movie-card" aria-label={`View details for ${movie.displayName}`}>
```

**AdminMovieList.jsx:** Add confirmation dialog improvements:
```jsx
async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) return;
    // ... rest
}
```

---

### 8.4 Missing Error Boundaries

**Problem:** No error boundaries to catch rendering errors. If a component crashes, the whole app crashes.

**Create `frontend/src/components/ErrorBoundary.jsx`:**

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Something went wrong</h2>
                    <p>We're sorry, but something unexpected happened.</p>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

**Add to App.jsx:**

```jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ErrorBoundary>
                    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                        {/* ... existing content */}
                    </div>
                </ErrorBoundary>
            </BrowserRouter>
        </AuthProvider>
    );
}
```

---

## Summary of Priority Changes

| Priority | Issue | File(s) | Impact |
|----------|-------|---------|--------|
| 🔴 Critical | Token expiration check | AuthContext.jsx | Security |
| 🔴 Critical | Admin auth race condition | AdminPage.jsx | Auth flow |
| 🟠 High | Missing error handling | myMovieApi.js, MovieDetail.jsx | Reliability |
| 🟠 High | Stale closure in MovieWatchPage | MovieWatchPage.jsx | Bug |
| 🟡 Medium | Protected route component | New file + App.jsx | Architecture |
| 🟡 Medium | Image error handling | MovieCard.jsx, MovieDetail.jsx | UX |
| 🟡 Medium | Hardcoded API URL | myMovieApi.js, adminApi.js | Deploy |
| 🔵 Low | Inline styles refactor | MovieDetail.jsx | Maintainability |
| 🔵 Low | Missing PropTypes | All components | Type safety |
| 🔵 Low | Missing error boundaries | New file + App.jsx | Reliability |

---

## Implementation Order

1. **Phase 1 - Critical Security** (Immediate)
   - Token expiration validation
   - Admin auth race condition fix

2. **Phase 2 - Core Bugs** (This sprint)
   - API error handling
   - MovieWatchPage stale closure
   - ProtectedRoute component

3. **Phase 3 - UX Improvements** (Next sprint)
   - Image error handling
   - Error boundaries
   - Redirect after login

4. **Phase 4 - Code Quality** (Ongoing)
   - Inline styles refactor
   - Add PropTypes or TypeScript
   - Environment variables setup
</task_progress>
</write_to_file>