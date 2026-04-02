import { useMovieFilter } from "../../hooks/useMovieFilter";
import FilterControls from "./FilterControls";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import "../../styles/filter-page.css";

export default function MovieFilterPage({ defaultType = "movie" }) {
    const {
        filters,
        movies,
        loading,
        error,
        pagination,
        updateFilter,
        resetFilters,
        goToPage
    } = useMovieFilter(defaultType);

    const emptyMessage = defaultType === "movie"
        ? "No movies found matching your filters"
        : "No TV shows found matching your filters";

    return (
        <div className="filter-page">

            {/* Filter Controls */}
            <FilterControls
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                loading={loading}
            />

            {/* Loading State */}
            {loading && movies.length === 0 && (
                <div className="loading">Loading...</div>
            )}

            {/* Error State */}
            {error && (
                <div className="error-container">
                    <p className="error-message">Error: {error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Retry
                    </button>
                </div>
            )}

            {/* Movie Grid */}
            {!loading && !error && movies.length > 0 && (
                <MovieGrid movies={movies} />
            )}

            {/* Empty State */}
            {!loading && !error && movies.length === 0 && (
                <div className="empty-state">
                    <p>{emptyMessage}</p>
                    <button onClick={resetFilters} className="reset-button">
                        Reset Filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={goToPage}
                />
            )}
        </div>
    );
}