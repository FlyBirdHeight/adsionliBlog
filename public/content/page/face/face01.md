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