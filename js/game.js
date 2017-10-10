function Game() {

	this.bots = [];
	this.botAvs = [];
	let bot;
	let botAv;
	for (let i=0; i < this.NUM_BOTS; i++)
	{
		bot = new NPC(i);
		this.bots.push(bot);
		botAv = new AvatarImg(bot);
		botAv.setPos((i * 100) + this.WIDTH/2 - (this.NUM_BOTS-1)*50,
			this.HEIGHT - 60);
		this.botAvs.push(botAv);
	}


	this.event = this.genEvent();
	this.culpritIndex = Math.floor(Math.random() * this.bots.length);

	console.log(this.getProblemText());
	console.log(this.getSolutionText());
	console.log(this.bots);

	this.statements = [];
	this.statementBubbles = [];

	this.totalTime = 0;
	this.statementTimer = 0;

	this.statementOffsetY = this.HEIGHT - this.UI_HEIGHT - 70;
	this.targetOffsetY = this.statementOffsetY;

	this.showCulprit = false;
	this.addStatement(true);
}

Game.prototype.TIME_PER_STATEMENT = 2 * 1000;
Game.prototype.UI_HEIGHT = 150;

Game.prototype.addStatement = function(force = false) {
	if (this.showCulprit) return;

	if (!force && this.statementTimer < this.TIME_PER_STATEMENT) return;

	// let statement = this.genSimpleStatement(this.statements.length % this.NUM_BOTS, true);
	let statement = this.genStatement(this.statements.length % this.NUM_BOTS);
	this.statements.push(statement);
	this.statementBubbles.push(new AvBubble(statement.speaker, statement.text));
	console.log(statement);

	if (this.statements.length >= 9) {
		this.moveBots(1, true);
	}
	this.statementTimer = 0;
}

Game.prototype.showResult = function() {
	this.statementBubbles.forEach((bubb) => {
		bubb.showResult();
	});
	this.showCulprit = true;
}

Game.prototype.update = function(delta) {
	if (!isNaN(delta)) {
		this.totalTime += delta;
		this.statementTimer += delta;

		if (Math.abs(this.statementOffsetY - this.targetOffsetY) > 0.1) {
			this.statementOffsetY +=
				((this.targetOffsetY - this.statementOffsetY) * 0.2);

		} else {
			this.statementOffsetY = this.targetOffsetY;
		}
	}	
}


Game.prototype.render = function(ctx) {
	ctx.fillStyle = 'rgb(100, 100, 100)';
	ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

	let ypos = 0;
	let bubble;

	for (let i=0; i < this.statements.length; i++) {
		bubble = this.statementBubbles[i];
		bubble.setPos(15, ypos + this.statementOffsetY);
		bubble.draw(ctx);
		ypos -= (bubble.HEIGHT + 10);

	}
	this.drawUI(ctx);
}

Game.prototype.accuseBot = function(bot) {
	console.log('Accusing ' + bot.name);
	this.showResult();	
}

Game.prototype.mouseDown = function(x, y) {
	if (this.showCulprit) return;

	let clickedBot = null;
	this.botAvs.forEach((av) => {
		let dX = x - av.x;
		let dY = y - av.y;
		let dist = dX*dX + dY*dY;

		if (dist < av.SIZE*av.SIZE) {
			clickedBot = av.bot;
			console.log(av);
		}

	});

	if (clickedBot != null) {
		this.accuseBot(clickedBot);
	}

	if (x > this.WIDTH - 110 && 
		y > this.HEIGHT - 110) {

		this.addStatement();
	}

}

Game.prototype.moveBots = function(direction, maxExtents=false) {
	let totalHeight = this.statementBubbles.length * 80;
	let displayHeight = this.HEIGHT - this.UI_HEIGHT;

	if (totalHeight < displayHeight) return;

	this.targetOffsetY = this.statementOffsetY + (80 * direction);
	
	let maxOffset = totalHeight - 40;
	let minOffset = displayHeight - 80;

	if (this.targetOffsetY < minOffset) this.targetOffsetY = minOffset;
	if (this.targetOffsetY > maxOffset) this.targetOffsetY = maxOffset;

	if (direction > 0 && maxExtents) {
		this.targetOffsetY = maxOffset;
	}
}

Game.prototype.keyDown = function(ev) {
	switch (ev.keyCode) {
		case 38:
			this.moveBots(1);
			break;
		case 40:
			this.moveBots(-1);
			break;
		case 49:
			// 1
			this.accuseBot(this.bots[0]);
			break;
		case 50:
			// 2
			this.accuseBot(this.bots[1]);
			break;
		case 51:
			// 3
			this.accuseBot(this.bots[2]);
			break;
		case 78:
			// N
			this.addStatement();
			break;
		default:
			break;
	}
}

