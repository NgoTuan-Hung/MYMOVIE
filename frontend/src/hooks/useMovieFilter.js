import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMoviesByFilter } from './myMovieApi';

export const useMovieFilter = () => {
    const [searchParams] = useSearchParams();

    // Initialize filters from URL parameters
    const [filters, setFilters] = useState({
        name: searchParams.get('name') || '',           // <-- NEW
        sort: searchParams.get('sort') || '',
        category: searchParams.get('category') || '',
        country: searchParams.get('country') || '',
        releaseYear: searchParams.get('releaseYear') || '',
        type: searchParams.get('type') || ''
    });

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        totalPages: 0,
        totalElements: 0
    });

    // Sync filters when URL search params change
    useEffect(() => {
        const name = searchParams.get('name') || '';            // <-- NEW
        const sort = searchParams.get('sort') || '';
        const category = searchParams.get('category') || '';
        const country = searchParams.get('country') || '';
        const releaseYear = searchParams.get('releaseYear') || '';
        const type = searchParams.get('type') || '';

        setFilters(prev => {
            if (
                prev.name !== name ||                               // <-- NEW
                prev.sort !== sort ||
                prev.category !== category ||
                prev.country !== country ||
                prev.releaseYear !== releaseYear ||
                prev.type !== type
            ) {
                return { name, sort, category, country, releaseYear, type };
            }
            return prev;
        });
    }, [searchParams.toString()]);

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
            name: '',                                       // <-- NEW
            sort: '',
            category: '',
            country: '',
            releaseYear: '',
            type: ''
        });
    }, []);

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