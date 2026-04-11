# Admin Movie Management - Implementation Plan

## 1. Backend Issues Analysis

### 1.1 AdminController Issues

| Issue | Location | Problem | Severity |
|-------|----------|---------|----------|
| `@PreAuthorize` missing | AdminController.java:32 | No security annotation on class or methods | High |
| UserRepository unused injection | AdminController.java:33 | Injected but only used in `/users` endpoint without proper authorization | Medium |
| Incomplete `getStats` | AdminController.java:42 | Returns empty response `ResponseEntity.ok().build()` | Medium |
| No error handling | Entire controller | No `@ControllerAdvice` or exception handling | Medium |

### 1.2 MyMovieService Issues

| Issue | Location | Problem | Severity |
|-------|----------|---------|----------|
| Duplicate methods | MyMovieService.java:60-79 | `createMovie(String, String, ...)` overlaps with `createMovie(CreateMovieRequest)` | Medium |
| System.out.println | MyMovieService.java:82 | Debug logging using `System.out.println` instead of proper logger | Low |
| Lazy loading in update | MyMovieService.java:150 | Uses `findMovieByIdLazy` but update needs fetch to verify existence | Low |
| Empty comment block | MyMovieService.java:187-193 | Incomplete comment explains nothing | Low |

### 1.3 Redundant Code

1. **Two createMovie methods** - Should consolidate to use `CreateMovieRequest` only
2. **UserRepository in AdminController** - Unused for movie management, only in unused endpoint
3. **Duplicate `getMovieById`** - Regular and Admin versions exist (acceptable for different responses)

---

## 2. Frontend Implementation Plan

### 2.1 Project Structure

```
frontend/src/
├── components/
│   └── admin/
│       ├── MovieTable.jsx         # Table component for movie list
│       ├── MovieFormModal.jsx     # Create/Update modal form
│       └── Pagination.jsx         # Reusable pagination
├── pages/
│   └── AdminPage.jsx              # Main admin page with tabs
└── services/
    └── api.js                     # API calls
```

### 2.2 API Endpoints to Call

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/movies?page=0&size=20&sort=id` | List movies with pagination |
| GET | `/api/admin/movies/{id}` | Get single movie details |
| POST | `/api/admin/movies` | Create new movie |
| PUT | `/api/admin/movies/{id}` | Update existing movie |
| DELETE | `/api/admin/movies/{id}` | Delete movie |

### 2.3 Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Header: Admin Dashboard] [Logout Button]                 │
├─────────────────────────────────────────────────────────────┤
│  [Stats Cards: Total Movies | Users | Views]               │
├─────────────────────────────────────────────────────────────┤
│  [Tab: Movie Management] [Tab: User Management] [Tab: ⚙️]  │
├─────────────────────────────────────────────────────────────┤
│  [Search Bar] [+ Add Movie Button]                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ID │ Title │ Year │ Status │ Episodes │ Actions    │   │
│  ├────┼───────┼──────┼─────────┼──────────┼────────────┤   │
│  │ 1  │ Movie1│ 2024 │ RELEASED│ 12       │ [👁][✏️][📁][🗑]│   │
│  │ 2  │ Movie2│ 2023 │ RELEASED│ 1        │ [👁][✏️][📁][🗑]│   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  [◀ Prev] Page 1 of 10 [Next ▶]                            │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 Button Actions

| Button | Icon | Action | Confirmation |
|--------|------|--------|--------------|
| Info | 👁 | Navigate to `/movie/{id}` (public page) | No |
| Update | ✏️ | Open edit modal | No |
| File | 📁 | Placeholder - alert "Coming soon" | No |
| Delete | 🗑️ | Confirm dialog then call DELETE API | Yes |

### 2.5 Component Details

#### MovieTable.jsx
- Render table with columns: ID, Title, Release Year, Status, Episodes, Actions
- Status badge with color coding (RELEASED=green, COMING_SOON=orange, UNPUBLISHED=gray)
- Action buttons row with fixed order: Info, Update, File, Delete

#### MovieFormModal.jsx
- Fields: Original Name, Display Name, Release Year, Duration, Status (dropdown), Episode Count, Poster URL
- For create: show empty form
- For update: pre-fill with existing data
- Submit calls appropriate API endpoint

#### Pagination
- Display: "Page X of Y"
- Controls: Previous, Next, or page numbers
- Props: currentPage, totalPages, onPageChange

### 2.6 State Management

```jsx
// AdminPage.jsx state structure
const [movies, setMovies] = useState([]);        // Movie list
const [currentPage, setCurrentPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [showModal, setShowModal] = useState(false);
const [editingMovie, setEditingMovie] = useState(null);
```

---

## 3. Implementation Steps

### Step 1: Create API Service
**File:** `frontend/src/services/api.js`
```javascript
import axios from 'axios';

const API_BASE = '/api/admin';

export const adminApi = {
  getMovies: (page = 0, size = 20, sort = 'id') =>
    axios.get(`${API_BASE}/movies`, { params: { page, size, sort } }),
  
  getMovie: (id) => axios.get(`${API_BASE}/movies/${id}`),
  
  createMovie: (data) => axios.post(`${API_BASE}/movies`, data),
  
  updateMovie: (id, data) => axios.put(`${API_BASE}/movies/${id}`, data),
  
  deleteMovie: (id) => axios.delete(`${API_BASE}/movies/${id}`),
};
```

### Step 2: Create MovieTable Component
**File:** `frontend/src/components/admin/MovieTable.jsx`
- Display movies in table format
- Handle action button clicks via props
- Apply proper styling

### Step 3: Create MovieFormModal Component
**File:** `frontend/src/components/admin/MovieFormModal.jsx`
- Form for create/update
- Use existing DTO structure for validation
- Handle form submission

### Step 4: Update AdminPage
**File:** `frontend/src/pages/AdminPage.jsx`
- Add movie management tab
- Integrate MovieTable and MovieFormModal
- Handle pagination
- Add loading/error states

### Step 5: Reuse Pagination Component
In AdminPage.jsx, import existing Pagination:
```jsx
import Pagination from '../components/filter/Pagination';
```

### Step 6: Add Styles
**File:** `frontend/src/styles/admin-movie.css`
- Table styling
- Modal styling
- Button styling
- Status badge colors

---

## 4. Code Changes Summary

### Backend (Reference Only - Do Not Modify)
- No backend changes required for this task
- Note: Consider adding `@PreAuthorize("hasRole('ADMIN')")` to AdminController in future

### Frontend Files to Create
| File | Action |
|------|--------|
| `frontend/src/services/api.js` | Create |
| `frontend/src/components/admin/MovieTable.jsx` | Create |
| `frontend/src/components/admin/MovieFormModal.jsx` | Create |
| `frontend/src/styles/admin-movie.css` | Create |

### Frontend Files to Reuse
| File | Reason |
|------|--------|
| `frontend/src/components/filter/Pagination.jsx` | Already generic - props: `currentPage`, `totalPages`, `onPageChange` |

> **Refactoring Note:** Move `Pagination.jsx` from `components/filter/` to `components/common/` for better code organization. Currently misplaced in filter folder. |

### Frontend Files to Modify
| File | Changes |
|------|---------|
| `frontend/src/pages/AdminPage.jsx` | Add movie management tab, integrate components |
| `frontend/src/App.jsx` | Add routes for movie modals if needed |

---

## 5. Next Steps After Implementation

1. **Add file management** - Implement the file button placeholder
2. **Add user management tab** - Use existing `/api/admin/users` endpoint
3. **Add stats endpoint** - Backend currently returns empty for stats
4. **Security** - Add proper authentication header to API calls