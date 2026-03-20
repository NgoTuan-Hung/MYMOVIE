const BASE_URL = "http://localhost:8080";

export async function fetchMovies() {
    const res = await fetch(`${BASE_URL}/movie`);
    return res.json();
}

export function getPosterUrl(fileName) {
    return `${BASE_URL}/test/image/${fileName}`;
}