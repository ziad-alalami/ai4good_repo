from model.bert.inference import Classifier
import time

classifier = Classifier("data/models/best_model.pt")

start_time = time.time()
pred, probs = classifier.predict("data/torgo_data/dysarthria_male/M01_Session1_0005.wav", gender="male")
# pred, probs = classifier.predict("data/Recording.m4a", gender="male")
end_time = time.time()

print(pred, probs, end_time - start_time)