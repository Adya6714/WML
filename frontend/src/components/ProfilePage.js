import React, { useCallback, useEffect, useState } from 'react';
import { getProfile, unassignWord as apiUnassignWord } from '../api';

function ProfilePage({ friend, onBack }) {
  const [profile, setProfile] = useState(null);
  const [busyTag, setBusyTag] = useState(null);

  const loadProfile = useCallback(async () => {
    const data = await getProfile(friend);
    setProfile(data);
  }, [friend]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const removeTag = async (word) => {
    try {
      setBusyTag(word);
      // Optimistic update
      setProfile((p) => ({ ...p, assigned: p.assigned.filter((w) => w !== word) }));
      await apiUnassignWord(friend, word);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#f59e0b', marginTop: 0 }}>{friend}’s Profile</h2>
        <button
          onClick={onBack}
          style={{
            padding: '0.45rem 0.9rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            color: '#e2e8f0'
          }}
        >↩︎ Back</button>
      </div>

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
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {profile.assigned.map((w, idx) => (
            <li key={idx}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(125,211,252,0.15)',
                border: '1px solid rgba(125,211,252,0.35)',
                color: '#7dd3fc',
                borderRadius: '999px',
                padding: '0.25rem 0.6rem',
                fontWeight: 600
              }}>
                {w}
                <button
                  onClick={() => removeTag(w)}
                  disabled={busyTag === w}
                  aria-label={`Remove ${w}`}
                  style={{
                    padding: '0 0.45rem',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '999px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    opacity: busyTag === w ? 0.6 : 1
                  }}
                >✕</button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags yet!</p>
      )}

      <button
        onClick={onBack}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: '#facc15',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          color: '#0b0f1a'
        }}
      >🔄 Tag Another Word</button>
    </div>
  );
}

export default ProfilePage;