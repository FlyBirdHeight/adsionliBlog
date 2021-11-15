# 鼠标滚轮事件的学习与总结
| 文档创建人 | 创建日期   | 文档内容          | 更新时间 |
| ---------- | ---------- | ----------------- | -------- |
| adsionli   | 2021-11-03 | 滚轮事件的学习与总结 | 2021-11-03   |

> 想写这篇关于鼠标滚轮事件的起因是因为在看elementui-image源码的时候可以通过鼠标滚轮事件，来调整preview-image的图片放缩，所以就想好好学习和整理一下相关知识

## 滚轮事件介绍

什么是滚轮事件？

根据MDN上给出的解释就是：当滚动鼠标滚轮或操作其它类似输入设备时会触发**滚轮事件**。

也就是说滚轮事件不单单指鼠标滚轮，也包括其他可以出发滚轮事件的设备，比如说电脑触控板等都是可以触发滚轮事件的。所以这里的标题实际不是特别的正确，不应该只界定在鼠标触发的滚轮事件。

在MDN上同样还有对滚轮事件的注意事项:

1. 滚轮方向的改动不一定就完全是文档内容的滚动方向，因为标准并未定义滚轮事件会引发什么样的行为，滚轮事件引发的行为都是由浏览器平台来自己定义的。
2. 即便滚轮事件引发了文档内容的滚动行为，也不表示滚轮方向和文档内容的滚动方向一定相同。因而通过该滚轮事件获知文档内容滚动方向的方法并不可靠。
3. 如果想要获取可靠的文档内容的滚动方向，可以通过对文档内容的滚动事件添加监听，主要监听scrollLeft和scrollTop两个值的变化，来推断出滚动方向

> 从上述的注意事项中，我们可以很简单的归纳出几点
>
> 1. 滚轮方向 ≠ 文档滚动方向(严格意义上，实际很多都是相同的)
> 2. 滚轮引发文档内容滚动行为-> 滚动方向 ≠ 文档滚动方向(严格意义上)
> 3. 要获取正确的文档滚动方向，需要添加eventListener，获取scrollLeft和scrollTop两个参数来判断，由此可以看出，滚动方向取决于左、上的方向。

## 滚轮事件的可使用场景(个人见解)

1. 图片放大预览时的放缩操作
2. 内容懒加载时，监听滚动条的滚动位置
3. blog中，显示当前文章内容滑动到什么标题下
4. 商品侧边分类显示商品整体滑动位置（描述的有点怪，具体可参考美团外卖）
5. 歌词的滑动，监听滑动位置，显示对应歌词的加粗
6. 列表展示数据时，默认分页操作，可以根据滑动高度是否到底触发再次请求的操作，模拟分页。(聊天框的实现也是类似的，比如微信)
7. 暂时没想到了，以后再有的话继续补充......

## 不同浏览器平台的鼠标滚轮事件的差异

```js
const mouseWheel = () =>
  "onwheel" in document.createElement("div")
    ? "wheel" // 各个厂商的高版本浏览器都支持"wheel"
    : document.onmousewheel !== undefined
    ? "mousewheel" // Webkit 和 IE一定支持"mousewheel"
    : "DOMMouseScroll"; // 低版本firefox
```

从上述代码中，我们可以看出，滚轮事件主要有三种类型，分别是: `wheel`, `mousewheel`, `DOMMouseScroll`。分别对应的使用场景也在注释中有说明。

虽然在MDN中也有说`mousewheel`已经被弃用了，主要使用的是`wheel`，但是为了兼容低版本浏览器，还是需要添加上去。在低版本的firefox浏览器中，其也不支持`wheel`,所以还需要添加`DOMMouseScroll`已达到兼容的目的。

同时，各个不同的浏览器平台对于滚轮事件的上下移动的判定使用的参数是完全不同的，有的是使用wheelDelta，有的则是使用detail的，并通过他们的正负来判断其滚动的方向的，下面是我在网上找到的一张图，可以从这张图上看出当前使用比较多的浏览器上是通过什么判断的。

![judgeScrollDirection](../../image/js/event/scroll/judge-scroll-direction.png)

> 从上表可以看出，deltaY一个可以判断滚轮的方向是向上还是向下(正值向下滚动，负值向上滚动)。这里的==H==取得是`document.body.clientHeight || window.innerHeight`。==n==是滚动的行数。一般来说n默认的是3行。
>
> 通过分析可以得出以下结论:
>
> 1. **可靠属性**：deltaY，方向判断方法一致（正值向下滚动，负值向上滚动），与操作系统鼠标设置有关联，但需注意绝对值算法不统一。(比如在mac上使用的时候，如果选择的鼠标滚轮是自然属性，实际就是向上滚动是正值，向下滚动是负值)
>
> 2. **功能方面**：Firefox能直观反映滚动行数，但不能直观与浏览器默认滚动条保持同步；其他几组浏览器则恰好相反；
>
> 3. **个人建议**：个人认为wheelDelta的最初设计思想很好，电脑鼠标滚轮垂直行数默认值是3，wheelDelta默认值120，即单行行高40px，即使用户电脑做了个性化设置，像素值也不会出现循环小数，避免了Chrome的deltaY设计缺陷，有利于行业规范化，所以建议各浏览器厂商能完整支持wheelDelta这一属性。

