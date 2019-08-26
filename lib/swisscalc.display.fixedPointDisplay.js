

var swisscalc = swisscalc || {};
swisscalc.display = swisscalc.display || {};


swisscalc.display.fixedPointDisplay = function(numDecimalPlaces, maxLength) { 
	this._display = "";
	this._isNegative = false;
	this._numDecimalPlaces = (typeof numDecimalPlaces === "undefined") ? 2 : numDecimalPlaces;
	this._maxLength = (typeof maxLength === "undefined") ? 20 : maxLength;
};

swisscalc.display.fixedPointDisplay.prototype.getCurrentDisplay = function() { 
	var str = "";
	var len = this._display.length;		
	var num = this._numDecimalPlaces;	
	
	
	if (num === 0) { 
		if (len === 0) return "0";							
		if (this._isNegative) return "-" + this._display;	
		return this._display;								
	}
	
	if (len > num) {
		var p1  = this._display.substring(0, len - num);
		var p2  = this._display.substring(len - num, len);
		str = p1 + "." + p2;
	} else if (len == num) {
		str = "0." + this._display;
	} else if (len < num) { 
		str = "0.";
		for (var i = 0; i < num - len; i++) str += "0";
		str += this._display;
	}
	
	if (this._isNegative) str = "-" + str;
	
	return str;
};


swisscalc.display.fixedPointDisplay.prototype.addDigit = function(digit) {
	
	if (this._display.length >= this._maxLength)
		return;
		
	if (digit == ".")
		return;
		
	if (this._display.length === 0 && digit == "0")
		return;
		
	this._display += digit;
};

swisscalc.display.fixedPointDisplay.prototype.negate = function() {
	this._isNegative = !this._isNegative;
};

swisscalc.display.fixedPointDisplay.prototype.backspace = function() {
	var len = this._display.length;	
	if (len == 1)
		this._display = "";
	else if (len == 2 && this._display.charAt(0) == "-")
		this._display = "";
	else
		this._display = this._display.substring(0, len - 1);
};

swisscalc.display.fixedPointDisplay.prototype.clear = function() {
	this._display = "";
};

swisscalc.display.fixedPointDisplay.prototype.getDisplayValue = function() {
	var sDisplay = this.getCurrentDisplay();
	return parseFloat(sDisplay);
};