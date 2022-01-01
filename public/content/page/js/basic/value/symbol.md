# Symbol类型

| 文档创建人 | 创建日期   | 文档内容                   | 更新时间   |
| ---------- | ---------- | -------------------------- | ---------- |
| adsionli   | 2021-12-17 | Js中的Symbol类型的知识总结 | 2021-12-17 |

# Symbol简介

`Symbol`类型是在ES6标准中推出的一种原始数据类型，但是在平时开发中使用的次数不是很多，所以不是很会使用`Symbol`类型的数据，现在出一篇博文来记录一下这个不同寻常的`Symbol`类型。

## Symbol的定义与概述

1. `Symbol`是一种原始数据类型，其表示的含义就是独一无二的值。

2. `Symbol`值通过`Symbol`函数生成，也就是说，对象的属性名现在可以用两种类型：一种是原来就有的字符串，另一种就是新增的`Symbol`类型。只要属性名属于`Symbol`类型，就是独一无二的，可以保证不会与其他属性名发生冲突。

==使用Symbol函数时，是不可以使用new的，因为Symbol是一种原始数据类型，而不是一个对象，所以是不可以添加属性的。==

3. `Symbol`函数可以接受一个字符串作为参数，表示对Symbol示例的描述，主要是为了在控制台显示的时候，可以显示出字符串参数`Symbol`，加以区分。

```js
let s1 = Symbol('s1');
let s2 = Symbol('s2');

console.log(s1.toString());
console.log(s2.toString());
```

如上述的代码中我们对变量`s1`与`s2`在声明为`Symbol`类型的时候加了字符串作为参数然后在`console.log`的时候，我们可以在浏览器控制台或者终端指执行的时候，区分出不同`Symbol`类型的表标识。

如果说`Symbol`的参数是一个对象的话，那么这个对象一定要带有`toString`方法，因为`Symbol`会自动去调用函数的`toString`方法来作为字符串参数标识。

```js
let obj = {
    toString(){
        return "obj"
    }
}

let s1 = Symbol(obj);
console.log(s1);
```

![symbol_param_obj_toString](../../../image/js/basic/value/symbol/symbol_param_obj_toString.png)

4. 对于Symbol类型来说，如果说在声明的时候，使用了相同的字符串作为表示，当我们去进行比较的时候我们可以发现，返回的一定是false。因为Symbol类型一定是独一无二的，无论字符串表示是否相同，都是不存在一样的

   > 当然对于使用`Symbol.for`来声明的就不一定了，当然这里是使用的Symbol来作为类型声明的。

```js
let s1 = Symbol();
let s2 = Symbol();
console.log(s1 == s2);
let s3 = Symbol('str');
let s4 = Symbol('str');
console.log(s3 == s4);
let s5 = Symbol.for('for');
let s6 = Symbol.for('for');
console.log(s5 == s6);
```

![symbol_equal](../../../image/js/basic/value/symbol/symbol_equal.png)

5. `Symbol`可以转换成两种类型分别是：`Boolean`、`String`。但是`Symbol`不可以转换成`Number`类型。

> 不过当`Symbol`转换成`Boolean`类型的时候，永远都表示为`true`

```js
let sym = Symbol('symbol');
//这里可以看出Symbol可以显示转换成String类型
console.log(`u Symbol is ${sym}`);
//也可以被动转换
let str = String(sym);
console.log(str);

let sym01 = Symbol('boolean');
let bool = Boolean(sym01);
console.log(bool);
```

## Symbol作为类中的属性名的使用

因为每一个`Symbol`值都是独一无二的，所以在对象中使用的话可以保证不会出现相同的作用名属性，这对于一个对象由多个模块构成的情况来说十分的有用，可以防止相同属性名的复写

> 其实也就和其他语言中的`protected`的作用非常相似。

这里举一段代码示例:

```js
var sym = Symbol();
var a = {
    [sym]: 'welcome to adisonli blog!'
}
//这里的输出就是'welcome to adisonli blog!'
console.log(a[sym]);
```

==`Symbol`类型的值作为对象的属性名的时候是不可以通过点运算符来进行调用的！==

> 其实原因也很好理解，因为点运算符之后跟的是字符串，但是Symbol类型也是一种基本类型且无法通过设置的字符串标记来取到，如此就可以知道肯定是无法通过点运算法来获取的。
>
> 下面这段代码就可以很清晰的显示
>
> ```js
> let sym = Symbol('symbol');
> let a = {
>     sym: 'adsionli blog'
> }
> a[sym] = 'adsionli'
> console.log('point:',a.sym);
> console.log('sym Symbol:',a[sym].toString(), sym.toString());
> console.log('iterator get:',a['sym']);
> console.log('point == iterator:',a.sym == a['sym']);
> ```
>
> ![symbol_obj_attribute](../../../image/js/basic/value/symbol/symbol_obj_attribute.png)
>
> 所以通过上面这个例子我们可以很容易的看到，Symbol在对象中的读取形式和普通的字符串属性是不相同的，无法通过点运算符来读到，只可以通过对象的迭代器属性来读取。

