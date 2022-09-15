# 面试题整理-Vue

| 文档创建人 | 创建日期   | 文档内容       | 更新时间   |
| ---------- | ---------- | -------------- | ---------- |
| adsionli   | 2022-08-09 | 面试题整理-Vue | 2022-08-09 |

1. v-if和v-for哪个优先级更高？

   关于v-if和v-for优先级问题，需要区分版本
   1. 在vue2中，`v-for`的优先级要比`v-if`高
   2. 在vue3中，`v-if`的优先级要比`v-for`高
     但是在官方文档中明确指出，不建议同时在一个元素中放入`v-if`与`v-for`。
     对于需要同时使用`v-if`与`v-for`的内容，我们其实可以使用`computed`类型的变量进行保存，在其中写上我们需要判断的`if`条件。

2. 你知道key的作用吗？

   ### 记忆思路
   1. 给出结论，key的作用是用于优化`patch`(节点更新)性能
   2. key的必要性
   3. 实际使用方式
   4. 总结：可从源码层面描述一下vue如何判断两个节点是否相同

   ### 回答内容
   1. key的作用主要是为了**更高效的更新虚拟DOM**。
   2. vue在patch过程中判断两个节点是否是相同节点是key是一个必要条件，**渲染一组列表时，key往往是唯一标识**，所以如果不定义key的话，vue只能认为比较的两个节点是同一个，哪怕它们实际上不是，这导致了频繁更新元素，使得整个patch过程比较低效，影响性能。
   3. 实际使用中在渲染一组列表时key必须设置，而且**必须是唯一标识**，应该**避免使用数组索引作为key**，这可能导致一些隐蔽的bug；vue中**在使用相同标签元素过渡切换时，也会使用key属性**，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。
   4. 从源码中可以知道，**vue判断两个节点是否相同时主要判断两者的key和元素类型等**，因此如果不设置key，它的值就是undefined，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的。

   [问题地址](https://github.com/57code/vue-interview/blob/master/public/02-key/README.md)

3. 能说说双向绑定以及它的实现原理吗？

   ### 回答思路
   1. 给出双绑定义
   2. 双绑带来的好处
   3. 在哪使用双绑
   4. 使用方式
   5. 扩展：使用细节、原理实现描述

   ### 答案
   1. vue中双向绑定是一个指令v-model，可以绑定一个动态值到视图，同时视图中变化能改变该值。v-model是语法糖，默认情况下相当于:value和@input。
   2. 使用v-model可以减少大量繁琐的事件处理代码，提高开发效率，代码可读性也更好
   3. 通常在表单项上使用v-model
   4. 原生的表单项可以直接使用v-model，自定义组件上如果要使用它需要在组件内绑定value并处理输入事件
   5. 我做过测试，输出包含v-model模板的组件渲染函数，发现它会被转换为value属性的绑定以及一个事件监听，事件回调函数中会做相应变量更新操作，这说明神奇魔法实际上是vue的编译器完成的。


   下面是代码渲染之后的样子，可以看到它在input上绑定了`change`事件
   ```js
   // <input type="checkbox" v-model="bar">
   _c('input', { 
     directives: [{ name: "model", rawName: "v-model", value: (bar), expression: "bar" }], 
     attrs: { "type": "checkbox" }, 
     domProps: { 
       "checked": Array.isArray(bar) ? _i(bar, null) > -1 : (bar) 
     }, 
     on: { 
       "change": function ($event) { 
         var $$a = bar, $$el = $event.target, $$c = $$el.checked ? (true) : (false); 
         if (Array.isArray($$a)) { 
           var $$v = null, $$i = _i($$a, $$v); 
           if ($$el.checked) { $$i < 0 && (bar = $$a.concat([$$v])) } 
           else { 
             $$i > -1 && (bar = $$a.slice(0, $$i).concat($$a.slice($$i + 1))) } 
         } else { 
           bar = $$c 
         } 
       } 
     } 
   })
   ```

4. vue中组件之间的通信方式？

   在vue中主要使用的组件间的通信方式有以下几种，这里使用的是**vue3**版本

   1. `props`，父组件传递内容给子组件
   2. `$emit/$on`，子组件传递内容给父组件
   3. `ref`，父组件获取子组件内容
   4. `eventbus `，跨层级间的组件通信
   5. `vuex`，全局数据状态管理
   6. `provide/inject`，可以跨域多级的父子组件通信，vue3新增
   7. `$attrs / $listeners`，`$attrs`能够让父组件跨组件的向下级子组件传递数据；`$listeners`能够让父组件获取到子组件的相关事件，有点像事件委托。
   > 可以看这篇[`$attrs`与`$listener`](https://juejin.cn/post/7008811358380621854)
   > `$attrs`的使用需要配合`inheritAttrs `进行使用，这样才能向下传递
   > `$listeners`就是为了让跨级子组件能够获取到`emit`事件，也可以冒泡出去

5. 你知道`nextTick`吗，它是干什么的，实现原理是什么？

   **思考思路**

   1. 什么是`nextTick`
   2. 它的作用是什么
   3. 哪里需要使用`nextTick`
   4. 如何使用

   **回答示例**

   1. `nextTick`是Vue提供的一个全局API，由于vue的异步更新策略导致我们对数据的修改不会立刻体现在dom变化上，此时如果想要立即获取更新后的dom状态，就需要使用这个方法。相当于调用`nextTick`的执行时机是在当前数据全部渲染完毕之后才会执行。
   2. 

