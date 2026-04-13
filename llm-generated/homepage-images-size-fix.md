# Homepage Images Size Fix

## Problem

The movie poster images on the homepage appear too small. The root cause is the `.movie-poster-container` in `movie-card.css` has a fixed `height: 280px`, which combined with the 5-column grid layout (`grid-template-columns: repeat(5, 1fr)`) and the `#root` container max-width of `1126px`, results in narrow cards and small poster images.

## Root Cause Analysis

| Factor | Current Value | Impact |
|--------|---------------|--------|
| Grid columns | `repeat(5, 1fr)` | 5 columns squeeze each card to ~200px wide |
| Poster height | `280px` fixed | Posters are short relative to card width |
| `#root` max-width | `1126px` | Limits total available horizontal space |
| Container padding | `padding: 20px` on `.filter-page` | Further reduces usable width |

With 5 columns at ~1126px container width (minus padding), each card is roughly `(1126 - 40) / 5 ≈ 217px` wide, making posters appear small.

## Solution

Apply changes across **two files** to make images noticeably larger:

### 1. `frontend/src/styles/movie-grid.css` — Reduce columns for better image prominence

Change from 5 columns to 4 columns on desktop, and adjust breakpoints accordingly.

**Before:**
```css
.movie-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-bottom: 32px;
}

/* Tablet */
@media (max-width: 1024px) {
    .movie-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Small tablet */
@media (max-width: 768px) {
    .movie-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Mobile */
@media (max-width: 480px) {
    .movie-grid {
        grid-template-columns: 1fr;
    }
}
```

**After:**
```css
.movie-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
}

/* Tablet */
@media (max-width: 1024px) {
    .movie-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }
}

/* Small tablet */
@media (max-width: 768px) {
    .movie-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .movie-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}
```

**Key changes:**
- Desktop: `repeat(5, 1fr)` → `repeat(4, 1fr)` — each card gets ~25% more width
- Gap: `20px` → `24px` on desktop for better visual breathing room between larger cards

### 2. `frontend/src/styles/movie-card.css` — Increase poster height

Increase the poster container height to match the wider cards and create a more cinematic feel.

**Before:**
```css
.movie-poster-container {
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: var(--bg-input);
}
```

**After:**
```css
.movie-poster-container {
    width: 100%;
    height: 380px;
    overflow: hidden;
    background: var(--bg-input);
}
```

**Mobile breakpoint update — Before:**
```css
/* Mobile */
@media (max-width: 768px) {
    .movie-poster-container {
        height: 200px;
    }
}
```

**Mobile breakpoint update — After:**
```css
/* Mobile */
@media (max-width: 768px) {
    .movie-poster-container {
        height: 280px;
    }
}
```

**Key changes:**
- Desktop poster height: `280px` → `380px` (+100px, ~36% taller)
- Mobile poster height: `200px` → `280px` (+80px, ~40% taller)

## Expected Result

With these changes:
- Each card will be ~27% wider on desktop (4 columns instead of 5)
- Posters will be ~36% taller (380px vs 280px)
- Combined, the poster image area will be roughly **75% larger** in total pixel area
- The homepage will have a more visually impactful, cinematic presentation

## Files to Modify

| File | Change |
|------|--------|
| `frontend/src/styles/movie-grid.css` | Change grid from 5 to 4 columns, increase gap to 24px |
| `frontend/src/styles/movie-card.css` | Increase poster height from 280px to 380px (desktop), 200px to 280px (mobile) |

## No Changes Needed

- `frontend/src/pages/HomePage.jsx` — No changes needed, the component structure is fine
- `frontend/src/components/filter/MovieGrid.jsx` — No changes needed
- `frontend/src/components/filter/MovieCard.jsx` — No changes needed, already uses `width: 100%` and `object-fit: cover`
