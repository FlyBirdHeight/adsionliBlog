# Title 模块开发的相关记录
| 文档创建人   | 创建日期   | 文档内容       | 更新时间 |
| -------- | ---------- | -------------- | ------------ |
| adsionli | 2021-10-26 | Title 模块开发记录  | 2021-10-26 更新相关说明     |

## 1. 正则匹配的使用记录
1. Title内容匹配

匹配规则：`/(^#{1,6})(\s{1,})(.+)/`

标签替换：`-h${value.level} id="title${value.startIndex}" class="${value.level < 4 ? 'page-title' : 'page-title-no-line'}"- ${this.matchSpecialChar(value.label)} -/h${value.level}-`

## 2. Title模块中的数据处理
> 因为对于Title模块来说，最后需要生成其标题列表，所以我们需要将数据处理成==**树的结构**==，方便后期处理组件数据时，方便递归呈现
> 在遍历数据时，实现树的结构是比较简单的，我们需要每一次都分析一下当前传入标题的层级，然后给定其`root`的`startIndex`,这样方便我们之后进行查找
> 具体呈现代码如下
> ```
> /**
> * @method judgeTitle 判断是否是Title
> * @param {*} value 待判断值
> * @param {Number} index 文件中下标
> */
>  judgeTitle(value, index, summaryLevel = null) {
>     if (this.title.test(value)) {
>         let execData = this.title.exec(value);
>         let level = execData[1].length;
>         let label = execData[3];
>         if (!this.lastLevel) {
>             this.lastLevel = level;
>             this.maxLevel = level;
>             this.root = index;
>             this.joinTitleList({
>                 startIndex: index,
>                 endIndex: index,
>                 label,
>                 level,
>                 summaryLevel,
>                 root: undefined,
>                 leave: [],
>             }, index)
>         } else {
>             if (level > this.lastLevel) {
>                 this.lastLevel = level;
>                 this.joinTitleList({
>                     startIndex: index,
>                     endIndex: index,
>                     label,
>                     level,
>                     summaryLevel,
>                     root: this.root,
>                     leave: [],
>                 }, index)
>                 this.root = index;
>             } else if (level == this.lastLevel) {
>                 this.joinTitleList({
>                     startIndex: index,
>                     endIndex: index,
>                     label,
>                     level,
>                     summaryLevel,
>                     root: this.titleValueList.get(this.root).root,
>                     leave: [],
>                 }, index)
>                 this.root = index;
>             } else if (level < this.lastLevel && level > this.maxLevel) {
>                 let selectRoot = undefined;
>                 let value = this.titleValueList.get(this.root);
>                 while (value.level != level) {
>                     selectRoot = value.root;
>                     value = this.titleValueList.get(value.root);
>                 }
>                 this.joinTitleList({
>                     startIndex: index,
>                     endIndex: index,
>                     label,
>                     level,
>                     summaryLevel,
>                     root: this.titleValueList.get(selectRoot).root,
>                     leave: [],
>                 }, index)
>                 this.lastLevel = level;
>                 this.root = index;
>             } else {
>                 this.lastLevel = level;
>                 this.joinTitleList({
>                     startIndex: index,
>                     endIndex: index,
>                     label,
>                     level,
>                     summaryLevel,
>                     root: undefined,
>                     leave: [],
>                 }, index)
>                 this.root = index;
>                 this.maxLevel = level;
>             }
>         }
>     }
> }
> ```
> 这里还需要一些别的处理，我们需要在最后呈现Span处理的时候将数据压平，这样才方便最后的标签插入
> ```
>  /**
>  * @method handleTitleLevel 处理Title的分级
>  */
> handleTitleLevel() {
>      let handleData = new Map();
>      for (let [key, value] of this.titleValueList) {
>          if (typeof (value.root) == 'undefined') {
>              handleData.set(key, value)
>              continue;
>          }
>          this.titleValueList.get(value.root).leave.push(value);
>      }
>      this.titleValueList = [...handleData];
>      this.titleValueList.map((currentValue) => {
>          currentValue.splice(0, 1);
>          return currentValue;
>      })
>      this.titleValueList = this.titleValueList.flat();
>  
>      return this;
> }
> ```

## 3. 一些注意
1. ==在Summary模块中的Title识别仅仅只会提供样式==，而不会生成在TitleList中
2. Title模块中的树形结构最后是返回到最外层了，因为还需要处理成TreeList组件中的