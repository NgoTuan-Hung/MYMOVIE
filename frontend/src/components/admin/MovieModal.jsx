
import { useState, useEffect } from 'react';
import { createMovie, updateMovie, getMovieById } from '../../hooks/adminApi';
import {
    fetchCountries,
    fetchCategories,
    fetchActors,
    fetchDirectors,
    fetchLanguages
} from '../../hooks/adminApi';
import '../../styles/movie-modal.css';
import MultiSelectDropdown from '../MultiSelectDropdown';

export default function MovieModal({ movie, onClose, onSaveSuccess }) {
    const isEdit = !!movie;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingRefs, setLoadingRefs] = useState(true);

    // Reference data options
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [actors, setActors] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [languages, setLanguages] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        originalName: '',
        displayName: '',
        releaseYear: '',
        duration: '',
        status: 'RELEASED',
        episodeCount: 1,
        posterPath: '',
        countryIds: [],
        categoryIds: [],
        actorIds: [],
        directorIds: [],
        languageIds: [],
    });

    // Load reference data once on mount
    useEffect(() => {
        loadReferenceData();
    }, []);

    // Load movie data for edit mode
    useEffect(() => {
        if (movie) {
            loadMovieData();
        }
    }, [movie]);

    async function loadReferenceData() {
        try {
            const [c, cat, a, d, l] = await Promise.all([
                fetchCountries(),
                fetchCategories(),
                fetchActors(),
                fetchDirectors(),
                fetchLanguages()
            ]);
            setCountries(c);
            setCategories(cat);
            setActors(a);
            setDirectors(d);
            setLanguages(l);
        } catch (err) {
            console.error('Failed to load reference data:', err);
        } finally {
            setLoadingRefs(false);
        }
    }

    async function loadMovieData() {
        try {
            const data = await getMovieById(movie.id);
            setFormData({
                originalName: data.originalName || '',
                displayName: data.displayName || '',
                releaseYear: data.releaseYear || '',
                duration: data.duration || '',
                status: data.status || 'RELEASED',
                episodeCount: data.episodeCount || 1,
                posterPath: data.posterUrl || '',
                countryIds: data.countryIds || [],
                categoryIds: data.categoryIds || [],
                actorIds: data.actorIds || [],
                directorIds: data.directorIds || [],
                languageIds: data.languageIds || [],
            });
        } catch (err) {
            setError(err.message);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'episodeCount' || name === 'releaseYear' || name === 'duration'
                ? (value ? parseInt(value) : '')
                : value
        }));
    }

    function handleSelectionChange(field, selectedIds) {
        setFormData(prev => ({
            ...prev,
            [field]: selectedIds
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = {
                ...formData,
                releaseYear: formData.releaseYear || null,
                duration: formData.duration || null,
                episodeCount: formData.episodeCount || 1,
            };

            if (isEdit) {
                await updateMovie(movie.id, payload);
            } else {
                await createMovie(payload);
            }

            onSaveSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loadingRefs) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="loading">Loading reference data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-content-wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? 'Edit Movie' : 'Add New Movie'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="movie-form movie-form-grid">
                    {error && <div className="form-error">{error}</div>}

                    {/* Basic Info */}
                    <div className="form-group">
                        <label htmlFor="originalName">Original Name *</label>
                        <input
                            type="text"
                            id="originalName"
                            name="originalName"
                            value={formData.originalName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="displayName">Display Name *</label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="releaseYear">Release Year</label>
                            <input
                                type="number"
                                id="releaseYear"
                                name="releaseYear"
                                value={formData.releaseYear}
                                onChange={handleChange}
                                min="1900"
                                max="2100"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">Duration (minutes)</label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status *</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="RELEASED">Released</option>
                                <option value="ON_GOING">On Going</option>
                                <option value="FINISH">Finish</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="episodeCount">Episode Count</label>
                            <input
                                type="number"
                                id="episodeCount"
                                name="episodeCount"
                                value={formData.episodeCount}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Multi-select fields */}
                    <MultiSelectDropdown
                        label="Countries"
                        options={countries}
                        selectedIds={formData.countryIds}
                        onChange={(ids) => handleSelectionChange('countryIds', ids)}
                        placeholder="Select countries"
                        searchable
                    />

                    <MultiSelectDropdown
                        label="Categories"
                        options={categories}
                        selectedIds={formData.categoryIds}
                        onChange={(ids) => handleSelectionChange('categoryIds', ids)}
                        placeholder="Select categories"
                        searchable
                    />

                    <MultiSelectDropdown
                        label="Actors"
                        options={actors}
                        selectedIds={formData.actorIds}
                        onChange={(ids) => handleSelectionChange('actorIds', ids)}
                        placeholder="Select actors"
                        searchable
                    />

                    <MultiSelectDropdown
                        label="Directors"
                        options={directors}
                        selectedIds={formData.directorIds}
                        onChange={(ids) => handleSelectionChange('directorIds', ids)}
                        placeholder="Select directors"
                        searchable
                    />

                    <MultiSelectDropdown
                        label="Languages"
                        options={languages}
                        selectedIds={formData.languageIds}
                        onChange={(ids) => handleSelectionChange('languageIds', ids)}
                        placeholder="Select languages"
                        searchable
                    />

                    <div className="form-group full-width">
                        <label htmlFor="posterPath">Poster Path</label>
                        <input
                            type="text"
                            id="posterPath"
                            name="posterPath"
                            value={formData.posterPath}
                            onChange={handleChange}
                            placeholder="e.g., posters/movie-title.jpg"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update Movie' : 'Add Movie')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}