# 面试题整理第一部分

| 文档创建人 | 创建日期   | 文档内容           | 更新时间   |
| ---------- | ---------- | ------------------ | ---------- |
| adsionli   | 2021-11-05 | 面试题整理第一部分 | 2021-11-05 |

> 面试题就是当我在学习时候，看到有人整理的话，就会进行记录，然后自己实现以下。

## 柯里化相关题目

**第一题：**

```js
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
```

**实现上段代码中给出的函数实现**

实现如下：

```js
var curry = function (fn) {
    let args = []
    return function curryHelper (...res) {
        if (res.length) {
            args = args.concat(res)
            return curryHelper
        } else {
            return fn.apply(this, args)
        }
    }
}

function add(...res) {
    return res.reduce((a, b) => a + b)
}

let addCurry = curry(add);
console.log(add(1)(2)(3)(4)())
```

> 解析：这一题就是典型的柯里化的题目，从给出的函数就可以看出来了，那么这里就采用无限制的柯里化实现就可以了，很简单的一道题目



## 变量相关题目

第一题： console中的输出输出是什么？
```js
function sayHi() {
  console.log(name)
  console.log(age)
  var name = 'Lydia'
  let age = 21
}
sayHi()
```
A: Lydia 和 undefined
B: Lydia 和 ReferenceError
C: ReferenceError 和 21
D: undefined 和 ReferenceError

答案：B
原因：这里主要是涉及到变量提升，`var`定义的变量在未定义时使用时会执行变量提升，所以在一开始输出中会输出`Lydia`。但是let定义的变量则不会存在变量提升，const也不会，这是es6中提出的新的定义变量的方式，变得更加严谨，不会再存在变量提升的情况