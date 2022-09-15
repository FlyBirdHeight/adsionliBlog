# Vue3之Diff算法学习

| 文档创建人 | 创建日期   | 文档内容          | 更新时间   |
| ---------- | ---------- | ----------------- | ---------- |
| adsionli   | 2022-07-13 | Vue3 Diff算法学习 | 2022-07-13 |

`Vue3`中最重要的模块之一就是`Diff`算法了，它保证了虚拟`Dom`的快速更新，为对比新旧`Virtual DOM`来找出真正的`Dom`变化之处提供了高效的查询。所以就需要来学习一下实现。

> 本章主要是通过学习<<vue.js设计与实现>>这本书来进行总结

首先对于拥有子集且子集是一个数组的时候，我们才会在组件更新的时候，去使用`diff`算法。这一点需要明确。

## 简单Diff

简单Diff的实现是真的比较简单，但是理解了简单Diff之后，就可以为之后学习双端Diff和快速Diff打下一个好的基础，知道我们的目标是什么。

> 这里使用到的一些函数和参数，都是在[Node](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)这个对象下的

我们需要在Diff算法中实现什么?

1. 找到需要更新的节点
2. 节点内容未改变，但节点顺序发生改变后，调整真实dom顺序
3. 有新增节点内容时，进行挂载与Dom的调整
4. 旧节点被移除后，卸载节点

也就是需要实现上面四个目标，然后我们就一步一步来实现。

### 1.1 节点更新判断

既然要知道节点是否被更新，那么我们首先需要**为每一个节点加上一个唯一标识符**，这样有利于让我们可以快速的在旧节点内容与新节点内容中找到对应的关系，来判断节点是否被更新。

```typescript
/**
* @method simpleDiff 简单Diff
* @param {*} newChildren 新节点数据
* @param {*} oldChildren 旧节点数据
* @param {Node} container 容器
*/
const simpleDiff = function(newChildren: any[], oldChildren: any[], container: Node) {
    //README: lastIndex就是用来记录newChildren元素的位置是否发生改变的关键
    let lastIndex = 0;
    for(let i = 0; i < newChildren.length; i++) {
        for(let j = 0; j < oldChildren.length; j++) {
            if(newChildren[i].key === oldChildren[j].key) {
                //NOTE: 首先会先对节点进行更新，这里会进行一个el的真实映射，是newChildren的节点也会获得真实dom，具体代码下面截图放出
                patch(oldChildren[j], newChildren[i], container);
                if(j < lastIndex) {
                	......
            	}else {
                    lastIndex = j;
                }
            }
        }
    }
}
```

> `patch`更新函数中也是最后会调用到`patchElement`这个函数，所以我们看一下`patchElement`函数实现：
>
> ```typescript
> function patchElement(n1: VNode, n2: VNode) {
>     //README: 这里就是进行DOM复用，在复用了DOM元素之后，新节点将持有对真实DOM的引用
>     const el = n2.el = n1.el;
>     const newProps = n2.props;
>     const oldProps = n1.props;
> 
>     for (const key in newProps) {
>         if (newProps[key] !== oldProps[key]) {
>             options.patchProps(el, key, oldProps[key], newProps[key])
>         }
>     }
>     for (const key in oldProps) {
>         if (!(key in newProps)) {
>             options.patchProps(el, key, oldProps[key], null);
>         }
>     }
>     //NOTE: 更新子节点
>     patchChildren(n1, n2, el);
> }
> ```
>
> 上面备注中也已经标出了，会进行`el`赋予。

上面这段代码中出现了一个`lastIndex`的变量，这个变量是用来记录节点位置是否发生改变的一个判断依据，我们可以通过遍历`newChildren`时，判断新的位置和`oldChilren`中的位置，进行判断是否发生改变。比如说下图的这种情况

![simpleDiff_change](../image/vue/diff/simpleDiff_change.png)

上图我们可以看到之前的p-3所在的index是2，但是在`newChildren`中，他的位置变成了0，这时候我们发现老的位置下标是要比新的位置下标来的大的，所以我们需要去更新一下`lastIndex`，让`lastIndex = j`，也就是赋予老的位置`index`。为什么这么做呢，因为这里和之后的更新`dom`有很大的关系。这里更新真实`dom`和我们会很容易想到的改变`parentNode`的`childNode`中的位置不同，它是采用尾插移动的，如下图

![simpleDiff_change-status](../image/vue/diff/simpleDiff_change-status.jpg)

