package com.example.mymovie.Repository;

import com.example.mymovie.Entity.MovieFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieFileRepository extends JpaRepository<MovieFile, Long> {
    long count();
}