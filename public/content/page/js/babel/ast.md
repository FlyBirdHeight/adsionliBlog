# babel学习-AST抽象语法树

| 文档创建人 | 创建日期   | 文档内容                | 更新时间   |
| ---------- | ---------- | ----------------------- | ---------- |
| adsionli   | 2022-07-20 | babel学习-AST抽象语法树 | 2022-07-20 |

### Literal

字面量

### identifier 

标识符

### statement 

语句，可独立执行的单位

### declaration

 声明语句

### expression 

表达式，具有返回值

### Class

class 的语法也有专门的 AST 节点来表示。

整个 class 的内容是 ClassBody，属性是 ClassProperty，方法是ClassMethod（通过 kind 属性来区分是 constructor 还是 method）。

### Modules

es module 是语法级别的模块规范，所以也有专门的 AST 节点。

#### import

import 有 3 种语法：

named import：

```javascript
import {c, d} from 'c';
```

default import：

```javascript
import a from 'a';
```

namespaced import:

```javascript
import * as b from 'b';
```

这 3 种语法都对应 ImportDeclaration 节点，但是 specifiers 属性不同，分别对应 ImportSpicifier、ImportDefaultSpecifier、ImportNamespaceSpcifier。

#### export

export 也有3种语法：

named export：

```javascript
export { b, d};
```

default export：

```javascript
export default a;
```

all export：

```javascript
export * from 'c';
```

分别对应 ExportNamedDeclaration、ExportDefaultDeclaration、ExportAllDeclaration 的 AST。

比如这三种 export

```javascript
export { b, d};
export default a;
export * from 'c';
```

### Program & Directive

program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。还有 directives 属性，存放 Directive 节点，比如`"use strict"` 这种指令会使用 Directive 节点表示。

### File & Comment

babel 的 AST 最外层节点是 File，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。

注释分为块注释和行内注释，对应 CommentBlock 和 CommentLine 节点。