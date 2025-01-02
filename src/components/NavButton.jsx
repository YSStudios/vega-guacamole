import React, { useEffect, useRef } from 'react';
import styles from '../styles/NavButton.module.scss';

export default function NavButton({ name, id, radius = 50, offset = 0 }) {
	const spanRef = useRef(null);
  
	useEffect(() => {
	  if (spanRef.current) {
		const container = spanRef.current;
		container.innerHTML = '';
  
		// Here radius is redefined, which overrides the prop. Comment or remove this line to use the passed prop.
		// let radius = 100;
  
		let rotateAngle = -100 / (name.length - 1); 
		let startAngle = (220 - 125) / 2 + 125;  
  
		// Calculate offset to center the word
		let wordOffset = -(name.length - 1) * 10;
  
		for (let i = 0; i < name.length; i++) {
		  const characterSpan = document.createElement('span');
		  characterSpan.className = `${styles.character}`;
		  characterSpan.textContent = name[i];
		  container.appendChild(characterSpan);
  
		  let angle = startAngle + i * rotateAngle;
		  let x = Math.cos(angle * (Math.PI / 180)) * radius;
		  let y = Math.sin(angle * (Math.PI / 180)) * radius;
		  
		  // Apply the offsets to the x-coordinate
		  characterSpan.style.left = `${x + radius + wordOffset + offset}px`;
		  characterSpan.style.bottom = `${y}px`;
  
		  characterSpan.style.transform = `rotate(${90 - angle}deg)`;
		}
	  }
	}, [name, radius, offset]);
  
	return (
	  <button className={`${styles.nav_button} ${styles[id]}`}>
		<span ref={spanRef} className={styles.nav_button_span}></span>
	  </button>
	);
  }
  
