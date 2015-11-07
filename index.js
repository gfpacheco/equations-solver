var Expression = function(left, operator, right) {
    if (typeof left === 'string') {
        this.parse(left);
    } else {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    this.bringXToTheLeftSide();
};

Expression.prototype.parse = function (string) {
    var operatorIndex = string.search(/[\+\-]/);

    if (operatorIndex === -1) {
        operatorIndex = string.search(/[\*\/]/);
    }

    if (operatorIndex !== -1) {
        this.left = new Expression(string.substring(0, operatorIndex));
        this.operator = string.substr(operatorIndex, 1);
        this.right = new Expression(string.substr(operatorIndex + 1));
    } else if (string.indexOf('x') === -1) {
        this.value = parseInt(string);
    } else {
        if (string === 'x') {
            this.value = 'x';
        } else {
            this.left = new Expression(string.replace('x', ''));
            this.operator = '*';
            this.right = new Expression('x');
        }
    }
};

Expression.prototype.bringXToTheLeftSide = function () {
    if (this.operator && this.operator.search(/\-\//) === -1 && this.right.hasX()) {
        var tempExpression = this.left;
        this.left = this.right;
        this.right = tempExpression;
    }
};

Expression.prototype.evaluate = function() {
    if (this.operator) {
        switch(this.operator) {
            case '+': return this.left.evaluate() + this.right.evaluate();
            case '-': return this.left.evaluate() - this.right.evaluate();
            case '*': return this.left.evaluate() * this.right.evaluate();
            case '/': return this.left.evaluate() / this.right.evaluate();
        }
    } else {
        return this.value;
    }
};

Expression.prototype.hasX = function() {
    if (this.operator) {
        return this.left.hasX() || this.right.hasX();
    } else {
        return this.value == 'x';
    }
};

Expression.prototype.inverseOperator = function() {
    switch(this.operator) {
        case '+': return '-';
        case '-': return '+';
        case '*': return '/';
        case '/': return '*';
    }
};

var Equation = function(string) {
    var equalIndex = string.indexOf('=');
    this.left = new Expression(string.substring(0, equalIndex));
    this.right = new Expression(string.substr(equalIndex + 1));
};

Equation.prototype.findX = function() {
    while(this.left.value !== 'x') {
        this.bringXToTheLeftSide();
        this.right = new Expression(this.right, this.left.inverseOperator(), this.left.right);
        this.left = this.left.left;
    }

    this.bringXToTheLeftSide();
    return this.right.evaluate();
};

Equation.prototype.bringXToTheLeftSide = function () {
    if (!this.left.hasX()) {
        var tempExpression = this.left;
        this.left = this.right;
        this.right = tempExpression;
    }
};

function equations_solver(e) {
    return new Equation(e).findX();
}

console.log('If 2*x+4=20 than x = ' + equations_solver('2*x+4=20'));
console.log('If 5*2+x*2=40 than x = ' + equations_solver('5*2+x*2=40'));
