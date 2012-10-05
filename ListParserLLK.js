var events = new require("events");
var util = require('util');
var Parser = require('./ParserLLK').Parser;

var ListParser = function(lexer, bufferLen){
	this.init(lexer, bufferLen);
};

util.inherits(ListParser, Parser);

var createListParser = function(lexer, bufferLen) {
	return new ListParser(lexer, bufferLen);
};

exports.createListParser = createListParser;


ListParser.prototype.Scene = function (){
  this.match(this._input_.)
}

ListParser.prototype.list = function () {
  
	this.match(this._input_._LBRACK_);
  
	this.elements();
	this.match(this._input_._RBRACK_);
};

ListParser.prototype.elements = function () {
	
	this.element();
	while (this.LA(1) == this._input_._COMMA_) {
		this.match(this._input_._COMMA_);
		this.element();
	}
};

ListParser.prototype.element = function() {
	if (this.LA(1) == this._input_._NAME_ && this.LA(2) == this._input_._EQUALS_) {
		this.match(this._input_._NAME_);
		this.match(this._input_._EQUALS_);
		this.match(this._input_._NAME_);
	} else if (this.LA(1) == this._input_._NAME_) {
		this.match(this._input_._NAME_);
	} else if( this.LA(1) == this._input_._LBRACK_) {
		this.list();
	} else {
		throw new Error("expecting name of list; found " + this.LT(1));
	}
};