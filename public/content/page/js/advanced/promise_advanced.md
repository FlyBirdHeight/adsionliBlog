# Promise

| 文档创建人 | 创建日期   | 文档内容        | 更新时间   |
| ---------- | ---------- | --------------- | ---------- |
| adsionli   | 2022-01-02 | Promise知识梳理 | 2022-01-02 |

## Promise简介

Promise是异步编程的一种解决方案，比起传统的解决方案：回调函数与事件，更加的合理且更加的强大。它最早是JS社区中被提出并实现，ES6将其写入到语言标准,统一了用法，并提供原生`Promise`对象。

一个 Promise 对象代表一个在这个 `promise` 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 *promise*，以便在未来某个时候把值交给使用者。

Promise对象具有两个特点：

1. 对象的状态不受外界的影响。

   Promise对象代表一种异步操作，既然是这样一定存在不同状态，这里定义了3种属于Promise的状态:

   (1) **Pending(进行中)**

   (2) **Fulfilled(已成功)**

   (3) **Rejected(已失败)**

   ==只有异步的结果可以影响到Promise对象的状态，其他任何的外部因素都无法影响。==

2. 对象的状态改变后就不会在改变，任何时候都可以得到这个结果。

   Promise对象只会存在两种状态转变，分别是Pending->Fulfilled以及Pending->Rejected，除了这两种状态转换就没有其他的状态变换了，也就是说不能逆且Fulfilled与Rejected状态之间也不能变换，一旦转变结束，就会Resolved(已定型)

Promise存在的一些缺点

1. 无法取消，一旦Promise创建之后就会立即执行无法中途取消。
2. 如果未设置相关的回调函数的话，就无法接收到Promise内部执行的错误信息。
3. 当Promise对象除于Pending状态时，无法知晓Promise在进行中的状态。

## resolve与reject函数、then回调函数

首先看一个Promise对象使用的例子

```js
var pro = new Promise(function(resolve, reject) {
    ...
    if(success){
        resolve(value)
    }else {
        reject(error)
    }
})
```

通过上面的代码可以看到Promise对象在声明的时候会接受一个函数作为参数传入，且这个函数中会存在两个参数分别是`resolve`与`reject`。

> 这两个参数会有JS引擎提供，不用自己部署。

`resolve`函数的作用就是将Promise对象的状态从Pending变为Fulfilled状态，同时也会将异步的结果作为函数的参数传递出去；`reject`函数的作用就是相反的，是将Promise状态从Pending状态变为Rejected状态，同时也会将异步的错误抛出作为函数的参数传递出来。

当Promise示例生成之后，可以使用`then`方法来分别指定Fulfilled状态以及Rejected状态的回调函数。

```js
var promise = new Promise(function(resolve, reject){
    ...
    if(success){
        resolve(value)
    }else {
        reject(error)
    }
})
promise.then(function(value) {
    console.log(value)
}, function(error) {
    console.log(error)
})
```

`then`方法可以接受两个回调函数作为参数，其中第一个参数的回调函数是必须要提供的，第二个参数的回调函数是可选的。

```js
let myFirstPromise = function(time){
    return new Promise(function(resolve, reject){
        //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
        //在本例中，使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
        setTimeout(resolve, 250, 'done Promise');
    });
}

myFirstPromise(100).then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```

> 通过上面这段代码示例我们可以了解到当我们在Promise实例中使用了一个`setTimeout`的时候，Promise实例会在`setTimeout`结束的时间后变为Fulfilled状态，并且返回异步的结果。

接下来是一个使用`XMLHttpRequest`的操作的例子代码：