Game.prototype.drawUI = function(ctx, ypos) {
	ctx.fillStyle = 'rgb(255,255,255)';
	ctx.strokeStyle = 'rgb()';

	const uiHeight = this.UI_HEIGHT;

	ctx.fillRect(0, this.HEIGHT-uiHeight, this.WIDTH, uiHeight);
	ctx.strokeRect(0, this.HEIGHT-uiHeight, this.WIDTH, uiHeight);

	ctx.fillStyle = 'rgb(0,0,0)';

	let text = this.getProblemText();
	let textSize = ctx.measureText(text);


	ctx.fillText(text, (this.WIDTH - textSize.width)/2, this.HEIGHT-uiHeight+20);
	
	text = 'Who was it?';
	textSize = ctx.measureText(text);

	ctx.fillText(text, (this.WIDTH - textSize.width)/2, this.HEIGHT-uiHeight+50);

	let i = 0;

	for (let i=0; i < this.bots.length; i++) {
		this.botAvs[i].draw(ctx);
		let textSize = ctx.measureText(this.bots[i].name);
		ctx.fillText(this.bots[i].name,
			this.botAvs[i].x - textSize.width/2,
			this.botAvs[i].y + this.botAvs[i].SIZE + 20);
	
		if (this.showCulprit) {
			if (i == this.culpritIndex) {
				ctx.strokeStyle = 'rgb(0,255,0)';
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.arc(this.botAvs[i].x, this.botAvs[i].y, 40, 0, Math.PI*2);
				ctx.stroke();
			} else {
				ctx.strokeStyle = 'rgb(255,0,0)';
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.moveTo(this.botAvs[i].x-40, this.botAvs[i].y-40);
				ctx.lineTo(this.botAvs[i].x+40, this.botAvs[i].y+40);	
				ctx.moveTo(this.botAvs[i].x+40, this.botAvs[i].y-40);
				ctx.lineTo(this.botAvs[i].x-40, this.botAvs[i].y+40);	
				ctx.stroke();
			}
		}
	}

	// draw next clue button
	let timeParam = this.statementTimer / this.TIME_PER_STATEMENT;
	if (timeParam > 1) timeParam = 1;

	ctx.fillStyle = 'rgb(100, 100, 100)';
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.lineWidth = 4;
	ctx.fillRect(this.WIDTH - 110, this.HEIGHT-110, 100, 100);
	ctx.strokeRect(this.WIDTH - 110, this.HEIGHT-110, 100, 100);
	ctx.fillStyle = 'rgb(0,0,0)';

	let words = ['GET','NEXT','CLUE'];
	let wordY = this.HEIGHT - 110 + 30;
	let wordSize;
	words.forEach((w) => {
		wordSize = ctx.measureText(w);
		ctx.fillText(w, this.WIDTH-110 + 50 - wordSize.width/2, wordY);
		wordY += 25;
	
	});

	// ctx.fillText('NEXT', this.WIDTH-75, this.HEIGHT-65);
	// ctx.fillText('CLUE', this.WIDTH-75, this.HEIGHT-45);

	if (this.statementTimer < this.TIME_PER_STATEMENT) {
		ctx.fillStyle = 'rgb(255,0,0)';
		ctx.fillRect(this.WIDTH - 108, this.HEIGHT-108, 96*(1-timeParam), 96);
	}


	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgb(0,0,0)';
}

Game.prototype.drawTimer = function(ctx) {
	const timeParam = this.statementTimer / this.TIME_PER_STATEMENT;

	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.fillStyle = 'rgb(100,100,100)';

	ctx.beginPath();
	ctx.arc(100, 100, 80, 0, Math.PI*2);
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.beginPath();
	ctx.moveTo(100, 100);
	ctx.lineTo(178,100);
	ctx.arc(100, 100, 78, 0, (Math.PI*2*timeParam));
	ctx.lineTo(100,100);
	ctx.fill();
}


Game.prototype.getProblemText = function() {
	let s = `One of these robots ${this.event}!`;
	return s;	
}

Game.prototype.getSolutionText = function() {
	let s = `${this.bots[this.culpritIndex].name} ${this.event}`;
	return s;
}

Game.prototype.genEvent = function() {
	let events = [
		'stole all the batteries',
		'replaced the machine oil with soda',
		'corrupted ALL the data',
		'swapped out metric bolts for imperial',
		'neglected to dust the solar panels'
	];

	return events[
		Math.floor(Math.random() * events.length)
	];
}


