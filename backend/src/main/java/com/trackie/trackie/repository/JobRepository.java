package com.trackie.trackie.repository;

import com.trackie.trackie.model.Job;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, String> {
}
// work with job objects, and id's will be string

// handles all database access (JpaRepository gives CRUD methods out of the box

// jparepository gives access to save(job) -> adds / updates job
// findAll() -> gets all jobs from database
// findById(id) -> finds by id
// deleteById(id) -> deletes job by id