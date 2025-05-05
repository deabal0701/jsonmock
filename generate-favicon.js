const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 32x32 canvas for the favicon
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Fill background with primary color
ctx.fillStyle = '#4f46e5'; // Primary color from CSS
ctx.fillRect(0, 0, 32, 32);

// Draw a stylized { } for JSON
ctx.fillStyle = 'white';
ctx.font = 'bold 24px sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('{', 12, 16);
ctx.fillText('}', 20, 16);

// Create a buffer of the PNG
const buffer = canvas.toBuffer('image/png');

// Write to file
fs.writeFileSync('./public/favicon.png', buffer);

console.log('Favicon generated successfully!'); 