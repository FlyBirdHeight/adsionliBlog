# Code 模块开发的相关记录

| 文档创建人 | 创建日期   | 文档内容          | 更新时间 |
| ---------- | ---------- | ----------------- | -------- |
| adsionli   | 2021-10-25 | Code 模块开发记录 | 暂无     |

## 1. 普通代码匹配
1. 匹配规则
```
//不过这里的匹配是对代码段开始的匹配规则
this.codeFragment = /^(\s*)?(`{3})(\s*)?$/;
```
2. 注意事项
> 1. 在普通代码适配的适合需要注意匹配前面的空格个数作为缩进的大小，不然生成的代码会比较丑

## 2. 单行注释模块匹配
1. 匹配规则
```
this.slashAnnotation = /^(\s*)(\/{2})(.+)/;
```

2. 注意事项
> 1. 单行注释匹配一定要注意，在//的前面一定只能拥有空格，否则匹配不成功，这里还未做优化，实际是可以被匹配到的才对

## 3. 多行注释模块匹配
1. 匹配规则
```
//首先是多行匹配的全局匹配，但是在本项目中是对每一行进行匹配的，所以这里的多行全局匹配也只是实验性的，不会作为使用内容
this.morelineAnnotation = /^(\/\*{1,}\n)?((\*{1}.*)\n)*(\*{1,}\/)$/gmi;
//多行匹配的开始、身体、结束匹配方式
this.morelineAnnotationStart = new RegExp(/^(\s*)?(\/\*{1,})(.+)?(\n*)?$/i);
this.morelineAnnotationBody = new RegExp(/^(\s*)?\*{1,}([^/]+)?$/i);
this.morelineAnnotationEnd = new RegExp(/^(\s*)?(\*{1,}.*)*\*\/(\s*)?$/i);
```
2. 注意事项
> *多行匹配相对于其他两个模块来说要难了很多，这里不仅需要匹配到多行的问题，还要考虑如果多行没有结束符号的时候的处理过程*
> 1. 首先多行匹配需要对多行注释的头部进行匹配，一但匹配到了之后，就需要记录多行注释匹配的开始位置
> 2. 开始匹配多行注释身体部分时，同样需要记录上一次身体数据的下标位置，然后判断是否与开始的头部只相差一行，如果是直接放入，更新多行注释缓存数据，如果不是，就需要再次进行判断，如果是已经放入过身体数据，同上操作。如果不是就需要处理，作为普通的代码直接处理即可
> 3. 当匹配到结尾的时候，匹配成功就直接放入到多行注释缓存数据中，然后处理标签并重置数据。如果没匹配到尾部，就直接将下面所有代码作为注释处理
> 4. 这里写的可能不多，但是在实际处理中，是考虑了很久

代码示例：
```
/**
* @method handle 处理代码模块的输入值
*/
handle() {
    let returnHtml = this.handleTag.start;
    let morelineAnnotationStart = undefined;
    let firstMorelineAnnotationFlag = false;
    let morelineAnnotationBodyIndex = undefined;
    let morelineAnnotationEndIndex = undefined;
    let morelineAnnotationData = [];
    this.handleValue.map((currentValue, index) => {
        let innerHtml = this.handleTag.pS;
        currentValue = currentValue.replace(/\r|\n/g, '');
        if (this.slashAnnotation.test(currentValue)) {
            innerHtml = this.handleNote(currentValue, innerHtml);
            returnHtml += innerHtml;
        } else if (this.morelineAnnotationStart.test(currentValue)) {
            morelineAnnotationStart = index;
            firstMorelineAnnotationFlag = true;
            morelineAnnotationData.push(currentValue);
        } else if (this.morelineAnnotationBody.test(currentValue) || currentValue == '*') {
            morelineAnnotationBodyIndex = index;
            if (!firstMorelineAnnotationFlag && morelineAnnotationBodyIndex - morelineAnnotationStart == 1) {
                morelineAnnotationData.push(currentValue);
            } else {
                if (firstMorelineAnnotationFlag && typeof (morelineAnnotationEndIndex) == 'undefined') {
                    morelineAnnotationData.push(currentValue);
                } else {
                    let requestData = [currentValue, firstMorelineAnnotationFlag, morelineAnnotationStart, morelineAnnotationEndIndex, innerHtml, 'notAn']
                    returnHtml += this.handleNormalCode(...requestData);
                }
            }
        } else if (this.morelineAnnotationEnd.test(currentValue)) {
            morelineAnnotationEndIndex = index;
            morelineAnnotationData.push(currentValue);
            returnHtml += this.handleMorelineAnnotation(morelineAnnotationData);
            /**
                * @description 当处理完成后，重置全部关于多行注释的内容
                */
            morelineAnnotationBodyIndex = undefined;
            morelineAnnotationData = [];
            morelineAnnotationStart = undefined;
            firstMorelineAnnotationFlag = false;
            morelineAnnotationEndIndex = undefined;
        } else {
            if (currentValue.length == 0) {
                returnHtml += this.handleTag.br;
                return;
            }
            let requestData = [currentValue, firstMorelineAnnotationFlag, morelineAnnotationStart, morelineAnnotationEndIndex, innerHtml]
            returnHtml += this.handleNormalCode(...requestData);
        }
    })
    returnHtml += this.handleTag.end;
    let startIndex = this.startIndex;
    let endIndex = this.endIndex;
    return {
        startIndex,
        endIndex,
        returnHtml
    };
}
```


## 4. 高亮的模块的处理
1. 高亮模块的匹配规则
```
//表达式、字符、变量
this.expression = [
    'let', 'var', 'this', 'class', 'function', 'const', 'import', 'export', 'delete', 'new', 'for', 'while', 'switch',
    'case', 'break', 'continue', 'default', 'async', 'await', 'return', 'typeof', 'do', 'if',
    'else if', 'else', 'import', 'super', 'try', 'catch', 'yield', 'throw', 'debugger', 'from', 'in', 'of', 'console'
];
this.char = /(\`.*\`|\'.*\'|\".*\"|\=|\+|\!|\?|\*|\||\/|\>|\<|\-|\&|\^|\@)/gi
this.value = /(?<=(let|var|class|function|const|import))(\s+)(.+?)(?=(\s|;)+)/g
```

2. 注意事项
> 1. 在高亮匹配中实际最重要的就是作用域匹配，但是暂时还没有实现，不过思路已经有了，应该会在本周进行实现，类似数据结构课上说的一种习题，就是符号匹配出栈，如果匹配到一个 **{** 就放入栈中，直到后面输入了 **}** ，就从栈中弹出最上层 **{** , 这样我们就可以很好地确认一个变量作用域，同时可以设置其高亮的显示
> 2. 其他内容的高亮全部可以通过正则匹配检查出来，这里就没什么可说的，直接看匹配即可
