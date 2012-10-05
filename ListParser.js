var events = new require("events");
var util = require('util');
var Parser = require('./Parser').Parser;

var ListParser = function(lexer){
	this.init(lexer);
};

util.inherits(ListParser, Parser);

var createListParser = function(lexer) {
	return new ListParser(lexer);
};

exports.createListParser = createListParser;


ListParser.prototype.list = function () {
	this.match(this._input_._LBRACK_);
	this.elements();
	this.match(this._input_._RBRACK_);
};

ListParser.prototype.elements = function () {
	
	this.element();
	while (this._lookahead_.type == this._input_._COMMA_) {
		this.match(this._input_._COMMA_);
		this.element();
	}
};

ListParser.prototype.element = function() {
	
	if (this._lookahead_.type == this._input_._NAME_) {
		this.match(this._input_._NAME_);
	} else if ( this._lookahead_.type == this._input_._LBRACK_) {
		this.list();
	} else {
		throw new Error("expecting name of list; found " + this._lookahead_);
	}
};