```js
//首先先封装一下getJson函数，使其返回一个Promise实例，然后借助这个Promise实例的状态回调函数来做处理
var getJson = function(url){
    var promise = new Promise(function(resolve, reject){
        //创建一个xmlhttprequest请求，并设置请求方法以及请求路径、请求头等参数，同时设置处理函数，在处理函数中改变Promise实例状态
        let client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
        function handler(){
            if(this.readyState !== 4){
               	return;
            }
            if(this.status === 200){
      			//状态为200时，代表请求成功了，这个时候的resolve参数就需要携带返回的请求数据带到回调函数中。
               	resolve(this.response);
            }else {
                //只要状态不是200就是请求失败，将失败的状态信息作为reject的参数，返回到失败的回调函数中进行分析。
                reject(new Error(this.statusText));
            }
        }
    })
    
    return promise;
}
//因为返回的是一个Promise实例，所以我们通过then函数来设置成功与失败的回调函数。
getJson(".../posts.json").then(res => {
    console.log("responseData:", res)
}, error => {
    console.log("responseError:", error)
})
```

> 通过上面的例子，我们就可以简单创建一个类似于ajax或者axios中的`get`请求了，实际上也就是通过Promise来实现的，最后返回一个Promise实例来执行成功或者失败状态的回调函数就可以了。

接下来的这个例子有点特殊，就是通过resolve来返回一个Promise实例作为参数来返回。

```js
let p1 = function(time){
    return new Promise(function(resolve, reject){
        console.log("p1 Promise done!")
        setTimeout(resolve, time, "done promise01 end!")
    })
}

let p2 = new Promise(function(resolve, reject){
    console.log("p2 Promise done!")
    setTimeout(reolve(p1(500)), 100);
})

p2
    .then(res => console.log(res, "p2 status fulfilled"))
    .catch(error => console.log(error, "p2 status rejected"))
```

> 上面的代码示例中，我们可以发现p1返回的是一个Promise示例，然后p2也是一个Promise实例，且在p2中，`resolve`的参数是p1执行之后的返回，也就是一个Promise实例,这个时候我们就会发现这个的执行的顺序是：
>
> 1. p1 Promise done!
> 2. p2 Promise done!
> 3. done promise01 end!     p2 status fulfilled
>
> 通过这个执行顺序我们看出：p1的状态会传递给p2，也就是说p1的状态决定了p2的状态。如果p1处于Pending的状态的时候，p2一定是处于Pending的状态且会等待p1的状态改变。当p1的状态变为了Resolved或Rejected状态时，p2的回调函数就会立即执行，然后将p2的状态变为Resolved或者Rejected状态。
>
> ==也就是说内部决定外部，内部状态的改变带动了外部状态的改变。==

### 备注

当在Promise中调用resolve或是reject的时候并不会终结Promise的参数函数的执行。

```js
new Promise(function(resolve, reject){
    resolve(1);
    console.log(2);
}).then(res => {
    console.log(res)
});
```

将上述代码在浏览器中运行，我们会发现在调用`resolve`函数之后，代码依然会往下走，并且在控制台中打印出2，并且是在`resolve`函数之前被打印出来。这就说明了立即的`resolve`函数是在Promise本轮事件循环的末尾执行的，总是晚于本轮循环的同步任务。

当然，一般来说调用`resolve`或者`reject`之后，Promise的状态就切换完成了，后续的回调操作都会放在`then`函数中，且不会写在`resolve`或者`reject`之后，所以为了避免这个现象的发生，可以改成下面的写法。

```js
new Promise(function(resolve, reject){
    return resolve(1);
    //这里直接return走了，就不会继续执行了。
    console.log("adsionli")
}).then(res => {
    console.log(res)
});
```

## Promise的链式调用

通过上一讲对`resolve`、`reject`以及`then`函数的说明及举例，我们这里就可以展开说说Promise的链式调用法了，这里先借用一下mdn上的一张关于链式调用的图来讲解说明。

![promise_link_use_info](../../image/js/advanced/promise/promise_link_use_info.png)

通过上图，我们可以简单描述一下上图链式调用的过程

1. 首先创建一个Promise实例，此时这个Promise实例处于Pending状态。

