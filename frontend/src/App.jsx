import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieList from "./test/MovieList";
import MovieDetail from "./test/MovieDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;