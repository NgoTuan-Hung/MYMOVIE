# Dark Theme Implementation Plan - MyMovie Frontend

## Problem Description

The current frontend has inconsistent colors: components like filter controls, movie cards, and pagination have white backgrounds (`#fff`) and light gray elements, which clash with the dark blue navigation bar (`#2c3e50`). This creates a jarring visual experience where components appear as bright white blocks against a dark theme.

## Goal

Implement a cohesive dark theme across all components that matches the navigation bar's dark blue color scheme (`#2c3e50`), creating a unified, modern dark UI similar to popular streaming platforms like Netflix, IMDb, or Letterboxd.

## Color Palette

### Primary Colors (based on navbar `#2c3e50`)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--navy-dark` | `#2c3e50` | Navigation bar background, primary dark backgrounds |
| `--navy-darker` | `#1a252f` | Hover states, active states, darker accents |
| `--navy-light` | `#34495e` | Card backgrounds, secondary backgrounds |
| `--navy-lighter` | `#3d566e` | Borders, subtle highlights |

### Text Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--text-primary` | `#ecf0f1` | Primary text (titles, labels) |
| `--text-secondary` | `#bdc3c7` | Secondary text (meta info, descriptions) |
| `--text-muted` | `#95a5a6` | Disabled states, placeholders |

### Accent Colors

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--accent` | `#e74c3c` | Primary accent (hover, active, buttons) - Red for movie theme |
| `--accent-hover` | `#c0392b` | Hover state for accent elements |
| `--accent-glow` | `rgba(231, 76, 60, 0.2)` | Box shadows, focus rings |

### Background Layers

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--bg-primary` | `#1a1a2e` | Page background |
| `--bg-secondary` | `#16213e` | Section backgrounds |
| `--bg-card` | `#2c3e50` | Card backgrounds (matches navbar) |
| `--bg-input` | `#34495e` | Input/select backgrounds |
| `--bg-hover` | `#3d566e` | Hover state backgrounds |

---

## Files to Modify

1. `frontend/src/index.css` - Add CSS custom properties (variables)
2. `frontend/src/styles/filter-controls.css` - Dark theme for filter controls
3. `frontend/src/styles/movie-card.css` - Dark theme for movie cards
4. `frontend/src/styles/pagination.css` - Dark theme for pagination
5. `frontend/src/styles/navbar.css` - Minor adjustments for consistency

---

## Detailed Code Changes

### 1. Update `frontend/src/index.css`

Add dark theme CSS custom properties at the root level:

```css
:root {
  /* Dark Theme Colors - Matching Navbar #2c3e50 */
  --navy-dark: #2c3e50;
  --navy-darker: #1a252f;
  --navy-light: #34495e;
  --navy-lighter: #3d566e;
  
  /* Background Colors */
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: #2c3e50;
  --bg-input: #34495e;
  --bg-hover: #3d566e;
  
  /* Text Colors */
  --text-primary: #ecf0f1;
  --text-secondary: #bdc3c7;
  --text-muted: #7f8c8d;
  
  /* Accent Colors */
  --accent: #e74c3c;
  --accent-hover: #c0392b;
  --accent-glow: rgba(231, 76, 60, 0.2);
  
  /* Border & Shadow */
  --border-color: #3d566e;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --shadow-hover: rgba(0, 0, 0, 0.5);
  
  /* Legacy compatibility */
  --text: #bdc3c7;
  --text-h: #ecf0f1;
  --bg: #0f0f1a;
  --border: #3d566e;
  --code-bg: #1a252f;
  --accent-legacy: #e74c3c;
  --accent-bg: rgba(231, 76, 60, 0.15);
  --accent-border: rgba(231, 76, 60, 0.5);
  --social-bg: rgba(52, 73, 94, 0.5);
  --shadow: rgba(0, 0, 0, 0.3) 0 10px 15px -3px, rgba(0, 0, 0, 0.2) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: dark;
  color: var(--text);
  background: var(--bg-primary);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

body {
  margin: 0;
  background-color: var(--bg-primary);
}

#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: var(--bg-primary);
}
```

---

### 2. Update `frontend/src/styles/filter-controls.css`

Complete dark theme implementation:

```css
.filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px var(--shadow-color);
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 160px;
    flex: 1;
}

.filter-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.filter-select {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--bg-input);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-select:hover {
    border-color: var(--accent);
    background: var(--bg-hover);
}

.filter-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}

.filter-select option {
    background: var(--bg-input);
    color: var(--text-primary);
}

.reset-button {
    padding: 10px 24px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    height: fit-content;
    transition: all 0.2s ease;
    font-weight: 500;
}

.reset-button:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--shadow-color);
}

.reset-button:active {
    transform: translateY(0);
}

.reset-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Mobile */
@media (max-width: 768px) {
    .filter-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-group {
        width: 100%;
        min-width: auto;
    }

    .reset-button {
        width: 100%;
    }
}
```

