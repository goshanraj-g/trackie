import spacy
import random
from spacy.util import minibatch
from spacy.training.example import Example
import os

# load the model
nlp = spacy.load("en_core_web_trf")

# get the named entity recognizer entity
ner = nlp.get_pipe("ner")

# create models directory
os.makedirs("models", exist_ok=True)

# Add new labels
ner.add_label("COMPANY")
ner.add_label("JOB_TITLE")
ner.add_label("LOCATION")

# training data
TRAIN_DATA = [
    # standard formats
    (
        "Software Engineer at Google",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 27, "COMPANY")]},
    ),
    (
        "Data Scientist at Meta",
        {"entities": [(0, 14, "JOB_TITLE"), (18, 22, "COMPANY")]},
    ),
    (
        "Product Manager at Amazon",
        {"entities": [(0, 15, "JOB_TITLE"), (19, 25, "COMPANY")]},
    ),
    (
        "Frontend Developer at Shopify",
        {"entities": [(0, 18, "JOB_TITLE"), (22, 29, "COMPANY")]},
    ),
    (
        "DevOps Engineer at Netflix",
        {"entities": [(0, 15, "JOB_TITLE"), (19, 26, "COMPANY")]},
    ),
    # location after company
    (
        "Software Engineer at Google Toronto, ON",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 27, "COMPANY"), (28, 39, "LOCATION")]},
    ),
    (
        "Data Analyst at Meta Vancouver, BC",
        {"entities": [(0, 12, "JOB_TITLE"), (16, 20, "COMPANY"), (21, 34, "LOCATION")]},
    ),
    (
        "UX Designer at Airbnb San Francisco, CA",
        {"entities": [(0, 11, "JOB_TITLE"), (15, 21, "COMPANY"), (22, 39, "LOCATION")]},
    ),
    (
        "Backend Engineer at Stripe New York, NY",
        {"entities": [(0, 16, "JOB_TITLE"), (20, 26, "COMPANY"), (27, 39, "LOCATION")]},
    ),
    (
        "Machine Learning Engineer at OpenAI Toronto, Canada",
        {"entities": [(0, 25, "JOB_TITLE"), (29, 35, "COMPANY"), (36, 51, "LOCATION")]},
    ),
    # companyt name first
    (
        "Microsoft Software Development Engineer",
        {"entities": [(0, 9, "COMPANY"), (10, 39, "JOB_TITLE")]},
    ),
    (
        "Apple iOS Developer",
        {"entities": [(0, 5, "COMPANY"), (6, 19, "JOB_TITLE")]},
    ),
    (
        "Tesla Automotive Software Engineer",
        {"entities": [(0, 5, "COMPANY"), (6, 34, "JOB_TITLE")]},
    ),
    (
        "Spotify Backend Developer",
        {"entities": [(0, 7, "COMPANY"), (8, 25, "JOB_TITLE")]},
    ),
    (
        "Uber Senior Software Engineer",
        {"entities": [(0, 4, "COMPANY"), (5, 29, "JOB_TITLE")]},
    ),
    # company name, and location
    (
        "Google Software Engineer Toronto, ON",
        {"entities": [(0, 6, "COMPANY"), (7, 24, "JOB_TITLE"), (25, 36, "LOCATION")]},
    ),
    (
        "Amazon Web Services Cloud Engineer Vancouver, BC",
        {"entities": [(0, 19, "COMPANY"), (20, 34, "JOB_TITLE"), (35, 48, "LOCATION")]},
    ),
    (
        "IBM Data Scientist Montreal, QC",
        {"entities": [(0, 3, "COMPANY"), (4, 18, "JOB_TITLE"), (19, 31, "LOCATION")]},
    ),
    (
        "Salesforce Product Manager San Francisco, CA",
        {"entities": [(0, 10, "COMPANY"), (11, 26, "JOB_TITLE"), (27, 44, "LOCATION")]},
    ),
    (
        "Shopify Full Stack Developer Ottawa, ON",
        {"entities": [(0, 7, "COMPANY"), (8, 29, "JOB_TITLE"), (30, 39, "LOCATION")]},
    ),
    # internships
    (
        "Software Engineering Intern at Facebook",
        {"entities": [(0, 27, "JOB_TITLE"), (31, 39, "COMPANY")]},
    ),
    (
        "Data Science Intern at LinkedIn",
        {"entities": [(0, 19, "JOB_TITLE"), (23, 31, "COMPANY")]},
    ),
    (
        "Google Software Engineer Intern",
        {"entities": [(0, 6, "COMPANY"), (7, 32, "JOB_TITLE")]},
    ),
    (
        "Microsoft Product Management Intern Seattle, WA",
        {"entities": [(0, 9, "COMPANY"), (10, 35, "JOB_TITLE"), (36, 47, "LOCATION")]},
    ),
    (
        "Amazon SDE Intern Toronto, ON",
        {"entities": [(0, 6, "COMPANY"), (7, 17, "JOB_TITLE"), (18, 29, "LOCATION")]},
    ),
    # senior/leads
    (
        "Senior Software Engineer at Slack",
        {"entities": [(0, 24, "JOB_TITLE"), (28, 33, "COMPANY")]},
    ),
    (
        "Lead Data Scientist at Palantir",
        {"entities": [(0, 19, "JOB_TITLE"), (23, 31, "COMPANY")]},
    ),
    (
        "Principal Engineer at Databricks",
        {"entities": [(0, 18, "JOB_TITLE"), (22, 32, "COMPANY")]},
    ),
    (
        "Staff Software Engineer at GitHub",
        {"entities": [(0, 23, "JOB_TITLE"), (27, 33, "COMPANY")]},
    ),
    (
        "Senior Product Manager at Zoom",
        {"entities": [(0, 22, "JOB_TITLE"), (26, 30, "COMPANY")]},
    ),
    # co-op
    (
        "Software Developer Co-op at Blackberry",
        {"entities": [(0, 24, "JOB_TITLE"), (28, 38, "COMPANY")]},
    ),
    (
        "Data Analyst Co-op at RBC",
        {"entities": [(0, 18, "JOB_TITLE"), (22, 25, "COMPANY")]},
    ),
    (
        "Shopify Software Engineer Co-op Waterloo, ON",
        {"entities": [(0, 7, "COMPANY"), (8, 31, "JOB_TITLE"), (32, 45, "LOCATION")]},
    ),
    (
        "TD Bank QA Engineer Co-op Toronto, ON",
        {"entities": [(0, 7, "COMPANY"), (8, 25, "JOB_TITLE"), (26, 37, "LOCATION")]},
    ),
    (
        "Wealthsimple Backend Developer Co-op",
        {"entities": [(0, 12, "COMPANY"), (13, 36, "JOB_TITLE")]},
    ),
    # specific tech 
    (
        "React Developer at Notion",
        {"entities": [(0, 15, "JOB_TITLE"), (19, 25, "COMPANY")]},
    ),
    (
        "Python Developer at Dropbox",
        {"entities": [(0, 16, "JOB_TITLE"), (20, 27, "COMPANY")]},
    ),
    (
        "Node.js Engineer at Discord",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 28, "COMPANY")]},
    ),
    (
        "DevOps Engineer at HashiCorp",
        {"entities": [(0, 15, "JOB_TITLE"), (19, 28, "COMPANY")]},
    ),
    (
        "Mobile Developer at Snapchat",
        {"entities": [(0, 16, "JOB_TITLE"), (20, 28, "COMPANY")]},
    ),
    # freelance/contract
    (
        "Contract Software Engineer at Upwork",
        {"entities": [(0, 27, "JOB_TITLE"), (31, 37, "COMPANY")]},
    ),
    (
        "Freelance Web Developer at Fiverr",
        {"entities": [(0, 23, "JOB_TITLE"), (27, 33, "COMPANY")]},
    ),
    (
        "Consultant Data Scientist at Accenture",
        {"entities": [(0, 25, "JOB_TITLE"), (29, 38, "COMPANY")]},
    ),
    # remote positions
    (
        "Remote Software Engineer at GitLab",
        {"entities": [(0, 24, "JOB_TITLE"), (28, 34, "COMPANY")]},
    ),
    (
        "Software Engineer (Remote) at Atlassian",
        {"entities": [(0, 26, "JOB_TITLE"), (30, 39, "COMPANY")]},
    ),
    (
        "Shopify Remote Frontend Developer Canada",
        {"entities": [(0, 7, "COMPANY"), (8, 33, "JOB_TITLE"), (34, 40, "LOCATION")]},
    ),
    # canadian companies and locations
    (
        "Software Developer at Cohere Toronto, ON",
        {"entities": [(0, 18, "JOB_TITLE"), (22, 28, "COMPANY"), (29, 40, "LOCATION")]},
    ),
    (
        "Machine Learning Engineer at Coveo Quebec City, QC",
        {"entities": [(0, 25, "JOB_TITLE"), (29, 34, "COMPANY"), (35, 50, "LOCATION")]},
    ),
    (
        "Hootsuite Social Media Developer Vancouver, BC",
        {"entities": [(0, 9, "COMPANY"), (10, 32, "JOB_TITLE"), (33, 46, "LOCATION")]},
    ),
    (
        "Mogo Fintech Developer Calgary, AB",
        {"entities": [(0, 4, "COMPANY"), (5, 22, "JOB_TITLE"), (23, 34, "LOCATION")]},
    ),
    (
        "Nuvei Payment Systems Engineer Montreal, QC",
        {"entities": [(0, 5, "COMPANY"), (6, 30, "JOB_TITLE"), (31, 43, "LOCATION")]},
    ),
    # different location formats
    (
        "Software Engineer at Google • Toronto, Ontario",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 27, "COMPANY"), (30, 47, "LOCATION")]},
    ),
    (
        "Data Scientist at Meta | Vancouver, British Columbia",
        {"entities": [(0, 14, "JOB_TITLE"), (18, 22, "COMPANY"), (25, 52, "LOCATION")]},
    ),
    (
        "Product Manager at Amazon - Seattle, Washington",
        {"entities": [(0, 15, "JOB_TITLE"), (19, 25, "COMPANY"), (28, 47, "LOCATION")]},
    ),
    # entry level positions
    (
        "Junior Software Developer at Wix",
        {"entities": [(0, 25, "JOB_TITLE"), (29, 32, "COMPANY")]},
    ),
    (
        "Entry Level Data Analyst at IBM",
        {"entities": [(0, 24, "JOB_TITLE"), (28, 31, "COMPANY")]},
    ),
    (
        "Graduate Software Engineer at Palantir",
        {"entities": [(0, 26, "JOB_TITLE"), (30, 38, "COMPANY")]},
    ),
    (
        "New Grad SDE at Amazon",
        {"entities": [(0, 12, "JOB_TITLE"), (16, 22, "COMPANY")]},
    ),
    # multi-word company names
    (
        "Software Engineer at Goldman Sachs",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 34, "COMPANY")]},
    ),
    (
        "Data Scientist at JP Morgan Chase",
        {"entities": [(0, 14, "JOB_TITLE"), (18, 33, "COMPANY")]},
    ),
    (
        "Product Manager at Morgan Stanley",
        {"entities": [(0, 15, "JOB_TITLE"), (19, 33, "COMPANY")]},
    ),
    (
        "Deloitte Technology Consultant Toronto, ON",
        {"entities": [(0, 8, "COMPANY"), (9, 30, "JOB_TITLE"), (31, 42, "LOCATION")]},
    ),
    (
        "Ernst & Young Software Developer Vancouver, BC",
        {"entities": [(0, 13, "COMPANY"), (14, 32, "JOB_TITLE"), (33, 46, "LOCATION")]},
    ),
    # specialty roles
    (
        "Site Reliability Engineer at Google",
        {"entities": [(0, 25, "JOB_TITLE"), (29, 35, "COMPANY")]},
    ),
    (
        "Security Engineer at Cloudflare",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 31, "COMPANY")]},
    ),
    (
        "Platform Engineer at Kubernetes",
        {"entities": [(0, 17, "JOB_TITLE"), (21, 31, "COMPANY")]},
    ),
    (
        "Infrastructure Engineer at Docker",
        {"entities": [(0, 23, "JOB_TITLE"), (27, 33, "COMPANY")]},
    ),
    # variations with punctuation and formatting
    (
        "Software Engineer, Backend at Stripe",
        {"entities": [(0, 26, "JOB_TITLE"), (30, 36, "COMPANY")]},
    ),
    (
        "Senior Data Scientist (ML/AI) at Uber",
        {"entities": [(0, 29, "JOB_TITLE"), (33, 37, "COMPANY")]},
    ),
    (
        "Full-Stack Developer at Square",
        {"entities": [(0, 20, "JOB_TITLE"), (24, 30, "COMPANY")]},
    ),
    (
        "Front-end Engineer at Pinterest",
        {"entities": [(0, 19, "JOB_TITLE"), (23, 32, "COMPANY")]},
    ),
]

