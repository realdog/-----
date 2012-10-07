var events = new require("events");
var util = require('util');

var BTParserM = function(){
    
};

util.inherits(BTParserM, events.EventEmitter);


/** 初始化
 * _input_ 为词法解析器实例
 * _lookahead_ 为向前看缓冲区，内容为词法单元
 * _markers_ 为回溯推演标记缓冲区(为了推演/从推演回复时候所进行push/pop _p_ 用的)
 * _p_ 为指示当前词法单元在_lookhead_中位置的指针
 * _FAILED_ 为检测当前语法单元没有解析过的常量
 * _list_memo_ 为记录当前词法单元是否解析过的缓冲区
 */
BTParserM.prototype.init = function(lexer) {
    events.EventEmitter.call(this);
    this._input_ = lexer;
    this._lookahead_ = [];
    this._markers_ = [];
    this._p_ = 0;
    this._FAILED_ = -1;
    this._list_memo_ = {};
};

/** 检测是否当前词法单元已经在推演状态下被解析过
 *  memoization 基本为_list_memo_
 */

BTParserM.prototype.alreadyParseRule = function(memoization) {
    console.log("BTParserM.prototype.alreadyParseRule 检测是否当前词法单元已经在推演状态下被解析过:");
    // 当前位置的词法单元如果不在在_list_memo_
    if (!memoization[this.index()]) {
        return false;
    }
    var memo = memoization[this.index()];
    console.log("解析list之前，目前索引为:  " + this.index() + "; 向前忽略到索引:" + memo + ":" + this._lookahead_[memo].text);
    // 如果是解析失败则抛出异常,否则将_p_指针前移到memo的位置
    if (memo == this._FAILED_) {
        throw new Error("FAIL");
    } else {
        this.seek(memo);
        return true;
    }
};

/** 用于记录中间结果
 *  memoization 基本为_list_memo_
 *  startTokenIndex 记录中起始索引(位于_lookhead_)
 *  failed alreadyParseRule返回的结果true(解析失败),false(没有解析过)
 */

BTParserM.prototype.memoize = function(memoization, startTokenIndex, failed) {
    console.log("BTParserM.prototype.memoize 用于记录中间结果:memoization-" + util.inspect(memoization) + ' startTokenIndex-' + startTokenIndex + ' failed-'  + failed);
    /*如果解析失败，起始位置对应内容为-1否则为结束位置@@ 代表了成功*/
    var stopTokenIndex = failed ? this._FAILED_ : this.index();
    memoization[startTokenIndex] = stopTokenIndex;
};

/** 返回当前_lookahead_缓冲区指针
 */
BTParserM.prototype.index = function() {
    console.log("BTParserM.prototype.index 返回当前_lookahead_缓冲区指针:" + this._p_);
    return this._p_;
};


/** 在向前看缓冲区中移动指针、添加数据用，目前一般是被match调用
*/

BTParserM.prototype.consume = function() {
    // 向前看指针向前移动
    console.log("BTParserM.prototype.consume -_lookahead_.length:" + this._lookahead_.length + ' p:' + this._p_ + ' _markers_.length:' + this._markers_.length);
    this._p_++;
    // 如果当前指针已经超过向前看缓冲区长度 并且推演标记/记录缓冲区内容为空,清空向前看缓冲区以及记忆缓冲区
    // 向前看缓冲区清零
    if (this._p_ == this._lookahead_.length && (!this.isSpeculating())) {
        this._p_ = 0;
        var _temp_ = this._lookahead_.splice(0, this._lookahead_.length);
        this._list_memo_ = {};
    }
    if (this._p_ > 0 && this._lookahead_[this._p_ -1].type != this._input_._EOF_TYPE_) {
        this.sync(1);
    }
    // 向前看缓冲区内容放入一个词法单元
    
};

/**  当前指针放入推演标记缓冲区
*/

BTParserM.prototype.mark = function() {
    console.log("BTParserM.prototype.mark 当前指针放入推演标记缓冲区:" + this._p_);
  this._markers_.push(this._p_);
  return this._p_;
};

/** 从推演标记缓冲区内弹出位置指针并同步给_p_
*/

BTParserM.prototype.release = function() {
    console.log("BTParserM.prototype.release-从推演标记缓冲区内弹出位置指针并同步给_p_");
    var marker = this._markers_.pop();
    this.seek(marker);
};

/** 修改_p_
*/

BTParserM.prototype.seek = function(index) {
    console.log("BTParserM.prototype.seek 修改_p_:" + index+ ' p:' + this._p_);
  this._p_ = index;
};

/** 推演标记/记录缓冲区内容是否为空
*/

BTParserM.prototype.isSpeculating = function() {
  return (this._markers_.length > 0);
};

/** 为向前看缓冲区增加x个词法单元，同时返回指定_p_ + i -1 位置的词法单元
*/

BTParserM.prototype.LT = function(i) {
    console.log("BTParserM.prototype.LT:" + i+ ' p:' + this._p_);
  this.sync(i);
  return this._lookahead_[this._p_ + i - 1];
}

/** 返回指定位置的词法单元类型
*/

BTParserM.prototype.LA = function(i) {
    console.log("BTParserM.prototype.LA:" + i+ ' p:' + this._p_);
    return this.LT(i).type;
};

/** 检查指定位置词法单元类型是否匹配x
 *  x 词法单元类型
 */

BTParserM.prototype.match = function (x) {
    console.log("BTParserM.prototype.match:" + x);
    // 如果指定位置词法单元类型是x则 向前移动_p_ 同时向前看缓冲区增加一个词法单元,否则抛出异常
    if (this.LA(1) == x) {
        this.consume();
    } else {
        throw new Error("MATCH-应当是 " + this._input_.getTokenName(x) + "; 发现是 " + this.LT(1));
    }
};

/** 测试并查看,向前看词法缓冲区增加x个词法单元
 *  i 增加词法单元的个数
*/

BTParserM.prototype.sync = function(i) {
    console.log("BTParserM.prototype.match:" + i + ' p:' + this._p_);
  // 如果要要增加的词法单元个数加上当前指针位置超过了向前看缓冲区长度则扩展缓冲区并添加内容否则不变
  if ((this._p_ + i -1) > (this._lookahead_.length - 1)) {
    // 计算要增加多少个空白位置
    var n = (this._p_ + i -1) - (this._lookahead_.length - 1);
    // 循环添加词法单元
    for(var index = 0; index < n; index++) {
      this._lookahead_.push(this._input_.nextToken());
    }
  }
}

/** 建立解析器实例
*/
exports.createParser = function() {
    return new BTParserM();
};
exports.Parser = BTParserM;