# Project Overview - Two Filter Pages

## Current State Analysis

### Existing Frontend
- **App.jsx**: Has routes for `/` (HomePage) and `/movie/:id` (MovieDetail)
- **NavigationBar.jsx**: Has navigation links for:
  - Home (`/`)
  - Movies (`/movie`)
  - TV Shows (`/tv`)
  - Genres (`/genres`)
- **myMovieApi.js**: Basic API utilities for fetching movies and posters

### Existing Backend
- **Filter endpoint**: `GET /movie/filter` with query parameters (sort, category, country, releaseYear, type, page, limit)
- **Country parameter**: Currently `@RequestParam` (already correct)
- **Response**: Paginated `Page<MovieResponse>` with content, totalElements, totalPages, size, number

### What's Missing
1. **No `/movie` filter page route** - NavigationBar links to `/movie` but no route exists in App.jsx
2. **No `/tv` filter page route** - NavigationBar links to `/tv` but no route exists in App.jsx
3. **No filter page components** - Need to create MovieFilterPage and TvFilterPage
4. **No filter state management** - Need hooks for filter logic

## Two Filter Pages Architecture

### Page 1: Movies Filter Page (`/movie`)
- **Route**: `/movie`
- **Purpose**: Filter and browse movies
- **Default type filter**: `type=movie` (episodeCount < 2)
- **URL params**: `?sort=&category=&country=&releaseYear=&type=movie&page=`

### Page 2: TV Shows Filter Page (`/tv`)
- **Route**: `/tv`
- **Purpose**: Filter and browse TV shows/series
- **Default type filter**: `type=series` (episodeCount > 1)
- **URL params**: `?sort=&category=&country=&releaseYear=&type=series&page=`

### Shared Components
Both pages share the same component structure:
- `FilterControls` - Dropdown controls for filtering
- `MovieGrid` - Grid display of results
- `Pagination` - Page navigation
- `MovieCard` - Individual item display

## Technical Requirements

### Frontend Stack
- React 18 with functional components
- React Router for routing and URL parameters
- CSS with design tokens for styling
- Custom hooks for state management

### API Integration
- Single backend endpoint: `GET /movie/filter`
- Query parameters: sort, category, category, country, releaseYear, type, page, limit
- Pagination: 10 items per page
- Debounced filter updates (300ms)

### Responsive Design
- Mobile-first approach
- 5 breakpoints: 640px, 768px, 1024px, 1280px
- Grid columns: 1 → 2 → 3 → 4 → 5 based on screen size

## Implementation Phases

### Phase 1: Foundation (Setup)
1. Create shared components folder structure
2. Create hooks folder for custom hooks
3. Update App.jsx with `/movie` and `/tv` routes
4. Fix NavigationBar handleSearch function (missing useNavigate)

### Phase 2: Core Components
1. Create `MovieFilterPage.jsx` - Main container for both pages
2. Create `FilterControls.jsx` - Filter dropdown container
3. Create `MovieGrid.jsx` - Grid layout component
4. Create `MovieCard.jsx` - Individual movie card
5. Create `Pagination.jsx` - Pagination controls

### Phase 3: State Management & API
1. Create `useMovieFilter.js` hook - Main filter logic
2. Create `useFilterParams.js` hook - URL parameter management
3. Update `myMovieApi.js` with filter API function
4. Connect components to API

### Phase 4: Styling
1. Create CSS files for each component
2. Implement responsive design
3. Add loading states and animations
4. Add error states

### Phase 5: Testing & Polish
1. Manual testing of filter functionality
2. Test pagination
3. Test responsive design
4. Test error handling

## File Structure Plan

```
frontend/src/
├── App.jsx                          # Add /movie and /tv routes
├── components/
│   ├── NavigationBar.jsx            # Fix handleSearch
│   ├── filter/
│   │   ├── MovieFilterPage.jsx      # Main filter page (reused for both routes)
│   │   ├── FilterControls.jsx       # Filter dropdowns
│   │   ├── MovieGrid.jsx            # Movie grid layout
│   │   ├── MovieCard.jsx            # Individual movie card
│   │   └── Pagination.jsx           # Pagination controls
│   └── ...
├── hooks/
│   ├── useMovieFilter.js            # Filter state and API logic
│   └── useFilterParams.js           # URL parameter management
├── services/
│   └── movieApi.js                  # API utilities (extend myMovieApi)
├── styles/
│   ├── filter-page.css              # Filter page styles
│   ├── filter-controls.css          # Filter controls styles
│   ├── movie-grid.css               # Grid styles
│   ├── movie-card.css               # Card styles
│   └── pagination.css               # Pagination styles
└── test/
    ├── HomePage.jsx                 # Existing
    ├── MovieDetail.jsx              # Existing
    └── myMovieApi.js                # Existing
```

## Key Differences Between Pages

| Aspect | Movies Page (`/movie`) | TV Shows Page (`/tv`) |
|--------|------------------------|------------------------|
| Route | `/movie` | `/tv` |
| Type Filter | `type=movie` | `type=series` |
| Page Title | "Movies" | "TV Shows" |
| Empty State | "No movies found" | "No TV shows found" |

Both pages use the same backend endpoint and component structure - only the default `type` parameter differs.