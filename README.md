## WML — Who’s Most Like…?

A lightweight full‑stack game where you draw a random word and tag the friend who best matches the vibe. Comes with confetti, a live leaderboard, and playful profile pages.

### Features
- Random word picker with skip/return
- One‑click assignment of words to friends
- Auto‑updating leaderboard and pool stats
- Playful friend profiles
- Modern, classy UI with hover effects and confetti

### Tech Stack
- Backend: Flask + Flask‑CORS
- Frontend: React (Create React App), axios, react‑confetti
- Data: JSON files stored on disk

### Repository Structure
```
WML/
  backend/
    app.py                 # Flask API server
    data/
      friends.json         # Friend bios + assigned words
      words.json           # Word pool (unused/used)
    requirements.txt       # Backend deps
  frontend/
    package.json           # Frontend deps + scripts + proxy
    src/
      components/          # React components (WordPicker, FriendCard, ProfilePage)
      App.js, index.js, index.css
  database/                # (reserved for future)
```

---

## Quick Start

### Prerequisites
- Python 3.10+ (3.11 recommended)
- Node 18+ and npm 9+

### 1) Backend
Install dependencies and run the API server.

Option A: Standard virtualenv
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Option B: User install (handy on low disk machines)
```bash
python3 -m pip install --user -r backend/requirements.txt
python3 backend/app.py
```
The server runs on http://127.0.0.1:5000

Health check:
```bash
curl http://127.0.0.1:5000/health
```

### 2) Frontend
Install and start the React dev server.
```bash
cd frontend
npm install
npm start
```
- App: http://localhost:3000
- API proxy: `proxy` is set to `http://localhost:5000`, so frontend uses relative paths like `/random-word`.

---

## Gameplay Flow
1) Open the app and get a random word
2) Click a friend card to assign the word
3) Confetti pops; you’re shown the friend’s profile and tags
4) Use Skip to return a word to the pool and draw another
5) Watch the live leaderboard update as tags accumulate

---

## API Reference
Base URL: `http://localhost:5000`

- GET `/health` or `/ping`
  - Returns `{ message: "pong" }`

- GET `/random-word`
  - Returns `{ word: string | null, message?: string }`
  - Moves the word from `unused` to `used`.

- POST `/return-word`
  - Body: `{ word: string }`
  - Returns a used word back to the `unused` pool (idempotent).

- POST `/assign-word`
  - Body: `{ person: string, word: string }`
  - Appends the word to the friend’s `assigned` array.

- GET `/profile/<name>`
  - Returns the profile record for the given friend name.

- GET `/friends`
  - Returns all friends with bios and assigned tags.

- GET `/stats`
  - Returns `{ unused_count, used_count, friend_counts: { [name]: number } }`.

Example:
```bash
curl http://localhost:5000/random-word
curl -X POST http://localhost:5000/assign-word \
  -H 'Content-Type: application/json' \
  -d '{"person":"Adya","word":"book"}'
```

---

## Data Model
- `backend/data/words.json`
  - `unused: string[]` — available words
  - `used: string[]` — previously drawn words

- `backend/data/friends.json`
  - `{ [name: string]: { intro: string, assigned: string[] } }`

Adding a new friend:
1) Add a new key under `friends.json` with `intro` and an empty `assigned` array
2) The frontend renders friend cards from a fixed list in `WordPicker.js` (`FRIENDS` array). Add the name there to expose it in the UI.

Resetting the pool:
- To reset the game, move words from `used` back into `unused` and/or clear `assigned` arrays in `friends.json` as desired.

---

## Development Notes
- Frontend dev server proxies unknown requests to `http://localhost:5000`.
- API calls use relative paths (e.g., `/random-word`), so no CORS issues during dev.
- Styling uses inline CSS for simplicity; swap to `styled-components` or CSS modules if you prefer.

### Scripts
Frontend:
- `npm start` — React dev server (port 3000)
- `npm run build` — Production build to `frontend/build`

Backend:
- `python backend/app.py` — Dev server (port 5000)
- `gunicorn -w 2 -b 0.0.0.0:5000 app:app` (from `backend/`) — Production WSGI server

---

## Troubleshooting
- Port already in use:
  - Backend: change port in `app.py` or kill the process using port 5000
  - Frontend: CRA will prompt to use another port
- Proxy not working:
  - Ensure backend is running on `http://localhost:5000`
  - Confirm `frontend/package.json` contains `"proxy": "http://localhost:5000"`
- CORS errors:
  - Should not occur in dev due to proxy; in production, serve both behind the same origin or configure CORS
- Low disk space (macOS):
  - Prefer `--user` installs for Python packages
  - Clean `node_modules` and reinstall: `rm -rf frontend/node_modules && (cd frontend && npm install)`

---

## Production Notes
- Serve the React build via any static file host (e.g., Nginx) and reverse‑proxy to the Flask API
- Run Flask with a WSGI server such as `gunicorn` or `uWSGI`
- Persist `backend/data/*.json` if you want to retain game state across deployments

---

## License
This project is for personal/educational use. Add a license if you plan to distribute. 