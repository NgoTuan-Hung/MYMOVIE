package com.example.mymovie.Repository;

import com.example.mymovie.Entity.MovieFile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MovieFileRepository extends JpaRepository<MovieFile, Long> {
    long count();

    @Query("SELECT DISTINCT f FROM MovieFile f LEFT JOIN FETCH f.sources WHERE f.movie.id = :movieId")
    List<MovieFile> findByMovieIdWithSources(@Param("movieId") Long movieId);
}