---

### 3. Update `frontend/src/styles/movie-card.css`

Complete dark theme implementation:

```css
.movie-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    position: relative;
    z-index: 1;
}

.movie-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px var(--shadow-hover);
    border-color: var(--accent);
    z-index: 10;
}

.movie-poster-container {
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: var(--bg-input);
}

.movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster {
    transform: scale(1.05);
}

.movie-poster-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    background: var(--bg-input);
}

.movie-info {
    padding: 12px;
    background: var(--bg-card);
}

.movie-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.meta-item {
    font-size: 12px;
    color: var(--text-secondary);
}

/* Mobile */
@media (max-width: 768px) {
    .movie-poster-container {
        height: 200px;
    }
}
```

---

### 4. Update `frontend/src/styles/pagination.css`

Complete dark theme implementation:

```css
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 20px;
}

.page-button {
    padding: 8px 14px;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-primary);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    font-weight: 500;
}

.page-button:hover:not(:disabled) {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--shadow-color);
}

.page-button.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    box-shadow: 0 2px 4px var(--shadow-color);
}

.page-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-ellipsis {
    padding: 8px 4px;
    color: var(--text-muted);
}
```

---

### 5. Update `frontend/src/styles/navbar.css`

Minor adjustments for consistency (z-index fix already applied):

```css
.navbar {
    background-color: var(--navy-dark);
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.logo:hover {
    color: var(--accent);
}

.nav-links {
    display: flex;
    gap: 20px;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--accent);
}

/* Search bar container */
.search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Input */
.search-input {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    width: 300px;
    font-size: 14px;
    outline: none;
    background: var(--bg-input);
    color: var(--text-primary);
}

.search-input::placeholder {
    color: var(--text-muted);
}

.search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}

/* Button */
.search-button {
    padding: 8px 16px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.search-button:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
}
```

---

## Complete File Contents

### `frontend/src/index.css` (Full Updated File)

```css
:root {
  /* Dark Theme Colors - Matching Navbar #2c3e50 */
  --navy-dark: #2c3e50;
  --navy-darker: #1a252f;
  --navy-light: #34495e;
  --navy-lighter: #3d566e;
  
  /* Background Colors */
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: #2c3e50;
  --bg-input: #34495e;
  --bg-hover: #3d566e;
  
  /* Text Colors */
  --text-primary: #ecf0f1;
  --text-secondary: #bdc3c7;
  --text-muted: #7f8c8d;
  
  /* Accent Colors */
  --accent: #e74c3c;
  --accent-hover: #c0392b;
  --accent-glow: rgba(231, 76, 60, 0.2);
  
  /* Border & Shadow */
  --border-color: #3d566e;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --shadow-hover: rgba(0, 0, 0, 0.5);
  
  /* Legacy compatibility */
  --text: #bdc3c7;
  --text-h: #ecf0f1;
  --bg: #0f0f1a;
  --border: #3d566e;
  --code-bg: #1a252f;
  --accent-legacy: #e74c3c;
  --accent-bg: rgba(231, 76, 60, 0.15);
  --accent-border: rgba(231, 76, 60, 0.5);
  --social-bg: rgba(52, 73, 94, 0.5);
  --shadow: rgba(0, 0, 0, 0.3) 0 10px 15px -3px, rgba(0, 0, 0, 0.2) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: dark;
  color: var(--text);
  background: var(--bg-primary);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #bdc3c7;
    --text-h: #ecf0f1;
    --bg: #0f0f1a;
    --border: #3d566e;
    --code-bg: #1a252f;
    --accent: #e74c3c;
    --accent-bg: rgba(231, 76, 60, 0.15);
    --accent-border: rgba(231, 76, 60, 0.5);
    --social-bg: rgba(52, 73, 94, 0.5);
    --shadow: rgba(0, 0, 0, 0.3) 0 10px 15px -3px, rgba(0, 0, 0, 0.2) 0 4px 6px -2px;
  }
}

body {
  margin: 0;
  background-color: var(--bg-primary);
}

#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: var(--bg-primary);
}

h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}

h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}

p {
  margin: 0;
}

code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}

code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}
```

---

### `frontend/src/styles/filter-controls.css` (Full Updated File)

```css
.filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px var(--shadow-color);
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 160px;
    flex: 1;
}

.filter-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.filter-select {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--bg-input);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.filter-select:hover {
    border-color: var(--accent);
    background: var(--bg-hover);
}

.filter-select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}

.filter-select option {
    background: var(--bg-input);
    color: var(--text-primary);
}

.reset-button {
    padding: 10px 24px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    height: fit-content;
    transition: all 0.2s ease;
    font-weight: 500;
}

.reset-button:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--shadow-color);
}

.reset-button:active {
    transform: translateY(0);
}

.reset-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Mobile */
@media (max-width: 768px) {
    .filter-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-group {
        width: 100%;
        min-width: auto;
    }

    .reset-button {
        width: 100%;
    }
}
```

