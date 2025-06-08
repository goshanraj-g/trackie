from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
import re

app = FastAPI()
nlp = spacy.load("en_core_web_sm")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobPost(BaseModel):
    text: str


@app.post("/upload-analyze")
def analyze_job_post(job: JobPost):
    doc = nlp(job.text)

    data = {
        "company": None,
        "title": None,
        "location": None,
        "url": None,
        "tech_stack": [],
    }

    job_titles = [
        "Software Engineer",
        "Developer",
        "Intern",
        "Data Scientist",
        "Marketing Associate",
        "Project Manager",
        "Product Designer",
    ]
    known_tech = [
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C++",
        "C#",
        "Go",
        "Rust",
        "Ruby",
        "Kotlin",
        "Swift",

        # Frontend Frameworks & Libraries
        "React",
        "Next.js",
        "Vue.js",
        "Svelte",
        "Tailwind CSS",
        "Bootstrap",

        # Backend Frameworks
        "Node.js",
        "Express.js",
        "Django",
        "Flask",
        "Spring Boot",
        "FastAPI",
        "NestJS",
        "Rails",

        # Cloud & DevOps
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Terraform",
        "GitHub Actions",
        "Jenkins",

        # Databases
        "SQL",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "SQLite",
        "DynamoDB",

        # Testing & CI
        "Jest",
        "JUnit",
        "PyTest",
        "Cypress",
        "Selenium",

        # Tools & Misc
        "Git",
        "Figma",
        "Postman",
        "GraphQL",
        "REST",
        "WebSockets",
        "Firebase",
        "Supabase",
    ]

    for ent in doc.ents:
        # figures out if company is an organization

        if ent.label_ == "ORG":
            data["company"] = ent.text
            break

    for ent in doc.ents:
        # figures out location
        if ent.label_ == "GPE":
            data["location"] = ent.text
            break

    for title in job_titles:
        if title.lower() in job.text.lower():
            data["title"] = title
            break

    url_match = re.search(r"(https?://\S+)", job.text)
    if url_match:
        data["url"] = url_match.group()

    data["tech_stack"] = [
        tech for tech in known_tech if tech.lower() in job.text.lower()
    ]

    return data
