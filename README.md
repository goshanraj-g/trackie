# 📌 Trackie

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-%5E18.0-61DAFB.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-%5E3.0-6DB33F.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)

<p align="center">
  <img src="public/logo.png" alt="Trackie Logo" width="120"/>
</p>

---

## About the Project

**Trackie** is a full-stack job tracking tool built to help developers stay on top of their job applications and leads. From applied roles to interviews to bookmarked postings, Trackie keeps everything in one place with a clean UI and modern developer stack.

---

## Key Features

### Core Features (MVP)

- Add, edit, and delete job applications
- Manage a personalized watchlist of potential roles
- Notes and metadata for each entry
- Logo fetching based on company domains (fallback to initials)
- Responsive, modern UI using Tailwind and ShadCN
- Fully integrated with a Spring Boot + PostgreSQL backend

---

## 🛠️ Stack Overview

### Frontend

- **React.js (v18)**
- **TailwindCSS**
- **ShadCN UI**

### Backend

- **Java** with **Spring Boot**
- **PostgreSQL** via Spring Data JPA

---

## 📸 Screenshots

<p align="center">
  <img src="public/dashboard.png" alt="Dashboard Preview" width="600"/>
</p>

---

## 🚧 To-Do / Planned Features

- **User Authentication** (Google Sign-In via Firebase)
- **Protected Routes** (`/dashboard`, etc.)
- **Sorting & Filtering**
  - Sort by date, company, or status
  - Add dropdowns or search bar
- **AWS Integration (Textract)**
  - Upload job screenshots
  - Use Textract to auto-fill fields
  - Store images via S3
- **Interview Reminder System**
  - Add `date` + `reminderTime` fields
  - Local browser notification or email via SES (or Twilio)
- **Deadline Tracker**
  - Add deadline fields to jobs
- **User-Specific Data**
  - Backend: Filter queries by `userId`
  - Frontend: Store user info and include in API requests

---

## 🚀 Deployment

Deployment will be configured in a future update with proper CI/CD and environment setup.

---

## 📄 License

MIT License © 2025
