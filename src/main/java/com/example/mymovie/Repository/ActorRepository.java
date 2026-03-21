package com.example.mymovie.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mymovie.Entity.Actor;

public interface ActorRepository extends JpaRepository<Actor, Long> {
    public Actor findById(int id);
}