Game.prototype.genStatement = function(botIndex = -1) {
	if (Math.random() < 0.4) {
		return this.genCompoundStatement(botIndex);
	}
	return this.genSimpleStatement(botIndex);
}

Game.prototype.genCompoundStatement = function(botIndex = -1) {
	const CONJUNTIONS = ['and','or'];

	let speaker = (botIndex == -1) ? this.getBot() : this.bots[botIndex];
	let objects = [this.getBot(), this.getBot()];

	let type = Math.random() > 0.5 ? 0 : 1;
	let botData = [];

	if (speaker.truthTeller) {
		// TRUE
		if (type == 0) {
			// AND
			// T T
			botData.push(this.makeDatum(objects[0], true));
			botData.push(this.makeDatum(objects[1], true));				
		} else {
			// OR (2 ways)		
			if (Math.random() < 0.5) {
				// T F	
				botData.push(this.makeDatum(objects[0], true));
				botData.push(this.makeDatum(objects[1], false));
			} else {
				// F T
				botData.push(this.makeDatum(objects[0], false));
				botData.push(this.makeDatum(objects[1], true));
			}
		}
	} else {
		// LIAR
		if (type == 0) {
			// AND
			if (Math.random() < 0.5) {
				// T F	
				botData.push(this.makeDatum(objects[0], true));
				botData.push(this.makeDatum(objects[1], false));
			} else {
				// F T
				botData.push(this.makeDatum(objects[0], false));
				botData.push(this.makeDatum(objects[1], true));
			}
		} else {
			// OR
			// F F
			botData.push(this.makeDatum(objects[0], false));
			botData.push(this.makeDatum(objects[1], false));				
		}
	}

	let s = '';
	for (let i=0; i < botData.length; i++) {
		if (speaker.id == botData[i].bot.id) {
			s += 'I am ';
		} else {
			s += botData[i].bot.name + ' is ';
		}
		s += botData[i].txt;

		if (i < botData.length-1) {
			if (type == 0) {
				s += ' AND ';
			} else {
				s += ' OR ';
			}
		}
	}
	return {text: s, speaker: speaker};
}

Game.prototype.makeDatum = function(bot, isTrue) {
	let selector = Math.random();

	let s;

	if (selector < 0.3) {
		// color
		s = bot.getColorText(isTrue);
	} else if (selector < 0.6) {
		// shape
		s = bot.getShapeText(isTrue);
	} else {
		// guilt
		let claimGuilt = false;
		if (bot.id == this.culpritIndex) {
			claimGuilt = isTrue;
		} else {
			claimGuilt = !isTrue;
		}
		s = claimGuilt ? 'guilty' : 'innocent';
	}

	return {bot: bot, txt: s};
}


Game.prototype.genSimpleStatement = function(botIndex = -1) {

	let object = this.getBot();
	let speaker = (botIndex == -1) ? this.getBot() : this.bots[botIndex];

	// let s = speaker.name + ': '; 
	/* 
	let statementType = Math.floor(Math.random() * 3);	
	let s = '';
	s += (object.id == speaker.id) ? 'I' : object.name;

	switch (statementType) {
		case 0:
			// statement about color
			s += (object.id == speaker.id) ? ' am ' : ' is ';
			s += object.getColorText(speaker.truthTeller);
			break;
		case 1:
			// statement about shape
			s += (object.id == speaker.id) ? ' am ' : ' is ';
			s += 'a ' + object.getShapeText(speaker.truthTeller);
			break;
		case 2:
			// statement about guilt
			let claimGuilt = false;
			if (object.id == this.culpritIndex) {
				claimGuilt = speaker.truthTeller;
			} else {
				claimGuilt = !speaker.truthTeller;
			}

			if (claimGuilt) {
				s += ' did it!';
			} else {
				s += (object.id == speaker.id) ? ' am ' : ' is ';
				s += 'innocent!';
			}

			break;
	}
	*/
	let d = this.makeDatum(object, speaker.truthTeller);
	let s = '';
	s += (object.id == speaker.id) ? 'I am ' : object.name + ' is ';
	s += d.txt;

	return {text: s, speaker: speaker};
}


Game.prototype.getBot = function() {
	return this.bots[
		Math.floor(Math.random() * this.bots.length)
	];
}

Game.prototype.NUM_BOTS = 3;
Game.prototype.WIDTH = 600;
Game.prototype.HEIGHT = 800;
