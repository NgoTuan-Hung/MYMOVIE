# Admin CRUD Management for Reference Data

## Overview

This document outlines the implementation plan for adding CRUD (Create, Read, Update, Delete) management for the following reference data entities in the admin panel:
- **Actors**
- **Categories**
- **Countries**
- **Directors**
- **Languages**

These entities are simple reference data with only `id` and `name` fields, making the implementation straightforward and consistent across all five.

---

## Current State Analysis

### Existing Backend
- **Entities**: `Actor.java`, `Category.java`, `Country.java`, `Director.java`, `Language.java` - all have similar structure with `id` and `name` fields
- **Repositories**: Each entity has a corresponding `JpaRepository` with basic `findById` method
- **AdminController**: Already has GET endpoints (`/countries`, `/categories`, `/actors`, `/directors`, `/languages`) but lacks CRUD operations

### Existing Frontend
- **AdminPage.jsx**: Uses a tab system with "Dashboard" and "Movie Management"
- **AdminMovieList.jsx**: Shows movie table with Add/Update/Delete actions
- **MovieModal.jsx**: Form modal pattern for creating/editing entities
- **adminApi.js**: Contains API functions for admin operations

---

## Implementation Plan

### Phase 1: Backend Implementation

#### 1.1 Create DTO Classes

**File: `src/main/java/com/example/mymovie/DTO/CreateActorRequest.java`**
```java
package com.example.mymovie.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateActorRequest {
    @NotBlank(message = "Actor name is required")
    private String name;
}
```

**File: `src/main/java/com/example/mymovie/DTO/UpdateActorRequest.java`**
```java
package com.example.mymovie.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateActorRequest {
    @NotBlank(message = "Actor name is required")
    private String name;
}
```

**Similar DTOs for Category, Country, Director, Language:**

| Entity | Create DTO | Update DTO | ID Type |
|--------|------------|------------|---------|
| Actor | CreateActorRequest | UpdateActorRequest | Long |
| Category | CreateCategoryRequest | UpdateCategoryRequest | Integer |
| Country | CreateCountryRequest | UpdateCountryRequest | Integer |
| Director | CreateDirectorRequest | UpdateDirectorRequest | Long |
| Language | CreateLanguageRequest | UpdateLanguageRequest | Integer |

**Note**: ID types differ - `Actor` and `Director` use `Long`, while `Category`, `Country`, and `Language` use `Integer`.

#### 1.2 Update AdminController

**File: `src/main/java/com/example/mymovie/Controller/AdminController.java`**

Add CRUD endpoints for each entity:

```java
// ==================== ACTOR CRUD ====================

@PostMapping("/actors")
public ResponseEntity<Actor> createActor(@Valid @RequestBody CreateActorRequest request) {
    Actor actor = new Actor();
    actor.setName(request.getName());
    return ResponseEntity.ok(actorRepository.save(actor));
}

@PutMapping("/actors/{id}")
public ResponseEntity<Actor> updateActor(
        @PathVariable Long id,
        @Valid @RequestBody UpdateActorRequest request) {
    Actor actor = actorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Actor not found with id: " + id));
    actor.setName(request.getName());
    return ResponseEntity.ok(actorRepository.save(actor));
}

@DeleteMapping("/actors/{id}")
public ResponseEntity<Void> deleteActor(@PathVariable Long id) {
    if (!actorRepository.existsById(id)) {
        throw new RuntimeException("Actor not found with id: " + id);
    }
    actorRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}

// ==================== CATEGORY CRUD ====================

@PostMapping("/categories")
public ResponseEntity<Category> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
    Category category = new Category();
    category.setName(request.getName());
    return ResponseEntity.ok(categoryRepository.save(category));
}

@PutMapping("/categories/{id}")
public ResponseEntity<Category> updateCategory(
        @PathVariable Integer id,
        @Valid @RequestBody UpdateCategoryRequest request) {
    Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    category.setName(request.getName());
    return ResponseEntity.ok(categoryRepository.save(category));
}

@DeleteMapping("/categories/{id}")
public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
    if (!categoryRepository.existsById(id)) {
        throw new RuntimeException("Category not found with id: " + id);
    }
    categoryRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}

// ==================== COUNTRY CRUD ====================

@PostMapping("/countries")
public ResponseEntity<Country> createCountry(@Valid @RequestBody CreateCountryRequest request) {
    Country country = new Country();
    country.setName(request.getName());
    return ResponseEntity.ok(countryRepository.save(country));
}

@PutMapping("/countries/{id}")
public ResponseEntity<Country> updateCountry(
        @PathVariable Integer id,
        @Valid @RequestBody UpdateCountryRequest request) {
    Country country = countryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
    country.setName(request.getName());
    return ResponseEntity.ok(countryRepository.save(country));
}

@DeleteMapping("/countries/{id}")
public ResponseEntity<Void> deleteCountry(@PathVariable Integer id) {
    if (!countryRepository.existsById(id)) {
        throw new RuntimeException("Country not found with id: " + id);
    }
    countryRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}

// ==================== DIRECTOR CRUD ====================

@PostMapping("/directors")
public ResponseEntity<Director> createDirector(@Valid @RequestBody CreateDirectorRequest request) {
    Director director = new Director();
    director.setName(request.getName());
    return ResponseEntity.ok(directorRepository.save(director));
}

@PutMapping("/directors/{id}")
public ResponseEntity<Director> updateDirector(
        @PathVariable Long id,
        @Valid @RequestBody UpdateDirectorRequest request) {
    Director director = directorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Director not found with id: " + id));
    director.setName(request.getName());
    return ResponseEntity.ok(directorRepository.save(director));
}

@DeleteMapping("/directors/{id}")
public ResponseEntity<Void> deleteDirector(@PathVariable Long id) {
    if (!directorRepository.existsById(id)) {
        throw new RuntimeException("Director not found with id: " + id);
    }
    directorRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}

// ==================== LANGUAGE CRUD ====================

@PostMapping("/languages")
public ResponseEntity<Language> createLanguage(@Valid @RequestBody CreateLanguageRequest request) {
    Language language = new Language();
    language.setName(request.getName());
    return ResponseEntity.ok(languageRepository.save(language));
}

@PutMapping("/languages/{id}")
public ResponseEntity<Language> updateLanguage(
        @PathVariable Integer id,
        @Valid @RequestBody UpdateLanguageRequest request) {
    Language language = languageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Language not found with id: " + id));
    language.setName(request.getName());
    return ResponseEntity.ok(languageRepository.save(language));
}

@DeleteMapping("/languages/{id}")
public ResponseEntity<Void> deleteLanguage(@PathVariable Integer id) {
    if (!languageRepository.existsById(id)) {
        throw new RuntimeException("Language not found with id: " + id);
    }
    languageRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}
```

**Important Considerations:**
- Deleting an entity that has associated movies will throw a foreign key constraint violation
- Consider adding soft-delete or check for associations before deletion
- Add proper exception handling with custom exceptions

---

### Phase 2: Frontend Implementation

#### 2.1 Update API Functions

**File: `frontend/src/hooks/adminApi.js`**

Add CRUD API functions:

```javascript
// ==================== ACTORS ====================

export async function createActor(data) {
    const res = await fetch(`${ADMIN_API}/actors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create actor');
    return res.json();
}

