# nodejs之worker_threads学习记录

| 文档创建人 | 创建日期   | 文档内容                    | 更新时间   |
| ---------- | ---------- | --------------------------- | ---------- |
| adsionli   | 2022-07-26 | `node.js`的`worker_threads` | 2022-07-26 |

在开发可视化PPT的这个大功能的时候，突然想到缓存的使用，就选择使用了service-worker，然后又想到可以自定义缓存策略，就想到可以通过后端判断是否发生了更新，但是如何加快判断的过程呢，就想着可以做一个多线程的更新判断。然后就看到了node中的`worker_threads`模块了，既然需要使用这个模块，那就先来学习一下，理清楚一下其中的内容，也方便之后的使用嘞。

## worker_threads

worker_threads在node主要就是用来进行多线程管理的一个库，是用来处理密集型CPU操作的一种很好地辅助手段，当然对于处理I/O来说的话，它的效率就不是特别好了，所以可以选用`cluster`或是`children-node`来进行处理。

`worker_threads`模块中主要包括了其本身的一些内容方法，以及`Worker`，`MessageChannel`这些类，接下来就一块一块内容梳理并记录，方便自己之后进行使用。

### 内置方法

#### isMainThread

`isMainThread`方法是用来判断当前线程是否是主线程的。可以在子线程中进行调用。

```js
import { isMainThread } from "worker_threads"
//NOTE: 用来判断当前线程是否是主线程
if(isMainThread) {
    
}else {
    
}
```

上面就是使用的一个🌰，它的返回值是一个`Boolean`。

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

#### resourceLimits

`resourceLimit`是用来限制子线程可以使用的资源数量的，其主要的资源设置有以下几个

- `maxOldGenerationSizeMb`：子线程中栈的最大内存

- `maxYoungGenerationSizeMb`：子线程中创建对象的堆的最大内存

- `codeRangeSizeMb`：生成代码消耗的内存

- `stackSizeMb`：该线程默认堆的大小

其主要作用在子线程创建时候的，声明其内存资源分配限制

#### workerData

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

#### markAsUntransferable

`markAsUntransferable`函数的作用是将一个数据设置为非`transfer`传递对象，具体作用在下面和`transferList`一起说明，单独说的话不太好理解。

#### moveMessagePortToContext

说实话，一开始没看懂这个函数，感觉怪怪的......后面查了一些别人的，大概知道它是干啥的了。

`moveMessagePortToContext`的作用就是将`MessageChannel`这个原本用来线程间通信的类，切换一个独立的、自定义的`context`对象，而不是默认的上下文对象了。

它主要接收两个参数，一个是原来通过`MessageChannel`创建的`port`实例对象，还有一个参数就是自定义的`context`上下文对象，然后它的返回就是修改了上下文对象之后的`port`对象。

> 不过在我写的时候，没怎么用到这个，就不管啦。

#### receiveMessageOnPort

`receiveMessageOnPort`函数能够获取到指定`port`(`MessageChannel`)的最后一条信息。

> 在写的时候也没怎么使用到，但是还是记录一下，以防之后进行使用

#### SHARE_ENV

`SHARE_ENV`这个参数可以在`new Worker`时，作为`options`中的`env`的参数传入，代表子线程也可以获取到主线程设置`process.env`属性，也就是全局环境变量。就和使用vue的时候设置的那个一样的，这里就是为了让子线程可以获取到。

#### get/setEnvironmentData

`setEnvironmentData`和`getEnvironmentData`作用的地方不同。

1. **`setEnvironmentData`被使用在主线程中**，在主线程中可以通过`setEnvironmentData`来设置环境数据内容，它的参数是`key,value`，这里的`key`可以设置为可用作`Map`键的任意、可克隆的值，`value`就是需要传递的内容。
2. `getEnvironmentData`被使用在子线程中，用来获取主线程中设置的`EnvironmentData`，通过`key`进行获取。

示例代码如下：

```js
const {
    Worker,
    isMainThread,
    setEnvironmentData,
    getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
    setEnvironmentData('Hello', 'World!');
    const worker = new Worker(__filename);
} else {
    console.log(getEnvironmentData('Hello'));  // Prints 'World!'.
}
```

注：使用这两个函数的node版本存在一定的限制，node版本需要`>= 14.18.0`

好了，差不多了，基本把文档中涉及到的内容都梳理完了(我的node设置的版本是14.18.0)，这里是根据自己使用的Node版本来的。

### MessageChannel类

主要内容说明与参数如下:

1. `MessageChannel`类的主要作用是用来进行子线程之间的通信的。
2. `MessageChannel`只能够支持两两线程通信，不能大规模通信。

> `MessageChannel`也是继承了`EventEmit`的

MessageChannel类里面的方法比较简单，就不展开说了，就用列表记录一下

