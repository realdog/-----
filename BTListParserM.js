var events = new require("events");
var util = require('util');
var Parser = require('./BTParserM').Parser;

/** 构造函数
 *
 *
 * */

var BTListParserM = function(lexer){
    this.init(lexer);
};

util.inherits(BTListParserM, Parser);

var createBTListParserM = function(lexer) {
    return new BTListParserM(lexer);
};

exports.createListParser = createBTListParserM;

/** 赋值语句
 *  list '=' list
 * */

BTListParserM.prototype.assign = function () {
    console.log("赋值:");
    this.list();
    this.match(this._input_._EQUALS_);
    this.list();
};

/**  _list
 *   '['  elements ']'
 */

BTListParserM.prototype._list = function () {
    console.log("在" +  this.index() + "的位置开始解析list规则");
    this.match(this._input_._LBRACK_);
    this.elements();
    this.match(this._input_._RBRACK_);
};

BTListParserM.prototype.list = function () {
    console.log("列表:");
    var failed = false;
    startTokenIndex = this.index();
    if (this.isSpeculating() && this.alreadyParseRule(this._list_memo_)) {
        return true;
    }
    
    try {
        this._list();
    } catch (e) {
        failed = true;
        throw e;
    } finally {
        if (this.isSpeculating()) {
            this.memoize(this._list_memo_, startTokenIndex, failed);
        }
    }
    
};

/** elements
 *  element (',' element)*
 */
BTListParserM.prototype.elements = function () {
    console.log("元素集合:");
    this.element();
    while (this.LA(1) == this._input_._COMMA_) {
        this.match(this._input_._COMMA_);
        this.element();
    }
};

/** element
 *  第一个是错误的 NAME | list
*/

BTListParserM.prototype.element = function() {
    console.log("元素:");
    /*
    if (this.LA(1) == this._input_._NAME_ && this.LA(2) == this._input_._EQUALS_) {
        this.match(this._input_._NAME_);
        this.match(this._input_._EQUALS_);
        this.match(this._input_._NAME_);
    } else 
    */
    if (this.LA(1) == this._input_._NAME_) {
        this.match(this._input_._NAME_);
    } else if( this.LA(1) == this._input_._LBRACK_) {
        this.list();
    } else {
        throw new Error("应当是name或者list;发现是 " + this.LT(1));
    }
};

/**  stat推演1
 *   list EOF
*/

BTListParserM.prototype.stat_alt1 = function(){
    console.log("推演1:");
  var success = true;
  // 增加标记
  this.mark();
  try {
    // 推演list
    this.list();
    this.match(this._input_._EOF_TYPE_);
  } catch (e) {
    // 推演失败
    console.log(e);
    success = false;
  }
  // 释放标记
  this.release();
  return success;
};

BTListParserM.prototype.stat_alt2 = function(){
    console.log("推演2:");
  var success = true;
  this.mark();
  
  try {
    this.assign();
    this.match(this._input_._EOF_TYPE_);
  } catch (e) {
    console.log(e);
    success = false;
  }
  
  this.release();
  return success;
};

/** 语句
 *  list EOF | assign EOF
*/

BTListParserM.prototype.stat = function() {
    console.log("语句:");
  if (this.stat_alt1()) {
    this.list();
    this.match(this._input_._EOF_TYPE_);
  } else if(this.stat_alt2()) {
    this.assign();
    this.match(this._input_._EOF_TYPE_);
  } else {
    throw new Error("应当是stat发现是 " + this.LT(1));
  }
};