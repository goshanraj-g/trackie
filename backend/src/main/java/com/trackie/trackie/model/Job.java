package com.trackie.trackie.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ElementCollection;
import java.util.List;

@Entity
public class Job {
    // @entity -> marks class as a DB table
    // @id -> marks field as the primary key
    @Id
    private String id;
    private String companyName;
    private String title;
    private String url;
    private String notes;
    private String status;
    private String type; // added or watchlist
    private String date;

    @ElementCollection
    // allow fetches to clearbit api
    private List<String> possibleDomains;
    private Integer logoIndex;

    public Job() {
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getPossibleDomains() {
        return possibleDomains;
    }

    public void setPossibleDomains(List<String> possibleDomains) {
        this.possibleDomains = possibleDomains;
    }

    public Integer getLogoIndex() {
        return logoIndex;
    }

    public void setLogoIndex(Integer logoIndex) {
        this.logoIndex = logoIndex;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}