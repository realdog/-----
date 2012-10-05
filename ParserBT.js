var events = new require("events");
var util = require('util');

var ParserBT = function(){
    
};

util.inherits(ParserBT, events.EventEmitter);

ParserBT.prototype.init = function(lexer) {
    events.EventEmitter.call(this);
    this._input_ = lexer;
    this._lookahead_ = [];
  this._markers_ = [];
    this._p_ = 0;
 
};

ParserBT.prototype.consume = function() {
  this._p_++;
  if (this._p_ == this._lookahead_.length && (!this.isSpeculating())) {
    this._p_ = 0;
    var _temp_ = this._lookahead_.slice(0, this._lookahead_.length);
  }
  this.sync(1);
}

ParserBT.prototype.mark = function() {
  this._markers_.push(this._p_);
  return this._p_;
};

ParserBT.prototype.release = function() {
  var marker = this._markers_.pop();
  this.seek(marker);
};

ParserBT.prototype.seek = function(index) {
  this._p_ = index;
};

ParserBT.prototype.isSpeculating = function() {
  return (this._markers_.length > 0);
};

ParserBT.prototype.LT = function(i) {
  this.sync(i);
  return this._lookahead_[this._p_ + i - 1];
}

ParserBT.prototype.LA = function(i) {
    return this.LT(i).type;
};

ParserBT.prototype.match = function (x) {
    if (this.LA(1) == x) {
        this.consume();
    } else {
        throw new Error("expecting " + this._input_.getTokenName(x) + "; found " + this.LT(1));
    }
};

ParserBT.prototype.sync = function(i) {
  if ((this._p_ + i -1) > (this._lookahead_.length - 1)) {
    var n = (this._p_ + i -1) - (this._lookahead_.length - 1);
    console.log(n)
    for(var index = 0; index < n; index++) {
      this._lookahead_.push(this._input_.nextToken());
    }
  }
}

exports.createParser = function() {
    return new ParserBT();
};
exports.Parser = ParserBT;