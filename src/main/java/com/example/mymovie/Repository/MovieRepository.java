package com.example.mymovie.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.example.mymovie.DTO.MovieResponse;
import com.example.mymovie.Entity.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
    @Query("""
               SELECT new com.example.mymovie.DTO.MovieResponse(
               m.id,m.displayName,m.releaseYear,m.duration,m.status,m.episodeCount,m.posterPath
               ) FROM Movie m
            """)
    public List<MovieResponse> getAllMovies();

    @Query("""
                SELECT new com.example.mymovie.DTO.MovieResponse(
                    m.id, m.displayName, m.releaseYear, m.duration,
                    m.status, m.episodeCount, m.posterPath
                )
                FROM Movie m
                ORDER BY COALESCE(m.weeklyViews, 0) DESC, m.id DESC
            """)
    List<MovieResponse> getHotMovies(Pageable pageable);

    @EntityGraph(attributePaths = { "actors", "directors", "categories", "countries", "languages" })
    public Optional<Movie> findById(Long id);
}
