package com.example.mymovie.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mymovie.DTO.DetailMovieResponse;
import com.example.mymovie.DTO.MovieResponse;
import com.example.mymovie.Service.MyMovieService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/movie")
@AllArgsConstructor
public class MovieController {
    private final MyMovieService movieService;

    @GetMapping
    public List<MovieResponse> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetailMovieResponse> getMovie(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @GetMapping("/hot")
    public List<MovieResponse> getHotMovies(@RequestParam(defaultValue = "10") int limit) {
        return movieService.getHotMovies(limit);
    }
}
