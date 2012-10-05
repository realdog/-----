var events = new require("events");
var util = require('util');

var Lexer = function(input) {
	 
};

util.inherits(Lexer, events.EventEmitter);

Lexer.prototype.init = function (input) {
	 events.EventEmitter.call(this);
	 this._name_ = 1;
	 this._input_ = input;
	 this._p_ = 0;
	 this._c_ = this._input_.charAt(this._p_);
	 this._EOF_ = -1;
	 this._EOF_TYPE_ = 1;
};
Lexer.prototype.consume = function() {
	this._p_++;
	if ( this._p_ >= this._input_.length) {
		this._c_ = this._EOF_;
	} else {
		this._c_ = this._input_.charAt(this._p_);
	}
};

Lexer.prototype.match = function(x) {
	if (this._c_ == x) {
		this.consume();
	} else {
		throw new Error("expecting:" + x + "; but found:" + this._c_);
	}
};

exports.Lexer = Lexer;

exports.createLexer = function (){
	return new Lexer();
}
