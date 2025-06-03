import spacy
import os
import random
from spacy.training.example import (
    Example,
)  # example -> combines raw text + annotations for training

# blank english NLP pipeline
nlp = spacy.blank("en")

# add named entity recognizer to pipeline
ner = nlp.add_pipe("ner")

os.makedirs("models", exist_ok=True)

# define new entity titles for training
ner.add_label("COMPANY")
ner.add_label("JOB_TITLE")
ner.add_label("LOCATION")

# training data
TRAIN_DATA = [
    (
        "Google is hiring a Software Engineer in Toronto.",
        {"entities": [(0, 6, "COMPANY"), (19, 36, "JOB_TITLE"), (40, 47, "LOCATION")]},
    ),
    (
        "Meta is looking for a Data Analyst based in New York.",
        {"entities": [(0, 4, "COMPANY"), (21, 33, "JOB_TITLE"), (44, 52, "LOCATION")]},
    ),
    (
        "Join Amazon as a Product Manager in Vancouver.",
        {"entities": [(5, 11, "COMPANY"), (15, 31, "JOB_TITLE"), (35, 44, "LOCATION")]},
    ),
    (
        "IBM Developer Intern (8 or 12 month term - Toronto or Montreal)",
        {
            "entities": [
                (0, 3, "COMPANY"),
                (4, 19, "JOB_TITLE"),
                (47, 53, "LOCATION"),
                (57, 65, "LOCATION"),
            ]
        },
    ),
    (
        "Veeva Systems Associate Software Engineer - Seeking 2024 and 2025 Grads",
        {"entities": [(0, 13, "COMPANY"), (14, 41, "JOB_TITLE")]},
    ),
    (
        "Google Student Researcher, BS/MS, Winter/Summer 2025",
        {"entities": [(0, 6, "COMPANY"), (7, 25, "JOB_TITLE")]},
    ),
    (
        "CIBC Application/Software Developer Co-op - Commercial Banking and Payments Technology",
        {"entities": [(0, 4, "COMPANY"), (5, 41, "JOB_TITLE")]},
    ),
    (
        "GeoComply ML Data Scientist Intern (Toronto)",
        {"entities": [(0, 9, "COMPANY"), (10, 35, "JOB_TITLE"), (37, 44, "LOCATION")]},
    ),
    (
        "Pinterest Software Engineering Intern 2025 (Toronto)",
        {"entities": [(0, 9, "COMPANY"), (10, 42, "JOB_TITLE"), (44, 51, "LOCATION")]},
    ),
    (
        "Auvik Software Developer Co-op",
        {"entities": [(0, 5, "COMPANY"), (6, 30, "JOB_TITLE")]},
    ),
    (
        "Zip Software Engineer Intern (Fall 2025)",
        {"entities": [(0, 3, "COMPANY"), (4, 31, "JOB_TITLE")]},
    ),
    (
        "Naptha AI Software Engineer (Intern)",
        {"entities": [(0, 9, "COMPANY"), (10, 35, "JOB_TITLE")]},
    ),
    (
        "Boson AI Deep Learning Scientist",
        {"entities": [(0, 8, "COMPANY"), (9, 32, "JOB_TITLE")]},
    ),
    (
        "World Vision Canada Intern, Employee-Centric Delivery",
        {"entities": [(0, 21, "COMPANY"), (22, 57, "JOB_TITLE")]},
    ),
    (
        "BMO Developer - Data, AI and Platform Development & Support (New or Recent Graduate)",
        {"entities": [(0, 3, "COMPANY"), (4, 77, "JOB_TITLE")]},
    ),
    (
        "Amazon Robotics - Software Development Engineer Co-Op - 2025 - Toronto",
        {"entities": [(0, 15, "COMPANY"), (18, 61, "JOB_TITLE"), (64, 71, "LOCATION")]},
    ),
    (
        "Capital One Intern, Mobile Software Engineer - Team Capital One Travel - Fall 2025",
        {"entities": [(0, 11, "COMPANY"), (12, 71, "JOB_TITLE")]},
    ),
    (
        "NVIDIA Software Engineering Intern, Robotics Perception Research - Fall 2025",
        {"entities": [(0, 6, "COMPANY"), (7, 70, "JOB_TITLE")]},
    ),
]

# convert training data into spaCy example objects
# for each training sample, turn the raw string into doc (tokenized text), and add entity annotations to it

examples = []
for text, annotations in TRAIN_DATA:
    doc = nlp.make_doc(text)  # tokenize text
    example = Example.from_dict(doc, annotations)  # pair tokens, and entities
    examples.append(example)

# start training model
optimizer = nlp.begin_training()
for i in range(30):
    random.shuffle(examples)
    for example in examples:
        nlp.update([example], sgd=optimizer)

# save to disk
nlp.to_disk("models/job_post_ner")
print("model trained")
