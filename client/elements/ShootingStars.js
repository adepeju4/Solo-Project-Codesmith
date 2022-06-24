import React from 'react';

function ShootingStars() {
  const shootingStars = [
    <section key={1} className="shootingWrapper">
      <span className="shootingStars" key={1}></span>
      <span className="shootingStars" key={2}></span>
      <span className="shootingStars" key={3}></span>
      <span className="shootingStars" key={4}></span>
      <span className="shootingStars" key={5}></span>
      <span className="shootingStars" key={6}></span>
      <span className="shootingStars" key={7}></span>
      <span className="shootingStars" key={8}></span>
      <span className="shootingStars" key={9}></span>
    </section>,
  ];
  return <>{shootingStars};</>;
}

export default ShootingStars;
