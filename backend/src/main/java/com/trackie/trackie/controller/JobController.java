package com.trackie.trackie.controller;

import com.trackie.trackie.model.Job;
import com.trackie.trackie.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// tell springboot that this is a REST API
@RestController
@RequestMapping("/api/jobs") // base route
@CrossOrigin(origins = "*") // allows requests from frontend
public class JobController {
    @Autowired // injects database helper
    private JobRepository jobRepo;

    // GET // api /jobs
    @GetMapping // returns all jobs
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

    // POST // api/jobs
    @PostMapping // adds job
    public Job addJob(@RequestBody Job job) {
        return jobRepo.save(job); // adds a job using JSON body
    }

}
