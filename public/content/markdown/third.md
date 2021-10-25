
> 测试Summary模块以及集成其他模块的用例
> > > > > # 123
>
>  ```
> var JsHighLight = function () {
>     /**
>      * @property {Array} expression 表达式
>      */
>     this.expression = [
>         'let', 'var', 'this', 'class', 'function', 'const', 'import', 'export', 'delete', 'new', 'for', 'while', 'switch',
>         'case', 'break', 'continue', 'default', 'async', 'await', 'return', 'typeof', 'do', 'if',
>         'else if', 'else', 'import', 'super', 'try', 'catch', 'yield', 'throw', 'debugger', 'from', 'in', 'of'
>     ];
>     this.char = /(\`.*\`|\'.*\'|\".*\"|\=|\+|\!|\?|\*|\||\/|\>|\<|\-|\&|\^|\@)/gi
>     this.value = /(?<=(let|var|class|function|const|import))(\s+)(.+?)(?=(\s|;)+)/g
> }
> 
> JsHighLight.prototype.matchExpress = function (data) {
>     for(let value of this.expression){
>         let reg = new RegExp(eval(`/(${value})(\\s|:|\\.){1}/`), 'g');
>         if(reg.test(data)){
>             data = data.replace(reg, '$1$2');
>         }
>     }
> 
>     return data;
> }
> 
> JsHighLight.prototype.matchChar = function(data){
>     if(this.char.test(data)){
>         data = data.replace(this.char, '$1')
>     }
>     return data;
> }
> 
> JsHighLight.prototype.matchValue = function(data){
>     if(this.value.test(data)){
>         data = data.replace(this.value, '$2$3')
>     }
> 
>     return data;
> }
> 
> JsHighLight.prototype.handleHighLight = function(data){
>     let handleData = this.matchChar(data);
>     handleData = this.matchValue(handleData);
>     handleData = this.matchExpress(handleData);
>     console.log(handleData);
>     return handleData;
> }
> 
> export default JsHighLight;
> ```
>
> 也许这就是命运的选择
