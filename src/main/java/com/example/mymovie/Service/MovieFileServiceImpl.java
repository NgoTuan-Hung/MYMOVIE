package com.example.mymovie.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.mymovie.DTO.MovieFileResponse;
import com.example.mymovie.Entity.MovieFile;
import com.example.mymovie.Repository.MovieFileRepository;
import com.example.mymovie.Service.Interface.MovieFileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieFileServiceImpl implements MovieFileService {
    private final MovieFileRepository movieFileRepository;

    public List<MovieFileResponse> getMovieFilesByMovieId(Long movieId) {
        List<MovieFile> files = movieFileRepository.findByMovieIdWithSources(movieId);
        return files.stream()
                .map(MovieFileResponse::new)
                .toList();
    }
}
