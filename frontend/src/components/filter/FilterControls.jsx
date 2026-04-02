import { FILTER_OPTIONS } from "../../test/myMovieApi";
import "../../styles/filter-controls.css";

export default function FilterControls({ filters, onFilterChange, onReset, loading }) {
    return (
        <div className="filter-controls">
            {/* Sort Dropdown */}
            <div className="filter-group">
                <label htmlFor="sort-select" className="filter-label">Sort By</label>
                <select
                    id="sort-select"
                    className="filter-select"
                    value={filters.sort}
                    onChange={(e) => onFilterChange("sort", e.target.value)}
                >
                    <option value="">All</option>
                    {FILTER_OPTIONS.sort.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category Dropdown */}
            <div className="filter-group">
                <label htmlFor="category-select" className="filter-label">Category</label>
                <select
                    id="category-select"
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                >
                    <option value="">All</option>
                    {FILTER_OPTIONS.categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Country Dropdown */}
            <div className="filter-group">
                <label htmlFor="country-select" className="filter-label">Country</label>
                <select
                    id="country-select"
                    className="filter-select"
                    value={filters.country}
                    onChange={(e) => onFilterChange("country", e.target.value)}
                >
                    <option value="">All</option>
                    {FILTER_OPTIONS.countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            {/* Release Year Dropdown */}
            <div className="filter-group">
                <label htmlFor="year-select" className="filter-label">Release Year</label>
                <select
                    id="year-select"
                    className="filter-select"
                    value={filters.releaseYear}
                    onChange={(e) => onFilterChange("releaseYear", e.target.value)}
                >
                    <option value="">All</option>
                    {FILTER_OPTIONS.releaseYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reset Button */}
            <button
                className="reset-button"
                onClick={onReset}
                disabled={loading}
            >
                Reset
            </button>
        </div>
    );
}