2. 当Promise实例完成了事务之后，进行状态转变

    (1) 如果是变为Fulfilled(已完成)状态，那么就可以进入成功的回调函数中。这个时候就可以将`resolve`方法携带的参数传给外部等待处理的内容。**这里就还有一种情况可以发生就是可以在`then`的回调方法中再返回一个Promise实例，这样就可以继续进入下一个Promise的Pending状态并进行等待，同时可以携带上一次Promise实例完成之后的参数。**

   (2)如果是变为了Rejected(已失败)状态，那么既可以通过在`then`中设置第二个可选的回调方法参数或者使用`catch`来捕获Promise实例内部发生的错误。**此时就可以将发生的错误进行处理返回到外部的同步任务中去。这里还有一种选择就是和Fulfilled状态的一样的处理，就是可以在回调方法中再返回一个Promise实例，这样就可以继续进入下一个Promise的Pending状态并进行等待。**

3. 继续重复Promise实例的状态转变的等待...

> 这里会涉及到then/catch的一些内容，主要就是then/catch方法返回的是一个新的Promise实例对象，这就为Promise链式调用提供了基础。

这里举一个代码示例来协助理解：

```js
//假设这里的场景是首先获取用户的id，然后再通过用户名称获取到用户信息，再根据获取到用户的信息来获取@用户的评论
//首先不使用Promise来进行接口请求
http.get('some_url', function (id) {
    //do something
    http.get('getNameById', id, function (userInfo) {
        //do something
        http.get('getCommentAtUser', name, function (commenty) {
            //dong something
        })
    })
});
//使用Promise
var getUserId(url) {
    return new Promise(function(resolve, reject) {
        http.get(url, function(id){
            resolve(id)
        })
    })
}
getUserId("getUserId").then(res => {
    //这个getNameById也是返回一个Promise实例，所以就出发了链式原则，也就是走向Fulfilled状态的链式
    return getNameById(res);
}).then(res => {
    return getCommentAtUser(res);
}).then(res => {
    console.log(res.comment);
})
```

> 说到底，Promise 也还是使用回调函数，只不过是把回调封装在了内部，使用上一直通过 then 方法的链式调用，使得多层的回调嵌套看起来变成了同一层的，书写上以及理解上会比嵌套写法更直观和简洁一些，不会陷入多级嵌套的地狱中去。

在看一个在Mdn上举出的🌰：

```js
const myPromise =
      (new Promise(myExecutorFunc))
    .then(handleFulfilledA,handleRejectedA)
    .then(handleFulfilledB,handleRejectedB)
    .then(handleFulfilledC,handleRejectedC);

// 或者，这样可能会更好...

const myPromise =
      (new Promise(myExecutorFunc))
    .then(handleFulfilledA)
    .then(handleFulfilledB)
    .then(handleFulfilledC)
    .catch(handleRejectedAny);
```

这个例子与上一个例子最大的不同就是在最后去捕获了一下异常，那么在Promise的链式调用中，对于错误的处理究竟该如何办呢？

过早地处理被拒绝的 promise 会对之后 promise 的链式调用造成影响。**不过有时候我们因为需要马上处理一个错误也只能这样做**。另一方面，在没有迫切需要的情况下，可以在最后一个.catch() 语句时再进行错误处理，这种做法更加简单。

当 `.then()` 中缺少能够返回 promise 对象的函数时，链式调用就直接继续进行下一环操作。因此，链式调用可以在最后一个 `.catch()` 之前把所有的 `handleRejection` 都省略掉。类似地， `.catch()` 其实只是没有给 `handleFulfilled` 预留参数位置的 `.then()` 而已。

链式调用的Promise就像俄罗斯套娃一样🪆，但是同时可以看成是一个FIFO形式的队列，先进先出，并可以传递参数给下一个Promise。

```js
{promise A, {promise B, {promise C}}}
```

> 这形式倒是有点像Trie-Tree的感觉，哈哈

