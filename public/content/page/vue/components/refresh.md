# 小功能实现-refresh下拉刷新

| 文档创建人 | 创建日期   | 文档内容                   | 更新时间   |
| ---------- | ---------- | -------------------------- | ---------- |
| adsionli   | 2022-11-22 | 小功能实现-refresh下拉刷新 | 2022-11-22 |

写了一个多月的毕业设计，开始重新写前端啦，之前就一直有在写自己的组件库，隔壁桌的同级老姐刚好在问我关于refresh刷新组件的问题，我就想着自己来一个，刚好扩充自己的组件库的内容，那么说干就干，花了半天时间进行了一个实现。

还是老样子，按照需求分析、内容实现这两个个方面来完成这个组件的开发。

> 组件都是基于vue3+ts开发

## 需求分析

下拉刷新是一个比较常见的功能，在很多移动端的应用中都被使用，那么我想着pc端也最好可以支持，所以这里我们的场景就是pc+移动端的实现。

1. 移动端需要通过手指触摸、移动、松开完成下拉刷新操作

2. pc端需要通过鼠标按下、移动、松开完成下拉刷新操作

3. 下拉刷新的容器需要分为两种：

   (1) 限制了高度的容器进行下拉刷新

   (2) 未限制高度的容器进行下拉刷新

4. 触发下拉刷新操作的最小高度以及能够限制显示最大下拉刷新文字的最大高度限制

5. 下拉刷新时，数据未完成响应时，再次满足触发下拉刷新条件时，需要阻止下拉刷新的重复触发

6. 下拉刷新获取数据完成后，向调用组件返回刷新返回数据

7. 可设置最大请求时长，如果超时了，中断请求并做出相应显示

## 内容实现

有了需求之后，我们就可以来一个一个进行实现了。

### refresh组件设计

首先我们需要实现一个大概的refresh组件，方便我们之后的各种功能的实现

```vue
<template>
  <div ref="refreshBody" class="adsionli-refresh">
    <refresh-up :maxHeight="props.maxHeight" :text="props.text" />
    <slot></slot>
  </div>
</template>
```

我们可以把需要实现下拉刷新的`dom`放在一个新的容器中同时作为`slot`传入，因为我们可以去支持一个下来刷新的交互，让用户得到更好的一个体验。

下面是`refresh-up`的实现，主要用来显示文字以及一个占位的作用

```vue
<template>
  <div ref="upText" class="refresh-text">{{ showText ? textValue : '' }}</div>
</template>
```

### 响应事件

对于需求1和2，我们可以放在一起进行实现。

**移动端事件**

对于移动端来说，浏览器提供了三个事件供我们使用，分别是`touchstart、touchmove、touchend`。通过这三个事件的捕获我们就可以完成对移动端的下拉刷新操作的捕获。

**pc端事件**

pc端想要实现移动端上的效果的话，就需要使用`mouse`的三个事件，分别是`mousedown、mousemove、mouseup`。

有了上面的事件我们就可以来对事件进行绑定，对于`touchstart`以及`mousedown`来说，我们需要将其绑定在我们的最外层的`refresh`容器中。

```vue
<template>
  <div ref="refreshBody" class="adsionli-refresh" @mousedown.stop="dragStart" @touchstart.stop="dragStart">
   
  </div>
</template>
```

对于`touchmove`,`touchend`,`mousemove`,`mouseup`这四个事件的话，我们需要绑定在`window`上，因为并不能确定用户会在什么位置进行滑动，所以我们需要让窗口绑定上这几个事件才可以。

那么如何区分是`touch`事件，还是`mouse`事件，我们可以通过对开始点击开始事件传入的event来进行判断

```typescript
const dragStart = (e: MouseEvent | TouchEvent) => {
    ...
    if (e instanceof TouchEvent) {
        window.addEventListener('touchmove', dragMove)
        window.addEventListener('touchend', dragEnd)
        ...
    } else {
        window.addEventListener('mousemove', dragMove)
        window.addEventListener('mouseup', dragEnd)
        ... 
    }
}
```

### 容器区分

对于传入`slot`，我们就需要区分分析中的两种情况：高度限制+容器滚轴，高度不限+窗口滚轴。

