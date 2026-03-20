package com.example.mymovie.Config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.mymovie.Entity.Actor;
import com.example.mymovie.Entity.Category;
import com.example.mymovie.Entity.Country;
import com.example.mymovie.Entity.Director;
import com.example.mymovie.Entity.Language;
import com.example.mymovie.Enum.MovieStatus;
import com.example.mymovie.Repository.ActorRepository;
import com.example.mymovie.Repository.CategoryRepository;
import com.example.mymovie.Repository.CountryRepository;
import com.example.mymovie.Repository.DirectorRepository;
import com.example.mymovie.Repository.LanguageRepository;
import com.example.mymovie.Service.Interface.MovieService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final MovieService movieService;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final CategoryRepository categoryRepository;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;

    @Bean
    CommandLineRunner initData() {
        return args -> {

            if (movieService.count() > 0)
                return; // avoid duplicate seed

            // Create base data first
            Actor actor1 = actorRepository.save(new Actor(null, "Leonardo DiCaprio"));
            Actor actor2 = actorRepository.save(new Actor(null, "Keanu Reeves"));

            Director director1 = directorRepository.save(new Director(null, "Christopher Nolan"));
            Director director2 = directorRepository.save(new Director(null, "Wachowski Sisters"));

            Category action = categoryRepository.save(new Category(null, "Action"));
            Category sciFi = categoryRepository.save(new Category(null, "Sci-Fi"));

            Country usa = countryRepository.save(new Country(null, "USA"));

            Language english = languageRepository.save(new Language(null, "English"));

            // Create movies
            movieService.createMovie(
                    "Inception",
                    "Inception",
                    2010,
                    148,
                    MovieStatus.RELEASED,
                    1,
                    List.of(actor1),
                    List.of(director1),
                    List.of(action, sciFi),
                    List.of(usa),
                    List.of(english),
                    "inception.jpg");

            movieService.createMovie(
                    "The Matrix",
                    "The Matrix",
                    1999,
                    136,
                    MovieStatus.RELEASED,
                    1,
                    List.of(actor2),
                    List.of(director2),
                    List.of(action, sciFi),
                    List.of(usa),
                    List.of(english),
                    "matrix.jpg");
        };
    }
}