# 变量与类型

| 文档创建人 | 创建日期   | 文档内容                   | 更新时间   |
| ---------- | ---------- | -------------------------- | ---------- |
| adsionli   | 2021-12-16 | Js中的变量与类型的知识总结 | 2021-12-16 |

## 数据类型的种类

根据ECAMScript标准的规定，一共有7种数据类型，然后这7种数据类型又被分为2类，分别是：原始类型和对象类型

### 原始类型

1. `Null`: 只包含了一个值：**Null**
2. `Undefined`: 和上面的老哥一样，也是只有一个值：**Undefined**

3. `Boolean`: 这个老朋友了，布尔类型，两个值：**true**和**false**
4. `Symbol`: 这个数据类型是在ES6中正式提出的，它主要是指一个实例且是唯一、不可改变的，具体的使用方法，将会在另外一篇文章中写出
5. `Number`: 整数、浮点数，以及在JS中特有的一些特殊值：`-Infinity(无穷小)`,`Infinity(无穷大)`,`NaN(无定义Number)`。
6. `String`: 字符串，与其他语言中一样的。

> 在ES10中新增了一种数据类型为`BigInt`，如果有学习C++或者Java的同学应该比较熟悉，极大值类型，类似于C++中的`long long`。

### 对象类型

1. `Object`

   说到`Object`类型，为什么它可以自己作为一大类，因为他下面的东西实在是太多了，随便举几个：`Promise`、`Array`、`Function`，就这几个都是我们最常用的都是在`Object`类型下的特殊对象，所以单独归为一类完全是没所谓的。

## 数据类型区分的意义

### 不可变性

对于原始数据类型来说，在ECMAScript标准中，被定义为具有不可变性的性质，也就是原始数据类型本身是不可被外界所改变的。

比如这里比较典型的String类型的变量：

```js
let str = "adsionli";
str.subString(0, 2);
str.substr(0, 2);
str.toLowerCase(1);
str.trim(1);
str[0] = 1;
console.log(str);
```

通过上述各种的**String**类型下自带的静态方法，你会发现最后的`console`出来的`str`依然还是`adsionli`，他并没有改变原有的`str`变量的值，而是在调用方法的时候返回了一个新的**String**类型的值。

当然这里也会存在一些有趣的问题，比如说下面这段代码：

```js
let str = "adsionli";
str += " love shirley";
console.log(str)
```

这时候`console`打印出来的数据时`"adsionli love shirley"`，这里是不是有点奇怪，为什么`String`类型的变量发生了改变，这不是不符合不可变性的要求了吗？实际这里原本String在内存空间中的确没有改变，而是在执行**+**的时候重新开辟了一块地址空间进行存储，并将`str`变量指针指到了新的地址空间上了，这就到时`str`打印的时候开起来发生了改变，实际上这个`String`值在原来的地址空间中是没有改变的。

具体流程如下图所示：

<img src="../../../image/js/basic/value/value_type/string_add_ram_change.png" alt="string_add_ram_change" style="zoom: 50%;" />

### 引用类型(对象类型)

引用类型在内存中的存储方式是采用的堆内存的结构，因为堆内存结构具有一下几个特点，让引用类型在使用中更加的灵活：

1. 存储的值空间大小不定，可以动态增删
2. 通过代码进行空间分配
3. 空间大
4. 使用引用地址进行读取，无法直接操作内部存储。

当然选用堆内存也有一个比较大的缺点就是**运行效率低**，但是对比它的优点来说，这点真的不太妨碍使用堆内存来存储引用类型。

具体的使用如下图及代码示例所示：

```js
const people01 = {
    name: "adsionli",
    age: "25",
    profession: "Postgraduate"
}
const people02 = {
    name: "shirley",
    age: "25",
    profession: "adsionli wife"
}
const getName = function(people){
    return people.hasOwnProperty('name') ? people.name : 'this people do not have name';
}
```

<img src="../../../image/js/basic/value/value_type/quote_heap_ram_use_info.jpg" alt="quote_heap_ram_use_info" style="zoom:50%;" />

当然，引用类型就不再具有`不可变性`了，我们可以轻易的改变它们

```js
people02.age = 16;
people01.age = 18;
console.log(people01);
console.log(people02);
```

比如说在数组中，数组类中有许多静态方法可以改变数组的结构

1. `pop()`: 弹出数组的最后一个元素，改变原数组，返回弹出元素
2. `shift()`: 把数组的第一个元素删除，若空数组，不进行任何操作，返回undefined,改变原数组，返回第一个元素的值
3. `unshift()`: 在数组头部添加一个或多个元素，改变原数组，返回新数组的长度
4. `reverse()`: 翻转数组，改变原数组，返回翻转后的数组
5. `sort()`: 对数组元素进行自定义回调的排序，改变原数组，返回排序后的数组
6. `splice()`: 从数组中添加/删除项目，改变原数组，返回被删除的元素

### 复制

对于原始类型的数据进行复制的操作可以见代码和下图所示：

```js
let str = "adsionliBlog";
let blogName = str;
console.log(blogName)
```

![copy_normal_type_data]()

对于引用类型的数据进行复制的操作可以见代码和下图所示：

```js
let obj01 = {
    name: "blog",
    author: "adsionli"
}
let obj2 = obj1;
console.log(obj2);
```

![copy_quote_type_data]()

### 比较



### 值传递与引用传递

