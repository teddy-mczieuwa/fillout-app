import React from 'react';
import Image from 'next/image';

interface TabIconProps {
  icon?: string;
}

const TabIcon: React.FC<TabIconProps> = ({ icon }) => {
  const iconSrc = icon === 'info.svg' || icon === 'check.svg' ? icon : 'file.svg';
  const altText = icon === 'info.svg' ? 'Info icon' : icon === 'check.svg' ? 'Check icon' : 'File icon';
  
  return (
    <Image 
      src={`icons/${iconSrc}`} 
      alt={altText} 
      className="mr-1" 
      width={16} 
      height={16} 
    />
  );
};

export default TabIcon;