针对这两种情况，我们需要进行特殊处理。

#### 高度限制

对于容器高度限制，并且设置了y轴可滚动的情况，我们就需要判断当前容器内滚轴的位置是否是在顶部，如果不是在顶部的话，我们是不能让它触发下拉刷新事件的，这里就需要进行下面代码的限制

```typescript
const dragStart = (e: MouseEvent | TouchEvent) => {
    const slotDom: HTMLOptionElement = (refreshBody.value!.childNodes as NodeListOf<HTMLOptionElement>)[2]
    if (slotDom!.scrollTop > 10) return
    ...
}
```

这里通过使用`ref`来获取`refresh`容器，然后再通过`childNodes`指定下标来获取到插槽的实际`dom`对象，然后我们通过判断`scrollTop`的大小是否`>10`来判断是否在当前容器的顶部(这里给了10`pixel`的容错)。如果说不符合要求，就不会为`window`绑定后面的事件，阻止下拉刷新

#### 高度不限制

对于容器高度不限制，那么我们就需要关注窗口滚动了，然后去判断当前容器位于窗口的位置，是否是一个**正值**，如果是**负值**，那么我们就可以知道容器顶部不在可视窗口内，那么也就不可以进行下拉刷新了，具体实现如下

```typescript
const dragStart = (e: MouseEvent | TouchEvent) => {
    const slotDom: HTMLOptionElement = (refreshBody.value!.childNodes as NodeListOf<HTMLOptionElement>)[2]
    if (slotDom!.getBoundingClientRect().y < 0) return
}
```

对于高度限制与不限制其实可以放在一起判断，因为这个判断同时只会有一个生效，所以我们改动一下代码

```typescript
const dragStart = (e: MouseEvent | TouchEvent) => {
    const slotDom: HTMLOptionElement = (refreshBody.value!.childNodes as NodeListOf<HTMLOptionElement>)[2]
    if (slotDom!.scrollTop > 10 || slotDom!.getBoundingClientRect().y < 0) return
    ...
}
```

### 下拉高度

对于需求分析的第四点，也就是可以触发下拉刷新的一个下拉高度的一个设计，我们可以设置最小触发高度，以及一个最大可下拉高度，这样可以为用户带来更好的交互体验。

这个功能很好实现，实现代码如下

```typescript
const movePos: Ref<number> = ref(0);
const dragHeight: Ref<number> = ref(0);
const showText: Ref<boolean> = ref(false);
const isRefresh: Ref<boolean> = ref(false)
provide('dragHeight', dragHeight);
provide('showText', showText);
const dragMove = (e: MouseEvent | TouchEvent) => {
    let height
    if (e instanceof TouchEvent) {
        height = e.touches[0].clientY - movePos.value
    } else {
        height = e.screenY - movePos.value
    }
    showText.value = height >= props.minHeight ? true : false
    dragHeight.value = height > props.maxHeight ? props.maxHeight : height
    isRefresh.value = height > props.minHeight ? true : false
}
```

这里设置了两个参数，一个是`movePos`用来记录鼠标点击或是触摸点击下的位置，还有一个`dragHeight`则是用来记录拖移高度的值，会叫其`provide`传递给`RefreshUp`组件进行使用，然后我们需要在`RefreshUp`组件中对高度值进行一个监听。除了这两个参数之外，我们还有一个`showText`参数，用来控制是否显示刷新文字，通过判断是否大于最小下拉高度来进行控制。

> 这里还设置了一个`isRefresh`的参数，这个参数是在鼠标抬起或是触摸结束的时候，用来协助判断是否需要进行更新请求的

```typescript
watch(dragHeight, (newV: number, oldV: number) => {
    upText.value!.setAttribute('style', `height: ${newV}px`)
})
```

然后去设置插入的`dom`的高度，插入一段dom，告诉用户正在进行下拉刷新，同时会有一个文字进行显示，增加交互体验。

### 数据响应及返回

对于需求分析的5,6,7这三个点，我们可以统一在数据响应及返回中进行处理。

