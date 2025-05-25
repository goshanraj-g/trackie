package com.trackie.trackie.repository;

import com.trackie.trackie.model.Job;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, String> {
}

// handles all database access (JpaRepository gives CRUD methods out of the box