# Testing and Deployment Plan

## Overview

Simple, practical testing for the two filter pages. No complex frameworks or CI/CD pipelines - just straightforward manual testing and basic verification.

## Testing Strategy

### 1. Manual Testing (Primary Method)

This is the main testing approach. Run the app and test in the browser.

#### Prerequisites
```bash
# Terminal 1: Start backend
cd c:\Users\ADMIN88\Desktop\temp\Project Files\java\mymovie
mvnw spring-boot:run

# Terminal 2: Start frontend
cd c:\Users\ADMIN88\Desktop\temp\Project Files\java\mymovie\frontend
npm run dev
```

#### Test Checklist

**Test 1: Movies Page Loads**
1. Open browser to `http://localhost:5173/movie`
2. Verify page title shows "Movies"
3. Verify movie grid displays results
4. Verify pagination shows at bottom

**Test 2: TV Shows Page Loads**
1. Open browser to `http://localhost:5173/tv`
2. Verify page title shows "TV Shows"
3. Verify TV shows grid displays results
4. Verify pagination shows at bottom

**Test 3: Filter by Sort**
1. Go to `/movie`
2. Change sort dropdown to "Name (A-Z)"
3. Verify results are sorted by name
4. Change sort to "Most Popular"
5. Verify results are sorted by view count

**Test 4: Filter by Category**
1. Go to `/movie`
2. Select a category (e.g., "Action")
3. Verify only Action movies are shown
4. Clear the category filter
5. Verify all movies are shown again

**Test 5: Filter by Country**
1. Go to `/movie`
2. Select a country (e.g., "US")
3. Verify only US movies are shown

**Test 6: Filter by Release Year**
1. Go to `/movie`
2. Select a year (e.g., "2024")
3. Verify only 2024 movies are shown

**Test 7: Pagination**
1. Go to `/movie`
2. Click "Next" or page "2"
3. Verify different results are shown
4. Click "Previous"
5. Verify first page results return

**Test 8: Reset Filters**
1. Apply multiple filters (sort, category, country)
2. Click "Reset" button
3. Verify all filters are cleared
4. Verify results return to default

**Test 9: Navigation Between Pages**
1. Go to `/movie`
2. Click "TV Shows" in navigation
3. Verify URL changes to `/tv`
4. Verify TV shows are displayed
5. Click "Movies" in navigation
6. Verify URL changes to `/movie`

**Test 10: Error Handling**
1. Stop the backend server
2. Refresh `/movie` page
3. Verify error message is displayed
4. Restart backend and verify retry works

**Test 11: Responsive Design**
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Test on mobile view (375px width)
4. Test on tablet view (768px width)
5. Test on desktop view (1280px width)
6. Verify grid adjusts correctly (1 → 2 → 3 → 4 → 5 columns)

**Test 12: Loading State**
1. In DevTools Network tab, set "Slow 3G" throttling
2. Refresh `/movie` page
3. Verify loading spinner appears
4. Verify results load after delay

### 2. Quick Console Test (API Verification)

Open browser console on `/movie` page and run:

```javascript
// Test API call directly
fetch('http://localhost:8080/movie/filter?type=movie&page=0&limit=10')
  .then(res => res.json())
  .then(data => console.log('Movies:', data))
  .catch(err => console.error('Error:', err));

// Test TV shows API call
fetch('http://localhost:8080/movie/filter?type=series&page=0&limit=10')
  .then(res => res.json())
  .then(data => console.log('TV Shows:', data))
  .catch(err => console.error('Error:', err));
```

Expected: Both should return paginated results with `content` array.

### 3. Visual Check

Verify these visual elements:
- [ ] Navigation bar shows current page highlight
- [ ] Filter dropdowns are aligned horizontally
- [ ] Movie cards show poster, title, year
- [ ] Pagination is centered at bottom
- [ ] Hover effects work on movie cards
- [ ] Loading spinner appears during fetch

## Deployment

### Build for Production

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/` folder.

### Serve Production Build

```bash
cd frontend
npm run preview
```

This serves the built files locally for verification.

### Deploy to Server

Copy `frontend/dist/` contents to your web server's public folder.

## Common Issues and Fixes

| Issue | Fix |
|-------|-----|
| CORS error | Add `@CrossOrigin` to backend controller |
| Blank page | Check console for errors, verify API URL |
| No results | Check backend is running, verify database has data |
| Filters not working | Check Network tab for API call parameters |
| Images not loading | Verify `getPosterUrl` returns correct URL |

## Next Steps

After testing is complete:
1. Review all test checklist items
2. Fix any issues found
3. Build for production
4. Deploy to server