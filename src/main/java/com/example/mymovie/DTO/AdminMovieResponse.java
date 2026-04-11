package com.example.mymovie.DTO;

import java.util.List;

import com.example.mymovie.Entity.Movie;
import com.example.mymovie.Enum.MovieStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminMovieResponse {
    private Long id;
    private String originalName;
    private String displayName;
    private Integer releaseYear;
    private Integer duration;
    private MovieStatus status;
    private Integer episodeCount;
    private String posterUrl;
    private Integer weeklyViews;
    private List<String> actors;
    private List<String> directors;
    private List<String> categories;
    private List<String> countries;
    private List<String> languages;

    public AdminMovieResponse(Movie movie) {
        this.id = movie.getId();
        this.originalName = movie.getOriginalName();
        this.displayName = movie.getDisplayName();
        this.releaseYear = movie.getReleaseYear();
        this.duration = movie.getDuration();
        this.status = movie.getStatus();
        this.episodeCount = movie.getEpisodeCount();
        this.posterUrl = movie.getPosterPath();
        this.weeklyViews = movie.getWeeklyViews();

        this.actors = movie.getActors().stream()
                .map(a -> a.getName())
                .toList();
        this.directors = movie.getDirectors().stream()
                .map(d -> d.getName())
                .toList();
        this.categories = movie.getCategories().stream()
                .map(c -> c.getName())
                .toList();
        this.countries = movie.getCountries().stream()
                .map(c -> c.getName())
                .toList();
        this.languages = movie.getLanguages().stream()
                .map(l -> l.getName())
                .toList();
    }
}