import spacy, random
from spacy.util import minibatch
import os
import random
from spacy.training.example import (
    Example,
)  # example -> combines raw text + annotations for training

# blank english NLP pipeline
nlp = spacy.load("en_core_web_trf")

# add named entity recognizer to pipeline
ner = nlp.get_pipe("ner")

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
    (
        "Backend Java Engineer (T4 Only) AMISEQ Toronto, ON (Hybrid)",
        {
            "entities": [
                (0, 31, "JOB_TITLE"),
                (32, 39, "COMPANY"),
                (40, 50, "LOCATION"),
            ]
        },
    ),
    (
        "Full Stack Engineering Lead NationGraph Toronto, ON (On-site)",
        {
            "entities": [
                (0, 27, "JOB_TITLE"),
                (28, 39, "COMPANY"),
                (40, 51, "LOCATION"),
            ]
        },
    ),
    (
        "Research and Development Intern Rocscience Toronto, ON (Hybrid)",
        {
            "entities": [
                (0, 31, "JOB_TITLE"),
                (32, 42, "COMPANY"),
                (43, 54, "LOCATION"),
            ]
        },
    ),
    (
        "React Native Developer (Internship) Xenara Inc. Mississauga, ON (On-site)",
        {
            "entities": [
                (0, 34, "JOB_TITLE"),
                (36, 47, "COMPANY"),
                (48, 63, "LOCATION"),
            ]
        },
    ),
    (
        "Python Developer Synchron Mississauga, ON",
        {
            "entities": [
                (0, 16, "JOB_TITLE"),  # "Python Developer"
                (17, 25, "COMPANY"),  # "Synchron"
                (26, 41, "LOCATION"),  # "Mississauga, ON"
            ]
        },
    ),
    (
        "Senior Java and Python Developer (with AWS skills) Luxoft Toronto, ON",
        {
            "entities": [
                (
                    0,
                    50,
                    "JOB_TITLE",
                ),  # "Senior Java and Python Developer (with AWS skills)"
                (51, 57, "COMPANY"),  # "Luxoft"
                (58, 69, "LOCATION"),  # "Toronto, ON"
            ]
        },
    ),
    (
        "Python Developer Tata Consultancy Services Toronto, ON",
        {
            "entities": [
                (0, 16, "JOB_TITLE"),  # "Python Developer"
                (17, 42, "COMPANY"),  # "Tata Consultancy Services"
                (43, 54, "LOCATION"),  # "Toronto, ON"
            ]
        },
    ),
    (
        "iOS Developer Akkodis Toronto, ON",
        {
            "entities": [
                (0, 13, "JOB_TITLE"),  # "iOS Developer"
                (14, 21, "COMPANY"),  # "Akkodis"
                (22, 33, "LOCATION"),  # "Toronto, ON"
            ]
        },
    ),
    (
        "Mainframe Developer Hays Ontario, Canada",
        {
            "entities": [
                (0, 19, "JOB_TITLE"),  # "Mainframe Developer"
                (20, 24, "COMPANY"),  # "Hays"
                (25, 40, "LOCATION"),  # "Ontario, Canada"
            ]
        },
    ),
    (
        "Artificial Intelligence Engineer Open Systems Technologies Mississauga, ON",
        {
            "entities": [
                (0, 32, "JOB_TITLE"),  # "Artificial Intelligence Engineer"
                (33, 58, "COMPANY"),  # "Open Systems Technologies"
                (59, 74, "LOCATION"),  # "Mississauga, ON"
            ]
        },
    ),
    (
        "Senior Java Full Stack Developer (Angular) Capgemini Mississauga, ON",
        {
            "entities": [
                (0, 42, "JOB_TITLE"),  # "Senior Java Full Stack Developer (Angular)"
                (43, 52, "COMPANY"),  # "Capgemini"
                (53, 68, "LOCATION"),  # "Mississauga, ON"
            ]
        },
    ),
    (
        "Senior Front End Developer Kubra Mississauga, ON",
        {
            "entities": [
                (0, 26, "JOB_TITLE")(27, 32, "COMPANY"),
                (33, 48, "LOCATION"),
            ]
        },
    ),
    (
        "Python Full Stack Engineer SII Canada Toronto, ON",
        {
            "entities": [
                (0, 26, "JOB_TITLE"),
                (27, 37, "COMPANY"),
                (38, 49, "LOCATION"),
            ]
        },
    ),
    (
        "Rust Engineer - Decentralized AI Models Axiom Recruit Canada",
        {
            "entities": [
                (0, 39, "JOB_TITLE"),
                (40, 53, "COMPANY"),
                (54, 60, "LOCATION"),
            ]
        },
    ),
]

# convert training data into spaCy example objects
# for each training sample, turn the raw string into doc (tokenized text), and add entity annotations to it

examples = []
for text, annotations in TRAIN_DATA:
    doc = nlp.make_doc(text)  # tokenize text
    example = Example.from_dict(doc, annotations)  # pair tokens, and entities
    examples.append(example)

# identify and disable all non-ner pipeline components (tok2vec, tagger, parser)
# building a list of everything except our named entity recognizer
# this makes it so it wont run on every update, speeding things up
other_pipes = [p for p in nlp.pipe_names if p != "ner"]
with nlp.disable_pipes(*other_pipes):
    optimizer = nlp.resume_training()
    # we loaded a pretrained model, so we resume training
    for epoch in range(30):
        random.shuffle(examples)
        losses = {}
        # train for 30 passes (epochs) over training data
        # shuffling the examples so each epoch avoids biasing the model for a particular order
        # losses dict to collect loss values for this epoch ( sum/average of the models prediction errors over all training examples in that epoch )
        for batch in minibatch(examples, size=8):
            nlp.update(batch, sgd=optimizer, drop=0.2, losses=losses)
        # split list of example in small batches up to 8 samples eachy
        # on each batch, the model does a forward pass: predicts entity labels for all examples in the batch
        # compute loss, measures how far those predictions are from actual annotations
        # backward pass, uses that loss to ajust (optimizer) the ner weights to improve model
        # dropout (drop=0.2) -> randomly drops 20% of models internal connections to reduce overfitting
        # accumulate, adds batch contributions to running total in losses[ner]
        print(f"Epoch {epoch+1} — Loss: {losses['ner']:.3f}")


# save to disk
nlp.to_disk("models/job_post_ner")
print("model trained")


# spacy train config.cfg --output ./models --paths.train ./train.spacy --paths.dev ./dev.spacy
