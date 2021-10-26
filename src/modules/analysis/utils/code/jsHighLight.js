var JsHighLight = function () {
    /**
     * @property {Array} expression 表达式
     */
    this.expression = [
        'let', 'var', 'this', 'class', 'function', 'const', 'import', 'export', 'delete', 'new', 'for', 'while', 'switch',
        'case', 'break', 'continue', 'default', 'async', 'await', 'return', 'typeof', 'do', 'if',
        'else if', 'else', 'import', 'super', 'try', 'catch', 'yield', 'throw', 'debugger', 'from', 'in', 'of', 'console'
    ];
    this.char = /(\`.*\`|\'.*\'|\".*\"|\=|\+|\!|\?|\*|\||\/|\>|\<|\-|\&|\^|\@)/gi
    this.value = /(?<=(let|var|class|function|const|import))(\s+)(.+?)(?=(\s|;)+)/g
}
//匹配表达式
JsHighLight.prototype.matchExpress = function (data) {
    for(let value of this.expression){
        let reg = new RegExp(eval(`/(${value})(\\s|:|\\.){1}/`), 'g');
        if(reg.test(data)){
            data = data.replace(reg, '<font class="expression">$1</font>$2');
        }
    }

    return data;
}
//匹配特殊字符
JsHighLight.prototype.matchChar = function(data){
    if(this.char.test(data)){
        data = data.replace(this.char, '<font class="char">$1</font>')
    }
    return data;
}
//匹配变量
JsHighLight.prototype.matchValue = function(data){
    if(this.value.test(data)){
        data = data.replace(this.value, '$2<font class="value">$3</font>')
    }

    return data;
}
//作用域匹配
JsHighLight.prototype.matchScope = function(data){

}

JsHighLight.prototype.handleHighLight = function(data){
    let handleData = this.matchChar(data);
    handleData = this.matchValue(handleData);
    handleData = this.matchExpress(handleData);
    return handleData;
}


export default JsHighLight;