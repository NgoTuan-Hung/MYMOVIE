package com.example.mymovie.Specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.mymovie.DTO.MovieFilterRequest;
import com.example.mymovie.Entity.Movie;

public class MovieSpecification {
    public static Specification<Movie> filter(MovieFilterRequest request) {
        return (root, query, cb) -> {
            query.distinct(true);

            var predicates = cb.conjunction();

            if (request.getName() != null && !request.getName().isBlank()) {
                String pattern = "%" + request.getName().toLowerCase() + "%";
                predicates = cb.and(cb.like(cb.lower(root.get("displayName")), pattern));
            }

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
                if ("movie".equals(request.getType())) {
                    predicates = cb.and(predicates, cb.lt(root.get("episodeCount"), 2));
                } else if ("series".equals(request.getType())) {
                    predicates = cb.and(predicates, cb.gt(root.get("episodeCount"), 1));
                }
            }

            return predicates;
        };
    }
}
