package com.example.mymovie.DTO;

import java.util.List;
import java.util.stream.Collectors;

import com.example.mymovie.Entity.MovieFile;
import com.example.mymovie.Entity.MovieSource;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieFileResponse {
    private Long id;
    private Integer episode;
    private String title;
    private List<SourceResponse> sources;

    // Constructor from entity
    public MovieFileResponse(MovieFile file) {
        this.id = file.getId();
        this.episode = file.getEpisode();
        this.title = file.getTitle();
        this.sources = file.getSources() != null
                ? file.getSources().stream()
                        .map(this::toSourceResponse)
                        .collect(Collectors.toList())
                : List.of();
    }

    private SourceResponse toSourceResponse(MovieSource source) {
        return new SourceResponse(
                source.getId(),
                source.getUrl(),
                source.getProvider());
    }
}