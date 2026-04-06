package com.example.mymovie.Repository;

import com.example.mymovie.Entity.MovieSource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieSourceRepository extends JpaRepository<MovieSource, Long> {
    long count();
}