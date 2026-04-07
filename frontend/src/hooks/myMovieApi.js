const BASE_URL = "http://localhost:8080";
const MOVIE_URL = `${BASE_URL}/movie`;

// Existing exports
export { BASE_URL, MOVIE_URL };

export async function fetchMovies() {
    const res = await fetch(`${BASE_URL}/movie`);
    return res.json();
}

export async function fetchHotMovies(limit = 10) {
    const res = await fetch(`${BASE_URL}/movie/hot?limit=${limit}`);
    return res.json();
}

export function getPosterUrl(fileName) {
    return `${BASE_URL}/test/image/${fileName}`;
}

export function getMovieUrl() {
    return `${MOVIE_URL}`
}

export async function fetchMoviesByFilter(filters = {}, page = 0, limit = 10) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (filters.name) params.append('name', filters.name);          // <-- NEW
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    if (filters.releaseYear) params.append('releaseYear', filters.releaseYear);
    if (filters.type) params.append('type', filters.type);

    const res = await fetch(`${MOVIE_URL}/filter?${params.toString()}`);

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
}

// Static filter options for dropdowns
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

// TODO: Update endpoint when backend is ready
export async function getMovieFiles(movieId) {
    const res = await fetch(`${MOVIE_URL}/${movieId}/files`);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
}