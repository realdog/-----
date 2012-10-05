var Lexer =  require('./Lexer').Lexer;
var Token = require('./Token').Token;
var util = require('util');

var ListLexer = function(input) {
    this.init(input);
    this._NAME_ = 2;
    this._COMMA_ = 3;
    this._LBRACK_ =4;
    this._RBRACK_ = 5;
  this._EQUALS_ = 6;
  this._LBRACE_ = 7;
  this._RBRACE_ = 8;
  this._COLON_ = 9;
  this._LP_ = 10;
  this._RP_ = 11;
    this._tokenNames_ = ["n/a", "<EOF>", "NAME", "COMMA", "LBRACK", "RBRACK", "EQUALS", "LBRACE", "RBRACE", "COLON", "LP", "RP"];
};
util.inherits(ListLexer, Lexer);
exports.ListLexer = ListLexer;

ListLexer.prototype.getTokenName = function(pos) {
    return this._tokenNames_[pos];
}

ListLexer.prototype.isLETTER = function() {
    return (/^([\u4E00-\u9AF5\uf900-\ufa2da-zA-Z])*$/.test(this._c_));
}

ListLexer.prototype.nextToken = function() {
    while(this._c_ != this._EOF_) {
        switch(this._c_) {
            case ' ':
            case '\r':
            case '\n':
            case '\t':
                this.ws();
                continue;
            case ',':
                this.consume();
                return new Token(this._COMMA_, ",", this.getTokenName(this._COMMA_));
                break;
            case '[':
                this.consume();
                return new Token(this._LBRACK_, "[", this.getTokenName(this._LBRACK_));
                break;
            case ']':
                this.consume();
                return new Token(this._RBRACK_, "]", this.getTokenName(this._RBRACK_));
                break;
      case '=':
        this.consume();
        return new Token(this._EQUALS_, "=", this.getTokenName(this._EQUALS_));
        break;
      case '{':
        this.consume();
        return new Token(this._LBRACE_, "{", this.getTokenName(this._LBRACE_));
        break;
      case '}':
        this.consume();
        return new Token(this._RBRACE_, "=", this.getTokenName(this._RBRACE_));
        break;
      case ':':
        this.consume();
        return new Token(this._COLON_, "=", this.getTokenName(this._COLON_));
        break;    
      case '(':
        this.consume();
        return new Token(this._LP_, "(", this.getTokenName(this._LP_));
        break;  
      case ')':
        this.consume();
        return new Token(this._RP_, ")", this.getTokenName(this._RP_));
        break;          
            default:
                if (this.isLETTER()) {
                    return this.name();
                }
                throw new Error("invalid character:" + this._c_);
            
        }
    }
    return new Token(this._EOF_TYPE_, "<EOF>", this.getTokenName(this._EOF_TYPE_ ));
};

ListLexer.prototype.name = function() {
    var buf = '';
    do {
        buf += this._c_;
        this.consume();
    } while (this.isLETTER())
    return new Token(this._NAME_, buf, this.getTokenName(this._NAME_));
}

ListLexer.prototype.ws = function(){
    while(this._c_ == ' ' || this._c_ == '\t' || this._c_ == '\r' || this._c_ == '\n') {
        this.consume();
    }
};

exports.createListLexer = function (input){
    return new ListLexer(input);
}



