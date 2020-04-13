function Stack() {

    this.push = function(item) {
        stack.push(item);
    };

    this.pop = function() {
        stack.pop();
    };

    this.empty = function() {
        return stack.length == 0;
    };

    this.top = function() {
        return stack[stack.length - 1];
    };

    this.size = function() {
        return stack.length;
    };

    var stack = new Array();
}

export {Stack};