对于需求分析中的5、6，我们在上一节中已经有提到的一个参数就是`isRefresh`的判断，我们会根据高度是否大于最小下拉刷新触发高度的判定，赋予`isRefresh`一个`Boolean`，然后在触发时进行判断。出了这个参数外，我们还需要增加一个`loading`参数，来判断是否是在请求过程中的判断。最后在完成请求之后，我们通过`emit`来返回请求到的数据。具体代码如下:

```typescript
const loading: Ref<boolean> = ref(false)
const dragEnd = async (e: MouseEvent | TouchEvent) => {
    window.removeEventListener('mousemove', dragMove)
    window.removeEventListener('mouseup', dragEnd)
    window.removeEventListener('touchmove', dragMove)
    window.removeEventListener('touchend', dragEnd)
    if (isRefresh.value) {
        movePos.value = 0
        textValue.value = props.loadText
        loading.value = true;
        try {
            let returnData = await refreshAction()
            textValue.value = props.successText
            emit('getData', returnData)
        } catch (e) {
            textValue.value = props.overTimeText
            emit('getData', null)
        }
        loading.value = false
        setTimeout(() => {
            showText.value = false
            dragHeight.value = 0
            textValue.value = props.text
        }, 500)
    }
}
```

> 其中的textValue是用来控制下拉刷新新增Dom出显示的文字。

在`dragEnd`函数中，我们通过判断是否符合请求条件，来控制请求的发起，然后在请求完成之后，在设置一个`setTimeout`来控制请求返回成功的反馈，让用户可以直观的感受到列表或相关目录刷新成功。

#### 最大请求时长

对于请求来说，如果请求失败的话，我们不设置一个最大请求时长的话，就会一直处于一个请求状态下，无法重新进行一个下拉刷新，这对用户来说肯定是不好的，所以我们需要控制一下最大请求时间，一旦超过了最大请求时间，就会进行一个反馈，让用户可以重新发起请求。下面就看一下具体实现代码。

```typescript
const refreshAction = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let returnData = props.refreshFunc === null ? null : await Promise.race([props.refreshFunc(), timelimit()])
            if (typeof returnData === 'boolean' && !returnData) {
                reject('request overtime!')
            }
            resolve(returnData)
        } catch (e) {
            reject(e)
        }
    })
}
const timelimit = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(false)
        }, props.timeLimit)
    })
}
```

好吧，还是很简单的，嘿嘿，其实就是用一个`Promise.race`，来实现一个最大请求时长的限制，这个还是挺简单的，在很多地方都有具体的说明，我这里就不做展开啦。

好啦，到这里我们其实就完成了全部的代码编写了，最后把代码放在一起，方便大家复制验证。

