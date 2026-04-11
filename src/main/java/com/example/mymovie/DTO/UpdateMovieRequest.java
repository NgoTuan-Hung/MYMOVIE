package com.example.mymovie.DTO;

import java.util.List;

import com.example.mymovie.Enum.MovieStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMovieRequest {
    private String originalName;
    private String displayName;
    private Integer releaseYear;
    private Integer duration;
    private MovieStatus status;
    private Integer episodeCount;
    private List<Integer> countryIds;
    private List<Integer> categoryIds;
    private List<Long> actorIds;
    private List<Long> directorIds;
    private List<Integer> languageIds;
    private String posterPath;
}