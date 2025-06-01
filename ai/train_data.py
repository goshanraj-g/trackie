import spacy
from spacy.training.example import Example # example -> combines raw text + annotations for training

# blank english NLP pipeline
nlp = spacy.blank("en")

# add named entity recognizer to pipeline
ner = nlp.add_pipe("ner")

# define new entity titles for training
ner.add_label("COMPANY")
ner.add_label("JOB_TITLE")
ner.add_label("LOCATION")

# training data
TRAIN_DATA = []

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
    for example in examples:
        nlp.update([example], sgd=optimizer)  # update model weights

# save to disk
nlp.to_dist("models/job_post_ner")
print("model trained")
