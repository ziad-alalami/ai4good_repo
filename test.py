from model.bert.inference import Classifier
import time

classifier = Classifier("model/bert/runs/1760284002/best_model.pt")

start_time = time.time()
pred, probs = classifier.predict("data/Recording.m4a", gender="male")
end_time = time.time()

print(pred, probs, end_time - start_time)