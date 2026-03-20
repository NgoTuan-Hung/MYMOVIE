package com.example.mymovie.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mymovie.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
