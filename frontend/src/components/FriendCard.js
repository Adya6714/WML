import React from 'react';
// import stuti from '../assets/stuti.jpg';
// import khushi from '../assets/khushi.jpg';
// import vanya from '../assets/vanya.jpg';
// import aditi from '../assets/aditi.jpg';
// import avni from '../assets/avni.jpg';
// import nandini from '../assets/nandini.jpg';
// import adya from '../assets/adya.jpg';

// const IMAGES = {
//   Stuti: stutiImg,
//   Khushi: khushiImg,
//   Vanya: vanyaImg,
//   Aditi: aditiImg,
//   Avni: avniImg,
//   Nandini: nandiniImg,
//   Adya: adyaImg
// };

function FriendCard({ name, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Choose ${name}`}
      style={{
        margin: '0.75rem',
        padding: '0.9rem',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        width: '140px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled
          ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
          : 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.2s ease',
        color: '#fff',
        outline: 'none',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <img
        src={`https://robohash.org/${name}?set=set5&size=100x100`}
        alt={name}
        style={{ borderRadius: '50%', marginBottom: '0.5rem', border: '2px solid rgba(255,255,255,0.08)' }}
      />
      <div style={{ fontWeight: 700, color: '#facc15', letterSpacing: '0.2px' }}>{name}</div>
    </button>
  );
}

export default FriendCard;