from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random

print("App started")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WORDS_PATH = os.path.join(BASE_DIR, "data", "words.json")
FRIENDS_PATH = os.path.join(BASE_DIR, "data", "friends.json")

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
    try:
        data = load_words()
        if not data['unused']:
            return jsonify({"word": None, "message": "No more words!"})
        word = random.choice(data['unused'])
        data['unused'].remove(word)
        data['used'].append(word)
        save_words(data)
        return jsonify({"word": word})
    except Exception as e:
        print(f"Error in /random-word: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/return-word', methods=['POST'])
def return_word():
    try:
        content = request.get_json(force=True)
        word = content.get('word')
        if not word:
            return jsonify({"error": "'word' is required"}), 400

        words_data = load_words()
        if word in words_data['used']:
            words_data['used'].remove(word)
            if word not in words_data['unused']:
                words_data['unused'].append(word)
            save_words(words_data)
            return jsonify({"message": f"Returned '{word}' to the pool."})
        # If the word was not in used, treat as idempotent success
        return jsonify({"message": f"'{word}' is already available."})
    except Exception as e:
        print(f"Error in /return-word: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/assign-word', methods=['POST'])
def assign_word():
    try:
        content = request.get_json(force=True)
        person = content['person']
        word = content['word']

        friends = load_friends()
        if person not in friends:
            return jsonify({"error": f"Unknown person '{person}'"}), 404
        if word not in friends[person]['assigned']:
            friends[person]['assigned'].append(word)
            save_friends(friends)
        return jsonify({"message": f"{word} assigned to {person}!"})
    except Exception as e:
        print(f"Error in /assign-word: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/friends', methods=['GET'])
def get_friends():
    try:
        return jsonify(load_friends())
    except Exception as e:
        print(f"Error in /friends: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        words = load_words()
        friends = load_friends()
        friend_counts = {name: len(info.get('assigned', [])) for name, info in friends.items()}
        return jsonify({
            "unused_count": len(words.get('unused', [])),
            "used_count": len(words.get('used', [])),
            "friend_counts": friend_counts
        })
    except Exception as e:
        print(f"Error in /stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/profile/<name>', methods=['GET'])
def get_profile(name):
    try:
        data = load_friends()
        return jsonify(data.get(name, {}))
    except Exception as e:
        print(f"Error in /profile/{name}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/ping', methods=['GET'])
@app.route('/health', methods=['GET'])
def ping():
    print("Ping/health endpoint was called")
    return jsonify({"message": "pong"})

if __name__ == '__main__':
    app.run(debug=True)