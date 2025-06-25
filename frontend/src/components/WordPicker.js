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

  const getRandomWord = async () => {
    const res = await axios.get('http://localhost:5000/random-word');
    setWord(res.data.word);
  };

  const assignWord = async (friend) => {
    await axios.post('http://localhost:5000/assign-word', {
      person: friend,
      word: word
    });
    setSelectedFriend(friend);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  useEffect(() => {
    getRandomWord();
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
        🧠 Who’s most like: <span style={{ color: '#00FFFF' }}>{word || '...'}</span>?
      </h2>

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
    </div>
  );
}

export default WordPicker;