有了上面这个图，就很明确了。所以我们可以通过`lastIndex`赋予老的且大的`index`，来判断`newChildren`中的`node`是否顺序发生改变的判断依据。

### 1.2 节点位置改变

在1.1中，我们已经可以知晓位置是否改变，且知道了他的位置改变时采用尾插法进行改变的，不是通过调整`childNode`中的原有顺序调整的，因此通过`lastIndex`的改变与比较，就可以知道位置是否改变了，那么为了调整位置的话，用代码实现比较简单了，如下所示

```typescript
/**
* @method simpleDiff 简单Diff
* @param {*} newChildren 新节点数据
* @param {*} oldChildren 旧节点数据
* @param {Node} container 容器
*/
const simpleDiff = function(newChildren: any[], oldChildren: any[], container: Node) {
    //README: lastIndex就是用来记录newChildren元素的位置是否发生改变的关键
    let lastIndex = 0;
    for(let i = 0; i < newChildren.length; i++) {
        for(let j = 0; j < oldChildren.length; j++) {
            if(newChildren[i].key === oldChildren[j].key) {
                patch(oldChildren[j], newChildren[i], container);
                if(j < lastIndex) {
                    //README: 这里我们可以知道，新的节点顺序一定是真实dom最终的顺序，所以我们可以通过获取前置节点来作为锚点。
                    //README: 因为新的节点数据中el对应的还是老的节点数据的真实Dom数据的，所以我们可以获取到
                	let preVNode = newChildren[i - 1];
                    if(anchor) {
                        //获取锚点，通过Node的nextSibling属性
                        let anchor = preVNode.el.nextSibling;
                        insert(oldChildren[j].el, container, anchor);
                    }
            	}else {
                    lastIndex = j;
                }
            }
        }
    }
}
```

我们通过获取`newChildren`上一节点的数据，来获取到它的前置节点的`VNode`，又因为它的el中保存的就是真实`dom`数据，那么我们就可以获取它的锚点`anchor`啦，然后再通过`Node`对象中的`nextSibling`属性可以获取到当前锚点的紧邻的后一位的`child`对象，然后在进行添加即可(这里需要先判断当前位是不是第一位，如果是第一位，那么`anchor`就为`undefined`，就不同设置了)。`insert`函数的代码如下

```typescript
const insert = (el, parent, anchor: Node | null = null) => {
    //insertBefore是Node的内置函数，用于添加到childrenNode中
    parent.insertBefore(el, anchor);
}
```

`insertBefore`也是`Node`对象本身具有的内置函数，直接调用就可以进行设置添加了。

### 1.3 新增节点

除了本身的节点位置及内容更新，也会存在新增的节点的进入，如果需要加入新增的接点的话，也是非常的简单的，我们只需要稍微修改一下1.2中的`simpleDiff`代码的实现即可

```typescript
/**
* @method simpleDiff 简单Diff
* @param {*} newChildren 新节点数据
* @param {*} oldChildren 旧节点数据
* @param {Node} container 容器
*/
const simpleDiff = function(newChildren: any[], oldChildren: any[], container: Node) {
    let lastIndex = 0;
    for(let i = 0; i < newChildren.length; i++) {
        //FIXME: 新增一个find协助判断是否是新增节点
        let find = false;
        for(let j = 0; j < oldChildren.length; j++) {
            if(newChildren[i].key === oldChildren[j].key) {
                find = true;
                patch(oldChildren[j], newChildren[i], container);
                if(j < lastIndex) {
                	let preVNode = newChildren[i - 1];
                    if(anchor) {
                        let anchor = preVNode.el.nextSibling;
                        insert(oldChildren[j].el, container, anchor);
                    }
            	}else {
                    lastIndex = j;
                }
            }
        }
        //如果在上面没有找的话，find依然是false,说明是新增节点
        if(!find) {
            let preVNode = newChildren[i - 1];
            let anchor = null;
            //FIXME: 如果新增节点在首位，那么就额外处理一下，否则取前置节点作为锚点
            if(preVNode) {
                anchor = preVNode.el.nextSibling;
            }else {
                //这里依然是调用了Node对象的属性firstChild,来设置锚点
                anchor = container.firstChild;
            }
            patch(null, newChildren[i], container,anchor);
        }
    }
}
```

新增了一个属性`find`用来协助判断是否是新增节点，如果是新增节点的话，就将新增节点添加入对应的位置，也就是下面的处理，这里稍微有点不一样，因为新增节点可能是首位，所以会调用`Node`对象的`firstChild`作为锚点进行新增。那么具体的工作原理可以看下图:

<img src="../image/vue/diff/simpleDiff_add.jpg" alt="simpleDiff_add" style="zoom:67%;" />

### 1.4 节点删除

那么有了节点更新，添加之后，也就会存在节点删除的情况，对于节点删除来说，我们只需要判断`newChildren`与`oldChildren`是否一样就可以了，所以还是需要在1.3的基础上继续完善代码，添加`newChildren`与`oldChildren`进行对比的代码即可。

```typescript
/**
* @method simpleDiff 简单Diff
* @param {*} newChildren 新节点数据
* @param {*} oldChildren 旧节点数据
* @param {Node} container 容器
*/
const simpleDiff = function(newChildren: any[], oldChildren: any[], container: Node) {
    let lastIndex = 0;
    for(let i = 0; i < newChildren.length; i++) {
        let find = false;
        for(let j = 0; j < oldChildren.length; j++) {
            if(newChildren[i].key === oldChildren[j].key) {
                find = true;
                patch(oldChildren[j], newChildren[i], container);
                if(j < lastIndex) {
                	let preVNode = newChildren[i - 1];
                    if(anchor) {
                        let anchor = preVNode.el.nextSibling;
                        insert(oldChildren[j].el, container, anchor);
                    }
            	}else {
                    lastIndex = j;
                }
            }
        }
        if(!find) {
            let preVNode = newChildren[i - 1];
            let anchor = null;
            if(preVNode) {
                anchor = preVNode.el.nextSibling;
            }else {
                anchor = container.firstChild;
            }
            patch(null, newChildren[i], container,anchor);
        }
    }
    //NOTE: 通过遍历oldChildren与newChildren进行对比，如果newChildren中不存在，就执行unmounted卸载操作
    for(let i = 0; i < oldChildren.length; i++) {
        let has = newChildren.find(vnode => vnode.key === oldChildren[i].key)
        if(!has) {
            unmount(oldChildren[i]);
        }
    }
}
```

通过在最后添加一次对比操作，来判断节点是否需要被卸载，如果`oldChildren`中的节点在`newChildren`无法找到的话，就进行卸载`unmount`操作。

> 这里最后的卸载在书上写的方法确实有点啰嗦了，有很多好的方法来实现，但是这只是作者给我们的一种思路参考的实现，所以无需深究这点。

好了，上面的4个步骤，我们就可以完成简单`Diff`的实现了，我想大家可以发现，这样子的时间复杂度也实在是有点高，有很多可以优化的地方，所以下面就是优化的内容，也就是双端`Diff`以及快速`Diff`了。

## 双端Diff

开始说双端Diff之前，可以先看一张对比图，然后从这个对比图开始我们的双端Diff实现原理的学习

<img src="../image/vue/diff/double_diff-constract.jpg" alt="double_diff-constract" style="zoom:80%;" />

可以看到再`SimpleDiff`中我们需要**移动2次**才能完成节点的更新，分别移动`p1,p2`。但是在右边这块中，我们只需要**移动一次`p3`的位置**，就可以完成更新，这就是我们需要在双端`Diff`中优化的效果，优化时间复杂度，减少节点更新次数。通过对比可以很直观地看到双端`Diff`的优势。简单`Diff`需要移动两次，而双端`Diff`只需要移动一次即可。

### 2.1 一般实现

我们通过下图，来一窥一般实现双端Diff的思路，很简单。

![image](../image/vue/diff/doubleDiff-index.jpg)

通过上图我们可以知道，双端`Diff`的实现是依靠的多指针来实现的，实际就是双指针的`Double`版，旧节点集合和新节点集合均有一对双指针来进行遍历比较。

这个比较的顺序在图上也已经清楚地标出了，分别是：

1. `newChildrenStart compare oldChildrenStart`

   新节点集合的头部节点与旧节点集合的头部节点进行比较。**如果相同就进行节点更新，更新`newChildren`的头指针与`oldChildren`的头指针；不同向下执行。**

2.  `newChildrenEnd compare oldChildrenEnd`

   新节点集合的尾部节点与旧节点集合的头部尾点进行比较。**如果相同就进行节点更新，更新`newChildren`的尾指针与`oldChildren`的尾指针；不同向下执行。**

3. `newChildrenEnd compare oldChildrenStart`

   新节点集合的尾部节点与旧节点集合的头部尾点进行比较。**如果相同就进行节点更新并进行真实的dom移动，更新`newChildren`的尾指针与`oldChildren`的头指针；不同向下执行。**

