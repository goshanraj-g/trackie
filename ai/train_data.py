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
    {
        "text": "Product Designer  SecureSoft Ottawa, ON",
        "entities": [[0, 16, "JOB_TITLE"], [18, 28, "COMPANY"], [29, 39, "LOCATION"]],
    },
    {
        "text": "Cloud Solutions Architect (Application in Description) DataBridge Analytics Vancouver, BC (Remote)",
        "entities": [[0, 25, "JOB_TITLE"], [55, 75, "COMPANY"], [76, 98, "LOCATION"]],
    },
    {
        "text": "Frontend Developer - Apply Now Nimbus Cloud Systems Ottawa, ON",
        "entities": [[0, 18, "JOB_TITLE"], [31, 51, "COMPANY"], [52, 62, "LOCATION"]],
    },
    {
        "text": "Product Designer - Apply Now NeoBank Victoria, BC (Remote)",
        "entities": [[0, 16, "JOB_TITLE"], [29, 36, "COMPANY"], [37, 58, "LOCATION"]],
    },
    {
        "text": "Senior Data Analyst (Application in Description) DataBridge Analytics Ottawa, ON",
        "entities": [[0, 19, "JOB_TITLE"], [49, 69, "COMPANY"], [70, 80, "LOCATION"]],
    },
    {
        "text": "Security Engineer (Application in Description) QuantumBit AI Victoria, BC (Remote)",
        "entities": [[0, 17, "JOB_TITLE"], [47, 60, "COMPANY"], [61, 82, "LOCATION"]],
    },
    {
        "text": "Full Stack Engineer - Immediate Start PixelCraft Studios Toronto, ON (Hybrid)",
        "entities": [[0, 19, "JOB_TITLE"], [38, 56, "COMPANY"], [57, 77, "LOCATION"]],
    },
    {
        "text": "AI Research Intern - Apply Now NeoBank Calgary, AB (Hybrid)",
        "entities": [[0, 18, "JOB_TITLE"], [31, 38, "COMPANY"], [39, 59, "LOCATION"]],
    },
    {
        "text": "Backend Developer - Apply Now PixelCraft Studios Toronto, ON (Hybrid)",
        "entities": [[0, 17, "JOB_TITLE"], [30, 48, "COMPANY"], [49, 69, "LOCATION"]],
    },
    {
        "text": "Full Stack Engineer  TechNova Inc. Montreal, QC (On-site)",
        "entities": [[0, 19, "JOB_TITLE"], [21, 34, "COMPANY"], [35, 57, "LOCATION"]],
    },
    {
        "text": "Frontend Developer  QuantumBit AI Toronto, ON (Hybrid)",
        "entities": [[0, 18, "JOB_TITLE"], [20, 33, "COMPANY"], [34, 54, "LOCATION"]],
    },
    {
        "text": "AI Research Intern - Apply Now QuantumBit AI Victoria, BC (Remote)",
        "entities": [[0, 18, "JOB_TITLE"], [31, 44, "COMPANY"], [45, 66, "LOCATION"]],
    },
    {
        "text": "Backend Developer (Application in Description) CodeNest Victoria, BC (Remote)",
        "entities": [[0, 17, "JOB_TITLE"], [47, 55, "COMPANY"], [56, 77, "LOCATION"]],
    },
    {
        "text": "Senior Data Analyst - Apply Now PixelCraft Studios Victoria, BC (Remote)",
        "entities": [[0, 19, "JOB_TITLE"], [32, 50, "COMPANY"], [51, 72, "LOCATION"]],
    },
    {
        "text": "Backend Developer - Apply Now Nimbus Cloud Systems Ottawa, ON",
        "entities": [[0, 17, "JOB_TITLE"], [30, 50, "COMPANY"], [51, 61, "LOCATION"]],
    },
    {
        "text": "Security Engineer (Promoted) StartLoop Ottawa, ON",
        "entities": [[0, 17, "JOB_TITLE"], [29, 38, "COMPANY"], [39, 49, "LOCATION"]],
    },
    {
        "text": "Machine Learning Engineer - Apply Now SecureSoft Ottawa, ON",
        "entities": [[0, 25, "JOB_TITLE"], [38, 48, "COMPANY"], [49, 59, "LOCATION"]],
    },
    {
        "text": "Full Stack Engineer - Apply Now DataBridge Analytics Montreal, QC (On-site)",
        "entities": [[0, 19, "JOB_TITLE"], [32, 52, "COMPANY"], [53, 75, "LOCATION"]],
    },
    {
        "text": "Security Engineer  StartLoop Victoria, BC (Remote)",
        "entities": [[0, 17, "JOB_TITLE"], [19, 28, "COMPANY"], [29, 50, "LOCATION"]],
    },
    {
        "text": "AI Research Intern (Promoted) TechNova Inc. Edmonton, AB",
        "entities": [[0, 18, "JOB_TITLE"], [30, 43, "COMPANY"], [44, 56, "LOCATION"]],
    },
    {
        "text": "Backend Developer (Promoted) CodeNest Montreal, QC (On-site)",
        "entities": [[0, 17, "JOB_TITLE"], [29, 37, "COMPANY"], [38, 60, "LOCATION"]],
    },
    {
        "text": "Security Engineer - Apply Now Nimbus Cloud Systems Halifax, NS",
        "entities": [[0, 17, "JOB_TITLE"], [30, 50, "COMPANY"], [51, 62, "LOCATION"]],
    },
    {
        "text": "Frontend Developer - Immediate Start DataBridge Analytics Ottawa, ON",
        "entities": [[0, 18, "JOB_TITLE"], [37, 57, "COMPANY"], [58, 68, "LOCATION"]],
    },
    {
        "text": "Senior Data Analyst - Immediate Start SecureSoft Montreal, QC (On-site)",
        "entities": [[0, 19, "JOB_TITLE"], [38, 48, "COMPANY"], [49, 71, "LOCATION"]],
    },
    {
        "text": "Frontend Developer - Apply Now NeoBank Halifax, NS",
        "entities": [[0, 18, "JOB_TITLE"], [31, 38, "COMPANY"], [39, 50, "LOCATION"]],
    },
    {
        "text": "Software Engineer - Immediate Start NeoBank Calgary, AB (Hybrid)",
        "entities": [[0, 17, "JOB_TITLE"], [36, 43, "COMPANY"], [44, 64, "LOCATION"]],
    },
    {
        "text": "Machine Learning Engineer  SecureSoft Calgary, AB (Hybrid)",
        "entities": [[0, 25, "JOB_TITLE"], [27, 37, "COMPANY"], [38, 58, "LOCATION"]],
    },
    {
        "text": "Senior Data Analyst  NeoBank Halifax, NS",
        "entities": [[0, 19, "JOB_TITLE"], [21, 28, "COMPANY"], [29, 40, "LOCATION"]],
    },
    {
        "text": "Product Designer - Apply Now TechNova Inc. Victoria, BC (Remote)",
        "entities": [[0, 16, "JOB_TITLE"], [29, 42, "COMPANY"], [43, 64, "LOCATION"]],
    },
    {
        "text": "Full Stack Engineer (Application in Description) BlueRocket Labs Edmonton, AB",
        "entities": [[0, 19, "JOB_TITLE"], [49, 64, "COMPANY"], [65, 77, "LOCATION"]],
    },
    {
        "text": "AI Research Intern - Apply Now TechNova Inc. Victoria, BC (Remote)",
        "entities": [[0, 18, "JOB_TITLE"], [31, 44, "COMPANY"], [45, 66, "LOCATION"]],
    },
    {
        "text": "Frontend Developer (Application in Description) BlueRocket Labs Montreal, QC (On-site)",
        "entities": [[0, 18, "JOB_TITLE"], [48, 63, "COMPANY"], [64, 86, "LOCATION"]],
    },
    {
        "text": "Product Designer (Application in Description) StartLoop Vancouver, BC (Remote)",
        "entities": [[0, 16, "JOB_TITLE"], [46, 55, "COMPANY"], [56, 78, "LOCATION"]],
    },
    {
        "text": "Machine Learning Engineer (Application in Description) NeoBank Calgary, AB (Hybrid)",
        "entities": [[0, 25, "JOB_TITLE"], [55, 62, "COMPANY"], [63, 83, "LOCATION"]],
    },
    {
        "text": "Backend Developer (Promoted) BlueRocket Labs Halifax, NS",
        "entities": [[0, 17, "JOB_TITLE"], [29, 44, "COMPANY"], [45, 56, "LOCATION"]],
    },
    {
        "text": "AI Research Intern (Promoted) SecureSoft Calgary, AB (Hybrid)",
        "entities": [[0, 18, "JOB_TITLE"], [30, 40, "COMPANY"], [41, 61, "LOCATION"]],
    },
    {
        "text": "DevOps Engineer (Application in Description) CodeNest Toronto, ON (Hybrid)",
        "entities": [[0, 15, "JOB_TITLE"], [45, 53, "COMPANY"], [54, 74, "LOCATION"]],
    },
    {
        "text": "Software Engineer - Apply Now SecureSoft Vancouver, BC (Remote)",
        "entities": [[0, 17, "JOB_TITLE"], [30, 40, "COMPANY"], [41, 63, "LOCATION"]],
    },
    {
        "text": "Product Designer (Application in Description) StartLoop Edmonton, AB",
        "entities": [[0, 16, "JOB_TITLE"], [46, 55, "COMPANY"], [56, 68, "LOCATION"]],
    },
    {
        "text": "Frontend Developer - Immediate Start DataBridge Analytics Edmonton, AB",
        "entities": [[0, 18, "JOB_TITLE"], [37, 57, "COMPANY"], [58, 70, "LOCATION"]],
    },
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
