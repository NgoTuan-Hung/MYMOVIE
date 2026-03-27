# Testing and Deployment Plan

## Overview

This document outlines the comprehensive testing strategy and deployment plan for the movie filter page implementation. The plan covers unit testing, integration testing, end-to-end testing, and deployment procedures.

## Testing Strategy

### 1. Unit Testing

#### Component Testing
**Framework**: Jest + React Testing Library

**Test Files Structure**:
```
frontend/src/__tests__/
├── components/
│   ├── FilterPage.test.js
│   ├── FilterControls.test.js
│   ├── MovieGrid.test.js
│   ├── MovieCard.test.js
│   └── Pagination.test.js
├── hooks/
│   ├── useMovieFilter.test.js
│   ├── useFilterParams.test.js
│   └── useFilterOptions.test.js
└── services/
    └── movieApi.test.js
```

#### Example Component Tests

**File**: `frontend/src/__tests__/components/FilterControls.test.js`

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import FilterControls from '../../components/FilterControls';

describe('FilterControls', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnApplyFilters = jest.fn();

  const defaultProps = {
    filters: {
      sort: '',
      category: '',
      country: '',
      releaseYear: '',
      type: ''
    },
    onFilterChange: mockOnFilterChange,
    onApplyFilters: mockOnApplyFilters,
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all filter dropdowns', () => {
    render(<FilterControls {...defaultProps} />);
    
    expect(screen.getByLabelText(/sort/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/release year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  test('calls onFilterChange when dropdown value changes', () => {
    render(<FilterControls {...defaultProps} />);
    
    const sortSelect = screen.getByLabelText(/sort/i);
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('sort', 'name');
  });

  test('disables filter button when loading', () => {
    render(<FilterControls {...defaultProps} loading={true} />);
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeDisabled();
  });
});
```

#### Hook Testing

**File**: `frontend/src/__tests__/hooks/useMovieFilter.test.js`

```javascript
import { renderHook, act } from '@testing-library/react';
import { useMovieFilter } from '../../hooks/useMovieFilter';

// Mock the API
jest.mock('../../services/movieApi', () => ({
  movieApi: {
    fetchMoviesByFilter: jest.fn()
  }
}));

describe('useMovieFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useMovieFilter());
    
    expect(result.current.filters).toEqual({
      sort: '',
      category: '',
      country: '',
      releaseYear: '',
      type: ''
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.movies).toEqual([]);
  });

  test('updates filter when updateFilter is called', () => {
    const { result } = renderHook(() => useMovieFilter());
    
    act(() => {
      result.current.updateFilter('sort', 'name');
    });
    
    expect(result.current.filters.sort).toBe('name');
  });

  test('resets filters when resetFilters is called', () => {
    const { result } = renderHook(() => useMovieFilter({ type: 'movie' }));
    
    act(() => {
      result.current.updateFilter('sort', 'name');
      result.current.updateFilter('category', 'Action');
    });
    
    act(() => {
      result.current.resetFilters();
    });
    
    expect(result.current.filters).toEqual({
      sort: '',
      category: '',
      country: '',
      releaseYear: '',
      type: 'movie' // Should preserve type from initial
    });
  });
});
```

### 2. Integration Testing

#### API Integration Tests

**File**: `frontend/src/__tests__/services/movieApi.test.js`

```javascript
import { movieApi } from '../../services/movieApi';

// Mock fetch
global.fetch = jest.fn();

describe('movieApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchMoviesByFilter', () => {
    test('calls correct endpoint with filter parameters', async () => {
      const mockResponse = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const filters = {
        sort: 'name',
        category: 'Action',
        country: 'US',
        releaseYear: '2023',
        type: 'movie'
      };

      const result = await movieApi.fetchMoviesByFilter(filters, 0, 10);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/movie/filter?page=0&limit=10&sort=name&category=Action&country=US&releaseYear=2023&type=movie'
      );
      expect(result).toEqual(mockResponse);
    });

    test('throws error for failed requests', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(movieApi.fetchMoviesByFilter({})).rejects.toThrow('HTTP error! status: 500');
    });
  });
});
```

### 3. End-to-End Testing

#### E2E Test Structure
**Framework**: Cypress

**Test Files**:
```
cypress/
├── e2e/
│   ├── filter-page.cy.js
│   ├── filter-functionality.cy.js
│   └── pagination.cy.js
├── fixtures/
│   └── movies.json
└── support/
    ├── commands.js
    └── e2e.js
