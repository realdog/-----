var createListLexer =  require('./ListLexer').createListLexer;
var util = require('util');
var Token = require('./Token').Token;
var createListParser = require('./ListParserBT').createListParser;

//backtrace
var lexer = createListLexer("[a,b] = [c,d]");
var parser = createListParser(lexer);
parser.stat();

/*
// lookahead k
var lexer = createListLexer("[a,b,, abc =abc]");
var parser = createListParser(lexer, 2);
parser.list();
*/

/*
// lookahead 1
var lexer = createListLexer("[a,b, abc] ");
var parser = createListParser(lexer);
parser.list();
*/
/*
// normal
var b = createListLexer("[a,b 测试] ");
var t = b.nextToken();
while (t.type != b._EOF_TYPE_) {
    console.log(t);
    t = b.nextToken();
}
console.log(t);

*/