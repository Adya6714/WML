import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage({ friend }) {
  const [profile, setProfile] = useState(null);
  const [busyTag, setBusyTag] = useState(null);

  const loadProfile = async () => {
    const res = await axios.get(`/profile/${friend}`);
    setProfile(res.data);
  };

  useEffect(() => {
    loadProfile();
  }, [friend]);

  const removeTag = async (word) => {
    try {
      setBusyTag(word);
      // Optimistic update
      setProfile((p) => ({ ...p, assigned: p.assigned.filter((w) => w !== word) }));
      await axios.post('/unassign-word', { person: friend, word });
    } catch (e) {
      // On failure, refetch to resync
      await loadProfile();
    } finally {
      setBusyTag(null);
    }
  };

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
      {profile.assigned.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {profile.assigned.map((w, idx) => (
            <li key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                background: 'rgba(125,211,252,0.15)',
                border: '1px solid rgba(125,211,252,0.35)',
                color: '#7dd3fc',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
                fontWeight: 600
              }}>{w}</span>
              <button
                onClick={() => removeTag(w)}
                disabled={busyTag === w}
                style={{
                  padding: '0.2rem 0.5rem',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '999px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  opacity: busyTag === w ? 0.6 : 1
                }}
              >
                ✕ remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags yet!</p>
      )}

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