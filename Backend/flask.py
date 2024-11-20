from flask import Flask, request, jsonify
import random
import string
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)

# Load model and tokenizer
model_name = "/kaggle/input/high-quality-multilingual-translation-data"  # Example model (English to French)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Helper function for translation
def translate(text, model, tokenizer, device):
    inputs = tokenizer(text, return_tensors="pt", padding=True).to(device)
    outputs = model.generate(**inputs)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Helper function to generate random words
def generate_random_words(num_words=5):
    words = []
    for _ in range(num_words):
        word_length = random.randint(3, 10)
        word = ''.join(random.choices(string.ascii_lowercase, k=word_length))
        words.append(word)
    return words

@app.route('/translate', methods=['POST'])
def api_translate():
    text = request.json.get('text', '')
    translated_text = translate(text, model, tokenizer, device)
    return jsonify({'translated_text': translated_text})

@app.route('/random_words', methods=['GET'])
def api_random_words():
    num_words = request.args.get('num_words', default=5, type=int)
    random_words = generate_random_words(num_words)
    return jsonify({'random_words': random_words})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
