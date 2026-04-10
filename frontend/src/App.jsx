import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import MovieDetail from "./pages/MovieDetail";
import MovieFilterPage from "./components/filter/MovieFilterPage";
import MovieWatchPage from "./pages/MovieWatchPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <NavigationBar />
          <main style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/movie" element={<MovieFilterPage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/movie/:id/watch" element={<MovieWatchPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;