| 名称         | 类型     | 作用                                                         |
| ------------ | -------- | ------------------------------------------------------------ |
| close        | 函数     | 用来关闭通信（**双向关闭**），一旦调用，信道就会关闭，无法`postMessage`了 |
| ref          | 函数     | 用于激活挂起的信道，即激活`unref`之后的信道，如果已经是激活状态的了，就不会在执行了 |
| unref        | 函数     | 用于挂起信道，但是不删除，就是退出了通信，可以用`ref`进行激活 |
| start        | 函数     | `start`的作用就是在如果没有设置`onmessage`监听函数的时候，用于忽略消息的，如果设置了`onMessage`，那么`onmessage`中会自动调用start函数进行消息跳过。如果不设置`start`函数，消息就会进行排队，也就是说`start`是用来消费传送来的消息的 |
| postmessage  | 函数     | 用来发信的，这里不展开说了，在下面worker里面具体说这个函数，因为其实现是一样的。 |
| close        | 监听事件 | 监听当前通信通道关闭事件                                     |
| message      | 监听事件 | 监听通信通道发信事件                                         |
| messageerror | 监听事件 | 监听通信信道发信失败事件                                     |

### Worker类

关于Worker，在使用的时候，感觉有一些内容可以分享给大家：

1. `Worker`类的作用就是创建一个子线程，可以通过`new Worker`进行创建，创建的同时必须传一个`filePath`或者是一个`string`类型的函数(需要在`options`中设置`eval`为`true`才可以)，来指定其执行内容。
1. `Worker`类继承了`EventEmit`类，所以可以使用`EventEmit`的相关函数及参数。
1. `Worker`子线程可以通过创建`MessageChannel`来进行子线程之间的通信，当然这个需要在主线程中进行控制，也可以是子线程中创建后，使用`transferList`，传递给主线程并指定需要通信的子线程，再有主线程进行分发到指定线程。
1. `Worker`子线程之间可以使用`SharedArrayBuffer`这个共享内存进行数据同步，任意一个子线程都可以对`SharedArrayBuffer`进行使用与修改。

#### threadId

可以通过`threadId`获取当前子线程的线程标识

#### once与on的事件捕获

once只执行一次，之后就不会在进行监听，但是on不同，on可以持续的进行监听，每一次都会发出响应。

#### postMessage

从主线程向子线程传递消息，其中包括两个参数，一个是正常的`value`，还有一个可选参数`transferList`

##### value注意项

1. `value`可以设置循环引用、Js类型实例、类型化数组、Wasm等
2. `value`不可设置为:
   1. `FileHandle`类
   2. `Histograme`类
   3. `KeyObject`类(加密秘钥)
   4. `MessagePort`类(可以在`transferList`中使用)
   5. `net.BlockList`
   6. `net.SocketAddress`

> 上面是文档中给出的

##### transferList解释与注意项

`transferList`是一个`list`，`list`中的对象可以是`ArrayBuffer、MessagePort、FileHandle`。

如果value中包含`SharedArrayBuffer`对象，那么该对象不能被包含在`transferList`中。

几个重要的点：

**1. `shaderdArrayBuffer`与`transferList`不能同时使用。**

**2. 在`postMessage`中，如果指定了transferList的数据，那么在当前线程中之后的使用中，`transferList`中的数据就无法被使用了，因为它会向我们投递物品之后，我们没有了这个物品一样，无法继续使用**

**3. 如果通过`markAsUntransferable`设置过的`buffer`变量，那么仍然是可以被之后使用的，因为`markAsUntransferable`会将数据进行标记，变为不可`transferable`**

#### unref/ref

线程挂起与恢复，这个主要是用来在主线程中，控制子线程状态进行使用的。`unref与ref`的作用就和`MessageChannel`的作用是一样的，我们可以使用`unref`与`ref`完成线程的复用，不过这就和之后需要实现的内容有关系了，我使用了`unref/ref`作为线程在有效时间内的挂起和激活。

`unref/ref`的使用也是在主线程中进行使用的。

> `unref/ref`的使用，不会触发`exit`和`online`事件

#### terminate

线程关闭，也就是直接销毁一个子线程对象，也是在主线程中进行使用的。

> `terminate`可以触发`exit`事件

#### stdin/stderr/stdout

这三个函数没怎么用到，也有点不太知道是干啥的，网上查了一下，也没什么人说，估计确实用的比较少。不过看文档里面，大概猜测一下，应该是可以通过这三个函数，来获取到在主线程的输入流，输出流和流读取的，不过没用过也不确定对不对，也不知道可以用在什么地方，知道的xdm可以评论告诉我一下😂。

这三个函数如果需要使用的话，还需要在`new Worker`时，配置一下`options`中的`stdin: true, stdout: true, stderr: true`才可以使用。

#### performance

`performance`参数可以用来获取当前线程的性能信息的对象，具体有些啥我没怎么用过不太知道，等到后面使用了回来补全。

### 线程池模式

由于每一次创建线程在销毁，在创建，在销毁的过程，消耗的资源和时间都太多了，所以Node官方在使用时，推荐使用线程池模式来进行多线程任务的处理。网上有很多人都有写线程池的实现，但是感觉不太符合自己的需求，就自己写了一个可复用线程池，不过写的有点多，这里就不放出来了，在一篇里面我会具体说一下自己的实现和想要实现的内容。



## 结语

本片文章主要是为了整理一下Node官网文档中`worker_threads`模块，里面有些语句描述实在是不太看得懂，所以记录一下，方便之后自己继续开发😂。

> 在node的18.x版本中，还新增了`BoradcastChannel`类，它可以用来1对多进行通信。这里提一下