---

### `frontend/src/styles/movie-card.css` (Full Updated File)

```css
.movie-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    position: relative;
    z-index: 1;
}

.movie-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px var(--shadow-hover);
    border-color: var(--accent);
    z-index: 10;
}

.movie-poster-container {
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: var(--bg-input);
}

.movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster {
    transform: scale(1.05);
}

.movie-poster-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    background: var(--bg-input);
}

.movie-info {
    padding: 12px;
    background: var(--bg-card);
}

.movie-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 8px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.meta-item {
    font-size: 12px;
    color: var(--text-secondary);
}

/* Mobile */
@media (max-width: 768px) {
    .movie-poster-container {
        height: 200px;
    }
}
```

---

### `frontend/src/styles/pagination.css` (Full Updated File)

```css
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 20px;
}

.page-button {
    padding: 8px 14px;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-primary);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    font-weight: 500;
}

.page-button:hover:not(:disabled) {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--shadow-color);
}

.page-button.active {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
    box-shadow: 0 2px 4px var(--shadow-color);
}

.page-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-ellipsis {
    padding: 8px 4px;
    color: var(--text-muted);
}
```

---

### `frontend/src/styles/navbar.css` (Full Updated File)

```css
.navbar {
    background-color: var(--navy-dark);
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.logo:hover {
    color: var(--accent);
}

.nav-links {
    display: flex;
    gap: 20px;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--accent);
}

/* Search bar container */
.search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Input */
.search-input {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    width: 300px;
    font-size: 14px;
    outline: none;
    background: var(--bg-input);
    color: var(--text-primary);
}

.search-input::placeholder {
    color: var(--text-muted);
}

.search-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
}

/* Button */
.search-button {
    padding: 8px 16px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.search-button:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
}
```

---

## Summary of Changes

| File | Changes |
|------|---------|
| `index.css` | Added dark theme CSS variables, changed page background to `#0f0f1a` |
| `filter-controls.css` | Dark backgrounds (`#2c3e50`, `#34495e`), light text, red accent |
| `movie-card.css` | Dark card background (`#2c3e50`), light text, red hover border |
| `pagination.css` | Dark buttons (`#2c3e50`), light text, red active/hover state |
| `navbar.css` | CSS variables, consistent styling, dark search input |

## Visual Preview

### Before (Current)
```
┌─────────────────────────────────────────────────┐
│  🎬 MyMovie  [Search...]  Home Movies TV Genres │  ← Dark Blue (#2c3e50)
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Filter Controls (WHITE BACKGROUND)       │  │  ← Bright white, jarring
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐                       │
│  │Card │ │Card │ │Card │  (WHITE CARDS)        │  ← Bright white, jarring
│  └─────┘ └─────┘ └─────┘                       │
│                                                 │
│         [1] [2] [3]  (WHITE BUTTONS)            │  ← Bright white
└─────────────────────────────────────────────────┘
```

### After (Dark Theme)
```
┌─────────────────────────────────────────────────┐
│  🎬 MyMovie  [Search...]  Home Movies TV Genres │  ← Dark Blue (#2c3e50)
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Filter Controls (DARK #2c3e50)           │  │  ← Matches navbar
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐                       │
│  │Card │ │Card │ │Card │  (DARK #2c3e50)       │  ← Matches navbar
│  └─────┘ └─────┘ └─────┘                       │
│                                                 │
│         [1] [2] [3]  (DARK BUTTONS)             │  ← Consistent dark
└─────────────────────────────────────────────────┘
```

## Testing Steps

1. Start the frontend development server: `cd frontend && npm run dev`
2. Open the application in a browser
3. Verify the following:
   - Page background is dark (`#0f0f1a`)
   - Navigation bar remains `#2c3e50`
   - Filter controls have dark background matching navbar
   - Movie cards have dark background matching navbar
   - Pagination buttons have dark background
   - Text is readable (light colors on dark backgrounds)
   - Hover effects work with red accent color
   - All dropdown options are readable
4. Test on mobile viewport to ensure responsive styles work
5. Verify no white flashes or inconsistent colors

## Implementation Order

1. **First**: Update `index.css` with CSS variables (foundation)
2. **Second**: Update `navbar.css` (reference component)
3. **Third**: Update `filter-controls.css`
4. **Fourth**: Update `movie-card.css`
5. **Fifth**: Update `pagination.css`

This order ensures each component can use the CSS variables defined in `index.css`.