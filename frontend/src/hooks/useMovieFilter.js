import { useState, useEffect, useCallback } from 'react';
import { fetchMoviesByFilter } from '../test/myMovieApi';

// Used by BOTH /movie and /tv pages
// defaultType: "movie" for movies page, "series" for TV page
export const useMovieFilter = (defaultType = 'movie') => {

    const [filters, setFilters] = useState({
        sort: '',
        category: '',
        country: '',
        releaseYear: '',
        type: defaultType
    });

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    useEffect(() => {
        setFilters(prev => {
            // Only update if type actually changed
            if (prev.type !== defaultType) {
                return {
                    ...prev,
                    type: defaultType
                };
            }
            return prev;
        });
    }, [defaultType]);

    // Fetch movies from API
    const fetchMovies = useCallback(async (currentFilters, currentPage = 0) => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchMoviesByFilter(currentFilters, currentPage, 10);

            setMovies(result.content || []);
            setPagination({
                page: result.number || 0,
                totalPages: result.totalPages || 0,
                totalElements: result.totalElements || 0
            });
        } catch (err) {
            setError(err.message);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch when filters change
    useEffect(() => {
        fetchMovies(filters, 0);
    }, [filters, fetchMovies]);

    // Update a single filter
    const updateFilter = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Reset all filters to defaults
    const resetFilters = useCallback(() => {
        setFilters({
            sort: '',
            category: '',
            country: '',
            releaseYear: '',
            type: defaultType
        });
    }, [defaultType]);

    // Go to specific page
    const goToPage = useCallback((page) => {
        fetchMovies(filters, page);
    }, [filters, fetchMovies]);

    return {
        filters,
        movies,
        loading,
        error,
        pagination,
        updateFilter,
        resetFilters,
        goToPage
    };
};