4. `newChildrenStart compare oldChildrenEnd`

   新节点集合的尾部节点与旧节点集合的头部尾点进行比较。**如果相同就进行节点更新并进行真实的dom移动，更新`newChildren`的尾指针与`oldChildren`的头指针；不同向下执行。**

> 1,2的判断与3,4判断后的处理不同，3,4还需要对应真实dom移动，而1,2实际还是在原位置，所以无需移动

所以我们可以先把我们需要使用到的变量设置出来

```typescript
type NodePointer = {
    index: number,
    node: VNode
}

let newStart: NodePointer = {
    index: 0,
    node: newChildren[this.index]
}
let newEnd: NodePointer = {
    index: newChildren.length - 1,
    node: newChildren[this.index]
}
let oldStart: NodePointer = {
    index: 0,
    node: oldChildren[this.index]
}
let oldEnd: NodePointer = {
    index: oldChildren.length - 1,
    node: oldChildren[this.index]
}
```

这里我们就是需要维护四个指针，也就是`newChildren`的头尾指针，`oldChildren`的头尾指针。

那么在理想情况下一定会有一对节点存在对应关系，且不存在节点卸载与新增，因此我们可以在上述四种情况中的任意一种都可以进行命中，那么就可以来进行代码编写了。

```typescript
type NodePointer = {
    index: number,
    node: VNode
}
const DoubleDiff = function(newChildren: VNode[], oldChildren: VNode[], container: Node) {
    let newStart: NodePointer = {
        index: 0,
        node: newChildren[this.index]
    }
    let newEnd: NodePointer = {
        index: newChildren.length - 1,
        node: newChildren[this.index]
    }
    let oldStart: NodePointer = {
        index: 0,
        node: oldChildren[this.index]
    }
    let oldEnd: NodePointer = {
        index: oldChildren.length - 1,
        node: oldChildren[this.index]
    }
    //README: 因为我们需要遍历newChildren与oldChildren所有修改后的节点，所以这里要使用while并引入对应终止判断
    //判断条件很好理解，如果最终两边的双指针同时指向最后一个节点时，说明已经到最后一个了，然后就可以跳出循环了
    while(newStart.index <= newEnd.index && oldStart.index <= oldEnd.index ) {
        //NOTE: 下面就是对上诉四种情况的判断
        if(newStart.node.key === oldStart.node.key) {
            patch(oldStart.node, newStart.node, container);
            //首部指针判断完成，均向下移动
            newStart.node = newChildren[++newStart.index];
            oldStart.node = newChildren[++oldStart.index];
        }else if(newEnd.node.key === oldEnd.node.key) {
            patch(oldEnd.node, newEnd.node, container);
            //尾部指针判断完成，均向上移动
            newEnd.node = newChildren[--newEnd.index];
            oldEnd.node = oldChildren[--oldEnd.index];
        }else if(newEnd.node.key === oldStart.node.key){
            patch(oldStart.node, newEnd.node, container);
            //这里因为位置不同，需要更新真实Dom位置，锚点选中为oldEnd的位置的紧邻下一位
            insert(oldStart.node.el,container, oldEnd.node.el.nextSibling);
            //newEnd指针判断完成，向上移动；oldStart指针判断完成，向下移动
            newEnd.node = newChildren[--newEnd.index];
            oldStart.node = oldChildren[++oldStart.index];
        }else if(newStart.node.key === oldEnd.node.key) {
            patch(oldEnd.node, newStart.node, container);
            //这里因为位置不同，需要更新真实Dom位置，锚点选中为olStart的位置
            insert(oldEnd.node.el,container, olStart.node.el);
            //newStart指针判断完成，向下移动；oldEnd指针判断完成，向上移动
            newStart.node = newChildren[++newStart.index];
            oldEnd.node = oldChildren[--oldEnd.index];
        }
    }
}
```

好啦，这样就完成了，看着挺多，实际很简单的嘞，所以这一块看完一遍立刻就记住了😂，只需要我们控制好指针移动的位置就好啦，还有就是锚点的选定，和简单Diff是不同的，因为有的可能是末尾，有的是首位，这里得注意一下下。

既然是在理想情况下，每一次比较都会出现相同的情况。那么非理想情况下呢，该如何处理呢？

### 2.2 非理想情况

