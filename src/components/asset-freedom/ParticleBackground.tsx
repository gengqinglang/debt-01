
import React from 'react';

const ParticleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="absolute animate-pulse" 
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        >
          <div className="w-1 h-1 bg-[#B3EBEF] rounded-full shadow-sm"></div>
        </div>
      ))}
    </div>
  );
};

export default ParticleBackground;
