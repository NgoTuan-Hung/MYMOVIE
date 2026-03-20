package com.example.mymovie.DTO;

import com.example.mymovie.Enum.MovieStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieResponse {
    private Long id;
    private String displayName;
    private Integer releaseYear;
    private Integer duration;
    private MovieStatus status;
    private Integer episodeCount;
    private String posterUrl;
}
