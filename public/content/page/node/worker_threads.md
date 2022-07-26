# nodejs之worker_threads学习记录

| 文档创建人 | 创建日期   | 文档内容                | 更新时间   |
| ---------- | ---------- | ----------------------- | ---------- |
| adsionli   | 2022-07-26 | node.js的worker_threads | 2022-07-26 |





## worker_threads

worker_threads在node主要就是用来进行多线程管理的一个库，是用来处理密集型CPU操作的一种很好地辅助手段，当然对于处理I/O来说的话，它的效率就不是特别好了，所以可以选用`cluster`或是`children-node`来进行处理。



### 内置方法

#### isMainThread

`isMainThread`方法是用来判断当前线程是否是主线程的。可以在子线程中进行调用。

#### parentPort

`parentPort`是一个很有用的方法，它可以让我们子线程与主线程进行通信的一个类，我们可以通过`parentPort`接受来自主线程的消息，也可以通过`parentPort`的`postMessage`函数，传递消息给主线程。它也是主要工作在子线程中的，下面是一个使用例子

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename);
    worker.once('message', (message) => {
        console.log(message);  // Prints 'Hello, world!'.
    });
    worker.postMessage('Hello, world!');
} else {
    //NOTE: 当消息从主线程发出时，我们可以通过parentPort.once监听message事件来获取，然后通过postMessage来回传消息
    parentPort.once('message', (message) => {
        parentPort.postMessage(message);
    });
}
```

### resourceLimits

`resourceLimit`是用来限制子线程可以使用的资源数量的，其主要的资源设置有以下几个

- `maxOldGenerationSizeMb`：子线程中栈的最大内存

- `maxYoungGenerationSizeMb`：子线程中创建对象的堆的最大内存

- `codeRangeSizeMb`：生成代码消耗的内存

- `stackSizeMb`：该线程默认堆的大小

其主要作用在子线程创建时候的，声明其内存资源分配限制

### workerData

`workerData`主要用于子线程获取主线程创建时，传递给子线程的数据的。

`workerData`的设置也是在子线程创建的时候进行设置，其设置和使用如下:

```js
const { Worker, isMainThread, workerData } = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
    console.log(workerData); 
}
```





### MessageChannel类

主要内容说明与参数如下:

1. MessageChannel类的主要作用是用来进行子线程之间的通信的。





### Worker类

主要内容说明与参数如下:

1. Worker类的作用就是创建一个子线程，可以通过`new Worker`进行创建，创建的同时必须穿一个`filePath`，来指定其执行内容





#### once与on的事件捕获

once只执行一次，之后就不会在进行监听，但是on不同，on可以持续的进行监听，每一次都会发出响应。具体代码如下

```js
```

上述代码的输出如下

![]()



#### postMessage

从主线程向子线程传递消息，其中包括两个参数，一个是正常的`value`，还有一个可选参数`transferList`



#### unref/ref

线程挂起与恢复

#### terminate

线程关闭

#### transferList解释与注意项

`transferList`是一个`list`，`list`中的对象可以是`ArrayBuffer、MessagePort、FileHandle`。

如果value中包含`SharedArrayBuffer`对象，那么该对象不能被包含在`transferList`中。

几个重要的点：

**1. `shaderdArrayBuffer`与`transferList`不能同时使用。**

**2. 在`postMessage`中，如果指定了transferList的数据，那么在当前线程中之后的使用中，`transferList`中的数据就无法被使用了，因为它会向我们投递物品之后，我们没有了这个物品一样，无法继续使用**

**3. 如果通过`markAsUntransferable`设置过的`buffer`变量，那么仍然是可以被之后使用的，因为`markAsUntransferable`会将数据进行标记，变为不可`transferable`**





### 线程池模式

由于每一次创建线程在销毁，在创建，在销毁的过程，消耗的资源和时间都太多了，所以Node官方在使用时，推荐使用线程池模式来进行多线程任务的处理，那么什么怎么来实现一个线程池模式呢，接下来就一步一步进行实现。