function NPC(id) {
	this.id = id;
	this.faceShape = Math.floor(Math.random() * 3);
	this.colorIndex = Math.floor(Math.random() * this.COLORS.length);
	this.name = `${this.NAMES[
		Math.floor(Math.random() * this.NAMES.length)
	]}-${this.id+1}`;


	this.truthTeller = Math.random() > 0.5;
}

NPC.prototype.getColor = function() {
	return this.COLORS[this.colorIndex];
}

NPC.prototype.getShapeText = function(genTruth = true) {
	const thisShape = this.SHAPE_NAMES[this.faceShape];
	// console.log([thisShape, genTruth]);

	if (genTruth) {
		return thisShape;
	} else {
		let options = this.SHAPE_NAMES.filter((shape) => {
			return shape != thisShape;
		});
		return options[Math.floor(Math.random() * options.length)];
	}
}

NPC.prototype.getColorText = function(genTruth = true) {

	const thisColor = this.COLOR_NAMES[this.colorIndex];
	// console.log([thisColor, genTruth]);

	if (genTruth) {
		return thisColor;
	} else {
		let options = this.SHAPE_NAMES.filter((color) => {
			return color != thisColor;
		});
		return options[Math.floor(Math.random() * options.length)];
	}	
}

NPC.prototype.SHAPE_TRI = 0;
NPC.prototype.SHAPE_CIRC = 1;
NPC.prototype.SHAPE_SQUARE = 2;
NPC.prototype.SHAPE_NAMES = ['a triangle',
	'a circle',
	'a square'];

NPC.prototype.COLORS = ['rgb(178,92,85)',
	'rgb(74,178,133)',
	'rgb(80,134,178)',
	'rgb(164,114,178)',
	'rgb(178,122,75)',
	'rgb(178,178,178)'];
NPC.prototype.COLOR_NAMES = ['red', 
	'green',
	'blue',
	'purple',
	'orange',
	'gray'];

NPC.prototype.NAMES = ['Tobor',
'Azerty',
'Ash',
'Owdator',
'Okexroid','Cyl',
'Wire',
'Uvev',
'Ecyx',
'Bolt',
'Rusty',
'Prime',
'Ijox',
'Ajx'];