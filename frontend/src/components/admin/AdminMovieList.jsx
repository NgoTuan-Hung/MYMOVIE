import { useState, useEffect } from 'react';
import { fetchAdminMovies, deleteMovie } from '../../hooks/adminApi';
import MovieModal from './MovieModal';
import AdminPagination from './AdminPagination';
import '../../styles/movie-list.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function AdminMovieList() {
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
        <div className="admin-movie-list-container">
            {/* Header with Add Button */}
            <div className="admin-movie-list-header">
                <h2>Movie Management</h2>
                <button className="admin-add-movie-btn" onClick={handleAdd}>
                    + Add Movie
                </button>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Movie Table */}
            <div className="admin-table-wrapper">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : movies.length === 0 ? (
                    <div className="no-movies">No movies found</div>
                ) : (
                    <table className="admin-movie-table">
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
                                                src={`${API_BASE_URL}/api/image/${movie.posterUrl}`}
                                                alt={movie.displayName}
                                                className="admin-movie-poster"
                                            />
                                        ) : (
                                            <div className="admin-no-poster">No Image</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="admin-movie-title">{movie.displayName}</div>
                                        <div className="admin-movie-original">{movie.originalName}</div>
                                    </td>
                                    <td>{movie.releaseYear || '-'}</td>
                                    <td>{movie.duration ? `${movie.duration} min` : '-'}</td>
                                    <td>
                                        <span className={`admin-status-badge admin-status-${movie.status.toLowerCase()}`}>
                                            {movie.status}
                                        </span>
                                    </td>
                                    <td>{movie.episodeCount || 1}</td>
                                    <td>{movie.weeklyViews || 0}</td>
                                    <td className="admin-actions-cell">
                                        <button
                                            className="admin-action-btn admin-update-btn"
                                            onClick={() => handleEdit(movie)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="admin-action-btn admin-file-btn"
                                            onClick={() => handleFileClick(movie)}
                                        >
                                            File
                                        </button>
                                        <button
                                            className="admin-action-btn admin-delete-btn"
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
            <AdminPagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={handlePageChange}
            />

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