# vue3实践-使用tsx的一点总结

| 文档创建人 | 创建日期   | 文档内容          | 更新时间   |
| ---------- | ---------- | ----------------- | ---------- |
| adsionli   | 2022-09-08 | 使用tsx的一点总结 | 2022-09-08 |

在找工作的7,8两个月中间，虽然一直在背八股、做题，没什么时间学习新的内容，但是还是抽空学了一下tsx的书写，以及对tsx进行了实际使用，使用下来的感受就是十分十分的好用，再配合上vue3中对副作用的超级封装，使得可以使用hooks的特性，用起来可以说是如鱼得水，书写代码变成了一种极致的享受。

但是，我还是在使用期间，遇到了太多太多的坑，有的坑，一困住就是一天，不过最后都还好走了出来，现在就把自己犯过的错误来和大家进行一下分享，避免掉入相同的陷阱中。

## 如何支持tsx

首先，我们需要让我们的vue3项目可以支持tsx，根据[官方文档](https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx)中的说明，我们需要下载一个babel的插件，通过这个插件，先让jsx被支持。

```shell
npm i -S @vue/babel-plugin-jsx
```

安装完成之后，我们需要在**babel.config.js**中配置一下，告诉babel在生成AST语法树阶段能够转变基于vue的jsx语法。

```js
module.exports = {
  plugins: [
    "@vue/babel-plugin-jsx"
  ]
}
```

然后我们还需要去修改一下**tsconfig.json**中的一些内容

```json
{
    "compilerOptions": {
        "jsx": "preserve",
        ...
    },
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        ...
    ]
}
```

就是在`compilerOptions`中配置上`jsx: "preserve"`以及在`include`中加上`tsx`结尾的文件。

> Vue 的类型定义也提供了 TSX 语法的类型推导支持。当使用 TSX 语法时，确保在 `tsconfig.json` 中配置了 `"jsx": "preserve"`，这样的 TypeScript 就能保证 Vue JSX 语法编译过程中的完整性。
>
> **摘自官方文档**

## tsx开发时的注意事项

这里先给出两个地址：

