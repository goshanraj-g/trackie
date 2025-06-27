import spacy

# Load your trained model
nlp = spacy.load("models/job_post_ner_final")

# Try it out
test_texts = [
    "Software Engineer at Google",
    "Meta is hiring a Data Scientist in Vancouver, BC",
    "New Grad SDE at Amazon Toronto, ON",
]

for text in test_texts:
    doc = nlp(text)
    print(f"\nText: {text}")
    for ent in doc.ents:
        print(f"→ {ent.text} ({ent.label_})")
