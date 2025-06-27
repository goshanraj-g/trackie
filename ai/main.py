from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import spacy
import re


model_path = Path(__file__).parent / "models" / "job_post_ner_final"
app = FastAPI()
nlp = spacy.load(model_path)

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
        if ent.label_ == "COMPANY":
            data["company"] = ent.text
            break  # stop at first match

    for ent in doc.ents:
        if ent.label_ == "LOCATION":
            data["location"] = ent.text
            break

    for ent in doc.ents:
        if ent.label_ == "JOB_TITLE":
            data["title"] = ent.text
            break

    url_match = re.search(r"(https?://\S+)", job.text)
    if url_match:
        data["url"] = url_match.group()

    data["tech_stack"] = [
        tech for tech in known_tech if tech.lower() in job.text.lower()
    ]

    return data
