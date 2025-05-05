import React from 'react';

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`card ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
