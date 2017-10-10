/*
arc(x,y, radius, startAngle, endAngle, anticlockwise)

arcTo(x1, y1, x2, y2, radius) 2: endpoint, 1: control point


ctx.beginPath()
ctx.moveTo(x,y)
ctx.lineTo(x,y)
ctx.stroke()
ctx.fill()

ctx.strokeStyle = 'black'
ctx.fillStyle = 'black'

 */

let ctx;
let canvas;
let game;
let lastTime = 0;
let currentTime;

function init() {
	canvas = document.getElementById('stage');

	ctx = canvas.getContext('2d');
	ctx.font = '20px sans';
	
	game = new Game();
	
	document.onmousedown = mouseDown;
	document.onkeydown = keyDown;

	render();
}

function keyDown(ev) {
	game.keyDown(ev);
}

function mouseDown(ev) {
	let trueX = ev.clientX - canvas.offsetLeft;
	let trueY = ev.clientY - canvas.offsetTop;

	game.mouseDown(trueX, trueY);
}

function render(time) {
	let delta = time - lastTime;
	lastTime = time;
	
	game.update(delta);
	game.render(ctx);

	requestAnimationFrame(render);
}


init();
