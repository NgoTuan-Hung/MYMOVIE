package com.example.mymovie.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.mymovie.Service.Interface.StorageService;

import lombok.AllArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/image")
@AllArgsConstructor
public class ImageController {
    private final StorageService storageService;

    @PostMapping
    public ResponseEntity<String> postMethodName(@RequestParam MultipartFile file) {
        String filePath = storageService.save(file);

        return ResponseEntity.ok(filePath);
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        var res = storageService.load(fileName);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).header(HttpHeaders.CONTENT_DISPOSITION,
                "inline; filename=\"" + res.getFilename() + "\"").body(res);
    }
}