```

#### Example E2E Tests

**File**: `cypress/e2e/filter-page.cy.js`

```javascript
describe('Filter Page E2E', () => {
  beforeEach(() => {
    // Seed database or mock API responses
    cy.intercept('GET', '/movie/filter*', { fixture: 'movies.json' }).as('getMovies');
    cy.visit('/filter?type=movies');
  });

  it('loads filter page with correct initial state', () => {
    cy.wait('@getMovies');
    cy.get('[data-testid="filter-controls"]').should('be.visible');
    cy.get('[data-testid="movie-grid"]').should('be.visible');
    cy.get('[data-testid="pagination"]').should('be.visible');
  });

  it('applies filters and updates URL', () => {
    // Select sort option
    cy.get('[data-testid="sort-select"]').select('name');
    
    // Select category
    cy.get('[data-testid="category-select"]').select('Action');
    
    // Click filter button
    cy.get('[data-testid="apply-filters-btn"]').click();
    
    // Verify URL updated
    cy.url().should('include', 'sort=name');
    cy.url().should('include', 'category=Action');
    
    // Verify API called with correct parameters
    cy.wait('@getMovies').then((interception) => {
      expect(interception.request.url).to.include('sort=name');
      expect(interception.request.url).to.include('category=Action');
    });
  });

  it('handles pagination correctly', () => {
    cy.get('[data-testid="page-button"]').contains('2').click();
    cy.url().should('include', 'page=1');
    cy.wait('@getMovies');
  });

  it('displays error state for failed requests', () => {
    cy.intercept('GET', '/movie/filter*', { statusCode: 500 }).as('getMoviesError');
    cy.visit('/filter?type=movies');
    cy.wait('@getMoviesError');
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

### 4. Visual Regression Testing

#### Storybook Integration
**Purpose**: Component documentation and visual testing

**File**: `frontend/src/stories/FilterPage.stories.js`

```javascript
import FilterPage from '../components/FilterPage';

export default {
  title: 'Pages/FilterPage',
  component: FilterPage,
};

const Template = (args) => <FilterPage {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'movies'
};

export const WithFilters = Template.bind({});
WithFilters.args = {
  type: 'series',
  initialFilters: {
    sort: 'viewCount',
    category: 'Action',
    country: 'US'
  }
};

export const Loading = Template.bind({});
Loading.args = {
  type: 'movies',
  loading: true
};

export const Error = Template.bind({});
Error.args = {
  type: 'movies',
  error: 'Failed to load movies'
};
```

## Performance Testing

### 1. Load Testing
- Test with 100+ movies in grid
- Verify pagination performance
- Test filter response times

### 2. Bundle Size Analysis
- Monitor JavaScript bundle size
- Optimize image loading
- Implement code splitting

### 3. Accessibility Testing
- Run axe-core accessibility tests
- Test keyboard navigation
- Verify screen reader compatibility

## Deployment Strategy

### 1. Development Environment

#### Local Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run cypress:open
```

#### Environment Variables
```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_MOCK_API=false
VITE_DEBUG_MODE=true
```

### 2. Build Configuration

#### Vite Configuration
**File**: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

### 3. Production Deployment

#### Build Process
```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy to server
scp -r dist/* user@server:/var/www/mymovie/
```

#### Docker Configuration
**File**: `frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
**File**: `frontend/nginx.conf`

```nginx
server {
    listen 80;
    server_name mymovie.example.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### 4. CI/CD Pipeline

#### GitHub Actions Workflow
**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy Filter Page

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - run: npm ci
    - run: npm run lint
    - run: npm run test -- --coverage
    - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - run: npm ci
    - run: npm run build
    - run: npm run cypress:run
      env:
        CYPRESS_baseUrl: https://staging.mymovie.com

  deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    - uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: mymovie/filter-page:latest
```

### 5. Monitoring and Analytics

#### Error Tracking
- Integrate error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user interactions

#### Performance Monitoring
- Page load times
- Filter response times
- Bundle size tracking

## Rollback Strategy

### 1. Blue-Green Deployment
- Deploy to staging environment first
- Test thoroughly before production
- Quick rollback to previous version if issues

### 2. Feature Flags
- Implement feature flags for new functionality
- Gradual rollout to users
- Easy disable if problems occur

## Next Steps

The implementation plan is now complete. Proceed with the actual implementation following the detailed plans in each document:

1. [1-OVERVIEW.md](./1-OVERVIEW.md) - Project overview and goals
2. [2-COMPONENT-STRUCTURE.md](./2-COMPONENT-STRUCTURE.md) - Component architecture
3. [3-API-INTEGRATION.md](./3-API-INTEGRATION.md) - API integration strategy
4. [4-STYLING-LAYOUT.md](./4-STYLING-LAYOUT.md) - Styling and layout plan
5. [5-STATE-MANAGEMENT.md](./5-STATE-MANAGEMENT.md) - State management strategy
6. [6-TESTING-DEPLOYMENT.md](./6-TESTING-DEPLOYMENT.md) - Testing and deployment plan

Each document provides detailed implementation guidance for building a robust, scalable, and user-friendly movie filter page.