# Admin Page Theme & Pagination Fix

## Problem

The admin movie management page (`AdminMovieList.jsx`) and its pagination component use hardcoded light-theme colors that clash with the app's dark theme. The dark theme is defined in `frontend/src/index.css` using CSS variables, but `movie-list.css` ignores them entirely.

### Current Theme Variables (from `index.css`)

| Variable | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0f0f1a` | Page background |
| `--bg-secondary` | `#1a1a2e` | Section backgrounds |
| `--bg-card` | `#2c3e50` | Card backgrounds |
| `--bg-input` | `#34495e` | Input/table backgrounds |
| `--bg-hover` | `#3d566e` | Hover states |
| `--text-primary` | `#ecf0f1` | Primary text |
| `--text-secondary` | `#bdc3c7` | Secondary text |
| `--text-muted` | `#7f8c8d` | Muted text |
| `--accent` | `#e74c3c` | Accent color |
| `--accent-hover` | `#c0392b` | Accent hover |
| `--border-color` | `#3d566e` | Borders |
| `--shadow-color` | `rgba(0,0,0,0.3)` | Shadows |

### Problematic Hardcoded Colors in `movie-list.css`

- `background: white` — table wrapper, table, pagination, buttons
- `color: #333` — headings, titles, page numbers
- `border-bottom: 1px solid #eee` — table rows
- `background: #f8f9fa` — table headers
- `color: #555` — table headers
- `background: #e9ecef` — no-poster placeholder
- `color: #6c757d` — muted text
- `background: #d4edda` / `#fff3cd` / `#d1ecf1` — status badges
- `background: #28a745` — add button
- `background: #007bff` — update button
- `background: #6c757d` — file button
- `background: #dc3545` — delete button
- `border: 1px solid #dee2e6` — pagination buttons

---

## Changes Required

### File 1: `frontend/src/styles/movie-list.css` — Complete Rewrite

Replace all hardcoded colors with CSS variable references. Below is the full replacement content:

```css
/* ============================================
   Admin Movie List Container
   ============================================ */
.admin-movie-list-container {
    padding: 20px;
}

.admin-movie-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.admin-movie-list-header h2 {
    margin: 0;
    color: var(--text-primary);
}

/* Add Movie Button — green accent, but dark-theme compatible */
.admin-add-movie-btn {
    background: #27ae60;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.admin-add-movie-btn:hover {
    background: #219a52;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

/* ============================================
   Table Wrapper & Table
   ============================================ */
.admin-table-wrapper {
    overflow-x: auto;
    background: var(--bg-card);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.admin-movie-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-movie-table th,
.admin-movie-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.admin-movie-table th {
    background: var(--bg-input);
    font-weight: 600;
    color: var(--text-primary);
    position: sticky;
    top: 0;
}

.admin-movie-table tbody tr {
    transition: background-color 0.15s ease;
}

.admin-movie-table tbody tr:hover {
    background: var(--bg-hover);
}

.admin-movie-table tbody tr:last-child td {
    border-bottom: none;
}

/* ============================================
   Poster & No Poster
   ============================================ */
.admin-movie-poster {
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 4px;
}

.admin-no-poster {
    width: 60px;
    height: 90px;
    background: var(--bg-input);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--text-muted);
    border-radius: 4px;
    border: 1px solid var(--border-color);
}

/* ============================================
   Movie Title & Original Name
   ============================================ */
.admin-movie-title {
    font-weight: 500;
    color: var(--text-primary);
}

.admin-movie-original {
    font-size: 12px;
    color: var(--text-muted);
}

/* ============================================
   Status Badges — dark-theme compatible
   ============================================ */
.admin-status-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
}

.admin-status-released {
    background: rgba(39, 174, 96, 0.15);
    color: #2ecc71;
    border: 1px solid rgba(39, 174, 96, 0.3);
}

.admin-status-on_going {
    background: rgba(241, 196, 15, 0.15);
    color: #f1c40f;
    border: 1px solid rgba(241, 196, 15, 0.3);
}

.admin-status-finish {
    background: rgba(52, 152, 219, 0.15);
    color: #3498db;
    border: 1px solid rgba(52, 152, 219, 0.3);
}

/* ============================================
   Action Buttons
   ============================================ */
.admin-actions-cell {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.admin-action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.admin-update-btn {
    background: #2980b9;
    color: white;
}

.admin-update-btn:hover {
    background: #2471a3;
    transform: translateY(-1px);
}

.admin-file-btn {
    background: var(--bg-hover);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.admin-file-btn:hover {
    background: var(--border-color);
    transform: translateY(-1px);
}

.admin-delete-btn {
    background: var(--accent);
    color: white;
}

.admin-delete-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
}

/* ============================================
   Pagination — dark-theme compatible
   ============================================ */
.admin-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 16px 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

.admin-pagination-info {
    color: var(--text-secondary);
    font-size: 14px;
}

.admin-pagination-controls-wrapper {
    display: flex;
    align-items: center;
}

/* Override the generic .pagination styles for admin context */
.admin-pagination .pagination {
    padding: 0;
}

/* ============================================
   Loading & No Movies States
   ============================================ */
.loading,
.no-movies {
    text-align: center;
    padding: 40px;
    color: var(--text-muted);
    font-size: 16px;
}

.error-message {
    background: rgba(231, 76, 60, 0.1);
    border: 1px solid rgba(231, 76, 60, 0.3);
    color: #e74c3c;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
    .admin-movie-list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .admin-actions-cell {
        flex-direction: column;
    }

    .admin-pagination {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
}
```