# convert training data into spaCy example objects
# for each training sample, turn the raw string into doc (tokenized text), and add entity annotations to it


def create_examples(train_data, nlp):
    """Convert training data to spaCy example objects with error handling"""
    examples = []
    skipped = 0

    for text, annotations in train_data:
        doc = nlp.make_doc(text)
        spans = []
        example_valid = True

        for start, end, label in annotations["entities"]:
            span = doc.char_span(start, end, label=label, alignment_mode="contract")
            if span is None:
                print(f"Skipping misaligned span: '{text[start:end]}' in: '{text}'")
                example_valid = False
                skipped += 1
                break
            spans.append(span)

        if example_valid:
            doc.ents = spans
            examples.append(
                Example.from_dict(
                    doc,
                    {"entities": [(s.start_char, s.end_char, s.label_) for s in spans]},
                )
            )

    print(f"Created {len(examples)} valid examples")
    if skipped > 0:
        print(f"Skipped {skipped} examples due to alignment issues")

    return examples


def train_model():
    print("Starting training...")

    # create examples
    examples = create_examples(TRAIN_DATA, nlp)

    if len(examples) == 0:
        print("No valid examples found. Check your annotations!")
        return

    # split data for validation
    split_idx = int(len(examples) * 0.8)
    train_examples = examples[:split_idx]
    val_examples = examples[split_idx:]

    print(
        f"Training on {len(train_examples)} examples, validating on {len(val_examples)} examples"
    )

    # training setup
    optimizer = nlp.resume_training()

    # trying different learning rates if loss is stuck
    optimizer.learn_rate = 0.001  

    best_loss = float("inf")
    patience = 15
    no_improve = 0

    # disable other pipes during training
    with nlp.disable_pipes("parser", "tagger", "attribute_ruler", "lemmatizer"):
        for epoch in range(100):  # mre epochs
            random.shuffle(train_examples)
            losses = {}

            # smaller batch size for better learning
            batch_size = 4 if len(train_examples) > 16 else 2

            for batch in minibatch(train_examples, size=batch_size):
                nlp.update(batch, sgd=optimizer, drop=0.35, losses=losses)

            current_loss = losses.get("ner", 0)

            # early stopping logic if worse
            if current_loss < best_loss:
                best_loss = current_loss
                no_improve = 0
                # save best model
                nlp.to_disk("models/job_post_ner_best")
            else:
                no_improve += 1

            print(
                f"Epoch {epoch+1:3d} — Loss: {current_loss:.3f} (Best: {best_loss:.3f})"
            )

            # early stopping
            if no_improve >= patience:
                print(
                    f"Early stopping at epoch {epoch+1} (no improvement for {patience} epochs)"
                )
                break

            # stop if loss gets very low
            if current_loss < 5.0:
                print(f"Training complete! Loss below 5.0")
                break

    # final save
    nlp.to_disk("models/job_post_ner_final")
    print("Model training completed and saved")

    # quick test
    test_texts = [
        "Software Engineer at Google",
        "Data Scientist at Meta Toronto, ON",
        "Microsoft Senior Developer",
    ]

    print("\nQuick test:")
    for text in test_texts:
        doc = nlp(text)
        entities = [(ent.text, ent.label_) for ent in doc.ents]
        print(f"'{text}' -> {entities}")


if __name__ == "__main__":
    train_model()