### Symbol作为属性名的遍历方式

根据上面的内容我们可以知道`Symbol`在对象中的获取方便与普通的字符串的属性获取是不同的，那么在`Object`类型中的`getOwnPropertyName`的方法是否能够获取到呢，答案自然是不行的，因为Symbol类型不是字符串类型，所以无法进行获取。当然`Object`类型中有一个方法还是可以获取到的就是`getOwnPropertySymbols`方法。

> 当然啦，这里如果是`hasOwnProperty`也就无法判断是否存在`Symbol`类型的属性啦！

同时，针对对象类型的迭代器遍历方式，比如`for...in...`或者是`for...of...`也是无法获取到`Symbol`类型的属性的，只可以获取普通的字符串类型的属性。

示例代码及运行示例图如下：

```js
let obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj.name = "shirley";
obj.age = 25;
obj[a] = 'adsionli';
obj[b] = 'blog';
console.log(obj)
let s = Object.getOwnPropertyNames(obj);
console.log('string attributes:', ...s);
let ssym = Object.getOwnPropertySymbols(obj);
console.log('symbol attributes:', ...ssym);
for(let key in obj){
    console.log("for...in...:", key);
}
```

![symbol_object_attribute_diffuse_getOwn](../../../image/js/basic/value/symbol/symbol_object_attribute_diffuse_getOwn.png)

在ES6中存在一个新的特殊类`Reflect`，其中的`ownKeys`方法可以获取到包括`Symbol`类型属性在内的全部的`key`，这里就让各位自己去测试一下啦。

基于上面的特性，通常就会将Symbol作为对象中定义一些非私有但又希望只用于内部的方法：

```js
var size = Symbol('size');
class Collection {
    constructor(){
        this[size] = 0;
    }
    
    add(item) {
        //这里可以通过获取this[size]的大小作为键名
        this[this[size]] = item;
        this[size]++;
    }
    
    static sizeOf(obj){
        return obj[size];
    }
}

let x = new Collection();
console.log('x size:', Collection.sizeOf(x));
x.add('adisonli');
x.add('blog');
console.log('x size:', Collection.sizeOf(x));
console.log('x attributes:', Object.getOwnPropertyNames(x));
console.log('x all attributes:', Reflect.ownKeys(x));
```

![symbol_not_primitive_inside_value](../../../image/js/basic/value/symbol/symbol_not_primitive_inside_value.png)

### Symbol在常量中的使用

`Symbol`类型还可以用来定义一组常量，可以保证常量中的每一个值都一定不相同。

```js
log.levels = {
    DEBUG: Symbol('debug');
    INFO: Symbol('info');
	WARN: Symbol('warn');
}

console.log(log.levels.DEBUG, "debug message");
console.log(log.levels.INFO, "info message");
```

常量使用`Symbol`最大的好处就是其他任何值都不可能是相同的值，这样就保证了`switch`的工作模式一定是可以被使用的。

## Symbol.for与Symbol的区别

当我们需要使用相同的`Symbol`值的时候，普通的`Symbol`是无法做到这一点的，只能够通过使用另外一种形式来声明的时候才可以，就是`Symbol.for`来声明。

`Symbol.for`可以接受一个字符串作为参数，然后回去搜索是否已经存在相同字符串的`Symbol`值，如果有就返回这个`Symbol`值，如果没有的话就新建一个并返回`Symbol`值。

```js
let sym01 = Symbol.for('adsionli');
let sym02 = Symbol.for('adsionli');

console.log(sym01 == sym02);
```

`Symbol.for`与`Symbol`都可以生成新的`Symbol`。他们的最主要的区别就是`Symbol.for`会被登记在全局变量中而`Symbol`则不会。`Symbol.for`的声明最大的不同就是在每次声明的时候会先去查询当前字符串的key是否存在，如果不存在的话就会创建一个`Symbol`并返回，然后再放入搜索表中，如果已经存在就直接返回而不会创建了。

`Symbol.keyFor`方法能够将一个通过`Symbol.for`声明的`Symbol`的值，返回其的key值。

> `Symbol.for`为`Symbol`值登记的名字是全局环境的，可以在不同的`iframe`或`service worker`中取到同一个值。

## 内置Symbol值

