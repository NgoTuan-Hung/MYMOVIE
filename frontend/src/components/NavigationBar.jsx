import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/navbar.css";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movie" },
    { label: "TV Shows", path: "/tv" },
    { label: "Genres", path: "/genres" },
];

const handleSearch = (q) => {
    navigate(`/movies?search=${q}`);
};

export default function NavigationBar() {

    return (
        <nav className="navbar">
            {/* Logo */}
            <Link to="/" className="logo">
                🎬 MyMovie
            </Link>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Navigation Links */}
            <div className="nav-links">
                {navItems.map((item) => (
                    <Link key={item.label} to={item.path} className="nav-link">
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}