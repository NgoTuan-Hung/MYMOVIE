import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import DropdownMenu from "./DropdownMenu";
import { FILTER_OPTIONS } from "../hooks/myMovieApi";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movie?type=movie" },
    { label: "TV Shows", path: "/movie?type=series" },
    { label: "Animation", path: "/movie?category=animation" },
];

export default function NavigationBar() {
    const navigate = useNavigate();

    const handleSearch = (q) => {
        navigate(`/movie?name=${encodeURIComponent(q)}`);
    };

    const handleGenreClick = (genre) => {
        navigate(`/movie?category=${encodeURIComponent(genre)}`);
    };

    const handleCountryClick = (country) => {
        navigate(`/movie?country=${encodeURIComponent(country)}`);
    };

    return (
        <header className="navbar-wrapper">
            {/* Top Row: Logo + Search */}
            <div className="navbar-top">
                <Link to="/" className="logo">
                    🎬 MyMovie
                </Link>
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Bottom Row: Navigation Links + Dropdowns */}
            <nav className="navbar-bottom">
                <div className="nav-links">
                    {navItems.map((item) => (
                        <Link key={item.label} to={item.path} className="nav-link">
                            {item.label}
                        </Link>
                    ))}

                    {/* Genres Dropdown */}
                    <DropdownMenu
                        triggerLabel="Genres"
                        items={FILTER_OPTIONS.categories}
                        onItemClick={handleGenreClick}
                        ariaLabel="Browse by genre"
                    />

                    {/* Country Dropdown */}
                    <DropdownMenu
                        triggerLabel="Country"
                        items={FILTER_OPTIONS.countries}
                        onItemClick={handleCountryClick}
                        ariaLabel="Browse by country"
                    />
                </div>
            </nav>
        </header>
    );
}