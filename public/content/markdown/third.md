# Markdown 第一期内容测试

## 1. 测试信息记录

| 测试人   | 测试日期   | 测试内容       | 是否通过测试 |
| -------- | ---------- | -------------- | ------------ |
| adsionli | 2021-10-24 | summary 模块测试  | 暂未通过         |
| adsionli | 2021-10-24 | jsHighlight 模块测试 | 通过,还可继续优化         |

## 2. 测试用例
### 1. summary 模块测试测试用例

> 测试Summary模块以及集成其他模块的用例
> # 123
>
> ```
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

1. summmary 匹配的几个特殊的点
    1. summary中是可以匹配code代码模块的，所以我们需要在每一次匹配的时候去匹配是否存在```这个情况，也就是在普通匹配的时候匹配到code的时候的情况，还要放入到summary中来的。*注意，code模块中间是绝对不可以断掉的(==指的是Summary模块的连贯性！==)，如果断掉了，就不能再变成code模块了，而是变成了普通的字符了！*
    2. 同上，也可以分别匹配Title模块和Table模块和OrderList模块，但是匹配Title模块有一个很特殊的点，其内的title模块是不能生成在Title索引中的，只是返回其中的样式
    3. 多个summary连在一起时，就可以组成一个大的summary模块，就像上面的表现形式是一样的
    4. 根据以上的点进行代码的编写