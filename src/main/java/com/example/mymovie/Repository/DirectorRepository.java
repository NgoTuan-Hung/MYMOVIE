package com.example.mymovie.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mymovie.Entity.Director;

public interface DirectorRepository extends JpaRepository<Director, Long> {
    public Director findById(int id);
}
