package com.example.mymovie.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

import com.example.mymovie.Enum.MovieStatus;

@Entity
@Table(name = "movie")
@Getter
@Setter
@NoArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalName;
    private String displayName;
    private Integer releaseYear;
    private Integer duration;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;

    private Integer episodeCount = 1;

    @ManyToMany
    @JoinTable(name = "movie_country", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "country_id"))
    private Set<Country> countries;

    @ManyToMany
    @JoinTable(name = "movie_category", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories;

    @ManyToMany
    @JoinTable(name = "movie_actor", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "actor_id"))
    private Set<Actor> actors;

    @ManyToMany
    @JoinTable(name = "movie_director", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "director_id"))
    private Set<Director> directors;

    @OneToMany(mappedBy = "movie")
    private Set<UserMovie> userMovies;

    @ManyToMany
    @JoinTable(name = "movie_language", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "language_id"))
    private Set<Language> languages;

    // getters, setters
    private String posterPath;
    private Integer weeklyViews;
}