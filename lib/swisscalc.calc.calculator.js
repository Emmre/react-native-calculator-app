

global.swisscalc = global.swisscalc || {};
global.swisscalc.calc = global.swisscalc.calc || {};
global.swisscalc.calc.calculator = function() {
	this._state = 0;	
	this._evaluator = new global.swisscalc.lib.shuntingYard();
	this._mainDisplay = new global.swisscalc.display.numericDisplay(true, 7);
	this._memoryDisplay = new global.swisscalc.display.memoryDisplay();
};


global.swisscalc.calc.calculator.STATE_AWAITING_OPERAND 	= 0;	
global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR 	= 0;
global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND	= 1;
global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR 	= 2;


global.swisscalc.calc.calculator.prototype.setState = function(state) {
	this._state = state;
};


global.swisscalc.calc.calculator.prototype.pushDisplay = function() {
	var val = this._mainDisplay.getDisplayValue();
	this._evaluator.addOperand(val);
};


global.swisscalc.calc.calculator.prototype.addDigit = function(digit) {
	if (this._state == global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR) 
	{
		this._mainDisplay.clear();
		this._mainDisplay.addDigit(digit);
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND) 
	{
		this._mainDisplay.addDigit(digit);
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR) 
	{
		this._mainDisplay.clear();
		this._mainDisplay.addDigit(digit);
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND);
	}
};


global.swisscalc.calc.calculator.prototype.backspace = function() {
	if (this._state == global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR) 
	{
		this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND) 
	{
		this._mainDisplay.backspace();
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR) 
	{
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR);
	}
};


global.swisscalc.calc.calculator.prototype.clear = function() {
	this._mainDisplay.clear();
	this._evaluator.clear();
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};


global.swisscalc.calc.calculator.prototype.clearEntry = function() {
	this._mainDisplay.clear();
};


global.swisscalc.calc.calculator.prototype.equalsPressed = function() {
	this.pushDisplay();
	var result = this._evaluator.evaluate();
	this._mainDisplay.setDisplayValue(result);
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};


global.swisscalc.calc.calculator.prototype.openParen = function() {
	this._evaluator.addOpenParen(global.swisscalc.lib.operatorCache.OpenParenOperator);
	this._mainDisplay.clear();
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};


global.swisscalc.calc.calculator.prototype.closeParen = function() {
	
	if (!this._evaluator.inSubExpression())
		return;
		
	this.pushDisplay();
	this._evaluator.addCloseParen(global.swisscalc.lib.operatorCache.CloseParenOperator);
	this._mainDisplay.setDisplayValue(this._evaluator.popOperand());
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};


global.swisscalc.calc.calculator.prototype.addNullaryOperator = function(nullaryOperator) {
	var val = nullaryOperator.evaluate();
	this._mainDisplay.setDisplayValue(val);
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};


global.swisscalc.calc.calculator.prototype.negate = function() {
	if (this._state == global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR) 
	{
		this.addUnaryOperator(global.swisscalc.lib.operatorCache.NegateOperator);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND) 
	{
		this._mainDisplay.negate();
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR) 
	{
		this.addUnaryOperator(global.swisscalc.lib.operatorCache.NegateOperator);
	}
};


global.swisscalc.calc.calculator.prototype.addUnaryOperator = function(unaryOperator) {
	this.pushDisplay();
	this._evaluator.addUnaryOperator(unaryOperator);
	this._mainDisplay.setDisplayValue(this._evaluator.popOperand());
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};


global.swisscalc.calc.calculator.prototype.addBinaryOperator = function(binaryOperator) {
	if (this._state == global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR) 
	{
		this.pushDisplay();
		this._evaluator.addBinaryOperator(binaryOperator);
		this._mainDisplay.setDisplayValue(this._evaluator.peekOperand());
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERAND) 
	{
		this.pushDisplay();
		this._evaluator.addBinaryOperator(binaryOperator);
		this._mainDisplay.setDisplayValue(this._evaluator.peekOperand());
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR);
	} 
	else if (this._state == global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR) 
	{
		
		this._evaluator.popOperator();
		this._evaluator.addBinaryOperator(binaryOperator);
		this._mainDisplay.setDisplayValue(this._evaluator.peekOperand());
		this.setState(global.swisscalc.calc.calculator.STATE_ENTERING_OPERATOR);
	}
};


global.swisscalc.calc.calculator.prototype.getMainDisplay = function() {
	return this._mainDisplay.getCurrentDisplay();
};


global.swisscalc.calc.calculator.prototype.memoryClear = function() {
	this._memoryDisplay.memoryClear();
};


global.swisscalc.calc.calculator.prototype.memoryPlus = function() {
	var val = this._mainDisplay.getDisplayValue();
	this._memoryDisplay.memoryPlus(val);
};


global.swisscalc.calc.calculator.prototype.memoryMinus = function() {
	var val = this._mainDisplay.getDisplayValue();
	this._memoryDisplay.memoryMinus(val);
};


global.swisscalc.calc.calculator.prototype.memorySet = function() {
	var val = this._mainDisplay.getDisplayValue();
	this._memoryDisplay.memorySet(val);
};


global.swisscalc.calc.calculator.prototype.memoryRecall = function() {
	
	if (!this._memoryDisplay.hasMemory())
		return;
		
	var val = this._memoryDisplay.memoryRecall();
	this._mainDisplay.setDisplayValue(val);
	this.setState(global.swisscalc.calc.calculator.STATE_AWAITING_OPERATOR);
};