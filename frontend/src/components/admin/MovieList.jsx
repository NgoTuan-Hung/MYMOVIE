import { useState, useEffect } from 'react';
import { fetchAdminMovies, deleteMovie } from '../../hooks/adminApi';
import MovieModal from './MovieModal';
import '../../styles/movie-list.css';

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