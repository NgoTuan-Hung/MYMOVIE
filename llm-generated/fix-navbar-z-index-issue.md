# Fix: Hovered Movie Card Overlapping Navigation Bar

## Problem Description

When hovering over a movie card that is positioned near the navigation bar, the hovered card overlaps the navigation bar. The visual stacking order changes from `nav > card` to `card > nav` after hovering, which is incorrect behavior.

## Root Cause Analysis

The issue is caused by CSS stacking context behavior:

1. **NavigationBar** (`navbar.css`): The navbar has `position: sticky` but **no `z-index`** defined. This means it relies on the default stacking order.

2. **Movie Card** (`movie-card.css`): On hover, the card applies `transform: translateY(-4px)` and `box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1)`. The `transform` property creates a **new stacking context**, which can cause the hovered card to appear above elements that should be on top.

3. **Stacking Context Conflict**: Without an explicit `z-index` on the navbar, the browser's default stacking order allows the transformed (hovered) card to render above the sticky navbar.

## Solution

The fix requires adding explicit `z-index` values to ensure the navigation bar always stays above movie cards, regardless of hover state.

### Files to Modify

1. `frontend/src/styles/navbar.css` - Add `z-index` to navbar
2. `frontend/src/styles/movie-card.css` - Ensure cards don't create conflicting stacking contexts

---

## Detailed Code Changes

### 1. Fix `frontend/src/styles/navbar.css`

Add `z-index: 1000` to the `.navbar` class to ensure it always stays on top of page content:

```css
.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;  /* ADD THIS LINE */
}
```

**Why z-index 1000?** This is a common convention that provides plenty of room for other elements to have lower z-index values while ensuring the navbar stays on top. Values like 100, 999, or 1000 are all acceptable.

### 2. Fix `frontend/src/styles/movie-card.css`

Add a `position` and `z-index` to the movie card to ensure it stays below the navbar:

```css
.movie-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;  /* ADD THIS LINE */
    z-index: 1;          /* ADD THIS LINE */
}

.movie-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;         /* ADD THIS LINE - keeps hover state below navbar */
}
```

**Why these values?**
- `position: relative` enables z-index to work on the card
- `z-index: 1` keeps the card at a low stacking level by default
- `z-index: 10` on hover allows the card to rise above other cards but still stay well below the navbar (z-index: 1000)

---

## Complete Updated Files

### Updated `frontend/src/styles/navbar.css`

```css
.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 24px;
    font-weight: bold;
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
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
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
    border: none;
    width: 300px;
    font-size: 14px;
    outline: none;
}

/* Button */
.search-button {
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.search-button:hover {
    background-color: #2980b9;
}
```

### Updated `frontend/src/styles/movie-card.css`

```css
.movie-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    z-index: 1;
}

.movie-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.movie-poster-container {
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: #f5f5f5;
}

.movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.movie-poster-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    background: #e0e0e0;
}

.movie-info {
    padding: 12px;
}

.movie-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
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
    color: #666;
}

/* Mobile */
@media (max-width: 768px) {
    .movie-poster-container {
        height: 200px;
    }
}
```

---

## Summary of Changes

| File | Property Added | Value | Purpose |
|------|---------------|-------|---------|
| `navbar.css` `.navbar` | `z-index` | `1000` | Ensures navbar always stays on top |
| `movie-card.css` `.movie-card` | `position` | `relative` | Enables z-index on card |
| `movie-card.css` `.movie-card` | `z-index` | `1` | Sets default low stacking level |
| `movie-card.css` `.movie-card:hover` | `z-index` | `10` | Allows hover effect above other cards but below navbar |

## Testing Steps

1. Start the frontend development server
2. Navigate to a page with movie cards (e.g., `/movie`)
3. Scroll so that some movie cards are positioned near/under the navigation bar
4. Hover over a movie card that is close to the navigation bar
5. **Expected Result**: The hovered card should animate upward but remain **below** the navigation bar
6. **Verify**: The navbar should always be visible and not be overlapped by any hovered card

## Alternative Approaches (Not Recommended)

1. **Using `pointer-events: none` on hover**: This would prevent interaction but breaks the hover effect entirely.

2. **Adding `overflow: hidden` to a parent container**: This could clip the hover animation and create visual issues.

3. **Using `position: fixed` instead of `sticky`**: This changes the navbar behavior and may cause layout issues.

The z-index approach is the cleanest and most maintainable solution.