export async function updateActor(id, data) {
    const res = await fetch(`${ADMIN_API}/actors/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update actor');
    return res.json();
}

export async function deleteActor(id) {
    const res = await fetch(`${ADMIN_API}/actors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete actor');
}

// ==================== CATEGORIES ====================

export async function createCategory(data) {
    const res = await fetch(`${ADMIN_API}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
}

export async function updateCategory(id, data) {
    const res = await fetch(`${ADMIN_API}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
}

export async function deleteCategory(id) {
    const res = await fetch(`${ADMIN_API}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete category');
}

// ==================== COUNTRIES ====================

export async function createCountry(data) {
    const res = await fetch(`${ADMIN_API}/countries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create country');
    return res.json();
}

export async function updateCountry(id, data) {
    const res = await fetch(`${ADMIN_API}/countries/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update country');
    return res.json();
}

export async function deleteCountry(id) {
    const res = await fetch(`${ADMIN_API}/countries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete country');
}

// ==================== DIRECTORS ====================

export async function createDirector(data) {
    const res = await fetch(`${ADMIN_API}/directors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create director');
    return res.json();
}

export async function updateDirector(id, data) {
    const res = await fetch(`${ADMIN_API}/directors/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update director');
    return res.json();
}

export async function deleteDirector(id) {
    const res = await fetch(`${ADMIN_API}/directors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete director');
}

// ==================== LANGUAGES ====================

export async function createLanguage(data) {
    const res = await fetch(`${ADMIN_API}/languages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create language');
    return res.json();
}

export async function updateLanguage(id, data) {
    const res = await fetch(`${ADMIN_API}/languages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update language');
    return res.json();
}

export async function deleteLanguage(id) {
    const res = await fetch(`${ADMIN_API}/languages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete language');
}
```

#### 2.2 Create Generic Reference Data Modal Component

**File: `frontend/src/components/admin/ReferenceDataModal.jsx`**

```jsx
import { useState } from 'react';
import '../../styles/reference-data-modal.css';

/**
 * Reusable modal for creating/editing simple reference data entities
 * Used for: Actors, Categories, Countries, Directors, Languages
 */
export default function ReferenceDataModal({
    entityName,           // e.g., "Actor", "Category"
    entity = null,        // null for create mode, entity object for edit mode
    onClose,
    onSaveSuccess,
    onCreate,             // API function to create
    onUpdate,             // API function to update
}) {
    const isEdit = !!entity;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState(entity?.name || '');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        
        if (!name.trim()) {
            setError(`${entityName} name is required`);
            return;
        }

        setLoading(true);
        try {
            const payload = { name: name.trim() };
            
            if (isEdit) {
                await onUpdate(entity.id, payload);
            } else {
                await onCreate(payload);
            }
            
            onSaveSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-content-small" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? `Edit ${entityName}` : `Add New ${entityName}`}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="reference-form">
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">{entityName} Name *</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`Enter ${entityName.toLowerCase()} name`}
                            autoFocus
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
```

#### 2.3 Create Generic Reference Data List Component

**File: `frontend/src/components/admin/ReferenceDataList.jsx`**

```jsx
import { useState, useEffect } from 'react';
import ReferenceDataModal from './ReferenceDataModal';
import AdminPagination from './AdminPagination';
import '../../styles/reference-data-list.css';

/**
 * Reusable list component for managing reference data
 * Used for: Actors, Categories, Countries, Directors, Languages
 */
export default function ReferenceDataList({
    entityName,           // e.g., "Actor", "Category"
    entityNamePlural,     // e.g., "Actors", "Categories"
    fetchAll,             // API function to fetch all
    onCreate,             // API function to create
    onUpdate,             // API function to update
    onDelete,             // API function to delete
    idType = 'number',    // 'number' for Integer IDs, 'long' for Long IDs
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination (client-side for reference data since lists are typically small)
    const [page, setPage] = useState(0);
    const itemsPerPage = 10;

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Load data
    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            setLoading(true);
            const data = await fetchAll();
            setItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Filter items based on search
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    // Handlers
    function handleAdd() {
        setEditingItem(null);
        setShowModal(true);
    }

    function handleEdit(item) {
        setEditingItem(item);
        setShowModal(true);
    }

    async function handleDelete(item) {
        if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

        try {
            await onDelete(item.id);
            loadItems();
        } catch (err) {
            // Handle foreign key constraint errors
            if (err.message.includes('Failed to delete')) {
                alert(`Cannot delete "${item.name}" because it is associated with one or more movies.`);
            } else {
                alert(err.message);
            }
        }
    }

    function handleSaveSuccess() {
        setShowModal(false);
        loadItems();
    }

    return (
        <div className="reference-data-container">
            {/* Header */}
            <div className="reference-data-header">
                <h2>{entityNamePlural} Management</h2>
                <button className="add-btn" onClick={handleAdd}>
                    + Add {entityName}
                </button>
            </div>

            {/* Search */}
            <div className="reference-data-search">
                <input
                    type="text"
                    placeholder={`Search ${entityNamePlural.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0); // Reset to first page on search
                    }}
                />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Table */}
            <div className="reference-data-table-wrapper">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : paginatedItems.length === 0 ? (
                    <div className="no-data">
                        {searchTerm ? `No ${entityNamePlural.toLowerCase()} found matching "${searchTerm}"` : `No ${entityNamePlural.toLowerCase()} found`}
                    </div>
                ) : (
                    <table className="reference-data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(item)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <AdminPagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={filteredItems.length}
                    onPageChange={setPage}
                />
            )}

            {/* Modal */}
            {showModal && (
                <ReferenceDataModal
                    entityName={entityName}
                    entity={editingItem}
                    onClose={() => setShowModal(false)}
                    onSaveSuccess={handleSaveSuccess}
                    onCreate={onCreate}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
}
```

#### 2.4 Create Styles

**File: `frontend/src/styles/reference-data.css`**

```css
/* Reference Data List Styles */
.reference-data-container {
    padding: 20px;
}

.reference-data-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.reference-data-header h2 {
    margin: 0;
    color: #fff;
}

.reference-data-header .add-btn {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
}

.reference-data-header .add-btn:hover {
    background: #45a049;
}

.reference-data-search {
    margin-bottom: 20px;
}

.reference-data-search input {
    width: 100%;
    max-width: 400px;
    padding: 10px 15px;
    border: 1px solid #444;
    border-radius: 6px;
    background: #2a2a2a;
    color: #fff;
    font-size: 14px;
}

.reference-data-search input:focus {
    outline: none;
    border-color: #4CAF50;
}

.reference-data-table-wrapper {
    background: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
}

.reference-data-table {
    width: 100%;
    border-collapse: collapse;
}

.reference-data-table th,
.reference-data-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #333;
}

.reference-data-table th {
    background: #2a2a2a;
    color: #888;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
}

.reference-data-table td {
    color: #fff;
}

.reference-data-table tbody tr:hover {
    background: #252525;
}

.actions-cell {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.2s;
}

.edit-btn {
    background: #2196F3;
    color: white;
}

.edit-btn:hover {
    background: #1976D2;
}

.delete-btn {
    background: #f44336;
    color: white;
}

.delete-btn:hover {
    background: #d32f2f;
}

/* Modal Styles */
.modal-content-small {
    max-width: 400px;
    width: 90%;
}

.reference-form {
    padding: 20px;
}

.reference-form .form-group {
    margin-bottom: 20px;
}

.reference-form label {
    display: block;
    margin-bottom: 8px;
    color: #888;
    font-size: 14px;
}

.reference-form input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #444;
    border-radius: 6px;
    background: #2a2a2a;
    color: #fff;
    font-size: 14px;
}

.reference-form input:focus {
    outline: none;
    border-color: #4CAF50;
}

.form-error {
    background: #ffebee;
    color: #c62828;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 15px;
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.cancel-btn {
    padding: 10px 20px;
    background: #555;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.submit-btn {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.submit-btn:disabled {
    background: #666;
    cursor: not-allowed;
}
```

#### 2.5 Update AdminPage.jsx

**File: `frontend/src/pages/AdminPage.jsx`**

Update the tab system to include reference data management:

```jsx
import { useAuth } from '../context/AuthContext';
import '../styles/admin-page.css';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminMovieList from '../components/admin/AdminMovieList';
import ReferenceDataList from '../components/admin/ReferenceDataList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchActors, createActor, updateActor, deleteActor,
    fetchCategories, createCategory, updateCategory, deleteCategory,
    fetchCountries, createCountry, updateCountry, deleteCountry,
    fetchDirectors, createDirector, updateDirector, deleteDirector,
    fetchLanguages, createLanguage, updateLanguage, deleteLanguage,
} from '../hooks/adminApi';

export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalViews: 0,
    });
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Mock stats - in real implementation, fetch from backend
    useEffect(() => {
        // TODO: Implement actual stats API
        setStats({
            totalMovies: 150,
            totalUsers: 42,
            totalViews: 12580,
        });
    }, []);

    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'movies', label: 'Movies' },
        { id: 'actors', label: 'Actors' },
        { id: 'categories', label: 'Categories' },
        { id: 'countries', label: 'Countries' },
        { id: 'directors', label: 'Directors' },
        { id: 'languages', label: 'Languages' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard stats={stats} />;
            case 'movies':
                return <AdminMovieList />;
            case 'actors':
                return (
                    <ReferenceDataList
                        entityName="Actor"
                        entityNamePlural="Actors"
                        fetchAll={fetchActors}
                        onCreate={createActor}
                        onUpdate={updateActor}
                        onDelete={deleteActor}
                    />
                );
            case 'categories':
                return (
                    <ReferenceDataList
                        entityName="Category"
                        entityNamePlural="Categories"
                        fetchAll={fetchCategories}
                        onCreate={createCategory}
                        onUpdate={updateCategory}
                        onDelete={deleteCategory}
                    />
                );
            case 'countries':
                return (
                    <ReferenceDataList
                        entityName="Country"
                        entityNamePlural="Countries"
                        fetchAll={fetchCountries}
                        onCreate={createCountry}
                        onUpdate={updateCountry}
                        onDelete={deleteCountry}
                    />
                );
            case 'directors':
                return (
                    <ReferenceDataList
                        entityName="Director"
                        entityNamePlural="Directors"
                        fetchAll={fetchDirectors}
                        onCreate={createDirector}
                        onUpdate={updateDirector}
                        onDelete={deleteDirector}
                    />
                );
            case 'languages':
                return (
                    <ReferenceDataList
                        entityName="Language"
                        entityNamePlural="Languages"
                        fetchAll={fetchLanguages}
                        onCreate={createLanguage}
                        onUpdate={updateLanguage}
                        onDelete={deleteLanguage}
                    />
                );
            default:
                return <AdminDashboard stats={stats} />;
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-title-section">
                    <h1 className="admin-title">🛡️ Admin Dashboard</h1>
                    <p className="admin-subtitle">Welcome, {user?.email}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="admin-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </div>
    );
}
```

---

## File Changes Summary

### Backend Files to Create

| File | Description |
|------|-------------|
| `src/main/java/com/example/mymovie/DTO/CreateActorRequest.java` | DTO for creating actors |
| `src/main/java/com/example/mymovie/DTO/UpdateActorRequest.java` | DTO for updating actors |
| `src/main/java/com/example/mymovie/DTO/CreateCategoryRequest.java` | DTO for creating categories |
| `src/main/java/com/example/mymovie/DTO/UpdateCategoryRequest.java` | DTO for updating categories |
| `src/main/java/com/example/mymovie/DTO/CreateCountryRequest.java` | DTO for creating countries |
| `src/main/java/com/example/mymovie/DTO/UpdateCountryRequest.java` | DTO for updating countries |
| `src/main/java/com/example/mymovie/DTO/CreateDirectorRequest.java` | DTO for creating directors |
| `src/main/java/com/example/mymovie/DTO/UpdateDirectorRequest.java` | DTO for updating directors |
| `src/main/java/com/example/mymovie/DTO/CreateLanguageRequest.java` | DTO for creating languages |
| `src/main/java/com/example/mymovie/DTO/UpdateLanguageRequest.java` | DTO for updating languages |

### Backend Files to Modify

| File | Changes |
|------|---------|
| `src/main/java/com/example/mymovie/Controller/AdminController.java` | Add CRUD endpoints for all 5 entities |

### Frontend Files to Create

| File | Description |
|------|-------------|
| `frontend/src/components/admin/ReferenceDataModal.jsx` | Reusable modal for creating/editing reference data |
| `frontend/src/components/admin/ReferenceDataList.jsx` | Reusable list component with search and pagination |
| `frontend/src/styles/reference-data.css` | Styles for reference data components |

### Frontend Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/hooks/adminApi.js` | Add CRUD API functions for all 5 entities |
| `frontend/src/pages/AdminPage.jsx` | Add new tabs for reference data management |

---

## Alternative Approaches

### Option 1: Separate Admin Controllers (Recommended for Larger Projects)

Create separate controller files for each entity:
- `ActorAdminController.java`
- `CategoryAdminController.java`
- etc.

**Pros:**
- Better organization for larger projects
- Easier to maintain individual entities
- Clear separation of concerns

**Cons:**
- More files to manage
- May be overkill for simple CRUD

### Option 2: Use a Generic Service Pattern

Create a generic service that handles CRUD for all simple entities:

```java
public interface SimpleEntityService<T, ID> {
    List<T> findAll();
    T findById(ID id);
    T create(String name);
    T update(ID id, String name);
    void delete(ID id);
}
```

**Pros:**
- DRY (Don't Repeat Yourself)
- Consistent behavior across all entities

**Cons:**
- More complex implementation
- Harder to customize individual entity behavior

### Option 3: Single Page with Sub-tabs

Instead of separate tabs for each entity, use a single "Reference Data" tab with sub-tabs:

**Pros:**
- Fewer main navigation items
- Groups related functionality together

**Cons:**
- Additional click to reach entity
- May require more complex UI

---

## Security Considerations

1. **Authentication**: All endpoints are already under `/api/admin/*` which should be protected by JWT authentication
2. **Authorization**: Verify that the user has `ADMIN` role before allowing operations
3. **Input Validation**: Use `@Valid` annotation and validate input names (no empty, max length, etc.)
4. **Foreign Key Constraints**: Handle deletion of entities that are associated with movies gracefully

---

## Testing Checklist

After implementation, test the following:

### Backend Tests
- [ ] Create each entity type (Actor, Category, Country, Director, Language)
- [ ] Update each entity type
- [ ] Delete each entity type
- [ ] Attempt to delete entity with associated movies (should fail or handle gracefully)
- [ ] Validate input (empty name, whitespace-only name)

### Frontend Tests
- [ ] Each tab displays correctly
- [ ] Search/filter functionality works
- [ ] Create modal works for each entity type
- [ ] Edit modal works for each entity type
- [ ] Delete confirmation and error handling
- [ ] Pagination works when list exceeds 10 items
- [ ] Error messages display correctly

---

## Estimated Implementation Time

| Phase | Task | Estimated Time |
|-------|------|----------------|
| Backend | Create 10 DTO classes | 30 min |
| Backend | Update AdminController | 45 min |
| Frontend | Update adminApi.js | 15 min |
| Frontend | Create ReferenceDataModal | 20 min |
| Frontend | Create ReferenceDataList | 30 min |
| Frontend | Create styles | 15 min |
| Frontend | Update AdminPage.jsx | 20 min |
| Testing | Manual testing | 30 min |
| **Total** | | **~3 hours** |

---

## Notes

1. **Reusability**: The `ReferenceDataModal` and `ReferenceDataList` components are designed to be reused for any simple entity with just `id` and `name` fields.

2. **Scalability**: If you need to add more fields to any entity in the future, you'll need to create a specific modal for that entity.

3. **Performance**: Reference data lists are typically small (< 1000 items), so client-side pagination and filtering is acceptable. For larger datasets, consider server-side pagination.

4. **Search**: Currently uses simple name matching. Consider adding server-side search with pagination for production use.

5. **Bulk Operations**: Future enhancement could include bulk import/export functionality for reference data.