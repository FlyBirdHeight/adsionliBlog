<template>
  <div class="container">
    <div>
      <h1>{{ number }}</h1>
    </div>
  </div>
</template>

<script>
import { throttle, throttleFirstEnd } from '@/funcs/utils/throttle.js'
function currying(fn, ...rest1) {
  return function (...rest2) {
    return fn.apply(null, rest1.concat(rest2))
  }
}
function curryingHelper(fn, len) {
  const length = len || fn.length // 第一遍运行length是函数fn一共需要的参数个数，以后是剩余所需要的参数个数
  return function (...rest) {
    return rest.length >= length // 检查是否传入了fn所需足够的参数
      ? fn.apply(this, rest)
      : curryingHelper(currying.apply(this, [fn].concat(rest)), length - rest.length) // 在通用currying函数基础上
  }
}

var curry = function (fn) {
  let args = []
  return function curryHelper (...res) {
    if (res.length) {
      args = args.concat(res)
      return curryHelper
    } else {
      return fn.apply(this, args)
    }
  }
}

function add(...res) {
  return res.reduce((a, b) => a + b)
}

export default {
  data() {
    return {
      number: 0,
    }
  },
  mounted() {
    // this.handleMouseMove();
    // this.handleCurry()
    let addCurry = curry(add)
    // let data = addCurry(1, 2, 3)(2);
    // console.log(data)
    console.log(addCurry(1)(2)(3)(4)())
  },
  methods: {
    handleMouseMove() {
      let that = this
      let test = function () {
        that.number++
        console.log(that.number)
      }
      document.onmousemove = throttleFirstEnd(test, 1000)
    },
    handleCurry() {
      let msg = curryingHelper(this.sayHello)
      //   msg('adsionli', 25, '甘蔗')
      msg('adsionli')(25)('西瓜')
    },

    sayHello(name, age, fruit) {
      console.log(`我叫 ${name},我 ${age} 岁了, 我喜欢吃 ${fruit}`)
    },
  },
}
</script>

<style></style>
