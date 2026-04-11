package com.example.mymovie.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.example.mymovie.DTO.AdminMovieResponse;
import com.example.mymovie.DTO.CreateMovieRequest;
import com.example.mymovie.DTO.DetailMovieResponse;
import com.example.mymovie.DTO.MovieFilterRequest;
import com.example.mymovie.DTO.MovieResponse;
import com.example.mymovie.DTO.UpdateMovieRequest;
import com.example.mymovie.Entity.Actor;
import com.example.mymovie.Entity.Category;
import com.example.mymovie.Entity.Country;
import com.example.mymovie.Entity.Director;
import com.example.mymovie.Entity.Language;
import com.example.mymovie.Entity.Movie;
import com.example.mymovie.Enum.MovieStatus;
import com.example.mymovie.Repository.ActorRepository;
import com.example.mymovie.Repository.CategoryRepository;
import com.example.mymovie.Repository.CountryRepository;
import com.example.mymovie.Repository.DirectorRepository;
import com.example.mymovie.Repository.LanguageRepository;
import com.example.mymovie.Repository.MovieRepository;
import com.example.mymovie.Service.Interface.MovieService;
import com.example.mymovie.Specification.MovieSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyMovieService implements MovieService {
    private final MovieRepository movieRepository;

    // ==== NEW REPOSITORIES ====
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final CategoryRepository categoryRepository;
    private final CountryRepository countryRepository;
    private final LanguageRepository languageRepository;

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
        return movieRepository.getAllMovies();
    }

    public List<MovieResponse> getHotMovies(int limit) {
        return movieRepository.getHotMovies(PageRequest.of(0, limit));
    }

    public DetailMovieResponse getMovieById(Long id) {
        return movieRepository.findById(id).map(DetailMovieResponse::new)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public MovieResponse ToResponse(Movie movie) {
        return new MovieResponse(
                movie.getId(),
                movie.getDisplayName(),
                movie.getReleaseYear(),
                movie.getDuration(),
                movie.getStatus(),
                movie.getEpisodeCount(),
                movie.getPosterPath());
    }

    public Page<MovieResponse> getMovieByFilter(MovieFilterRequest req, int page, int limit) {
        Sort sort = Sort.unsorted();

        if ("name".equals(req.getSort())) {
            sort = Sort.by("displayName").ascending();
        } else if ("viewCount".equals(req.getSort())) {
            sort = Sort.by("weeklyViews").descending();
        }

        Pageable pageable = PageRequest.of(page, limit, sort);

        var movies = movieRepository.findAll(MovieSpecification.filter(req), pageable);

        return movies.map(this::ToResponse);
    }

    // =====================================================
    // CRUD IMPLEMENTATIONS
    // =====================================================

    @Override
    public Movie createMovie(CreateMovieRequest request) {
        Movie movie = new Movie();

        movie.setOriginalName(request.getOriginalName());
        movie.setDisplayName(request.getDisplayName());
        movie.setReleaseYear(request.getReleaseYear());
        movie.setDuration(request.getDuration());
        movie.setStatus(request.getStatus());
        movie.setEpisodeCount(
                request.getEpisodeCount() != null ? request.getEpisodeCount() : 1);
        movie.setPosterPath(request.getPosterPath());

        setIfPresent(request.getActorIds(), actorRepository, movie::setActors);
        setIfPresent(request.getDirectorIds(), directorRepository, movie::setDirectors);
        setIfPresent(request.getCategoryIds(), categoryRepository, movie::setCategories);
        setIfPresent(request.getCountryIds(), countryRepository, movie::setCountries);
        setIfPresent(request.getLanguageIds(), languageRepository, movie::setLanguages);

        return movieRepository.save(movie);
    }

    @Override
    public Movie updateMovie(Long id, UpdateMovieRequest request) {
        Movie movie = movieRepository.findMovieByIdLazy(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        Optional.ofNullable(request.getOriginalName()).ifPresent(movie::setOriginalName);
        Optional.ofNullable(request.getDisplayName()).ifPresent(movie::setDisplayName);
        Optional.ofNullable(request.getReleaseYear()).ifPresent(movie::setReleaseYear);
        Optional.ofNullable(request.getDuration()).ifPresent(movie::setDuration);
        Optional.ofNullable(request.getStatus()).ifPresent(movie::setStatus);
        Optional.ofNullable(request.getEpisodeCount()).ifPresent(movie::setEpisodeCount);
        Optional.ofNullable(request.getPosterPath()).ifPresent(movie::setPosterPath);

        setIfPresent(request.getActorIds(), actorRepository, movie::setActors);
        setIfPresent(request.getDirectorIds(), directorRepository, movie::setDirectors);
        setIfPresent(request.getCategoryIds(), categoryRepository, movie::setCategories);
        setIfPresent(request.getCountryIds(), countryRepository, movie::setCountries);
        setIfPresent(request.getLanguageIds(), languageRepository, movie::setLanguages);

        return movieRepository.save(movie);
    }

    private <T, ID> void setIfPresent(
            Collection<ID> ids,
            JpaRepository<T, ID> repo,
            Consumer<Set<T>> setter) {
        if (ids != null) {
            setter.accept(
                    ids.stream()
                            .map(repo::getReferenceById)
                            .collect(Collectors.toSet()));
        }
    }

    @Override
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findMovieByIdLazy(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));

        // Check if movie has associated user movies before deleting
        if (movie.getUserMovies() != null && !movie.getUserMovies().isEmpty()) {
            // Option 1: Delete associated user movies first
            // Option 2: Throw exception
            // Option 3: Just delete the movie (cascade will handle orphanRemoval)
            // For now, we'll just delete
        }

        movieRepository.delete(movie);
    }

    @Override
    public AdminMovieResponse getMovieByIdForAdmin(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        return new AdminMovieResponse(movie);
    }

    @Override
    public Page<AdminMovieResponse> getAllMoviesForAdmin(Pageable pageable) {
        return movieRepository.findAllWithAssociations(pageable)
                .map(AdminMovieResponse::new);
    }
}