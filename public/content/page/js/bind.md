# apply,bind,call用法与区别

| 文档创建人 | 创建日期   | 文档内容                  | 更新时间   |
| ---------- | ---------- | ------------------------- | ---------- |
| adsionli   | 2021-11-15 | apply,bind,call用法与区别 | 2021-11-15 |

>  最近写代码经常会碰到使用`apply,bind,call`的场景，为了彻底可以区分开其三者的使用，写一篇博文记录一下。

`bind`与`apply`, `call`的区别在于，`bind`是返回对应函数，便于稍后调用，而`apply`与`call`是立即执行。

## apply

> **mdn**上关于`apply`的说明：[apply说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

### apply解释

**`apply()`**： 改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 `this` 的指向

### apply参数

`apply`参数有两个，分别是：

1. 一个具有给定`this`值的函数

   >必选的。在 *`func`* 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

2. 以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数

   > 可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `func` 函数。如果该参数的值为 `null` 或 `undefined`，则表示不需要传入任何参数。
   >
   > ==注：从ECMAScript 5 开始可以使用类数组对象。==

### apply使用示例

1. 示例一：通过`apply`使用Math方法中的`max`和`min`方法

```js
const numbers = [5, 6, 2, 3, 7];
//通过apply绑定参数，首项包含this值的函数设为Null
const max = Math.max.apply(null, numbers);
//输出为7
console.log(max);
//通过apply绑定参数，首项包含this值的函数设为Null
const min = Math.min.apply(null, numbers);
//输出为2
console.log(min);
```

2. 示例二：最简单的柯里化通用示例的实现，也是通过apply绑定参数，这里传入的`this`设为null

```js
function curry(fn, ...args1){
    let args = args1;
    return function(...args2){
        args = args.concat(args2);
        return fn.apply(null, args);
    }
}
```

3. 示例三：将类数组对象转换成数组对象

```js
//是否是数组对象的验证
function isArray(obj){ 
    return Object.prototype.toString.call(obj) === '[object Array]' ;
}

var parent = document.getElementById('parent');
var child_nodes = parent.childNodes;

var domNodes = Array.prototype.slice.apply(child_nodes)
//输出为true
console.log(isArray(domNodes));
```

> 类数组对象的解释：
>
> `Javascript`中存在一种名为伪数组的对象结构。比较特别的是 `arguments` 对象，还有像调用 `getElementsByTagName` , `document.childNodes` 之类的，它们返回`NodeList`对象都属于伪数组。不能应用 Array下的 `push` , `pop` 等方法。
>
> ==类数组对象不是数组对象，它不包括数组对象原型链上的任何方法==
>
> ```js
> //输出false
> console.log(NodeList instanceof Array)
> ```

### apply源码实现分析

```js
Function.prototype.apply = function (obj, arr) {
    // 当apply的第一个参数是null的时候，this的默认指向是window
    var obj = obj || window;
    // 把该函数挂载到对象上
    obj.fn = this;
    //判断有没有传值
    if (!arr) {
        result = obj.fn();
    } else {
        //判断传入的是不是数组，不是的话抛出异常
        if (!Array.isArray(arr)) {
            throw new Error('上传的必须是数组');
        };
        var args = [];
        // 用于存储apply后面的参数
        for (var i = 0; i < arr.length; i++) {
            args.push('arr[' + i + ']');
        };
        // 这里的args默认是会调用Array.toString()方法的
        var result = eval('obj.fn(' + args + ')');
    }
    // 删除函数
    delete obj.fn;
    // 因为函数可能有放回值，所以把结果也返回出去给他们
    return result;
}

```





## call

> mdn上关于`call`的说明：[call说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

### call解释



### call参数



### call使用示例



### call源码实现分析

```js
Function.prototype.call = function (obj) {
    // 当call的第一个参数没有或者是null的时候，this的指向是window
    var obj= obj || window;
    // 把a方法放进里面
    obj.fn = this;
    // 用于存储call后面的参数
    var args = [];
    var len = arguments.length;
    // 这里是为了将一个函数的参数传入到另外一个函数执行
    for (var i = 1; i < len; i++) {
        args.push('arguments[' + i + ']');
    };
    // 在eval的环境下 args数组会变成一个一个参数字符串（默认是会调用Array.toString()）
    var result = eval('obj.fn(' + args + ')');
    // 删除b里面的a方法
    delete obj.fn;
    // 因为函数可能有返回值，所以把结果也返回出去给他们
    return result;
};

```



## apply与call之间的区别





## bind

### bind解释



### bind参数



### bind使用示例



### bind源码实现分析

```js
Function.prototype.bind = function(context){
    self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){
        var innerArgs = Array.prototype.slice.call(arguments, 1);
        args = args.concat(innerArgs);
        return self.apply(context, args)
    }
}
```



## es7中新增双冒号绑定的使用

### 使用示例

1. 基本使用
2. 链式使用法

