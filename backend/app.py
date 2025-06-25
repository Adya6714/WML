from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

WORDS_PATH = os.path.join("data", "words.json")
FRIENDS_PATH = os.path.join("data", "friends.json")

# Load word data
def load_words():
    with open(WORDS_PATH, "r") as f:
        return json.load(f)

def save_words(data):
    with open(WORDS_PATH, "w") as f:
        json.dump(data, f, indent=2)

# Load friends data
def load_friends():
    with open(FRIENDS_PATH, "r") as f:
        return json.load(f)

def save_friends(data):
    with open(FRIENDS_PATH, "w") as f:
        json.dump(data, f, indent=2)

@app.route('/random-word', methods=['GET'])
def get_random_word():
    data = load_words()
    if not data['unused']:
        return jsonify({"word": None, "message": "No more words!"})
    
    import random
    word = random.choice(data['unused'])
    data['unused'].remove(word)
    data['used'].append(word)
    save_words(data)
    return jsonify({"word": word})

@app.route('/assign-word', methods=['POST'])
def assign_word():
    content = request.get_json()
    person = content['person']
    word = content['word']

    data = load_friends()
    data[person]['assigned'].append(word)
    save_friends(data)
    return jsonify({"message": f"{word} assigned to {person}!"})

@app.route('/profile/<name>', methods=['GET'])
def get_profile(name):
    data = load_friends()
    return jsonify(data.get(name, {}))

if __name__ == '__main__':
    app.run(debug=True)