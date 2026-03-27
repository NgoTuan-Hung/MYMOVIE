package com.example.mymovie.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieFilterRequest {
    private String sort;
    private String category;
    private String country;
    private String releaseYear;
    private String type;
}
