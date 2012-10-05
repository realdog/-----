var events = new require("events");
var util = require('util');

var ParserLLK = function(){
	
};

util.inherits(ParserLLK, events.EventEmitter);

ParserLLK.prototype.init = function(lexer, bufferLen) {
	events.EventEmitter.call(this);
	this._input_ = lexer;
	this._lookahead_ = [];
	this._bufferLen_ = bufferLen;
	this._p_ = 0;
	var i = 0;
  //console.log(this._bufferLen_);
	try {
		for (i = 0; i < this._bufferLen_; i++) {
			this.consume();
		}
	} catch (e) {
		console.log(e);
	}

};

ParserLLK.prototype.consume = function() {
  
	this._lookahead_[this._p_] = this._input_.nextToken();
	this._p_ = (this._p_ + 1) % this._bufferLen_;
}

ParserLLK.prototype.LT = function(i) {

	return this._lookahead_[( this._p_ + i - 1) % this._bufferLen_ ];
}

ParserLLK.prototype.LA = function(i) {
	return this.LT(i).type;
}

ParserLLK.prototype.match = function (x) {
	if (this.LA(1) == x) {
		this.consume();
	} else {
		throw new Error("expecting " + this._input_.getTokenName(x) + "; found " + this.LT(1));
	}
};

exports.createParser = function() {
	return new ParserLLK();
};
exports.Parser = ParserLLK;