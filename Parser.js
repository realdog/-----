var events = new require("events");
var util = require('util');

var Parser = function(){
    
};

util.inherits(Parser, events.EventEmitter);

Parser.prototype.init = function(lexer) {
    events.EventEmitter.call(this);
    this._input_ = lexer;
    this._lookahead_ = lexer.nextToken();

};

Parser.prototype.consume = function() {
    this._lookahead_ = this._input_.nextToken();
}

Parser.prototype.match = function (x) {
    if (this._lookahead_.type == x) {
        this.consume();
    } else {
        throw new Error("expecting " + this._input_.getTokenName(x) + "; found " + this._lookahead_);
    }
};

exports.createParser = function() {
    return new Parser();
};
exports.Parser = Parser;