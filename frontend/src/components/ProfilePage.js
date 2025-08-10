import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage({ friend }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(`/profile/${friend}`);
      setProfile(res.data);
    };
    fetchProfile();
  }, [friend]);

  if (!profile) return <p style={{ color: '#e2e8f0' }}>Loading profile...</p>;

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', color: '#e2e8f0' }}>
      <h2 style={{ color: '#f59e0b', marginTop: 0 }}>{friend}’s Profile</h2>

      <pre style={{
        whiteSpace: 'pre-wrap',
        background: '#0f172a',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '1rem',
        marginBottom: '1rem',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {profile.intro}
      </pre>

      <h3 style={{ color: '#7dd3fc' }}>📝 Tagged As:</h3>
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
          background: '#facc15',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          color: '#0b0f1a'
        }}
      >
        🔄 Tag Another Word
      </button>
    </div>
  );
}

export default ProfilePage;