var Token = function(type, text, tname) {
	this.type = type;
	this.text = text;
	this.tname = tname;
};

exports.Token = Token;

Token.prototype.toString = function() {
	return "<'" + this.text + ":" + this.tname + "'>'";
};