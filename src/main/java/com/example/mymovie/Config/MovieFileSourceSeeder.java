package com.example.mymovie.Config;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.mymovie.Entity.Movie;
import com.example.mymovie.Entity.MovieFile;
import com.example.mymovie.Entity.MovieSource;
import com.example.mymovie.Repository.MovieFileRepository;
import com.example.mymovie.Repository.MovieRepository;
import com.example.mymovie.Repository.MovieSourceRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class MovieFileSourceSeeder {

    private final MovieRepository movieRepository;
    private final MovieFileRepository movieFileRepository;
    private final MovieSourceRepository movieSourceRepository;

    // Base URL for all streaming sources
    private static final String BASE_STREAM_URL = "https://pub-ba42193aff49498c847386e3958fe7aa.r2.dev/videos/Movie-1/output.m3u8";

    // Source provider names for variety
    private static final String[] SOURCE_PROVIDERS = {
            "Primary CDN",
            "Backup CDN",
            "Cloudflare Stream",
            "AWS MediaConvert",
            "Azure Media Services"
    };

    @Bean
    CommandLineRunner seedMovieFilesAndSources() {
        return args -> {

            // Skip if data already exists
            if (movieFileRepository.count() > 0) {
                System.out.println("MovieFile and MovieSource data already exists. Skipping seed.");
                return;
            }

            System.out.println("=== Seeding MovieFile and MovieSource Data ===");

            List<Movie> allMovies = movieRepository.findAll();
            Random random = new Random(42); // Fixed seed for reproducibility

            int totalFilesCreated = 0;
            int totalSourcesCreated = 0;

            for (Movie movie : allMovies) {
                Integer episodeCount = movie.getEpisodeCount() != null ? movie.getEpisodeCount() : 1;

                // For RELEASED movies: 1 file (the full movie)
                // For ON_GOING movies: create files for each episode
                List<MovieFile> movieFiles = new ArrayList<>();

                if (episodeCount == 1) {
                    // Single movie file (full movie)
                    MovieFile movieFile = new MovieFile();
                    movieFile.setMovie(movie);
                    movieFile.setEpisode(null); // null for movies
                    movieFile.setTitle(movie.getDisplayName() + " - Full Movie");
                    movieFiles.add(movieFileRepository.save(movieFile));
                } else {
                    // TV Series - create file for each episode
                    for (int ep = 1; ep <= episodeCount; ep++) {
                        MovieFile movieFile = new MovieFile();
                        movieFile.setMovie(movie);
                        movieFile.setEpisode(ep);
                        movieFile.setTitle(movie.getDisplayName() + " - Episode " + ep);
                        movieFiles.add(movieFileRepository.save(movieFile));
                    }
                }

                // Create 1-3 sources per file (different CDN/providers)
                for (MovieFile file : movieFiles) {
                    int sourceCount = random.nextInt(3) + 1; // 1-3 sources
                    List<Integer> usedIndices = new ArrayList<>();

                    for (int s = 0; s < sourceCount; s++) {
                        MovieSource source = new MovieSource();
                        source.setFile(file);
                        source.setUrl(BASE_STREAM_URL); // All URLs point to the same stream

                        // Assign a unique provider from the SOURCE_PROVIDERS array
                        int providerIndex;
                        do {
                            providerIndex = random.nextInt(SOURCE_PROVIDERS.length);
                        } while (usedIndices.contains(providerIndex));
                        usedIndices.add(providerIndex);

                        source.setProvider(SOURCE_PROVIDERS[providerIndex]);
                        movieSourceRepository.save(source);
                        totalSourcesCreated++;
                    }
                }

                totalFilesCreated += movieFiles.size();
                System.out.println("Created " + movieFiles.size() + " file(s) with " +
                        (episodeCount == 1 ? "1" : episodeCount) + " episode(s) for: " + movie.getDisplayName());
            }

            System.out.println("=== Seeding Complete ===");
            System.out.println("Total MovieFiles created: " + totalFilesCreated);
            System.out.println("Total MovieSources created: " + totalSourcesCreated);
        };
    }
}