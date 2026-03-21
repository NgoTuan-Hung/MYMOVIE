package com.example.mymovie.Config;

import java.util.List;
import java.util.Arrays;
import java.util.Random;

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
                        Actor actor3 = actorRepository.save(new Actor(null, "Tom Hanks"));
                        Actor actor4 = actorRepository.save(new Actor(null, "Scarlett Johansson"));
                        Actor actor5 = actorRepository.save(new Actor(null, "Brad Pitt"));
                        Actor actor6 = actorRepository.save(new Actor(null, "Jennifer Lawrence"));
                        Actor actor7 = actorRepository.save(new Actor(null, "Robert Downey Jr."));
                        Actor actor8 = actorRepository.save(new Actor(null, "Natalie Portman"));
                        Actor actor9 = actorRepository.save(new Actor(null, "Will Smith"));
                        Actor actor10 = actorRepository.save(new Actor(null, "Angelina Jolie"));

                        Director director1 = directorRepository.save(new Director(null, "Christopher Nolan"));
                        Director director2 = directorRepository.save(new Director(null, "Wachowski Sisters"));
                        Director director3 = directorRepository.save(new Director(null, "Steven Spielberg"));
                        Director director4 = directorRepository.save(new Director(null, "Martin Scorsese"));
                        Director director5 = directorRepository.save(new Director(null, "Quentin Tarantino"));
                        Director director6 = directorRepository.save(new Director(null, "James Cameron"));
                        Director director7 = directorRepository.save(new Director(null, "Peter Jackson"));
                        Director director8 = directorRepository.save(new Director(null, "Ridley Scott"));
                        Director director9 = directorRepository.save(new Director(null, "Denis Villeneuve"));
                        Director director10 = directorRepository.save(new Director(null, "Francis Ford Coppola"));

                        Category action = categoryRepository.save(new Category(null, "Action"));
                        Category sciFi = categoryRepository.save(new Category(null, "Sci-Fi"));
                        Category drama = categoryRepository.save(new Category(null, "Drama"));
                        Category comedy = categoryRepository.save(new Category(null, "Comedy"));
                        Category horror = categoryRepository.save(new Category(null, "Horror"));
                        Category romance = categoryRepository.save(new Category(null, "Romance"));
                        Category thriller = categoryRepository.save(new Category(null, "Thriller"));
                        Category adventure = categoryRepository.save(new Category(null, "Adventure"));

                        Country usa = countryRepository.save(new Country(null, "USA"));
                        Country uk = countryRepository.save(new Country(null, "UK"));
                        Country canada = countryRepository.save(new Country(null, "Canada"));
                        Country australia = countryRepository.save(new Country(null, "Australia"));

                        Language english = languageRepository.save(new Language(null, "English"));
                        Language spanish = languageRepository.save(new Language(null, "Spanish"));
                        Language french = languageRepository.save(new Language(null, "French"));

                        // Arrays of movie data for random generation
                        String[] movieTitles = {
                                        "Eternal Horizon", "Shadow Protocol", "Neon Dreams", "Quantum Rift",
                                        "Midnight Heist", "Frozen Frontier", "Digital Ghosts", "Solar Flare",
                                        "Crimson Tide", "Iron Fortress", "Silent Witness", "Golden Age",
                                        "Broken Compass", "Electric Storm", "Phantom Zone", "Time Bender",
                                        "Dark Matter", "Crystal Skull", "Redemption Arc", "Final Countdown"
                        };

                        String[] movieDisplayNames = {
                                        "Eternal Horizon", "Shadow Protocol", "Neon Dreams", "Quantum Rift",
                                        "Midnight Heist", "Frozen Frontier", "Digital Ghosts", "Solar Flare",
                                        "Crimson Tide", "Iron Fortress", "Silent Witness", "Golden Age",
                                        "Broken Compass", "Electric Storm", "Phantom Zone", "Time Bender",
                                        "Dark Matter", "Crystal Skull", "Redemption Arc", "Final Countdown"
                        };

                        Random random = new Random();

                        // Create 20 random movies
                        for (int i = 0; i < 20; i++) {
                                // Randomly select actors (1-3 actors per movie)
                                List<Actor> randomActors = Arrays.asList(
                                                actorRepository.findById((random.nextInt(10) + 1)),
                                                actorRepository.findById((random.nextInt(10) + 1)))
                                                .subList(0, random.nextInt(2) + 1);

                                // Randomly select directors (1-2 directors per movie)
                                List<Director> randomDirectors = Arrays.asList(
                                                directorRepository.findById((random.nextInt(10) + 1)),
                                                directorRepository.findById((random.nextInt(10) + 1)))
                                                .subList(0, random.nextInt(1) + 1);

                                // Randomly select categories (1-3 categories per movie)
                                List<Category> randomCategories = Arrays.asList(
                                                categoryRepository.findById((random.nextInt(8) + 1)),
                                                categoryRepository.findById((random.nextInt(8) + 1)),
                                                categoryRepository.findById((random.nextInt(8) + 1)))
                                                .subList(0, random.nextInt(2) + 1);

                                // Randomly select countries (1-2 countries per movie)
                                List<Country> randomCountries = Arrays.asList(
                                                countryRepository.findById((random.nextInt(4) + 1)),
                                                countryRepository.findById((random.nextInt(4) + 1)))
                                                .subList(0, random.nextInt(1) + 1);

                                // Randomly select languages (1-2 languages per movie)
                                List<Language> randomLanguages = Arrays.asList(
                                                languageRepository.findById((random.nextInt(3) + 1)),
                                                languageRepository.findById((random.nextInt(3) + 1)))
                                                .subList(0, random.nextInt(1) + 1);

                                // Generate random movie data
                                int releaseYear = 2000 + random.nextInt(25); // Years 2000-2024
                                int duration = 90 + random.nextInt(120); // Duration 90-210 minutes
                                MovieStatus status = random.nextBoolean() ? MovieStatus.RELEASED : MovieStatus.ON_GOING;
                                int episodeCount = status == MovieStatus.RELEASED ? 1 : random.nextInt(10) + 1;

                                // Generate random poster filename
                                String posterFilename = "movie_" + (i + 1) + ".jpg";

                                try {
                                        movieService.createMovie(
                                                        movieTitles[i],
                                                        movieDisplayNames[i],
                                                        releaseYear,
                                                        duration,
                                                        status,
                                                        episodeCount,
                                                        randomActors,
                                                        randomDirectors,
                                                        randomCategories,
                                                        randomCountries,
                                                        randomLanguages,
                                                        posterFilename);
                                } catch (Exception e) {
                                        // If there's an error with random data, create a fallback movie
                                        movieService.createMovie(
                                                        "Fallback Movie " + i,
                                                        "Fallback Movie " + i,
                                                        2020,
                                                        120,
                                                        MovieStatus.RELEASED,
                                                        1,
                                                        List.of(actor1),
                                                        List.of(director1),
                                                        List.of(action),
                                                        List.of(usa),
                                                        List.of(english),
                                                        "fallback_" + i + ".jpg");
                                }
                        }
                };
        }
}
