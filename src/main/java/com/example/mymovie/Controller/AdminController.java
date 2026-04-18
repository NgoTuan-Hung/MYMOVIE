package com.example.mymovie.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mymovie.DTO.AdminMovieResponse;
import com.example.mymovie.DTO.CreateMovieRequest;
import com.example.mymovie.DTO.UpdateMovieRequest;
import com.example.mymovie.Entity.Actor;
import com.example.mymovie.Entity.Category;
import com.example.mymovie.Entity.Country;
import com.example.mymovie.Entity.Director;
import com.example.mymovie.Entity.Language;
import com.example.mymovie.Entity.Movie;
import com.example.mymovie.Repository.ActorRepository;
import com.example.mymovie.Repository.CategoryRepository;
import com.example.mymovie.Repository.CountryRepository;
import com.example.mymovie.Repository.DirectorRepository;
import com.example.mymovie.Repository.LanguageRepository;
import com.example.mymovie.Repository.UserRepository;
import com.example.mymovie.Service.MyMovieService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminController {
    private final UserRepository userRepository;
    private final MyMovieService movieService;
    private final CountryRepository countryRepository;
    private final CategoryRepository categoryRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final LanguageRepository languageRepository;

    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getAllCountries() {
        return ResponseEntity.ok(countryRepository.findAll());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/actors")
    public ResponseEntity<List<Actor>> getAllActors() {
        return ResponseEntity.ok(actorRepository.findAll());
    }

    @GetMapping("/directors")
    public ResponseEntity<List<Director>> getAllDirectors() {
        return ResponseEntity.ok(directorRepository.findAll());
    }

    @GetMapping("/languages")
    public ResponseEntity<List<Language>> getAllLanguages() {
        return ResponseEntity.ok(languageRepository.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/movies")
    public ResponseEntity<Page<AdminMovieResponse>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sort) {
        Sort.Direction direction = Sort.Direction.DESC;
        if (sort.startsWith("-")) {
            sort = sort.substring(1);
        } else {
            direction = Sort.Direction.ASC;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        Page<AdminMovieResponse> movies = movieService.getAllMoviesForAdmin(pageable);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<AdminMovieResponse> getMovieById(@PathVariable Long id) {
        AdminMovieResponse movie = movieService.getMovieByIdForAdmin(id);
        return ResponseEntity.ok(movie);
    }

    @PostMapping("/movies")
    public ResponseEntity<AdminMovieResponse> createMovie(
            @Valid @RequestBody CreateMovieRequest request) {
        Movie movie = movieService.createMovie(request);
        return ResponseEntity.ok(new AdminMovieResponse(movie));
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<AdminMovieResponse> updateMovie(
            @PathVariable Long id,
            @RequestBody UpdateMovieRequest request) {
        Movie movie = movieService.updateMovie(id, request);
        return ResponseEntity.ok(new AdminMovieResponse(movie));
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}