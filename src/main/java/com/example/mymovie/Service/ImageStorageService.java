package com.example.mymovie.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.mymovie.Service.Interface.StorageService;

@Service
public class ImageStorageService implements StorageService {
    private final Path root = Paths.get("upload/images");

    @Override
    public String save(MultipartFile file) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(fileName));

            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to store the file: " + e);
        }
    }

    @Override
    public Resource load(String fileName) {
        try {
            Path file = root.resolve(fileName);

            var res = new UrlResource(file.toUri());

            if (res.exists() || res.isReadable()) {
                return res;
            } else {
                throw new RuntimeException("Could not read the file: " + fileName);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load the file: " + e);
        }
    }
}