```vue
/**
* NOTE: component is AdsionliRefresh
*/
<template>
  <div ref="refreshBody" class="adsionli-refresh" @mousedown.stop="dragStart" @touchstart.stop="dragStart">
    <refresh-up />
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, provide, Ref } from 'vue'
import { RefreshProps } from './refresh'
import RefreshUp from './up.vue'
export default defineComponent({
  name: 'AdsionliRefresh',
  props: RefreshProps,
  setup(props, { emit, slots }) {
    const refreshBody: Ref<Nullable<HTMLElement>> = ref(null)
    const showText = ref<boolean>(false)
    const movePos = ref<number>(0)
    const dragHeight = ref<number>(0)
    const textValue = ref<string>(props.text)
    const isRefresh: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)
    provide('showText', showText)
    provide('dragHeight', dragHeight)
    provide('textValue', textValue)
    const dragStart = (e: MouseEvent | TouchEvent) => {
      const slotDom: HTMLOptionElement = (refreshBody.value!.childNodes as NodeListOf<HTMLOptionElement>)[2]
      if (slotDom!.scrollTop > 10 || slotDom!.getBoundingClientRect().y < 0) return
      if (loading.value) return
      if (e instanceof TouchEvent) {
        window.addEventListener('touchmove', dragMove)
        window.addEventListener('touchend', dragEnd)
        movePos.value = e.touches[0].clientY
      } else {
        window.addEventListener('mousemove', dragMove)
        window.addEventListener('mouseup', dragEnd)
        movePos.value = e.screenY
      }
    }

    const dragMove = (e: MouseEvent | TouchEvent) => {
      let height
      if (e instanceof TouchEvent) {
        height = e.touches[0].clientY - movePos.value
      } else {
        height = e.screenY - movePos.value
      }
      showText.value = height >= props.minHeight ? true : false
      dragHeight.value = height > props.maxHeight ? props.maxHeight : height
      isRefresh.value = height > props.minHeight ? true : false
    }

    const dragEnd = async (e: MouseEvent | TouchEvent) => {
      window.removeEventListener('mousemove', dragMove)
      window.removeEventListener('mouseup', dragEnd)
      window.removeEventListener('touchmove', dragMove)
      window.removeEventListener('touchend', dragEnd)
      if (isRefresh.value) {
        movePos.value = 0
        textValue.value = props.loadText
        loading.value = true
        try {
          let returnData = await refreshAction()
          textValue.value = props.successText
          emit('getData', returnData)
        } catch (e) {
          textValue.value = props.overTimeText
          emit('getData', null)
        }
        loading.value = false
        setTimeout(() => {
          showText.value = false
          dragHeight.value = 0
          textValue.value = props.text
        }, 500)
      }
      isRefresh.value = false
    }

    const refreshAction = function () {
      return new Promise(async (resolve, reject) => {
        try {
          let returnData = props.refreshFunc === null ? null : await Promise.race([props.refreshFunc(), timelimit()])
          if (typeof returnData === 'boolean' && !returnData) {
            reject('request overtime!')
          }
          resolve(returnData)
        } catch (e) {
          reject(e)
        }
      })
    }

    const timelimit = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(false)
        }, props.timeLimit)
      })
    }

    return {
      dragStart,
      dragMove,
      dragEnd,
      props,
      refreshBody,
    }
  },
  components: {
    RefreshUp,
  },
})
</script>
/**
* component is RefreshUp
*/
<template>
  <div ref="upText" class="refresh-text">{{ showText ? textValue : '' }}</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, inject, watch, Ref } from 'vue'
import { RefreshUpProps } from './up'
export default defineComponent({
  name: 'RefreshUp',
  props: RefreshUpProps,
  setup(props) {
    const upText: Ref<Nullable<HTMLElement>> = ref(null)
    const showText: Ref<boolean> = inject('showText') || ref<boolean>(false)
    const dragHeight: Ref<number> = inject('dragHeight') || ref<number>(0)
    const textValue: Ref<string> = inject('textValue') || ref<string>('')
    onMounted(() => {
      upText.value!.setAttribute('style', `height: 0px; max-height: ${props.maxHeight}px`)
    })
    watch(dragHeight, (newV: number, oldV: number) => {
      upText.value!.setAttribute('style', `height: ${newV}px`)
    })
    return {
      upText,
      textValue,
      showText,
    }
  },
})
</script>
```

```typescript
/**
* NOTE: props
*/
import { ExtractPropTypes } from 'vue';
export const RefreshUpProps = {

} as const;
export const RefreshProps = {
    drag: {
        type: String,
        default: "up"
    },
    maxHeight: {
        type: Number,
        default: 80
    },
    minHeight: {
        type: Number,
        default: 40
    },
    icon: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: "松开刷新..."
    },
    loadText: {
        type: String,
        default: "正在刷新..."
    },
    successText: {
        type: String,
        default: "刷新成功..."
    },
    overTimeText: {
        type: String,
        default: "刷新失败，请重试..."
    },
    boxHeight: {
        type: String || Number,
        default: "auto"
    },
    refreshFunc: {
        type: Function,
        default: null
    },
    timeLimit: {
        type: Number,
        default: 5000
    }
} as const;
export type RefreshProps = ExtractPropTypes<typeof RefreshProps>
export type RefreshUpProps = ExtractPropTypes<typeof RefreshUpProps>
```

好啦，这样一个小功能的下来刷新就可以简单实现啦，后面呢其实还可以在一些过渡上做一些优化，让用户使用的时候更加的流畅，还可以根据自己的需求，对相关内容进行改造，比如在下来刷新时插入的那个dom添加如相关的icon，让其看着更加舒服等。

