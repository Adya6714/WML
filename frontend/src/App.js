import React from 'react';
import WordPicker from './components/WordPicker';

function App() {
  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji',
      minHeight: '100vh',
      background: 'radial-gradient(1000px 600px at 20% 0%, #121826 0%, #0b0f1a 60%, #05070c 100%)'
    }}>
      <div style={{
        maxWidth: '980px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
        boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.4rem',
          textAlign: 'center',
          color: '#e2e8f0',
          marginBottom: '0.5rem'
        }}>Who’s Most Like…?</h1>
        <p style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginTop: 0
        }}>Pick a friend for the vibe — stack up tags and climb the leaderboard.</p>
        <WordPicker />
      </div>
    </div>
  );
}

export default App;