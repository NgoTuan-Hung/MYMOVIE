package com.example.mymovie.Service.Interface;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.mymovie.DTO.AdminMovieResponse;
import com.example.mymovie.DTO.CreateMovieRequest;
import com.example.mymovie.DTO.MovieResponse;
import com.example.mymovie.DTO.UpdateMovieRequest;
import com.example.mymovie.Entity.Actor;
import com.example.mymovie.Entity.Category;
import com.example.mymovie.Entity.Country;
import com.example.mymovie.Entity.Director;
import com.example.mymovie.Entity.Language;
import com.example.mymovie.Entity.Movie;
import com.example.mymovie.Enum.MovieStatus;

public interface MovieService {
    public long count();

    public Movie createMovie(
            String originalName,
            String displayName,
            Integer year,
            Integer duration,
            MovieStatus status,
            Integer episodeCount,
            List<Actor> actors,
            List<Director> directors,
            List<Category> categories,
            List<Country> countries,
            List<Language> languages,
            String posterPath);

    public List<MovieResponse> getAllMovies();

    // ==== NEW CRUD METHODS ====

    // Create movie from request DTO
    Movie createMovie(CreateMovieRequest request);

    // Update existing movie
    Movie updateMovie(Long id, UpdateMovieRequest request);

    // Delete movie by ID
    void deleteMovie(Long id);

    // Get movie by ID for admin (includes all fields)
    AdminMovieResponse getMovieByIdForAdmin(Long id);

    // Get all movies for admin (paginated) - FIXED: use EntityGraph to avoid N+1
    Page<AdminMovieResponse> getAllMoviesForAdmin(Pageable pageable);
}