什么是非理想情况？就是我们进行两边的首尾节点比较的四种情况没有任何一种情况符合的时候，就是非理想情况，那么在这种情况下我们该如何处理呢？下图就是我们的解决方法的具体处理。

![image](../image/vue/diff/doubleDiff_no_normal.jpg)

通过上图我们可以知道，我们通过查找`newStart`在`oldChildren`中复用的`vnode`，注意这里是查找`newStart`对应的，因为`newChildren`才是我们最终的要完成的。通过找到的可复用`vnode`，我们去更新`vnode`以及调整相关真实`dom`的位置。这里就是比较重要的一步，**我们需要把`oldChildren`中复用位置的`vnode`变为`undefined`，因为这样，当我们再次遍历到这个位置的时候，我们就知道这个位置已经被处理过了，不需要处理了，直接更新指针就完事了。**

有了上面的分析之后，我们来实现就很简单了。

```typescript
const DoubleDiff = function(newChildren: VNode[], oldChildren: VNode[], container: Node) {
    ......
    while(newStart.index <= newEnd.index && oldStart.index <= oldEnd.index ) {
        //NOTE: 新增两个判断，判断是否是已经处理过的节点，如果是直接更新指针
        if(!oldStart) {
            oldStart.node = oldChildren[++oldStart.index]
        }else if(!oldEnd) {
            oldEnd.node = oldChildren[--oldEnd.index]
        }else if(newStart.node.key === oldStart.node.key) {
            ......
        }else if(newEnd.node.key === oldEnd.node.key) {
            ......
        }else if(newEnd.node.key === oldStart.node.key){
            ......
        }else if(newStart.node.key === oldEnd.node.key) {
            ......
        }else {
            //README: 如果上述四种情况都没有命中的话，说明我们需要自己去找到对应newStart.node的可复用节点
            let idx = oldChildren.findIndex(vnode => vnode.key === newStart.node.key);
            /**
            * README: 这里大于0的判断是有说法的，因为如果是新增节点的话，返回的是-1
            * 还有一种不可能的情况就是idx == 0的情况，因为上面四种判断中已经知道是肯定不可能的;
            * 那么大于0说明节点是存在的
            */
            if(idx > 0) {
                patch(oldChildren[idx], newStart.node, container);
                //NOTE: 记得要更新真实Dom, 这时候的锚点位置，就是我们要替换的oldStart的位置，因为对应的是newStart位置
                insert(oldChildren[idx].el, container, oldStart);
                //NOTE: 再记得更新一下newStart指针，然后将遍历过的
                oldChildren[idx] = undefined;
                newStart.node = newChildren[++newStart.index];
            }
        }
    }
}
```

这样，我们的就可以更新非理想情况下的节点位置啦，通过很巧妙的设置`undefined`的情况，来跳过检测过的节点，然后再通过主动需要`oldChildren`中的可复用节点，来进行更新

### 2.3 节点新增

之前我们已经把节点在无新增的情况下的更新情况已经处理好啦，那么现在就开始处理节点新增的情况下的代码改动了。在**2.2**中我们不是在最后的else中代码说明里面写了为什么判断`>0`的情况，那么我们就可以在这里去挂载我们的新增节点。稍微修改一下此处代码。

```typescript
let idx = oldChildren.findIndex(vnode => vnode.key === newStart.node.key);
if(idx > 0) {
    patch(oldChildren[idx], newStart.node, container);
    insert(oldChildren[idx].el, container, oldStart);
    oldChildren[idx] = undefined;
}else {
    //NOTE: 这里说明就是新增的代码，并且他们的锚点就应该是oldStart，因为此时新增节点的位置newStart位置上，所以要对应过去
    patch(null, newStart, container, oldStart.node.el)
}
//README: 因为两种情况都要移动newStart指针，所以可以放到外面来
newStart.node = newChildren[++newStart.index];
```

但是除了上述情况之外，我们知道新增节点之后且`oldChildren`中的节点没有被卸载，那么`newChildren`的长度肯定会比`oldChildren`长，所以在这种情况时，我们可能此时已经走到了`oldStart.index > oldEnd.index`情况了，就如下图。

![doubleDiff_add](../image/vue/diff/doubleDiff_add.jpg)

那么为了应对上图所展示的情况，我们就需要在循环之外，做处理了，这个处理也很简单，我们可以看到图中，此时在`newStart.index`与`newEnd.idx`之间的全部内容都是我们需要新增的内容，那么就可以知道我们的代码怎么写了。

