const BASE_URL = "http://localhost:8080";
const MOVIE_URL = `${BASE_URL}/movie`;

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