到Promise中存在一个return 是Promise的时候，就会出现动态替换效果。return的Promise会替换掉已经Resolved状态的Promise，并且弹出这个Resolved的Promise。

当然除了上述的Promise的链式调用之外，一个Promise实例可能会参与不止一次的嵌套，比如下面这段代码示例，当p01在成为了`settled`状态之后会导致两个实例被then调用。

> settled状态就是已敲定状态，通常是在Pending进行完成之后，还没进入到回调函数的一个状态，此时Promise实例已经执行完毕但是还没触发状态转换的时候，就是已敲定状态。

```js
let p01 = new Promise(xxxFunc);
let p02 = p01.then(handleFulfilled01, handleRejected01);
let p03 = p01.then(handleFulfilled02, handleRejected02);
```

## Promise中的静态方法

### Promise.prototype.then()

1. then方法是定义在Promise原型对向上的，它的作用其实在上面已经说的很清楚了，就是为Promise实例添加状态改变时的回调函数，它可以传入两个回调函数作为参数，第一个是Fulfilled状态的回调函数，第二个是Rejected状态的回调函数，第二个是可选的。
2. then方法返回的实际上是一个新的Promise实例，所以可以采取链式调用的方法，也就上面的那么多关于Promise链式调用的说明。

> 关于对then的返回是一个新的Promise实例的内容，我会在关于Promise源码解析中具体来分析

### Promise.prototype.catch()

**`Promise.prototype.catch`方法实际上就是`then(null,reject)`的别名**，用于返回Promise实例内部执行发生错误时的回调函数。

1. 如果Promise在状态改变时没用使用catch或者then的第二个参数来获取内部执行的错误回调，就无法获取到内部错误的信息。
2. 在最初的描述中我们知道了catch实际也就是then，所以他返回的也是一个Promise对象，也是可以进行链式操作的。

### Promise.all()

1. Promise.all()方法接受的参数是一个Promise的iterable类型的输入，且只返回一个Promise实例。

2. 返回的Promise实例的resolve回来的结果是这个Promise的iterable类型的所有resolve回调返回的数据的集合数组。

3. 最外层的Promise实例是在所有输入的promise的resolve回调都结束，或者输入的iterable里没有promise了的时候，才进行状态切换。

4. **它的reject回调执行是，只要任何一个输入的promise的reject回调执行或者输入不合法的promise就会立即抛出错误，并且reject的是第一个抛出的错误信息**

   > 上句话的意思就是一旦出现错误的时候，就会直接抛出，之前所有成功的都不会传递回来，只会返回遇到的第一个Promise内部发生错误的信息，其他直接抛弃。
   >
   > ==同时因为4的特性，我们可以快速返回失败行为==

5. 如果传入的参数不是Promise实例的时候，就会直接进入到Promise.resolve，创建一个新的Promise实例再进一步处理

接下来举一个有点特殊的例子，大家可以分析一下:

```js
const p1 = new Promise((resolve, reject) => {
	resolve('hello, welcome to adsionli blog')
}).then(result => result)
.catch(error => error)

const p2 = new Promise((resolve, reject) => {
    throw new Error('oh! something is wrong')
}).then(res => res)
.catch(error => error)

Promise.all([p1, p2]).then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
```

先看一下上面这段代码示例，我们可以分析一下最终的输出是什么？

首先我们需要明确的就是，上面的p1与p2两个Promise实例和我们普通使用的是存在不同，就是他们都自己处理状态成功或失败的回调了。然后我们再来想一下，`then`方法返回的是一个新的Promise实例对象。最后再来想一下，新的Promise实例在`Promise.all`中的执行是什么情况。

这时候是不是就比较清晰了，可以来判断一下最后的输出了，最后的输出如下：

```js
'hello, welcome to adsionli blog'
'oh! something is wrong'
```

