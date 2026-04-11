package com.example.mymovie.DTO;

import java.util.List;

import com.example.mymovie.Enum.MovieStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateMovieRequest {
    @NotBlank(message = "Original name is required")
    private String originalName;

    @NotBlank(message = "Display name is required")
    private String displayName;

    private Integer releaseYear;
    private Integer duration;

    @NotNull(message = "Status is required")
    private MovieStatus status;

    private Integer episodeCount = 1;
    private List<Integer> countryIds;
    private List<Integer> categoryIds;
    private List<Long> actorIds;
    private List<Long> directorIds;
    private List<Integer> languageIds;
    private String posterPath;
}