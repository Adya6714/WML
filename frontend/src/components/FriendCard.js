import React from 'react';
import stutiImg from '../assets/stuti.jpg';
import khushiImg from '../assets/khushi.jpg';
import vanyaImg from '../assets/vanya.jpg';
import aditiImg from '../assets/aditi.jpg';
import avniImg from '../assets/avni.jpg';
import nandiniImg from '../assets/nandini.jpg';
import adyaImg from '../assets/adya.jpg';

const IMAGES = {
  Stuti: stutiImg,
  Khushi: khushiImg,
  Vanya: vanyaImg,
  Aditi: aditiImg,
  Avni: avniImg,
  Nandini: nandiniImg,
  Adya: adyaImg
};
function FriendCard({ name, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        margin: '1rem',
        padding: '1rem',
        border: '2px solid #444',
        borderRadius: '12px',
        width: '110px',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#222',
        transition: 'transform 0.2s',
        color: '#fff'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img
        src={`https://robohash.org/${name}?set=set5&size=100x100`}
        alt={name}
        style={{ borderRadius: '50%', marginBottom: '0.5rem' }}
      />
      <div style={{ fontWeight: 'bold', color: '#FFD700' }}>{name}</div>
    </div>
  );
}


export default FriendCard;