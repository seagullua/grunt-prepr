/*
 * Rather dubious usage of macros, JavaScript allows to define CLASS and METHOD
 * as functions instead, the only advantage can be that the macro substitution does not
 * incur any runtime costs. For example:
 * 
function CLASS(name, func) {
	this[name] = func;
}

function METHOD(clazz, methodName, func) {
	clazz.prototype[methodName] = func;
}

CLASS("Vector", function(x, y) {
    this.x = x; 
    this.y = y;
});

METHOD(Vector, "add", function(other) {
	return new Vector(this.x + other.x, this.y + other.y);
});

var a = new Vector(1, 2);
var b = new Vector(2, 3);

a.add(b);
 */

#define CLASS(NAME) function NAME
#define METHOD(CLASS_NAME, NAME) CLASS_NAME.prototype.NAME = function

CLASS(Vector)(x, y) {
	this.x = x; 
	this.y = y;
}

METHOD(Vector, add)(other) {
	return new Vector(this.x + other.x, this.y + other.y);
};

var a = new Vector(1, 2);
var b = new Vector(2, 3);

a.add(b);