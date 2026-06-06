import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Create a 1024x1024 canvas
const width = 1024;
const height = 1024;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Draw background
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#10141e');
gradient.addColorStop(0.5, '#1e1b2e');
gradient.addColorStop(1, '#111824');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Add some glowing orbs in the background
function drawGlow(x, y, r, color) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}

// Purple glow
drawGlow(200, 200, 400, 'rgba(108, 99, 255, 0.15)');
// Cyan glow
drawGlow(800, 600, 500, 'rgba(0, 243, 255, 0.1)');

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Draw {AHK}
ctx.font = 'bold 120px sans-serif';
ctx.fillStyle = '#e2e8f0';
ctx.fillText('{ AHK }', width / 2, 300);

// Draw ANGU HARI KARTHICK M
ctx.font = 'bold 50px sans-serif';
ctx.fillStyle = '#f8fafc';
ctx.fillText('ANGU HARI KARTHICK M', width / 2, 450);

// Draw subtitle
ctx.font = 'italic 30px sans-serif';
ctx.fillStyle = '#94a3b8';
ctx.fillText('(A professional tech portfolio)', width / 2, 530);

// Draw description
ctx.font = 'bold 24px sans-serif';
ctx.fillStyle = '#64748b';
ctx.letterSpacing = '2px'; // node-canvas might not support letterSpacing directly, but it's ok
ctx.fillText('DIGITAL INNOVATOR / FRONT-END DEVELOPER', width / 2, 600);

// Draw Button "Explore My Work"
const btnY = 750;
const btnWidth = 300;
const btnHeight = 60;
const btnX = (width - btnWidth) / 2;
const radius = 10;

ctx.strokeStyle = '#00f3ff';
ctx.lineWidth = 2;

// Draw rounded rect
ctx.beginPath();
ctx.moveTo(btnX + radius, btnY);
ctx.lineTo(btnX + btnWidth - radius, btnY);
ctx.quadraticCurveTo(btnX + btnWidth, btnY, btnX + btnWidth, btnY + radius);
ctx.lineTo(btnX + btnWidth, btnY + btnHeight - radius);
ctx.quadraticCurveTo(btnX + btnWidth, btnY + btnHeight, btnX + btnWidth - radius, btnY + btnHeight);
ctx.lineTo(btnX + radius, btnY + btnHeight);
ctx.quadraticCurveTo(btnX, btnY + btnHeight, btnX, btnY + btnHeight - radius);
ctx.lineTo(btnX, btnY + radius);
ctx.quadraticCurveTo(btnX, btnY, btnX + radius, btnY);
ctx.closePath();
ctx.stroke();

// Button text
ctx.font = 'bold 20px sans-serif';
ctx.fillStyle = '#e2e8f0';
ctx.fillText('Explore My Work', width / 2, btnY + btnHeight / 2);

// Save image
const out = fs.createWriteStream(path.join(process.cwd(), 'public', 'ahk-monitor-screen.png'));
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () =>  console.log('The PNG file was created.'));
