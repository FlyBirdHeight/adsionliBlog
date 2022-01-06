# Promise源码实现(二)

| 文档创建人 | 创建日期   | 文档内容            | 更新时间   |
| ---------- | ---------- | ------------------- | ---------- |
| adsionli   | 2022-01-05 | Promise源码实现(二) | 2022-01-05 |

在[Promise源码实现(一)](https://adsionli.xslease.com/page/js/advanced/read_promise_01)中，我们已经完成了一个Promise实例的链式调用及错误抛出，在本节中我们将来解决一下Promise中一些静态方法以及一些Promise的原型方法的实现。

首先先放出上一节中实现的代码，以便翻阅：

```js
class Promise {
    constructor(fn) {
        this.callbacks = [];
        this.status = 'Pending';
        this.value = null;
        this.reason = null;
        try {
            fn(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            this._reject(error);
        }
    }

    then(onFulfilled, on_rejected = null) {
        return new Promise((resolve, reject) => {
            this.handle({
                onFulfilled: onFulfilled || null,
                onRejected: on_rejected || null,
                resolve,
                reject
            })
        })
    }

    handle(callback) {
        if (this.status === 'Pending') {
            this.callbacks.push(callback);
            return;
        }
        let cb = this.status === 'Fulfilled' ? callback.onFulfilled : callback.onRejected;
        let rcb = this.status === 'Fulfilled' ? callback.resolve : callback.reject;
        let value = this.status === 'Fulfilled' ? this.value : this.reason;
        if (!cb) {
            rcb(value);
            return;
        }
        try {
            let data = cb(value);
            rcb(data);
        } catch (error) {
            callback.reject(error);
        }
    }
    
    catch(onRejected) {
        return this.then(null, onRjected);
    }

    _resolve(value) {
        if (this.status === 'Pending') {
            if (value && (typeof (value) === 'object' || typeof (value) === 'function') && value instanceof Promise) {
                let then = value.then;
                then.call(value, this._resolve.bind(this), this._reject.bind(this));
                return;
            }
            this.status = 'Fulfilled';
            this.value = value;
            this.callbacks.forEach(callback => {
                this.handle(callback)
            })
        }
    }

    _reject(value) {
        if (this.status === 'Pending') {
            this.status = '_rejected';
            this.reason = value;
            this.callbacks.forEach(callback => {
                this.handle(callback)
            });
        }
    }
}
```

## Promise原型方法实现

有一部分的原型的方法已经在上一节实现了，比如说then以及catch方法，所以现在我们来实现一下剩下的一些原型方法

### Promise.prototype.finally的实现

根据[MDN上关于finally方法的介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)，我们可以知道finally方法最后的返回是一个Promise。而且其执行是在Promise结束时，且不管最终的结果是什么都会执行的一个回调函数。

那我们就有了一开始的思路：

1. 返回Promise对象。(说明之后还可以继续`then`)
2. 在Promise结束后，都会执行
3. 因为不受Promise执行的状态影响，所以finally方法接收的回调函数中与状态无关。
4. 将值原封不动的传递给后面的`then`

现在差不多已经明确了内容，那就来开始编写finally的代码吧

```js
finally(callback){
    //首先判断一下传入的参数是否是一个函数方法，如果不是的话，就直接执行then方法，且无需传入回调函数。
    //这样在执行handle的时候就可以根据当前Promise状态直接返回相关值
    if(typeof(callback) !== 'function'){
        return this.then();
    }
    //直接用当前的Promise的原型，因为它返回的是当前次的Promise对象的value以及reason。
    let Promise = this.constructor;
    return this.then(
        //onFulfilled,执行我们传入的finally的回调方法，因为其与状态无关，所以不需要额外的参数传入，就是一个独立的函数
        //同时无论callback回调中是否存在返回，都不会影响到当前次的Promise的value或者reason
    	value => Promise.resolve(callback()).then(() => value),
        //onRejected
        reason => Promise.resolve(callback()).then(() => {throw reason})
    )
}
```

> `Promise.resolve`的实现可以看下一节中的静态方法实现的记录。

到这里，`Promise.finally`的实现就完成啦，接下来我们来继续完善这个Promise类，将其的静态方法进行实现。

## Promise静态方法的实现

### Promise.resolve与Promise.reject实现

`Promise.resolve`与`Promsie.reject`的实现都比较简单，他们的实现方式实际上是差不多的。接下来可以分析一下他的返回与传入

1. 返回的是一个Promise实例对象
2. 其实际就等价于`new Promise((resolve, reject) =>  resolve/reject(value))`。
3. `Promise.resolve`返回的是一个以给定值解析后的`Promise` 对象。如果这个值是一个 promise ，那么将返回这个 promise ；如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。此函数将类promise对象的多层嵌套展平。
4. `Promise.reject`返回一个被拒绝的`Promise对象`。

基于上两点我们就可以编写代码啦！

```js
static resolve(value){
    //如果说传入的value是一个Promise或者是一个thenable对象，那么就直接返回其本身就可以了。
    if(value instanceof Promise){
    	return value;   
    }
    //同时thenable传入的就是一个then方法，那么执行返回的也是一个Promise且就已经是最终状态了，所以直接返回就可以了。
    if(value && typeof(value) === 'object' && value.hasOwnProperty('then') && typeof(value.then) === 'function'){
        return new Promise(resolve => {
            then(resolve)
        })
    }
    return new Promise((resolve,reject) => {
        resolve(value);
    })
}

static reject(value){
    return new Promise((resolve, reject) => {
        reject(value);
    })
}
```

### Promise.all的实现

根据[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)上关于`Promise.all`方法的描述我们可以获得以下信息:

1. 接受的参数是一个Promise的`iterable`类型(`Array，Map，Set`类型)
2. 只返回一个Promise实例且 那个输入的所有Promise的`resolve`回调的结果是一个数组。
3. 一旦其中一个输入的Promise发生错误就会立即抛出，且是第一个抛出的错误信息。
4. 会等到全部的Promise都`resolve`回调执行完成之后或传入的`iterable`中没有Promise的时候，返回的Promise才会进行`resolve`回调。

根据上面的分析，应该还是比较容易写出代码的。下面就是实现Promise.all的代码：

```js
static all(args){
    return new Promise((resolve, reject) => {
        let fulfilledCount = 0;
        const num = args.length;
        let resData = new Array(num);
        args.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                fulfilledCount++;
                resData[index] = res;
                if(fulfilledCount == num){
                    resolve(resData);
                }
            }, error => {
                reject(error)
            })
        })
    })
}
```

### Promise.race的实现

根据[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)上关于`Promise.race`方法的描述我们可以获得以下信息:

1. 返回的是一个Promise对象
2. 返回的数据时传入的Promise的`iterable`类型中，第一个执行完毕的，不论是成功还是失败。

`Promise.race`的实现比起`all`的实现要简单一些，不需要去记录全部的返回，只需要有一个执行完成就返回就完事了。

```js
static race(args){
	return new Promise((resolve, reject) => {
        for(let i = 0; i < args.length; i++){
            Promise.resolve(arghs[i]).then(value => {
                //这里使用return直接返回，结束掉for循环
                return resolve(value)
            }, error => {
                return reject(error)
            })
        }
    })
}
```

## 总结

到这里基本上Promise类的实现基本也就完成了，说实话Promise的运行机制真的有点复杂，看了三天才大概完全弄清楚它的流程以及代码执行过程，弄懂了之后，感觉Promise设计者在设计之时所想到的情况真的是不容易。

现在回顾下 Promise 的实现过程，其主要使用了设计模式中的观察者模式：

1. 通过 `Promise.prototype.then` 和 `Promise.prototype.catch` 方法将观察者方法注册到被观察者 Promise 对象中，同时返回一个新的 Promise 对象，以便可以链式调用。
2. 被观察者管理内部Pending、Fulfilled 和 Rejected 的状态转变，同时通过构造函数中传递的 `resolve` 和 `reject` 方法以主动触发状态转变和通知观察者。

好啦，就到这里啦，还希望好好进行回顾，来预防忘记知识点，加油ヾ(◍°∇°◍)ﾉﾞ！



