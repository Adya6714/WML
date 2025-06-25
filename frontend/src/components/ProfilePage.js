import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage({ friend }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(`http://localhost:5000/profile/${friend}`);
      setProfile(res.data);
    };
    fetchProfile();
  }, [friend]);

  if (!profile) return <p style={{ color: '#fff' }}>Loading profile...</p>;

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', color: '#fff' }}>
      <h2 style={{ color: '#FF8C00' }}>{friend}’s Profile</h2>

      <pre style={{
        whiteSpace: 'pre-wrap',
        background: '#1e1e1e',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '1rem',
        marginBottom: '1rem'
      }}>
        {profile.intro}
      </pre>

      <h3 style={{ color: '#87CEEB' }}>📝 Tagged As:</h3>
      <ul>
        {profile.assigned.length > 0 ? (
          profile.assigned.map((w, idx) => <li key={idx}>{w}</li>)
        ) : (
          <li>No tags yet!</li>
        )}
      </ul>

      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#FFD700',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          color: '#000'
        }}
      >
        🔄 Tag Another Word
      </button>
    </div>
  );
}

export default ProfilePage;