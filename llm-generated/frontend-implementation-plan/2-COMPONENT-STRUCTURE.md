# Component Structure Plan

## Overview

This document details the component architecture for the TWO filter pages implementation. Both pages share the same components but with different default type parameters.

## Two Filter Pages

### Page 1: Movies Filter Page
- **Route**: `/movie`
- **Component**: `MovieFilterPage` with `defaultType="movie"`
- **Purpose**: Filter and browse movies (episodeCount < 2)

### Page 2: TV Shows Filter Page
- **Route**: `/tv`
- **Component**: `MovieFilterPage` with `defaultType="series"`
- **Purpose**: Filter and browse TV shows/series (episodeCount > 1)

## Component Hierarchy

```
App.jsx
├── Route: /movie → MovieFilterPage(defaultType="movie")
└── Route: /tv → MovieFilterPage(defaultType="series")

MovieFilterPage (Main Container - reused for both pages)
├── FilterControls (Filter Controls Section)
│   ├── SortDropdown
│   ├── CategoryDropdown
│   ├── CountryDropdown
│   ├── ReleaseYearDropdown
│   └── FilterButton
├── MovieGrid (Content Display)
│   └── MovieCard (Individual Movie Item)
└── Pagination (Navigation Controls)
```

## Component Breakdown

### 1. MovieFilterPage.jsx (Main Container - Reused for both pages)

**Purpose**: Main container component that orchestrates the filter page functionality. This single component is used for BOTH `/movie` and `/tv` routes.

**Props**:
- `defaultType`: `"movie"` or `"series"` - determines the default type filter

**Usage in App.jsx**:
```jsx
<Route path="/movie" element={<MovieFilterPage defaultType="movie" />} />
<Route path="/tv" element={<MovieFilterPage defaultType="series" />} />
```

**State Management**:
- Filter parameters (sort, category, country, releaseYear, type)
- Current page number
- Loading state
- Error state
- Movie data

**Key Functions**:
- Initialize filters from URL parameters and defaultType prop
- Handle filter changes
- Fetch movies from API
- Manage pagination
- Handle loading and error states

**API Integration**:
- GET `/movie/filter` with query parameters
- Support for pagination (page, limit)
- Error handling for failed requests

**Page Titles**:
- When `defaultType="movie"`: Display "Movies"
- When `defaultType="series"`: Display "TV Shows"

### 2. FilterControls.jsx

**Purpose**: Container for all filter dropdowns and controls

**Props**:
- `filters`: Current filter values
- `onFilterChange`: Callback for filter updates
- `onApplyFilters`: Callback for applying filters
- `loading`: Boolean for loading state

**Child Components**:
- SortDropdown
- CategoryDropdown
- CountryDropdown
- ReleaseYearDropdown
- TypeDropdown
- FilterButton

**Layout**: Horizontal layout with dropdowns and apply button

### 3. Individual Dropdown Components

#### SortDropdown
**Options**: 
- "name" (Sort by name A-Z)
- "viewCount" (Sort by view count descending)

#### CategoryDropdown
**Options**: Dynamic from API (Action, Comedy, Drama, etc.)

#### CountryDropdown
**Options**: Dynamic from API (US, UK, Japan, etc.)

#### ReleaseYearDropdown
**Options**: Dynamic range from database (e.g., 2020, 2019, 2018...)

#### TypeDropdown
**Options**:
- "movie" (episodeCount < 2)
- "series" (episodeCount > 1)

### 4. MovieGrid.jsx

**Purpose**: Grid layout for displaying movie cards

**Props**:
- `movies`: Array of MovieResponse objects
- `loading`: Boolean for loading state

**Layout**: Responsive grid (5 columns on desktop, 3 on tablet, 2 on small tablet, 1 on mobile)

**Features**:
- Loading skeleton states
- Empty state handling
- Click to navigate to movie detail

### 5. MovieCard.jsx

**Purpose**: Individual movie display component

**Props**: `movie` (MovieResponse object)

**Display Elements**:
- Poster image (with getPosterUrl function)
- Display name
- Release year
- Duration
- Episode count (for series)

**Styling**: Card layout with hover effects

### 6. Pagination.jsx

**Purpose**: Pagination controls

**Props**:
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `onPageChange`: Callback for page navigation
- `loading`: Boolean for loading state

**Features**:
- Previous/Next buttons
- Page number buttons (with ellipsis for long lists)
- Disabled states for current page

## Data Flow

1. **URL Parameters** → FilterPage (initialization)
2. **User Filter Changes** → FilterControls → FilterPage (state update)
3. **FilterPage** → API Call → Backend
4. **Backend Response** → FilterPage → MovieGrid
5. **Pagination Clicks** → FilterPage → API Call → MovieGrid

## State Management Strategy

### Local State (useState)
- Filter parameters
- Current page
- Loading states
- Error states

### URL State (React Router)
- Filter parameters in query string
- Page number
- Type parameter (movies/series)

### API State Management
- Custom hook `useMovieFilter` for API calls
- Debounced filter updates to prevent excessive API calls
- Caching for dropdown options

## Error Handling

### API Errors
- Network failures
- Invalid filter parameters
- Server errors

### UI States
- Loading spinners
- Error messages
- Empty results display
- Retry functionality

## Performance Considerations

### Optimization Strategies
- Debounced filter updates (300ms delay)
- Memoized API calls with useMemo
- Virtualization for long lists (if needed)
- Image lazy loading for movie posters

### Responsive Design
- CSS Grid for flexible layouts
- Media queries for different screen sizes
- Touch-friendly controls for mobile

## Next Steps

Proceed to [3-API-INTEGRATION.md](./3-API-INTEGRATION.md) for detailed API integration plan and implementation.