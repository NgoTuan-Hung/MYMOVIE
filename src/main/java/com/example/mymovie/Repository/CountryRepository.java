package com.example.mymovie.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mymovie.Entity.Country;

public interface CountryRepository extends JpaRepository<Country, Integer> {
    public Country findById(int id);
}
