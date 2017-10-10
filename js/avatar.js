function AvBubble(bot, text) {
	this.x = 0;
	this.y = 0;

	this.avImg = new AvatarImg(bot);
	this.textBubb = new TextBubble(text);
	this.bot = bot;
	this.isRight = false;
}

AvBubble.prototype.HEIGHT = 70;
AvBubble.prototype.MAX_WIDTH = 600;

AvBubble.prototype.showResult = function() {
	this.avImg.showType = true;
	this.textBubb.color = (this.bot.truthTeller) ?
		this.textBubb.COLOR_TRUE : this.textBubb.COLOR_FALSE;
}


AvBubble.prototype.setPos = function(x, y) {
	this.x = x;
	this.y = y;

	if (this.isRight) {
		this.avImg.setPos(this.x - this.avImg.SIZE + this.MAX_WIDTH - 10,
			this.y + this.avImg.SIZE);

		this.textBubb.setPos(this.x, this.y);
	}
	else {
		this.avImg.setPos(this.x + this.avImg.SIZE,
			this.y + this.avImg.SIZE);

		this.textBubb.setPos(this.x + this.avImg.SIZE*2 + 10,
			this.y);		
	}
}

AvBubble.prototype.draw = function(ctx) {
	this.avImg.draw(ctx);
	this.textBubb.draw(ctx);
}

function TextBubble(txt) {
	this.x = 0;
	this.y = 0;
	this.width = 500;
	this.height = 60;

	this.text = txt;
	this.txtSize = 20;
	this.radius = 10;

	this.color = this.COLOR_DEF;
}

TextBubble.prototype.COLOR_DEF = 'rgb(200,200,200)';
TextBubble.prototype.COLOR_TRUE = 'rgb(200,255,200)';
TextBubble.prototype.COLOR_FALSE = 'rgb(255,200,200)';

TextBubble.prototype.setColor = function(c) {
	this.color = c;
}

TextBubble.prototype.setPos = function(x,y) {
	this.x = x;
	this.y = y;
}

TextBubble.prototype.draw = function(ctx) {

	ctx.fillStyle = this.color;
	
	ctx.beginPath();
	ctx.moveTo(this.x + this.radius, this.y);
	ctx.lineTo(this.x + this.width - this.radius, this.y);
	// top-right arc
	ctx.arc(this.x + this.width - this.radius,
		this.y + this.radius,
		this.radius,
		Math.PI/2, 0, false);
	ctx.lineTo(this.x + this.width, this.y + this.height - this.radius);
	// bottom-right arc
	ctx.arc(this.x + this.width - this.radius,
		this.y + this.height - this.radius,
		this.radius,
		0, Math.PI*0.5);
	ctx.lineTo(this.x + this.radius, this.y + this.height);
	// bottom-left arc
	ctx.arc(this.x + this.radius,
		this.y + this.height - this.radius,
		this.radius,
		Math.PI*0.5, Math.PI);
	ctx.lineTo(this.x, this.y + this.height * 0.64);
	ctx.lineTo(this.x - 10, this.y + this.height * 0.5);
	ctx.lineTo(this.x, this.y + this.height * 0.35);
	ctx.lineTo(this.x, this.y + this.radius);
	// top-left arc
	ctx.arc(this.x + this.radius,
		this.y + this.radius,
		this.radius,
		Math.PI, Math.PI*1.5);
	ctx.fill();

	this.drawText(ctx);
}

TextBubble.prototype.drawText = function(ctx) {

	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.font = this.txtSize + 'px sans';
	ctx.fillText(this.text, this.x + this.radius, this.y + this.txtSize);

}


function AvatarImg(bot, showType=false) {
	this.x = 0;
	this.y = 0;

	this.bot = bot;
	this.showType = showType;
}

AvatarImg.prototype.SIZE = 30;

AvatarImg.prototype.setPos = function(x, y) {
	this.x = x;
	this.y = y;
}


AvatarImg.prototype.draw = function(ctx) {
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.fillStyle = 'rgb(200,200,200)';
	ctx.lineWidth = 3;

	ctx.beginPath();
	ctx.arc(this.x, this.y, this.SIZE, 0, Math.PI*2);
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = this.bot.getColor();
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.beginPath();

	const faceSize = this.SIZE * 0.75;

	switch (this.bot.faceShape) {
		case this.bot.SHAPE_TRI:
			ctx.moveTo(this.x - faceSize, this.y - faceSize);
			ctx.lineTo(this.x + faceSize, this.y - faceSize);
			ctx.lineTo(this.x, this.y + faceSize);
			// ctx.lineTo(this.x - faceSize, this.y + faceSize);
			ctx.lineTo(this.x - faceSize, this.y - faceSize);
			break;
		case this.bot.SHAPE_CIRC:
			ctx.arc(this.x, this.y, this.SIZE * 0.75, 0, Math.PI*2);
			break;
		case this.bot.SHAPE_SQUARE:
			ctx.moveTo(this.x - faceSize, this.y - faceSize);
			ctx.lineTo(this.x + faceSize, this.y - faceSize);
			ctx.lineTo(this.x + faceSize, this.y + faceSize);
			ctx.lineTo(this.x - faceSize, this.y + faceSize);
			ctx.lineTo(this.x - faceSize, this.y - faceSize);
			break;
		default:
			break;
	}
	ctx.stroke();
	ctx.fill();


	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.beginPath();
	// draw two eyes
	ctx.arc(this.x + faceSize/2, this.y-faceSize/2, 5, 0, Math.PI*2);
	ctx.arc(this.x - faceSize/2, this.y-faceSize/2, 5, 0, Math.PI*2);
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(this.x - faceSize/2, this.y+faceSize/2);
	ctx.lineTo(this.x + faceSize/2, this.y+faceSize/2);
	ctx.stroke();

	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.fillStyle = 'rgb(255,255,255)';
	ctx.beginPath();
	ctx.arc(this.x - faceSize, this.y + faceSize, 10, 0, Math.PI*2);
	ctx.fill();
	ctx.stroke();

	ctx.fillStyle = 'rgb(0,0,0)';
	let textSize = ctx.measureText(''+(this.bot.id+1));

	ctx.fillText(''+(this.bot.id+1),this.x - faceSize-textSize.width/2, this.y + faceSize+5);

	if (this.showType) {
		if (this.bot.truthTeller) {
			ctx.fillStyle = 'rgb(0,255,0)';
		} else {
			ctx.fillStyle = 'rgb(255, 0, 0)';
		}

		ctx.beginPath();
		ctx.arc(this.x + faceSize, this.y + faceSize, 10, 0, Math.PI*2);
		ctx.fill();
	}

	ctx.lineWidth = 1;
}