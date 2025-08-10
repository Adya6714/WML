import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FriendCard from './FriendCard';
import ProfilePage from './ProfilePage';
import Confetti from 'react-confetti';

const FRIENDS = ["Stuti", "Khushi", "Vanya", "Aditi", "Avni", "Nandini", "Adya"];

function WordPicker() {
  const [word, setWord] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const getRandomWord = async () => {
    setIsFetching(true);
    const res = await axios.get('/random-word');
    setWord(res.data.word);
    setIsFetching(false);
  };

  const fetchStats = async () => {
    const res = await axios.get('/stats');
    setStats(res.data);
  };

  const assignWord = async (friend) => {
    if (!word) return;
    await axios.post('/assign-word', {
      person: friend,
      word: word
    });
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setSelectedFriend(friend);
    }, 1200);
  };

  const skipWord = async () => {
    if (!word) return;
    await axios.post('/return-word', { word });
    await getRandomWord();
  };

  useEffect(() => {
    getRandomWord();
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchStats, 4000);
    return () => clearInterval(interval);
  }, []);

  if (selectedFriend) return <ProfilePage friend={selectedFriend} />;

  return (
    <div>
      {showConfetti && <Confetti />}
      <h2 style={{
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#FF69B4'
      }}>
        🧠 Who's most like: <span style={{ color: '#00FFFF' }}>{word || (isFetching ? '...' : 'No more words')}</span>?
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <button onClick={skipWord} style={{
          padding: '0.5rem 1rem',
          background: '#1f6feb',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 'bold'
        }}>⏭️ Skip</button>
        <button onClick={getRandomWord} disabled={isFetching} style={{
          padding: '0.5rem 1rem',
          background: '#2ea043',
          opacity: isFetching ? 0.7 : 1,
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 'bold'
        }}>🎲 New Word</button>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '2rem'
      }}>
        {FRIENDS.map(name => (
          <FriendCard key={name} name={name} onClick={() => assignWord(name)} />
        ))}
      </div>

      {stats && (
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div style={{
            background: '#1e1e1e',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#87CEEB' }}>📊 Pool</h3>
            <div>Unused: <strong>{stats.unused_count}</strong></div>
            <div>Used: <strong>{stats.used_count}</strong></div>
          </div>
          <div style={{
            background: '#1e1e1e',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#FFD700' }}>🏆 Leaderboard</h3>
            <ul style={{ margin: 0 }}>
              {Object.entries(stats.friend_counts)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <li key={name}>{name}: <strong>{count}</strong></li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default WordPicker;