var events = new require("events");
var util = require('util');
var Parser = require('./ParserBT').Parser;

var ListParserBT = function(lexer){
    this.init(lexer);
};

util.inherits(ListParserBT, Parser);

var createListParserBT = function(lexer) {
    return new ListParserBT(lexer);
};

exports.createListParser = createListParserBT;


ListParserBT.prototype.assign = function () {
    this.list();

  this.match(this._input_._EQUALS_);

    this.list();
};

ListParserBT.prototype.list = function () {
  console.log(this._lookahead_);
    this.match(this._input_._LBRACK_);
    this.elements();
    this.match(this._input_._RBRACK_);
};

ListParserBT.prototype.elements = function () {
    
    this.element();
    while (this.LA(1) == this._input_._COMMA_) {
        this.match(this._input_._COMMA_);
        this.element();
    }
};

ListParserBT.prototype.element = function() {
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

ListParserBT.prototype.stat_alt1 = function(){
  var success = true;
  this.mark();
  try {
    this.list();
    this.match(this._input_._EOF_TYPE_);
  } catch (e) {
    success = false;
  }
  
  this.release();
  return success;
};

ListParserBT.prototype.stat_alt2 = function(){
  var success = true;
  this.mark();
  
  try {
    this.assign();
    this.match(this._input_._EOF_TYPE_);
  } catch (e) {
    success = false;
  }
  
  this.release();
  return success;
};

ListParserBT.prototype.stat = function() {
  if (this.stat_alt1()) {
    this.list();
    this.match(this._input_._EOF_TYPE_);
  } else if(this.stat_alt2()) {
    this.assign();
    this.match(this._input_._EOF_TYPE_);
  } else {
    throw new Error("expecting stat found " + this.LT(1));
  }
};