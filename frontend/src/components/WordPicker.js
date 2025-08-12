import React, { useEffect, useState } from 'react';
import FriendCard from './FriendCard';
import ProfilePage from './ProfilePage';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';
import { assignWord as apiAssignWord, getRandomWord as apiGetRandomWord, getStats as apiGetStats, returnWord as apiReturnWord } from '../api';

const FRIENDS = ["Stuti", "Khushi", "Vanya", "Aditi", "Avni", "Nandini", "Adya"];

const CONFETTI_CONFIG = {
  numberOfPieces: 220,
  gravity: 0.25,
  tweenDuration: 1200,
  recycle: false,
  wind: 0.02,
  initialVelocityX: { min: -8, max: 8 },
  initialVelocityY: { min: -12, max: -18 }
};

function WordPicker() {
  const [word, setWord] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [assigningTo, setAssigningTo] = useState(null);
  const { width, height } = useWindowSize();

  const hasWord = !!word;

  const getRandomWord = async () => {
    try {
      setIsFetching(true);
      setError(null);
      const data = await apiGetRandomWord();
      setWord(data.word);
    } catch (e) {
      setError('Failed to fetch a word.');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiGetStats();
      setStats(data);
    } catch {
      // ignore casual stats errors
    }
  };

  const assignWord = async (friend) => {
    if (!hasWord || assigningTo) return;
    try {
      setAssigningTo(friend);
      await apiAssignWord(friend, word);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedFriend(friend);
      }, 1200);
    } catch (e) {
      setError('Failed to assign. Try again.');
    } finally {
      setAssigningTo(null);
    }
  };

  const skipWord = async () => {
    if (!hasWord || isFetching) return;
    try {
      await apiReturnWord(word);
    } finally {
      await getRandomWord();
    }
  };

  useEffect(() => {
    getRandomWord();
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchStats, 4000);
    return () => clearInterval(interval);
  }, []);

  if (selectedFriend) return <ProfilePage friend={selectedFriend} onBack={() => setSelectedFriend(null)} />;

  return (
    <div>
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={CONFETTI_CONFIG.numberOfPieces} gravity={CONFETTI_CONFIG.gravity} recycle={CONFETTI_CONFIG.recycle} wind={CONFETTI_CONFIG.wind} tweenDuration={CONFETTI_CONFIG.tweenDuration} />
      )}

      <h2 style={{
        fontSize: '1.8rem',
        textAlign: 'center',
        color: '#FF69B4'
      }}>
        🧠 Who's most like: <span style={{ color: '#00FFFF' }}>{hasWord ? word : (isFetching ? '...' : 'No more words')}</span>?
      </h2>

      {error && (
        <div style={{
          maxWidth: '680px',
          margin: '0.5rem auto 0',
          padding: '0.5rem 0.75rem',
          borderRadius: '10px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.35)',
          color: '#fecaca',
          textAlign: 'center'
        }}>{error}</div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <button onClick={skipWord} disabled={!hasWord || isFetching} style={{
          padding: '0.5rem 1rem',
          background: '#1f6feb',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontWeight: 'bold',
          opacity: (!hasWord || isFetching) ? 0.7 : 1
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
          <FriendCard key={name} name={name} onClick={() => assignWord(name)} disabled={!hasWord || !!assigningTo} />
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