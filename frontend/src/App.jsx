import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./test/HomePage";
import MovieDetail from "./test/MovieDetail";
import MovieFilterPage from "./components/filter/MovieFilterPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavigationBar />
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie" element={<MovieFilterPage defaultType="movie" />} />
            <Route path="/tv" element={<MovieFilterPage defaultType="series" />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;
