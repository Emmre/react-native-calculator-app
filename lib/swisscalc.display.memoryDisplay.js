global.swisscalc = global.swisscalc || {};
global.swisscalc.display = global.swisscalc.display || {};
global.swisscalc.display.memoryDisplay = function() { 
	this._display = "";
	this._memValue = 0;
	this._hasMemory = false;
};

global.swisscalc.display.memoryDisplay.prototype.hasMemory = function() {
	return this._hasMemory;
};

global.swisscalc.display.memoryDisplay.prototype.getCurrentDisplay = function() {
	return this._display;
};

global.swisscalc.display.memoryDisplay.prototype.memoryRecall = function() {
	return this._memValue;
};

global.swisscalc.display.memoryDisplay.prototype.memorySet = function(val) {
	this._hasMemory = true;
	this._memValue = val;
	this._display = "M";
};

global.swisscalc.display.memoryDisplay.prototype.memoryPlus = function(val) {
	this._hasMemory = true;
	this._memValue += val;
	this._display = "M";
};

global.swisscalc.display.memoryDisplay.prototype.memoryMinus = function(val) {
	this._hasMemory = true;
	this._memValue -= val;
	this._display = "M";
};

global.swisscalc.display.memoryDisplay.prototype.memoryClear = function() {
	this._hasMemory = false;
	this._memValue = 0;
	this._display = "";
};
