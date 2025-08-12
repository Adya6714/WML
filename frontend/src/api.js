import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getRandomWord() {
  const res = await api.get('/random-word');
  return res.data;
}

export async function returnWord(word) {
  const res = await api.post('/return-word', { word });
  return res.data;
}

export async function assignWord(person, word) {
  const res = await api.post('/assign-word', { person, word });
  return res.data;
}

export async function unassignWord(person, word) {
  const res = await api.post('/unassign-word', { person, word });
  return res.data;
}

export async function getStats() {
  const res = await api.get('/stats');
  return res.data;
}

export async function getProfile(name) {
  const res = await api.get(`/profile/${encodeURIComponent(name)}`);
  return res.data;
}

export async function getFriends() {
  const res = await api.get('/friends');
  return res.data;
}

export default api; 