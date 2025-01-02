// OptimizedNoiseEffect.js
const optimizedNoise = () => {
	// Initialize canvas and context variables
	let canvas = document.getElementById('noise');
	let ctx;
  
	if (!canvas) {
	  console.error('Canvas element with ID "noise" not found.');
	  return;
	}
  
	let wWidth = window.innerWidth;
	let wHeight = window.innerHeight;
  
	let noiseData = [];
	let frame = 0;
	let loopTimeout;
  
	// Optimized Create Noise using Typed Arrays for direct pixel manipulation
	const createNoise = () => {
	  const idata = ctx.createImageData(wWidth, wHeight);
	  const buffer = new Uint8ClampedArray(wWidth * wHeight * 4); // 4 components per pixel
  
	  for (let i = 0; i < buffer.length; i += 4) {
		buffer[i] = Math.random() * 255;        // Red
		buffer[i + 1] = Math.random() * 255;    // Green
		buffer[i + 2] = Math.random() * 255;    // Blue
		buffer[i + 3] = 255;                    // Alpha
	  }
  
	  idata.data.set(buffer);
	  noiseData.push(idata);
	};
  
	// Paint Noise
	const paintNoise = () => {
	  ctx.putImageData(noiseData[frame], 0, 0);
	  frame = (frame + 1) % noiseData.length; // Cycle through noise frames
	};
  
	// Loop
	const loop = () => {
	  paintNoise();
  
	  loopTimeout = setTimeout(() => {
		requestAnimationFrame(loop);
	  }, 1000 / 25); // Throttle to ~25 FPS
	};
  
	// Setup
	const setup = () => {
	  canvas.width = wWidth;
	  canvas.height = wHeight;
	  ctx = canvas.getContext('2d');
  
	  noiseData = [];
	  for (let i = 0; i < 10; i++) {
		createNoise();
	  }
  
	  loop();
	};
  
	// Reset on resize
	const reset = () => {
	  window.addEventListener('resize', () => {
		clearTimeout(loopTimeout);
		wWidth = window.innerWidth;
		wHeight = window.innerHeight;
		setup(); // Re-setup to adjust to new window size
	  }, false);
	};
  
	setup();
	reset();
  };
  
  export default optimizedNoise;
  