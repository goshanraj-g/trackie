from fastapi import FastAPI
from pydantic import BaseModel
import spacy
import re

app = FastAPI()
nlp = spacy.load("en_core_web_sm")


class JobPost(BaseModel):
    text: str


@app.post("/analyze")
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
        "React",
        "Node.js",
        "Django",
        "Spring",
        "AWS",
        "Docker",
        "SQL",
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
