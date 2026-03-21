package com.example.mymovie.DTO;

import java.util.List;

import com.example.mymovie.Entity.Actor;
import com.example.mymovie.Entity.Category;
import com.example.mymovie.Entity.Country;
import com.example.mymovie.Entity.Director;
import com.example.mymovie.Entity.Language;
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
public class DetailMovieResponse {
        private Long id;
        private String displayName;
        private Integer releaseYear;
        private Integer duration;
        private MovieStatus status;
        private Integer episodeCount;
        private String posterUrl;

        private List<String> actors;
        private List<String> directors;
        private List<String> categories;
        private List<String> countries;
        private List<String> languages;

        public DetailMovieResponse(Movie movie) {
                this(
                                movie.getId(),
                                movie.getDisplayName(),
                                movie.getReleaseYear(),
                                movie.getDuration(),
                                movie.getStatus(),
                                movie.getEpisodeCount(),
                                movie.getPosterPath(),

                                movie.getActors().stream()
                                                .map(Actor::getName)
                                                .toList(),

                                movie.getDirectors().stream()
                                                .map(Director::getName)
                                                .toList(),

                                movie.getCategories().stream()
                                                .map(Category::getName)
                                                .toList(),

                                movie.getCountries().stream()
                                                .map(Country::getName)
                                                .toList(),

                                movie.getLanguages().stream()
                                                .map(Language::getName)
                                                .toList());
        }
}