## 鼠标滚轮事件的使用

```js
//获取鼠标滚轮事件
const mouseWheel = () =>
  "onwheel" in document.createElement("div")
    ? "wheel" // 各个厂商的高版本浏览器都支持"wheel"
    : document.onmousewheel !== undefined
    ? "mousewheel" // Webkit 和 IE一定支持"mousewheel"
    : "DOMMouseScroll"; // 低版本firefox
this.mouseWheelHandler = rafThrottle((e) => {
    /**
     * NOTE: wheelDelta和detail都是用来判断滚轮是上滑还是下滑，但是在不同浏览器的平台中的判断条件不同，所以需要两个都叫判断
     * NOTE: 当使用window.requestAnimationFrame的时候，是可以不使用transition的
     */
    const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
    if (delta > 0) {
        this.transform.enableTransition = false;
        this.zoomIn(false);
    } else {
        this.transform.enableTransition = false;
        this.zoomOut(false);
    }
});
on(this.$isServer)(document, mouseWheel(), this.mouseWheelHandler);
```

上面这段代码就是对滚轮事件的一个应用，不过这里是做了一个性能上的优化，暂时先不说。

其实滚轮事件的绑定就和普通事件的处理方式完全相同。

## 滚动事件的性能优化

> 其实之前并没打算写这一章节的，后来发现在阅读源码组件的时候发现了图片懒加载就是基于滚动事件做的性能优化，所以这里新增滚动事件的性能优化这一章节来进行说明。但是这之前需要各位阅读本节的读者，最好先去看一下节流与防抖的知识，这样才可以更好的理解接下来的内容，同样我自己也整理了节流与防抖的知识，可以前往查看: [节流(throttle)与防抖(debounce)](/#/page/js/throttle-debounce)

### 防抖实现滚轮优化

> 这里会选择防抖来实现滚轮优化，实际上是因为我所使用的场景，所以我选择使用防抖来作为本次滚轮优化的一个例子。

滚轮与trottle-debounce结合使用在我们开发的时候有很多很多的示例，所以这里就不进行一一的列举了，我们直接进入一段代码分析示例，结合代码来进行说明，使用场景为：基于滚轮的图片懒加载的实现。代码如下:

```js
/**
* @method throttle 节流的实现
* @description 这里使用第一次立即执行，最后一次执行，中间节流的写法，确保事件执行的准确
* @param {Function} fn 待执行回调方法
* @param {Number} time 执行时间
* @param {Array|null} 传入参数.
*/
function throttle(fn, time, ...res){
    let start = 0;
    let timer = null;
    return function(){
        let now = +new Date();
        if(now - start < time){
           timer && clearTimeout(timer);
           timer = new setTimeout({
               fn.apply(this, res);
               start = now;
           }, time)
        }else{
            start = now;
            fn.apply(this, res);
        }
    }
}
/**
* @method 判断是否为html片段
* @param {Object} node 待判断内容
* @return {Boolean}
*/
function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
}
/**
* @method isScroll 判断是否是滚轮
* @param {Object} el 本体的dom对象
* @param {Boolean} vertical 是否只有垂直滚动条
* @return {Boolean}
*/
function isScroll(el, vertical){
    if (this.$isServer) return;

    const determinedDirection = vertical !== null && vertical !== undefined;
    const overflow = determinedDirection
    ? vertical
    ? getStyle(el, 'overflow-y')
    : getStyle(el, 'overflow-x')
    : getStyle(el, 'overflow');

    return overflow.match(/(scroll|auto|overlay)/);
};
/**
* @method getScrollContainer 获取Scroll容器
* @param {Object} el 本体的dom对象
* @param {Boolean} vertical 是否只有垂直滚动条
* @return {Object} scroll容器
*/
function getScrollContainer(el, vertical){
    if (this.$isServer) return;

    let parent = el;
    while (parent) {
        if ([window, document, document.documentElement].includes(parent)) {
            return window;
        }
        if (isScroll(parent, vertical)) {
            return parent;
        }
        parent = parent.parentNode;
    }

    return parent;
}
/**
* @method handleLazyLoad 处理懒加载
*/
function handleLazyLoad() {
    if (isInContainer(this.$el, this._scrollContainer)) {
        this.show = true;
        this.removeLazyLoadListener();
    }
}
/**
* @method addLazyLoadListener 添加懒加载监听器
*/
function addLazyLoadListener() {
    //判断是否为服务端渲染
    if (this.$isServer) return;

    const { scrollContainer } = this;
    let _scrollContainer = null;
    //NOTE scrollContainer父组件传入的一个scroll容器，不传过来就自己去找，传过来可以是id,name或者直接一个dom元素也可以
    if (isHtmlElement(scrollContainer)) {
        _scrollContainer = scrollContainer;
    } else if (isString(scrollContainer)) {
        _scrollContainer = document.querySelector(scrollContainer);
    } else {
        _scrollContainer = getScrollContainer(this.$el);
    }

    if (_scrollContainer) {
        this._scrollContainer = _scrollContainer;
        this._lazyLoadHandler = throttle(this.handleLazyLoad, 200);
        on(_scrollContainer, 'scroll', this._lazyLoadHandler);
        this.handleLazyLoad();
    }
}

addLazyLoadListener();
```

上段代码看起来很多，实际上的实现不是特别难，主要需要处理的就是找到当前组件所在的`scroll`容器的位置，然后再添加对应容器的`scroll`的监听事件，最后在使用`throttle`(节流)进行处理，减少响应次数，增强用户体验。同时本例子是基于vue进行实现的，所以这里只需控制图片的显示就可以了，不过这里的显示不是用`v-show`来控制的，而是使用`v-if`来使用的，它在一开始是不被渲染得，所以需要使用`v-if`来控制图片的渲染，这样才能实现图片的懒加载。

所以，`throttle`与`scroll`事件的结合，可以提高浏览器的性能，减少事件频繁响应导致`scroll`事件卡顿的影响。

不过上面还是`scroll`的滚动事件，不是鼠标等设备的滚轮事件，但是依然也是滚动事件的一种即滚轮控制滚动条的事件。

### raf(window.requestAnimationFrame)触发滚轮事件

> window.requestAnimationFrame() 这个方法是用来在页面重绘之前，通知浏览器调用一个指定的函数。这个方法接受一个函数为参，该函数会在重绘前调用。
>
> rAF 常用于 web 动画的制作，用于准确控制页面的帧刷新渲染，让动画效果更加流畅，当然它的作用不仅仅局限于动画制作，我们可以利用它的特性将它视为一个定时器。（当然它不是定时器）
>
> 通常来说，rAF 被调用的频率是每秒 60 次，也就是 1000/60 ，触发频率大概是 16.7ms 。(当执行复杂操作时，当它发现无法维持 60fps 的频率时，它会把频率降低到 30fps 来保持帧数的稳定。)
>
> 其实这就有点像==使用时间戳版本的throttle的实现==，但是`raf`的渲染评率会更加的准确，因为这是重新渲染的回调。

代码示例如下:

```js
//获取鼠标滚轮事件
const mouseWheel = () =>
    "onwheel" in document.createElement("div")
    ? "wheel" // 各个厂商的高版本浏览器都支持"wheel"
    : document.onmousewheel !== undefined
    ? "mousewheel" // Webkit 和 IE一定支持"mousewheel"
    : "DOMMouseScroll"; // 低版本firefox

/**
* @method rafThrottle raf的实现
* @param {Function} fn 回调方法
* @return {Function}
*/
function rafThrottle(fn){
    let locked = false;
    return function(...res){
        if(locked){
           return;
        }
        locked = true;
        window.requestAnimationFrame(_ => {
            fn.apply(this, res);
        	locked = false;
        })
    }
}

mouseWheelHandler = rafThrottle((e) => {
    /**
    * NOTE: wheelDelta和detail都是用来判断滚轮是上滑还是下滑，但是在不同浏览器的平台中的判断条件不同，所以需要两个都叫判断
    * NOTE: 当使用window.requestAnimationFrame的时候，是可以不使用transition的
    */
    const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
    if (delta > 0) {
        this.transform.enableTransition = false;
        this.zoomIn(false);
    } else {
        this.transform.enableTransition = false;
        this.zoomOut(false);
    }
});

on(this.$isServer)(document, mouseWheel(), this.mouseWheelHandler);
```

上面这段代码示例就是在图片预览时，可以通过鼠标滚轮的事件去改变图片的scale的值，实现图片的缩放。

这里就是用了rafThrottle方法，来对图片缩放时进行性能优化，让他的缩放速度和浏览器重新渲染速度保持一致，保证整个过程的流畅性，从而不出现影响用户使用的卡顿。

> 代码内容不是太难，这里就详细展开描述了，上面也有相应的注释进行了解释

# 使用总结

滚轮事件在相应事件中比较复杂的一个事件了，想要搞懂这个事件还是有点困难的，只有通过自己的实际上手写代码才能有比较深刻的理解，加上其还拥有性能优化的地方，比如结合节流防抖以及raf来提高性能。所以需要真正掌握这一块知识，需要具备很多前置知识，这也就很好的将这些知识串联在了一起。比如说实现一个基于节流的scroll事件监听，就需要具备**throttle,currying,scrollEvent**这三个方面的知识了。==知识不应该只停留在为了应付面试的八股文之上，知识应该被使用在需要使用的地方。==作为一名好的前端开发，需要考虑更多！加油💪🏻！。
