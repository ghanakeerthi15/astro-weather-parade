import { useEffect, useRef } from 'react';

const StarField = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const createStars = () => {
      const stars = [];
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        stars.push(star);
      }
      return stars;
    };

    const stars = createStars();
    stars.forEach(star => canvasRef.current?.appendChild(star));

    return () => {
      stars.forEach(star => star.remove());
    };
  }, []);

  return <div ref={canvasRef} className="star-field" />;
};

export default StarField;
