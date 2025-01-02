import React, { useEffect, useRef } from 'react';

const MatrixText = ({ text, delay = 0, duration = 3000, letterDelay = 100 }) => {
  const spanRef = useRef(null);

  useEffect(() => {
    const span = spanRef.current;
    const originalText = text;
    let iteration = 0;
    
    setTimeout(() => {
      const interval = setInterval(() => {
        span.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return String.fromCharCode(65 + Math.floor(Math.random() * 26));
          })
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, letterDelay); // This controls the speed of letter changes

      // Ensure the animation stops after the specified duration
      setTimeout(() => {
        clearInterval(interval);
        span.innerText = originalText;
      }, duration);

    }, delay);
  }, [text, delay, duration, letterDelay]);

  return <span ref={spanRef}>{text}</span>;
};

export default MatrixText;