### Key Changes Summary for `movie-list.css`

| Element | Before | After |
|---|---|---|
| Table wrapper bg | `white` | `var(--bg-card)` (#2c3e50) |
| Table header bg | `#f8f9fa` | `var(--bg-input)` (#34495e) |
| Table header text | `#555` | `var(--text-primary)` (#ecf0f1) |
| Row borders | `#eee` | `var(--border-color)` (#3d566e) |
| Row hover | none | `var(--bg-hover)` (#3d566e) |
| Movie title text | `#333` | `var(--text-primary)` (#ecf0f1) |
| Movie original text | `#6c757d` | `var(--text-muted)` (#7f8c8d) |
| No poster bg | `#e9ecef` | `var(--bg-input)` (#34495e) |
| No poster text | `#6c757d` | `var(--text-muted)` (#7f8c8d) |
| Released badge | `#d4edda`/`#155724` | `rgba(39,174,96,0.15)`/`#2ecc71` |
| Ongoing badge | `#fff3cd`/`#856404` | `rgba(241,196,15,0.15)`/`#f1c40f` |
| Finish badge | `#d1ecf1`/`#0c5460` | `rgba(52,152,219,0.15)`/`#3498db` |
| Update button | `#007bff` | `#2980b9` (darker, fits dark theme) |
| File button | `#6c757d`/white | `var(--bg-hover)`/`var(--text-primary)` |
| Delete button | `#dc3545` | `var(--accent)` (#e74c3c) |
| Pagination bg | `white` | `var(--bg-card)` (#2c3e50) |
| Pagination text | `#6c757d` | `var(--text-secondary)` (#bdc3c7) |
| Pagination buttons | `white`/`#dee2e6` border | Uses existing `.pagination` CSS vars |
| Error message | plain text | Styled with red tinted background |

---

### File 2: `frontend/src/components/admin/AdminPagination.jsx` — Minor Fix

The pagination component wraps the shared `Pagination` component but doesn't pass the correct class. The shared `Pagination` component already uses `pagination.css` which correctly uses CSS variables. The wrapper just needs to ensure the admin pagination uses the dark theme properly.

**Current file (no changes needed to JSX):**
The CSS changes in `movie-list.css` above already handle the `.admin-pagination` styling. The nested `.pagination` class from the shared component will inherit the dark theme styles from `pagination.css`.

**One small CSS addition needed** — add this to the `movie-list.css` changes above (already included):
```css
.admin-pagination .pagination {
    padding: 0;
}
```

This removes the extra padding from the nested pagination component so it doesn't double-pad inside the admin-pagination container.

---

### File 3: `frontend/src/styles/admin-page.css` — Minor Tab Enhancement

The admin page tabs already use CSS variables correctly. One small improvement: ensure the tab content area has a consistent background.

**Add to the end of `admin-page.css`:**

```css
/* Tab content area background */
.admin-container > .admin-movie-list-container,
.admin-container > .admin-dashboard {
    background: var(--bg-secondary);
    border-radius: 0 0 8px 8px;
    border: 1px solid var(--border-color);
    border-top: none;
}
```

**Note:** This may be optional depending on whether the AdminDashboard component already has proper dark styling. The main fix is in `movie-list.css`.

---

## Implementation Order

1. **Replace `frontend/src/styles/movie-list.css`** with the new content above (full file rewrite)
2. **Verify `frontend/src/components/admin/AdminPagination.jsx`** — no code changes needed, CSS handles it
3. **Optionally enhance `frontend/src/styles/admin-page.css`** — add tab content background if needed
4. **Test** — navigate to `/admin` → Movie Management tab and verify:
   - Table background matches dark theme
   - Text is readable (light text on dark bg)
   - Status badges are visible and distinct
   - Action buttons have proper contrast
   - Pagination matches the shared pagination style
   - Row hover effect is visible

## Files to Modify

| File | Change Type | Priority |
|---|---|---|
| `frontend/src/styles/movie-list.css` | Full rewrite | **Critical** |
| `frontend/src/components/admin/AdminPagination.jsx` | No changes | — |
| `frontend/src/styles/admin-page.css` | Minor addition (optional) | Low |
