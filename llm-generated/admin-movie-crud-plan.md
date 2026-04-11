# Admin Movie CRUD - Frontend Implementation Plan

## 1. Overview

This document outlines the implementation plan for the admin movie CRUD page. The existing AdminPage.jsx will be enhanced to include a dedicated movie management tab/section with full CRUD functionality.

## 2. Backend API Reference

### Endpoints (from AdminController.java)

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/admin/movies?page=0&size=20&sort=id` | Paginated movie list |
| GET | `/api/admin/movies/{id}` | Get single movie |
| POST | `/api/admin/movies` | Create new movie |
| PUT | `/api/admin/movies/{id}` | Update existing movie |
| DELETE | `/api/admin/movies/{id}` | Delete movie |

### Authentication
- All `/api/admin/**` endpoints require `ROLE_ADMIN`
- Include JWT token in Authorization header: `Bearer {token}`

### Data Models

**AdminMovieResponse (GET response):**
```javascript
{
  id: Long,
  originalName: String,
  displayName: String,
  releaseYear: Integer,
  duration: Integer,
  status: "ON_GOING" | "FINISH" | "RELEASED",
  episodeCount: Integer,
  posterUrl: String,
  weeklyViews: Integer,
  actors: String[],         // list of actor names
  directors: String[],      // list of director names
  categories: String[],    // list of category names
  countries: String[],     // list of country names
  languages: String[]      // list of language names
}
```

**CreateMovieRequest (POST body):**
```javascript
{
  originalName: String (required),
  displayName: String (required),
  releaseYear: Integer,
  duration: Integer,
  status: "ON_GOING" | "FINISH" | "RELEASED" (required),
  episodeCount: Integer (default: 1),
  countryIds: Integer[],
  categoryIds: Integer[],
  actorIds: Long[],
  directorIds: Long[],
  languageIds: Integer[],
  posterPath: String
}
```

**UpdateMovieRequest (PUT body):** Same as CreateMovieRequest but all fields optional.

## 3. Implementation Plan

### 3.1 File Structure

```
frontend/src/
├── components/
│   └── admin/
│       ├── MovieList.jsx        # Movie table with pagination
│       ├── MovieModal.jsx       # Modal for add/edit movie
│       └── MovieActions.jsx      # Action buttons per row
├── hooks/
│   └── adminApi.js              # New API hooks for admin
└── pages/
    └── AdminPage.jsx            # Modified to include movie management
```

### 3.2 New API Hooks (frontend/src/hooks/adminApi.js)

```javascript
import { BASE_URL } from './myMovieApi';

const ADMIN_API = `${BASE_URL}/api/admin`;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Fetch paginated movies
export async function fetchAdminMovies(page = 0, size = 20, sort = 'id') {
  const res = await fetch(`${ADMIN_API}/movies?page=${page}&size=${size}&sort=${sort}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

// Get single movie
export async function getMovieById(id) {
  const res = await fetch(`${ADMIN_API}/movies/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch movie');
  return res.json();
}

// Create movie
export async function createMovie(data) {
  const res = await fetch(`${ADMIN_API}/movies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create movie');
  return res.json();
}

// Update movie
export async function updateMovie(id, data) {
  const res = await fetch(`${ADMIN_API}/movies/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update movie');
  return res.json();
}

// Delete movie
export async function deleteMovie(id) {
  const res = await fetch(`${ADMIN_API}/movies/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete movie');
}
```

### 3.3 MovieList Component (frontend/src/components/admin/MovieList.jsx)

```javascript
import { useState, useEffect } from 'react';
import { fetchAdminMovies, deleteMovie } from '../../hooks/adminApi';
import MovieModal from './MovieModal';
import './MovieList.css';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  
  // Fetch movies
  useEffect(() => {
    loadMovies();
  }, [page]);
  
  async function loadMovies() {
    try {
      setLoading(true);
      const data = await fetchAdminMovies(page, size);
      setMovies(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // Add new movie
  function handleAdd() {
    setEditingMovie(null);
    setShowModal(true);
  }
  
  // Edit existing movie
  function handleEdit(movie) {
    setEditingMovie(movie);
    setShowModal(true);
  }
  
  // Delete movie
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      await deleteMovie(id);
      loadMovies(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  }
  
  // File placeholder (placeholder for future implementation)
  function handleFileClick(movie) {
    alert(`File management for "${movie.displayName}" - coming soon!`);
  }
  
  // Save success callback
  function handleSaveSuccess() {
    setShowModal(false);
    loadMovies();
  }
  
  // Pagination
  function handlePageChange(newPage) {
    setPage(newPage);
  }
  
  return (
    <div className="movie-list-container">
      {/* Header with Add Button */}
      <div className="movie-list-header">
        <h2>Movie Management</h2>
        <button className="add-movie-btn" onClick={handleAdd}>
          + Add Movie
        </button>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Movie Table */}
      <div className="movie-table-wrapper">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : movies.length === 0 ? (
          <div className="no-movies">No movies found</div>
        ) : (
          <table className="movie-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Title</th>
                <th>Year</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Episodes</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    {movie.posterUrl ? (
                      <img 
                        src={`http://localhost:8080/api/image/${movie.posterUrl}`} 
                        alt={movie.displayName}
                        className="movie-poster"
                      />
                    ) : (
                      <div className="no-poster">No Image</div>
                    )}
                  </td>
                  <td>
                    <div className="movie-title">{movie.displayName}</div>
                    <div className="movie-original">{movie.originalName}</div>
                  </td>
                  <td>{movie.releaseYear || '-'}</td>
                  <td>{movie.duration ? `${movie.duration} min` : '-'}</td>
                  <td>
                    <span className={`status-badge status-${movie.status.toLowerCase()}`}>
                      {movie.status}
                    </span>
                  </td>
                  <td>{movie.episodeCount || 1}</td>
                  <td>{movie.weeklyViews || 0}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn update-btn"
                      onClick={() => handleEdit(movie)}
                    >
                      Update
                    </button>
                    <button 
                      className="action-btn file-btn"
                      onClick={() => handleFileClick(movie)}
                    >
                      File
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(movie.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <span className="pagination-info">
          Showing {page * size + 1} - {Math.min((page + 1) * size, totalElements)} of {totalElements}
        </span>
        <div className="pagination-controls">
          <button 
            disabled={page === 0} 
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
          <span className="page-number">Page {page + 1} of {totalPages}</span>
          <button 
            disabled={page >= totalPages - 1} 
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Movie Modal */}
      {showModal && (
        <MovieModal 
          movie={editingMovie}
          onClose={() => setShowModal(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
```

### 3.4 MovieModal Component (frontend/src/components/admin/MovieModal.jsx)

```javascript
import { useState, useEffect } from 'react';
import { createMovie, updateMovie, getMovieById } from '../../hooks/adminApi';
import './MovieModal.css';

export default function MovieModal({ movie, onClose, onSaveSuccess }) {
  const isEdit = !!movie;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    originalName: '',
    displayName: '',
    releaseYear: '',
    duration: '',
    status: 'RELEASED',
    episodeCount: 1,
    posterPath: '',
  });
  
  // Load movie data for edit mode
  useEffect(() => {
    if (movie) {
      loadMovieData();
    }
  }, [movie]);
  
  async function loadMovieData() {
    try {
      const data = await getMovieById(movie.id);
      setFormData({
        originalName: data.originalName || '',
        displayName: data.displayName || '',
        releaseYear: data.releaseYear || '',
        duration: data.duration || '',
        status: data.status || 'RELEASED',
        episodeCount: data.episodeCount || 1,
        posterPath: data.posterUrl || '',
      });
    } catch (err) {
      setError(err.message);
    }
  }
  
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'episodeCount' || name === 'releaseYear' || name === 'duration'
        ? (value ? parseInt(value) : '')
        : value
    }));
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        releaseYear: formData.releaseYear || null,
        duration: formData.duration || null,
        episodeCount: formData.episodeCount || 1,
      };
      
      if (isEdit) {
        await updateMovie(movie.id, payload);
      } else {
        await createMovie(payload);
      }
      
      onSaveSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Movie' : 'Add New Movie'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="movie-form">
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originalName">Original Name *</label>
              <input
                type="text"
                id="originalName"
                name="originalName"
                value={formData.originalName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="displayName">Display Name *</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                min="1900"
                max="2100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="RELEASED">Released</option>
                <option value="ON_GOING">On Going</option>
                <option value="FINISH">Finish</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="episodeCount">Episode Count</label>
              <input
                type="number"
                id="episodeCount"
                name="episodeCount"
                value={formData.episodeCount}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="posterPath">Poster Path</label>
            <input
              type="text"
              id="posterPath"
              name="posterPath"
              value={formData.posterPath}
              onChange={handleChange}
              placeholder="e.g., posters/movie-title.jpg"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Movie' : 'Add Movie')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 3.5 CSS Styles (add to existing or create new CSS file)

```css
/* MovieList.css */
.movie-list-container {
  padding: 20px;
}

.movie-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.movie-list-header h2 {
  margin: 0;
  color: #333;
}

.add-movie-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-movie-btn:hover {
  background: #218838;
}

.movie-table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.movie-table {
  width: 100%;
  border-collapse: collapse;
}

.movie-table th,
.movie-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.movie-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.movie-poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.no-poster {
  width: 60px;
  height: 90px;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6c757d;
  border-radius: 4px;
}

.movie-title {
  font-weight: 500;
  color: #333;
}

.movie-original {
  font-size: 12px;
  color: #6c757d;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-released {
  background: #d4edda;
  color: #155724;
}

.status-on_going {
  background: #fff3cd;
  color: #856404;
}

.status-finish {
  background: #d1ecf1;
  color: #0c5460;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.update-btn {
  background: #007bff;
  color: white;
}

.file-btn {
  background: #6c757d;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.pagination-info {
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-controls button {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  color: #333;
  font-weight: 500;
}

/* MovieModal.css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
}

.movie-form {
  padding: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
}

.form-error {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 20px;
  border: none;
  background: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.5;
}

.loading, .no-movies {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}
```

### 3.6 Modify AdminPage.jsx

Update AdminPage.jsx to include a tab system with navigation between "Dashboard" and "Movie Management":

```javascript
// Add this state
const [activeTab, setActiveTab] = useState('dashboard');

// Replace the return with tab navigation
return (
  <div className="admin-container">
    <div className="admin-header">
      <div className="admin-title-section">
        <h1 className="admin-title">Admin Dashboard</h1>
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
      // Existing dashboard content
      <>
        {/* Stats Cards */}
        ...
      </>
    ) : (
      <MovieList />
    )}
  </div>
);
```

Add CSS for tabs:

```css
.admin-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #dee2e6;
}

.admin-tabs .tab {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  border-bottom: 2px solid transparent;
}

.admin-tabs .tab.active {
  color: #333;
  border-bottom-color: #007bff;
  font-weight: 500;
}
```

## 4. Implementation Checklist

- [ ] Create `frontend/src/hooks/adminApi.js` - API hooks
- [ ] Create `frontend/src/components/admin/MovieList.jsx` - Movie list component
- [ ] Create `frontend/src/components/admin/MovieModal.jsx` - Modal component
- [ ] Create `frontend/src/components/admin/MovieList.css` - CSS styles
- [ ] Create `frontend/src/components/admin/MovieModal.css` - Modal styles
- [ ] Update `frontend/src/pages/AdminPage.jsx` - Add tabs and MovieList
- [ ] Update `frontend/src/styles/admin-page.css` - Add tab styles (if needed)

## 5. Notes

- All admin API calls require JWT token in Authorization header
- File button is a placeholder - actual file upload/managemnet will be implemented later
- The poster display uses the existing image endpoint `/api/image/{filename}`
- Currently no support for relationships (actors, directors, categories, etc.) in the form - these can be added in future iterations
- Pagination uses page-based navigation with size of 10 items per page