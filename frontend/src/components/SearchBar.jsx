import { useState } from "react";
import "../styles/navbar.css";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search movies"
            />
            <button type="submit" className="search-button">
                Search
            </button>
        </form>
    );
}