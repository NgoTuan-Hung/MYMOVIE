
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