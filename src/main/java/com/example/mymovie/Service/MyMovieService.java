package com.example.mymovie.Service;

import java.util.HashSet;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Service;

import com.example.mymovie.DTO.DetailMovieResponse;
import com.example.mymovie.DTO.MovieResponse;
import com.example.mymovie.Entity.Actor;
import com.example.mymovie.Entity.Category;
import com.example.mymovie.Entity.Country;
import com.example.mymovie.Entity.Director;
import com.example.mymovie.Entity.Language;
import com.example.mymovie.Entity.Movie;
import com.example.mymovie.Enum.MovieStatus;
import com.example.mymovie.Repository.MovieRepository;
import com.example.mymovie.Service.Interface.MovieService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyMovieService implements MovieService {
    private final MovieRepository movieRepository;

    @Override
    public long count() {
        return movieRepository.count();
    }

    @Override
    public Movie createMovie(String originalName, String displayName, Integer year, Integer duration,
            MovieStatus status, Integer episodeCount, List<Actor> actors, List<Director> directors,
            List<Category> categories, List<Country> countries, List<Language> languages, String posterPath) {

        Movie movie = new Movie();
        movie.setOriginalName(originalName);
        movie.setDisplayName(displayName);
        movie.setReleaseYear(year);
        movie.setDuration(duration);
        movie.setStatus(status);
        movie.setEpisodeCount(episodeCount);
        movie.setActors(new HashSet<>(actors));
        movie.setDirectors(new HashSet<>(directors));
        movie.setCategories(new HashSet<>(categories));
        movie.setCountries(new HashSet<>(countries));
        movie.setLanguages(new HashSet<>(languages));
        movie.setPosterPath(posterPath);

        return movieRepository.save(movie);
    }

    public List<MovieResponse> getAllMovies() {
        System.out.println("getAllMovies");
        return movieRepository.getAllMovies();
    }

    public List<MovieResponse> getHotMovies(int limit) {
        return movieRepository.getHotMovies(PageRequest.of(0, limit));
    }

    public DetailMovieResponse getMovieById(Long id) {
        return movieRepository.findById(id).map(DetailMovieResponse::new)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }
}