```typescript
const DoubleDiff = function(newChildren: VNode[], oldChildren: VNode[], container: Node) {
    ......
    while(newStart.index <= newEnd.index && oldStart.index <= oldEnd.index ) {
        if(!oldStart) {
            ......
        }else if(!oldEnd) {
            ......
        }else if(newStart.node.key === oldStart.node.key) {
            ......
        }else if(newEnd.node.key === oldEnd.node.key) {
            ......
        }else if(newEnd.node.key === oldStart.node.key){
            ......
        }else if(newStart.node.key === oldEnd.node.key) {
            ......
        }else {
            let idx = oldChildren.findIndex(vnode => vnode.key === newStart.node.key);
            ......
            if(idx > 0) {
               ......
            }else {
                //NOTE: 这里说明就是新增的代码，并且他们的锚点就应该是oldStart，因为此时新增节点的位置newStart位置上，所以要对应过去
                patch(null, newStart, container, oldStart.node.el)
            }
            //README: 因为两种情况都要移动newStart指针，所以可以放到外面来
            newStart.node = newChildren[++newStart.index];
        }
    }
    //README: 在while循环之外判断，newChildren是否还未遍历完，那么这其中的数据就是我们需要新增的节点，而且此时oldChildren中的节点并没有出现卸载的内容
    if(oldStart.index > oldEnd.index && newStart.index <= newEnd.index) {
        for(let i = newStart.index; i <= newEnd.index; i++) {
            //这里挂载的锚点位置，一定是oldStart的位置，因为此时是从newStart位置一个一个下来的，所以我们就可以知道要替换的位置啦
            patch(null, newChildren[i], container, oldStart.node.el)
        }
    }
}
```

当当当，完成了对节点新增的挂载啦，下面就是节点卸载。

### 2.4 节点卸载

有了**2.3**的节点新增的内容之后，我们就可以很容易的得到节点卸载啦，卸载即**oldChildren存在newChildren**中不存在的节点数据，那么说明了啥？说明了最后`oldChildren`必然是没有处理完的，而且此时`newChildren`中需要更新及新增节点都已经全部完成了处理。

> 一开始我这里有点迷惑了，在想如果**卸载数<装载数**的话，卸载还能正常运行吗？回头又看了一遍之前的实现，就通了，因为我们在`while`中的最后一个else里面会不停的判断是否能在`oldChildren`中找到可复用的节点，找不到就说明是新增节点，进行`patch`操作。也就是说，无论最终我们的卸载数的数量是多少，都不会影响装载，因为在`else`中都会去装载，除非出现了一种情况:
>
> **`oldChildren`中的节点并没有出现卸载的内容，但是依然还有装载的节点未完成装载。**也就是**2.3**中在`while`外的判断。
>
> 那么如果`oldChildren`出现了卸载情况，就一定只会出现一种情况：
>
> `oldChildren`的`oldStart`与`oldEnd`指针之间还存在数据，而`newChildren`的两个头尾指针已经处理完了，且`newStart.index > newEnd.index`

然后就是我们的代码实现啦，很简单，只需要多加一点判断就可

```typescript
const DoubleDiff = function(newChildren: VNode[], oldChildren: VNode[], container: Node) {
    ......
    while(newStart.index <= newEnd.index && oldStart.index <= oldEnd.index ) {
        ......
    }
    if(oldStart.index > oldEnd.index && newStart.index <= newEnd.index) {
        for(let i = newStart.index; i <= newEnd.index; i++) {
            patch(null, newChildren[i], container, oldStart.node.el)
        }
    }else if(newStart.index > newEnd.index && oldStart.index <= oldEnd.index) {
        //NOTE: 这里就是说明了oldChildren中存在着等待卸载的节点，所以会出现oldStart.index <= oldEnd.index的情况
        for(let i = oldStart.index; i <= oldEnd.index; i++) {
            unmount(oldChildren[i]);
        }
    }
}
```

> 运行示例图如下：
>
> ![doubleDiff_delete](../image/vue/diff/doubleDiff_remove.jpg)



好啦，到这里双端Diff算法也就说的差不多了，由于本篇的篇幅已经有点长了，所有还有一篇vue3中的快速Diff的实现，将会放在另外一篇中讲解

> 看了半天，写总结花了一天😂，不过理解之后，完全是自己从头到尾自己撸出来，这感觉还是挺好的😄。

**注：本文主要参考书籍是霍春阳大佬写的<<vue.js设计与实现>>，这本书写的真的非常好**