package com.example.mymovie.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.mymovie.DTO.MovieResponse;
import com.example.mymovie.Entity.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("""
               SELECT new com.example.mymovie.DTO.MovieResponse(
               m.id,m.displayName,m.releaseYear,m.duration,m.status,m.episodeCount,m.posterPath
               ) FROM Movie m
            """)
    public List<MovieResponse> getAllMovies();
}