没错，不管是成功还是失败的信息都会被打印出来。其实通过上面的一步步的思考也不太难以理解。平时我们使用`Promise.all`方法的时候是不会带`then`或者`catch`方法的，所以就不会返回新的Promise实例对象，而是放入的本身实例对象的`iterable`类型的参数，所以一旦内部出现错误，就会被Promise.all的Promise示例对象捕获到，从而抛弃其他的结果。但是在这里呢，我们通过直接处理`resolve`或是`reject`的回调函数，返回一个新的Promise实例对象，这个新的Promise对象接受的参数就是`then`或是`catch`返回回来的参数，然后在`resolve`给最外层的Promise实例。

通过这种处理之后，我们在使用Promise.all的时候就不会因为一个Promise的执行错误，导致整个结果都无法返回而只会返回第一个错误的信息了，所以这是一个比较特殊的点，还是需要分析一下才能得出的。

### Promise.race()

1. `Promise.race()`方法接受的参数是一个Promise的iterable类型的输入，且只返回一个Promise实例。

2. 返回的Promise实例是当作为参数的Promise数组中的第一个Promise实例发生状态改变时的返回值传递到返回的Promise实例中。

   > 这点与Promise.all方法是不同的，它不会等待全部的Promise实例执行完成之后在进入到then中，而是在第一个Promise状态发生改变的时候就进行`then`的回调了。

3. 如果传入的参数不是Promise实例的时候，就会直接进入到`Promise.resolve`，创建一个新的Promise实例再进一步处理(这个和`Promise.all`是类似的)

下面给一个阮老师书上的给出的一个例子，我觉得挺好的，也很有使用的场景：

```js
const p = Promise.race([
    //一个对后端获取用户信息的请求
    http.get('userInfo'),
    //设置一个获取数据时间的门限为5s
    new Promise(function(resolve, reject){
        setTimeout(() => reject(new Error('overTime! please wait!')), 5000)
    })
])
p.then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
```

这个例子可以很好地描述出一个使用`Promise.race()`的场景，就是当后端并发量大无法处理过来数据的时候，我们可以通过设置一个门限时间，来避免无限时间的请求，来提前返回一个错误，使用`Promise.race()`的特性。

### Promise.allSettled()

1. `Promise.allSettled()`方法接受的参数是一个Promise的iterable类型的输入，且只返回一个Promise实例。

2. 返回的Promise实例是所有给定的promise都已经`fulfilled`或`rejected`后的结果

   > 这里就与`Promise.all()`以及`Promise.race()`都完全不同的内容了，`Promise.allSettled()`会返回不管是错误还是正确的全部内容，而不会其中一个成功或是其中一个失败而导致其他结果无法返回的问题。

当有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个`promise`的结果时，通常使用`Promise.allSettled()`。

> 这个比较好理解，就不给出代码示例了。



### 其他

| 方法              | 作用                                                         | 返回                            |
| ----------------- | ---------------- | ---------------- |
| `Promise.resolve()` | `Promise.resolve()`一个比较重要用途就是将当前对象转换成一个新的Promise对象，实际就相当于`Promise(resolve => resolve("foo"))` | Promise实例对象                 |
| `Promise.reject()` | `Promise.reject()`的功能和`Promise.resolve`的作用是类似的，但是不同的是`Promise.reject()`方法的参数会原封不动地作为`reject`的理由变成后续方法的参数。 | Promise实例对象且状态为Rejected |

## 总结

Promise的基本使用以及相关内容到这里其实就差不多了，我发现这个内容还是相当多的，要熟练掌握起来还是需要不少时间的，但是掌握了之后就会成为我们写代码时的一大助力，所以还望看完之后多多进行练习及使用来加深印象，接来就是去看Promise的源码来了解一下内部工作的流程啦，加油加油，2022校招还有半年，冲冲冲ヾ(◍°∇°◍)ﾉﾞ！

## 参考来源

1. ES6标准入门.14章.阮一峰：[线上版本](http://es6.ruanyifeng.com/#docs/promise)
2. MDN.Promise： [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
3. 师兄给的资料😄，这个不放出啦，我的私人收藏。

