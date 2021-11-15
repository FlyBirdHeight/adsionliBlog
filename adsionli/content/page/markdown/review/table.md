# Table 模块开发的相关记录
| 文档创建人   | 创建日期   | 文档内容       | 更新时间 |
| -------- | ---------- | -------------- | ------------ |
| adsionli | 2021-10-26 | Table 模块开发记录  | 2021-10-26 更新相关说明     |

## 1. 正则匹配的使用记录
1. Table内容匹配
    (1) 表头匹配: `/^((\|?)[^|]+(\|{1}))([^|]+(\|?))*([^|]+)/i`;
    (2) Table位置匹配: `/((\|)?(\s*)((:{1})?-{1,}(:{1})?)(\s*)(\|*))+/i`;
    (3) 表体匹配: `/((\|?).*?)+(\|+)/i`;
    (4) 表格结束匹配: `/^(\s*)(\n*|\r*)?$/i`;
    
> 注：这里为了能够匹配各种情况的表格匹配，做了很多次尝试，但是还是会存在极其特殊的匹配不到的情况，绝大部分均可匹配，当然这里的表格处理匹配之外，还在代码层面做了表格的过滤，来进一步阻止脏表格的污染
## 2. Table模块便签替换
这里的Table的标签替换主要使用了自己创建的组件table以及table-column组件来进行接收！

## 3. 开发Table模块时遇到的问题
1. 正则匹配无法判断的情况
    (1) 正则匹配无法很好地判断出表格是否完全匹配，所以需要借助代码层面的辅助进行表格的过滤，过滤代码如下
```
/**
* @method filterTableData 清洗table数据表，剔除不符合要求数据
*/
filterTableData() {
    let filterData = [];
    let filterArray = (value) => {
        return value != '';
    }
    for (let value of this.tableParameter.allTableData) {
        let valueCode = value.codeData;
        let header = valueCode[0].replace(/\s/g, '');
        let rule = valueCode[1].replace(/\s/g, '');
        let headerList = header.split('|').filter(filterArray);
        let ruleList = rule.split('|').filter(filterArray);
        if (headerList.length == ruleList.length) {
            let headerData = this.handleHeaderData(headerList);
            let ruleData = this.handleRuleData(ruleList);
            if (ruleData.length == 0) {
                continue;
            }
            let bodyData = this.handleBodyData(valueCode.splice(2, valueCode.length - 2), headerList.length);
            filterData.push({
                headerData, ruleData, bodyData, startIndex: value.startIndex, endIndex: value.endIndex
            });
        }
    }
    this.tableParameter.allTableData = filterData;

    return this;
}
```
    (2) 自定义组件中需要将表头的数据与表格体的数据进行分割，然后才可以进行渲染，所以需要对匹配数据进行分割
    (3) 传入数据给组件的时候，因为是放在字符串的，所以要对数据`JSON.stringify`才可以，而且，这里存在一个很坑的一点，这个`JSON.stringify`之后的内容是双引号，在实际使用中存在问题，所以在传入的时候需要进行`replace`先转换成单引号，再在接收数据的时候进行`replace`成双引号在`JSON.parse`才可以。代码如下
```
//传入代码
JSON.stringify(value.tableData).replace(/"/g, "'")
//接收数据
JSON.parse(data.replace(/'/g), '"')
```