1. [vue中内置组件在tsx中的使用](https://cn.vuejs.org/api/built-in-components.html)
2. [vue渲染函数案例](https://cn.vuejs.org/guide/extras/render-function.html#render-function-recipes)

这里强烈建议大家按照官方给出的来，网上乱七八糟的内容太多了，很多都很乱，还是以官方为准。

这里稍微对官方说的不太多的内容进行一些补充：

### 事件修饰符

对于一些事件修饰符的使用，虽然官方给出了一些，但是实在是太少了，我们常用的阻止冒泡的`stop`，以及阻止标签默认事件发生的`prevent`的用法没有给出，虽然有说[`withModifiers`](https://cn.vuejs.org/api/render-function.html#withmodifiers)可以进行使用，但还是有点抽象，这里就写一段代码帮助大家进行理解。

```tsx
<div
    class={styles.renderContainer + ' renderContainer'}
    id="positionShowBack"
    onClick={withModifiers(() => {
        emit('clostProjection')
    }, ['stop', 'prevent'])}
    ref={preRenderContainer}
>
    .....
</div>
```

这段代码中我们可以看到我们可以在对应标签下直接在`onClick`中传入一个对象，其中包括了`withModifiers`这个函数，并且传入我们的回调执行函数进去，然后在设置第二个参数，用来指明我们需要添加的事件修饰符即可。

### v-show问题

在官方中没有提到的`v-show`的使用问题，但是实际上还是可以进行使用的，但是这里就需要搭配上官方提到的[`withDirectives`](https://cn.vuejs.org/api/render-function.html#withdirectives)自定义指令啦，其实`v-show`依然是提供给我们使用的，不过官方没有提出，所以大家会不知道这一点，下面就是在tsx中使用的方法

```tsx
import {
  vShow,
  withDirectives,
} from 'vue'
<ItemAnimation animate={animate.value} duration={playTime.value}>
    {withDirectives(
        <div
            class={styles.preRender}
            tabindex="-1"
            onClick={withModifiers(() => {}, ['stop'])}
            style={renderBackground(pageMap.value.setting, null, true)}
            >
            {renderText(pageMap.value.item.text)}
            {renderImage(pageMap.value.item.image)}
        </div>,
        [[vShow, props.display && !playPosition.value]]
    )}
</ItemAnimation>
```

我们可以直接从`vue`中导入`vShow`，然后在使用`withDirectives`，第一个参数是我们需要渲染出来的虚拟Node，第二个参数是一个数组，里面需要放入我们需要添加的自定义指令，这里我们需要传入的就是`vShow`这个指令，然后第二个就是传入参数值，用于触发指令。

> `withDirectives`的参数有两个：
>
> 1. 现有的vnode
> 2. 自定义指令数组
>
> 自定义指令数组包括以下内容
>
> ```typescript
> function withDirectives(
>   vnode: VNode,
>   directives: DirectiveArguments
> ): VNode
> 
> // [Directive, value, argument, modifiers]
> /**
> * @param {Directive} Directive 自定义指令函数
> * @param {any} value 自定义指令传入的参数
> * @param {argument} arg 自定义指令的额外参数，其实就比如在使用v-model的时候，我们会指定v-model:name，后面的那个name
> * @param {DirectiveModifiers} modifiers 自定义指令的一些标识符，比如stop/once等，需要写成{stop: true, once: true}这种形式
> */
> type DirectiveArguments = Array<
>   | [Directive]
>   | [Directive, any]
>   | [Directive, any, string]
>   | [Directive, any, string, DirectiveModifiers]
> >
> ```

### 组件使用

这里说的组件导入要分成两块，一种是从另外一个tsx文件进行导入，还有一种就是从vue文件中进行导入，这两种导入和使用方式都是相同的，不过有一点需要注意：当使用vue文件进行组件导入到tsx文件中是，vue文件中的组件不需要声明Name属性，否则会报错。但是如果是通过tsx导出组件的话，又可以申明name，不知道为啥。

#### 组件ref获取dom

然后就是`ref`获取Dom对象问题，实际上和在普通的vue中使用是一样的，但是由于我们把`render`的内容写在了`setup`中，导致我们在`expose`的时候是拿不到`ref`对象然后返回给引入这个组件的父组件中的，这里有一种我自己的解决方法，就是通过`emit`进行返回。就如下面这段代码中所示：

```tsx
setup(props, { emit }) {
    const instance = getCurrentInstance()
    ......
    const preRenderContainer: any = ref()
    ......

    provide('playPosition', playPosition)
    watch(
      () => handleObj.currentPageData,
      async (newV: any, oldV: any) => {
        ......
        emit('getRef', preRenderContainer.value)
        ......
      }
    )
    return () => (
      <Teleport to={'body'} disabled={teleportFullScreen.value}>
        <div
          class={styles.renderContainer + ' renderContainer'}
          id="positionShowBack"
          onClick={withModifiers(() => {
            emit('clostProjection')
          }, ['stop'])}
          ref={preRenderContainer}
        >
          ......
        </div>
      </Teleport>
	)
}
```

可以看到我们在代码里会把获取到的`ref`对象`emit`给父组件，这样就不需要再通过`expose`进行返回了。

> 这里主要就是因为`jsx`代码是写在`setup`中，才导致这个问题出现，主要是为了使用composition-api的编码风格，其实写在render中的话，我没试过...

#### props类型判断

还有一个问题就是`props`类型的问题，我看了不少issue之后，发现还是只有这种方式可行，代码如下：

```tsx
interface ToolbarProps {
  position: number[]
}

const PreViewToolbar = defineComponent({
  emits: [],
  props: ['position'],
  setup(props: ToolbarProps, { emit }) {
    ......
  },
})
```

首先就是需要在外部先设置一个`Interface`或者`Type`将`Props`接收的内容的类型进行定义，然后在使用**options-api**的形式，定义一下`Props`接受的参数有哪些，最后再在`setup`中的`props`声明一下其类型。

实在是过于复杂，我试过其他方法，发现都无法有效果，只有这样来定义`props`，才能获取到代码提示和类型检测。

#### css导入

css导入很简答，可以按照普通的形式进行导入就可以了，就下面这段代码:

```tsx
import './index.scss'
export default defineComponent({
    setup(){
        return () => (
            <div class="xxx"></div>
        )
    }
})
```

除了上面这种导入之外，我们可以通过`css-module`的形式进行导入，通过`css-module`导入的话，我们可以将其看做一个对象，然后写成下面这种形式:

```tsx
import styles from './scss/toolbar.module.scss'

const PreViewToolbar = defineComponent({
  setup() {
    ......
    return () => <div class={styles.toolbar_container}>{getToolButton(instance.ctx.$el)}</div>
  },
})
```

我们就可以把样式全部当成一个对象然后传入进去使用就可以了，也是挺方便的，不过这种就需要配置过了，具体可以看一下[这篇文章](https://www.jianshu.com/p/be1778a76763?u_atoken=2f468ebc-a87d-4bc1-bd19-55f0303a1e7d&u_asession=01t2XFYtcxnjhnu8nOGfo7FWE87sZ8ZtW3OrlcwcvNuUHffbWzcpuOjf-FzEIc9pxzX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K_oxKFBdu6W4lRkEuQ-JIjAUPWO0ljqS-0m6uUj231Ub2BkFo3NEHBv0PZUm6pbxQU&u_asig=05ZlLDwAFXa4BVhn2Fh7CLowgIQgfqSHoSgRu8PgR6NKcQZTLtq_4TmPpIlLHQIw-6qREeO2vBKbMYLP9H3V1ceteHWYDLbXt9MMeNPvTxXpjOyi4bEw9Minwab3jkOhBqdbRJ_y3mZ3sE5Rz6Bog6j7lryOqvWzOR0Pfg53e5bfr9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzcNJgwpf6LJvauhELMdVBXjhJpZ_O7cctR8UC23eOLOqU1_gr7b-5Q11Fu-gS_hPv-3h9VXwMyh6PgyDIVSG1W8zc4Lv7zc0v23SlvMhmrspfJ4B3Phh-pBvo2Q9oBWTsW_cir80qpk57886VJrdqHjewFgexC4POT-zlHiGMYlpmWspDxyAEEo4kbsryBKb9Q&u_aref=w1mpGGSLkvc3pi037E%2BvGl%2FH4y0%3D)，跟着配一下即可，完全是可用的，亲测，强烈推荐，非常的好用。

#### emit问题

不知道为啥，我看别人写的时候，他们并没有声明emit的内容，也没有警告，但是我自己在写的时候，如果使用了emit，但是没有声明过的话，就会有控制台警告，很烦，所以自己定一下也没什么问题，这样还能有代码提示呢。

```tsx
export default defineComponent({
  name: 'PreRenderContainer',
  emits: ['getRef', 'getPage', 'clostProjection'],
  setup(props, { emit }) {
    ......
  },
})

```

#### 组件类型问题

这个问题没有解决掉，现在都只能使用any的类型来代替，就很麻烦，各位大佬求求指点一些，呜呜呜。

#### v-for循环获取ref

这个其实和之前在`fragment`中的操作差不多，需要先声明一个`ref([])`，然后在组件循环时，在ref传入一个回调执行函数就可以了，如下段代码

```tsx
const pageImage = ref([])
arr.map((v: any) => {
    return (
        <div
            class={styles.preRender}
            tabindex="-1"
            ref={(el: any) => {
                if (!pageImage.value.includes(el)) {
                    pageImage.value.push(el)
                }
            }}
            style={renderBackground(v.setting, null, true)}
            >
            {renderText(v.item.text)}
            {renderImage(v.item.image)}
        </div>
    )
})
```

当然，在tsx中`v-for`的形式可以使用`Array`的`map`函数中的返回来替代，因为tsx可以支持直接解析一个虚拟Node数组的。



上面差不多就是在开发组件时遇到的一些问题啦，就在这里记录一下，避免以后再遇到同样的问题，导致重复踩坑的惨案发生。



### hooks使用

虽然说hooks的使用并不是在tsx中才独有的，在正常的vue开发中也可以使用hooks，但是我感觉tsx+hooks的开发实在是太香了，现在vue3之后，对于副作用的比较好的捕获之后，也可以开始逐渐导入hooks的感念，让代码达到松耦合、高内聚。

不过关于hooks的内容已经太多太多了，好的使用方式也特别多了，所以这里就不再继续阐述了，大家可以在自己平时的代码开发中去使用这些好的设计方式，来让自己的代码变得易度、可维护。



## 总结

这里会持续进行更新，记录自己在使用tsx开发过程中遇到的问题，然后慢慢的记录下来，防止自己重复踩坑，同时方便大家进行查看，写的有点混乱，希望大家多多包含😂



