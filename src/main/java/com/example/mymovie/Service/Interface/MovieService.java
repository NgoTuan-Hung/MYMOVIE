package com.example.mymovie.Service.Interface;

import java.util.List;

import com.example.mymovie.DTO.MovieResponse;
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
}
