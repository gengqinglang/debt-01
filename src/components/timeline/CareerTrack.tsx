
import React from 'react';

interface CareerTrackProps {
  displayAge: number;
  isPartnerPerspective: boolean;
  currentAge: number;
  partnerAge: number;
}

const CareerTrack: React.FC<CareerTrackProps> = () => {
  // This component is no longer needed as career info is now displayed 
  // directly in the timeline below age circles
  return null;
};

export default CareerTrack;
