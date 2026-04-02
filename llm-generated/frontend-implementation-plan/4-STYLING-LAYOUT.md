# Styling and Layout Plan

## Overview

This document details the styling strategy and layout implementation for the movie filter page. The design will be responsive, modern, and consistent with the existing application aesthetic.

## Design System

### Color Palette
Based on existing application colors and modern UI trends:

```css
:root {
  /* Primary Colors */
  --primary-color: #d32f2f;        /* Red for accents and highlights */
  --primary-hover: #b71c1c;        /* Darker red for hover states */
  
  /* Background Colors */
  --bg-body: #f5f5f5;              /* Light gray for page background */
  --bg-card: #ffffff;              /* White for cards and containers */
  --bg-header: #ffffff;            /* White for header/navigation */
  
  /* Text Colors */
  --text-primary: #333333;         /* Dark gray for main text */
  --text-secondary: #666666;       /* Medium gray for secondary text */
  --text-muted: #999999;           /* Light gray for muted text */
  
  /* Border and Divider Colors */
  --border-color: #e0e0e0;         /* Light gray for borders */
  --divider-color: #eeeeee;        /* Very light gray for dividers */
  
  /* Status Colors */
  --success-color: #4caf50;        /* Green for success states */
  --error-color: #f44336;          /* Red for error states */
  --warning-color: #ff9800;        /* Orange for warning states */
}
```

### Typography
```css
:root {
  /* Font Families */
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;              /* 12px */
  --text-sm: 0.875rem;             /* 14px */
  --text-base: 1rem;               /* 16px */
  --text-lg: 1.125rem;             /* 18px */
  --text-xl: 1.25rem;              /* 20px */
  --text-2xl: 1.5rem;              /* 24px */
  --text-3xl: 1.875rem;            /* 30px */
  --text-4xl: 2.25rem;             /* 36px */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing Scale
```css
:root {
  /* Spacing Scale */
  --space-1: 0.25rem;              /* 4px */
  --space-2: 0.5rem;               /* 8px */
  --space-3: 0.75rem;              /* 12px */
  --space-4: 1rem;                 /* 16px */
  --space-5: 1.25rem;              /* 20px */
  --space-6: 1.5rem;               /* 24px */
  --space-8: 2rem;                 /* 32px */
  --space-10: 2.5rem;              /* 40px */
  --space-12: 3rem;                /* 48px */
  --space-16: 4rem;                /* 64px */
}
```

### Shadows and Effects
```css
:root {
  /* Shadow Scale */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Border Radius */
  --radius-sm: 0.25rem;            /* 4px */
  --radius-md: 0.375rem;           /* 6px */
  --radius-lg: 0.5rem;             /* 8px */
  --radius-xl: 0.75rem;            /* 12px */
  --radius-2xl: 1rem;              /* 16px */
}
```

## Layout Structure

### 1. Filter Page Layout

```css
/* FilterPage.css */
.filter-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
}

.filter-controls {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
}
```

### 2. Filter Controls Styling

```css
/* FilterControls.css */
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 200px;
}

.filter-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--bg-body);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: var(--primary-color);
  background: var(--bg-card);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.filter-button {
  margin-left: auto;
  padding: var(--space-3) var(--space-6);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-button:hover {
  background: var(--primary-hover);
}

.filter-button:disabled {
  background: var(--text-muted);
  cursor: not-allowed;
}
```

### 3. Movie Grid and Card Styling

```css
/* MovieGrid.css */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-6);
}

.movie-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
  background: var(--bg-body);
}

.movie-info {
  padding: var(--space-4);
}

.movie-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
}

.meta-item {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.movie-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Loading States */
.movie-card.skeleton {
  animation: shimmer 1.5s infinite ease-in-out;
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
```

### 4. Pagination Styling

```css
/* Pagination.css */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
}

.page-button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.page-button:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-button.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--bg-body);
  border-color: var(--border-color);
}

.page-ellipsis {
  padding: var(--space-2) var(--space-4);
  color: var(--text-secondary);
  font-weight: var(--font-semibold);
}
```

## Responsive Design

### 1. Breakpoints

```css
/* Responsive breakpoints */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Mobile First Approach */
.movie-grid {
  grid-template-columns: 1fr;
}

/* Small tablets */
@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-controls {
    gap: var(--space-3);
  }
}

/* Tablets */
@media (min-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .filter-group {
    min-width: 160px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .filter-controls {
    gap: var(--space-4);
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .movie-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .filter-page {
    padding: var(--space-8);
  }
}
```

### 2. Mobile Optimizations

```css
/* Mobile-specific styles */
@media (max-width: 640px) {
  .filter-page {
    padding: var(--space-4);
  }
  
  .filter-controls {
    padding: var(--space-4);
  }
  
  .filter-group {
    width: 100%;
    min-width: auto;
  }
  
  .filter-button {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }
  
  .movie-grid {
    gap: var(--space-4);
  }
  
  .movie-poster {
    height: 200px;
  }
  
  .movie-info {
    padding: var(--space-3);
  }
}
```

## Animation and Interaction

### 1. Micro-Interactions

```css
/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease;
}

/* Hover effects */
.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.filter-select:hover {
  border-color: var(--primary-color);
  background: var(--bg-card);
}

/* Loading animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.movie-card {
  animation: fadeIn 0.3s ease-out;
}

/* Skeleton loading */
.skeleton-loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### 2. Focus States

```css
/* Accessibility focus states */
.filter-select:focus,
.page-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Skip link for keyboard navigation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  z-index: 100;
  text-decoration: none;
  border-radius: var(--radius-md);
}

.skip-link:focus {
  top: 6px;
}
```

## CSS Architecture

### 1. File Organization

```
frontend/src/styles/
├── globals.css              # Global styles and CSS reset
├── variables.css            # CSS custom properties (design tokens)
├── components/
│   ├── filter-page.css      # Filter page specific styles
│   ├── filter-controls.css  # Filter controls styles
│   ├── movie-grid.css       # Movie grid and card styles
│   └── pagination.css       # Pagination styles
└── utilities/
    ├── responsive.css       # Media queries and responsive utilities
    ├── animations.css       # Animation keyframes and transitions
    └── accessibility.css    # Accessibility enhancements
```

### 2. CSS-in-JS Approach

For React components, we'll use styled-components or CSS modules for better encapsulation:

```javascript
// FilterControls.jsx
import styled from 'styled-components';

const FilterContainer = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-md);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 200px;
`;
```

## Next Steps

Proceed to [5-STATE-MANAGEMENT.md](./5-STATE-MANAGEMENT.md) for detailed state management implementation plan.