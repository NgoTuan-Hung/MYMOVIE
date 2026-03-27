package com.example.mymovie.Specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.mymovie.DTO.MovieFilterRequest;
import com.example.mymovie.Entity.Movie;

public class MovieSpecification {
    public static Specification<Movie> filter(MovieFilterRequest request) {
        return (root, query, cb) -> {
            query.distinct(true);

            var predicates = cb.conjunction();

            if (request.getCategory() != null) {
                var join = root.join("categories");
                predicates = cb.and(predicates, cb.equal(join.get("name"), request.getCategory()));
            }

            if (request.getCountry() != null) {
                var join = root.join("countries");
                predicates = cb.and(predicates, cb.equal(join.get("name"), request.getCountry()));
            }

            if (request.getReleaseYear() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("releaseYear"), request.getReleaseYear()));
            }

            if (request.getType() != null) {
                if (request.getType().equals("movie")) {
                    predicates = cb.and(predicates, cb.lt(root.get("episodeCount"), 2));
                } else if (request.getType().equals("series")) {
                    predicates = cb.and(predicates, cb.gt(root.get("episodeCount"), 1));
                }
            }

            return predicates;
        };
    }
}
