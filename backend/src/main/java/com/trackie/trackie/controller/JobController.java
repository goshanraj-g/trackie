package com.trackie.trackie.controller;

import com.trackie.trackie.model.Job;
import com.trackie.trackie.repository.JobRepository;
import com.trackie.trackie.service.AIExtractionService;
import com.trackie.trackie.service.S3Service;
import com.trackie.trackie.service.TextractService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

// tell springboot that this is a REST API
@RestController
@RequestMapping("/api/jobs") // base route
@CrossOrigin(origins = "*") // allows requests from frontend
public class JobController {

    @Autowired // injects database helper
    private JobRepository jobRepo;

    @Autowired // injects s3 service code
    private S3Service s3Service;

    @Autowired // injects textract service code
    private TextractService textractService;

    @Autowired // injects aiExtraction service code
    private AIExtractionService aiExtractionService;

    // GET // api /jobs
    @GetMapping // returns all jobs
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

    // GET watchlist items only
    @GetMapping("/watchlist")
    public List<Job> getWatchlist() {
        return jobRepo.findByType("watchlist");
    }

    // POST // api/jobs
    @PostMapping // adds job
    public Job addJob(@RequestBody Job job) {
        return jobRepo.save(job); // adds a job using JSON body
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable String id, @RequestBody Job updatedJob) {
        updatedJob.setId(id); // make sure id is preserved
        return jobRepo.save(updatedJob);
    }

    // DELETE /api/jobs/{id}
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable String id) {
        jobRepo.deleteById(id);
    }

    @PostMapping("/upload-analyze")
    public ResponseEntity<Map<String, Object>> uploadAndAnalyze(@RequestParam("file") MultipartFile file)
            throws IOException {
        String fileName = s3Service.uploadFile(file);
        String extractedText = textractService.extractText(fileName);
        Map<String, Object> structuredData = aiExtractionService.analyzeText(extractedText);

        return ResponseEntity.ok(structuredData);
    }

}
