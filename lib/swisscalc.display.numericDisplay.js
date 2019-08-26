
global.swisscalc = global.swisscalc || {};
global.swisscalc.display = global.swisscalc.display || {};


global.swisscalc.display.numericDisplay = function(groupDigits, maxLength) { 
	this._display = "0";
	this._groupDigits = (typeof groupDigits === "undefined") ? true : groupDigits;
	this._maxLength = (typeof maxLength === "undefined") ? 20 : maxLength;
};

global.swisscalc.display.numericDisplay.prototype.getCurrentDisplay = function() { 
	return (this._groupDigits)
		? global.swisscalc.lib.format.groupDigits(this._display)
		: this._display;
};


global.swisscalc.display.numericDisplay.prototype.addDigit = function(digit) {
	if (this._display.length >= this._maxLength)
		return;
		
	if (digit == "." && this._display.indexOf(".") >= 0)
		return;
		
	if (digit != "." && this._display == "0")
		this._display = "";
		
	this._display += digit;
};

global.swisscalc.display.numericDisplay.prototype.negate = function() {
	var fChar = this._display.charAt(0);
	this._display = (fChar == "-") ? this._display.substring(1) : "-" + this._display;
};

global.swisscalc.display.numericDisplay.prototype.backspace = function() {
	var len = this._display.length;	
	if (len == 1)
		this._display = "0";
	else if (len == 2 && this._display.charAt(0) == "-")
		this._display = "0";
	else
		this._display = this._display.substring(0, len - 1);
};

global.swisscalc.display.numericDisplay.prototype.clear = function() {
	this._display = "0";
};

global.swisscalc.display.numericDisplay.prototype.getDisplayValue = function() {
	return parseFloat(this._display);
};

global.swisscalc.display.numericDisplay.prototype.setDisplayValue = function(val) {
	this._display = val.toString();
};
