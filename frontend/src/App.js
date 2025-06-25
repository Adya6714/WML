import React from 'react';
import WordPicker from './components/WordPicker';

function App() {
  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Comic Sans MS',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1b1b1b, #000)'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        textAlign: 'center',
        color: '#FFD700',
        marginBottom: '2rem'
      }}>🤔 Who’s Most Like…?</h1>
      <WordPicker />
    </div>
  );
}

export default App;