# 1. 代码构建

```
/**
* @method handleNote 处理note
* @param {String} handleValue 待处理参数
*/
handleNote(handleValue, innerHtml) {
    handleValue = handleValue.replace(this.removeEndSpace, '')
    let spaceCount = handleValue.match(this.space)[0].length;
    let tabLayour = this.getTabNum(spaceCount);
    innerHtml = innerHtml.replace(/code_font/i, this.handleTag.note + (tabLayour != '' ? ` ${tabLayour}` : ''));
    innerHtml += handleValue + this.handleTag.pE;

    return innerHtml
}
```

## 1.1 测试 `table`

|  测试人  |    测试内容    |      测试时间       | 是否完成 |
| :------: | :------------: | :-----------------: | :------: |
| adsionli | 多级标题的构建 | 2021 年 10 月 19 日 |  未完成  |

### 1.1.1 测试==特殊字符==匹配

**adsionli\***真的很肝\*==加油加油==，<u>成为一个优秀的人</u>

## 1.2 测试2级标题2

### 1.2.1 测试3级标题1

#### 1.2.1.1 测试4级标题1

###### 1.2.1.1.1.1 测试6级标题1

## 1.3 测试2级标题3

# 2. 匹配内容的记录

## 2.1 特殊字符匹配

```
//TODO 注意，加粗匹配一定要在倾斜匹配之前
this.specialChar = {
    bold: /(\*{2})(.+?)(\1)/gi,
    tilt: /(\*)(.+?)\1/gi,
    boldTilt: /(\*{3})(.+?)(\1)/gi,
    inlineCode: /(`{1,5})(.+?)\1/gi,
    deleteLine: /(~{2})(.+?)(\1)/gi,
    highlight: /(={2})(.+?)\1/gi,
    hyperlinks: /(\[(.+?)\])(\((.+?)\))/gi
}
```

## 2.2 表格匹配

```
this.tableReg = {
    start: /^((\|?)[^|]+(\|{1}))([^|]+(\|?))*([^|]+)$/i,
    rule: /((\|)?(\s*)((:{1})?-{1,}(:{1})?)(\s*)(\|*))+/i,
    body: /((\|?).*?)+(\|+)/i,
    end: /^(\s*)(\n*)?$/i
};
```

## 2.3 代码匹配（含普通注释及多行注释匹配）
```
/**
* @description 定义正则规则表达式参数
* @property {String} removeEndSpace 去除尾部空格
* @property {String} space 获取空格数量
* @property {Array} nodeSign 注释标记
* @property {RegExp} morelineAnnotation 多行注释的匹配(暂时没啥用)
* @property {RegExp} morelineAnnotationStart 多行注释头匹配
* @property {RegExp} morelineAnnotationBody 多行注释身体匹配
* @property {RegExp} morelineAnnotationEnd 多行注释尾匹配
*
**/
this.removeEndSpace = /\s*$/;
this.space = /^\s*/g;
this.morelineAnnotation = /^(\/\*{1,}\n)?((\*{1}.*)\n)*(\*{1,}\/)$/gmi;
this.morelineAnnotationStart = new RegExp(/^(\s*)?(\/\*{1,})(.+)?(\n*)?$/i);
this.morelineAnnotationBody = new RegExp(/^(\s*)?\*{1,}([^/]+)?$/i);
this.morelineAnnotationEnd = new RegExp(/^(\s*)?(\*{1,}.*)*\*\/(\s*)?$/i);
this.slashAnnotation = /^(\s*)(\/{2})(.+)/;
```

## 2.4 标题匹配
### 2.4.1 普通标题匹配
```
this.title = /(^#{1,6})(\s{1,})(.+)/;
```
### 2.4.2 多级标题的构建