
global.swisscalc = global.swisscalc || {};
global.swisscalc.lib = global.swisscalc.lib || {};
global.swisscalc.lib.shuntingYard = function() { 
	this._numOpenParen 	= 0;
	this._operands 		= [];
	this._operators 	= [];
	this._actionBuffer 	= [];
};


global.swisscalc.lib.shuntingYard.prototype.peekOperand = function() {
	var len = this._operands.length;
	return (len !== 0) ? this._operands[len-1] : 0.0;
};

global.swisscalc.lib.shuntingYard.prototype.popOperand = function() {
	var len = this._operands.length;
	return (len !== 0) ? this._operands.pop() : 0.0;
};

global.swisscalc.lib.shuntingYard.prototype.numOperands = function() {
	return this._operands.length;
};

global.swisscalc.lib.shuntingYard.prototype.popOperator = function() {
	return this._actionBuffer.pop();
};

global.swisscalc.lib.shuntingYard.prototype.numOperators = function() {
	return this._actionBuffer.length;
};

global.swisscalc.lib.shuntingYard.prototype.inSubExpression = function() {
	return this._numOpenParen > 0;
};

global.swisscalc.lib.shuntingYard.prototype.clear = function() {
	this._operands.length = 0;
	this._operators.length = 0;
	this._actionBuffer.length = 0;
};

global.swisscalc.lib.shuntingYard.prototype.evaluate = function() {
    for (var i = 0; i < this._actionBuffer.length; i++)
        this._operators.push(this._actionBuffer[i]);
    this._actionBuffer.length = 0;
		
	while (this._operators.length > 0) {
		var operator = this._operators.pop();
		this.applyOperator(operator);
	}
	
	if (this._operands.length != 1)
		console.error("Invalid operand length (" + this._operands.length + ")");
        
	return this._operands.pop();
};

global.swisscalc.lib.shuntingYard.prototype.applyOperator = function(operator) {
	var val = operator.evaluate(this);
	this.addOperand(val);
};

global.swisscalc.lib.shuntingYard.prototype.addOperand = function(operand) {
	this._operands.push(operand);
};

global.swisscalc.lib.shuntingYard.prototype.addOperator = function(operator) {
	if (operator.IsOpenParen) {
		this.addOpenParen(operator);
	} else if (operator.IsCloseParen) {
		this.addCloseParen(operator);
	} else if (operator.Arity == global.swisscalc.lib.operator.ARITY_NULLARY) {
		this.addNullaryOperator(operator);
	} else if (operator.Arity == global.swisscalc.lib.operator.ARITY_UNARY) {
		this.addUnaryOperator(operator);
	} else if (operator.Arity == global.swisscalc.lib.operator.ARITY_BINARY) {
		this.addBinaryOperator(operator);
	}
};

global.swisscalc.lib.shuntingYard.prototype.addNullaryOperator = function(operator) {
	this.applyOperator(operator);
};

global.swisscalc.lib.shuntingYard.prototype.addUnaryOperator = function(operator) {
	this.applyOperator(operator);
};

global.swisscalc.lib.shuntingYard.prototype.addBinaryOperator = function(operator) {
	while (this._actionBuffer.length > 0)
	{
		var abLen = this._actionBuffer.length;
		if (!this._actionBuffer[abLen-1].isHigherPrecedence(operator))
			break;
			
		var prevOperator = this._actionBuffer.pop();
		this.applyOperator(prevOperator);
	}
	
	this._actionBuffer.push(operator);
};

global.swisscalc.lib.shuntingYard.prototype.addOpenParen = function(operator) {
	this._actionBuffer.push(operator);
	this._numOpenParen++;
};

global.swisscalc.lib.shuntingYard.prototype.addCloseParen = function(operator) {
	if (this._numOpenParen === 0)
		return;
		
	this._numOpenParen--;
	while (this._actionBuffer.length > 0)
	{
		var nextOperator = this._actionBuffer.pop();
		if (nextOperator.IsOpenParen)
			return;
			
		this.applyOperator(nextOperator);
	}
};