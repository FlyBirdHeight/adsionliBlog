<template>
  <div>
    <h1>structure-function</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    this.setFuncStructure({ x: 1, y: 2 })
    this.setFuncStructureDefault({ x: 1, y: 3 })
    this.setFuncStructureArray(['a', 'b'])
    this.setFuncStructureDefaultNotValue()
    this.setFuncStructureDefaultNotValue({ x: 5 })
    this.swapByStructure();
    let [x, y, z] = this.returnManyByArray();
    console.log("returnManyByArray", [x, y, z]);

    let {count, count:[a, {p: world}]} = this.returnManyByObj();
    console.log("returnManyByObj:count", count);
    console.log("returnManyByObj:a", a);
    console.log("returnManyByObj:p", world);
  },
  data() {
    return {}
  },
  methods: {
    fn: function*() {
      let a = yield 'hello'
      console.log(a)
      yield
      console.log(a)
    },
    setUndefined: () => {
      let [x, y, z] = [undefined, undefined, undefined]
      console.log([x, y, z])
    },
    setFunction: () => {
      //如果说x的默认值是一个函数表达式，那么当结构时，没有给x赋值，那么就会执行这个函数表达式，并且x的值是undefined，如果赋值了，就不会执行函数表达式，x会取得赋予的值
      function fnD() {
        console.log('>>>>>')
      }
      var [x = fnD()] = []
      console.log(x)
    },
    setObject: () => {
      /**
       * @note 解构赋值给一个对象的时候，其实前面的是对象名称，也就是Key，后面h和l才是真正赋值的value,所以console的时候可以打印出f和l,而first和last只是对应的key是没有值的赋予的，所以会报错
       */
      let obj = { first: 'aaaa', last: 'bbbb' }
      let { first: f, last: l } = obj
      console.log(f)
      console.log(l)
      // console.log(first);
      // console.log(last);
    },
    setObj2: () => {
      let obj = { foo: { bar: 'bar' } }
      let {
        foo,
        foo: { bar },
      } = obj
      console.log(bar)
      console.log(foo)
    },
    setObjFun: () => {
      //@note 解构赋值的对象赋值可以将对象中的方法直接提取出来进行赋值，这也就是一些写法为什么会为 import {Cesium, Viewer} from "xxxxx.js"这种写法的出现，这实际上就是结构的一种
      //@note 这就是类似element-ui中的按需引入的实现，其实就是对象的结构赋值
      let { floor, random, cos } = Math
      console.log(floor(random() * 50))
      //字符串的赋值，因为是String，所以其本质也是对象赋值。可以提出其对象中除函数外的变量值
      let { length: str } = 'hello'
      console.log(str)
      let { toString: s } = 123
      console.log(s === Number.prototype.toString)
    },
    //函数参数的解构赋值写法，无默认值
    setFuncStructure: ({ x, y }) => {
      console.log('funcStructure', x + ' ' + y)
    },
    //函数参数的解构赋值写法，有默认值
    setFuncStructureDefault: ({ x = 0, y = 2 } = {}) => {
      console.log('funcStructureDefault', x + ' ' + y)
    },
    //函数参数的数组解构赋值写法
    setFuncStructureArray: ([x, y]) => {
      console.log('funcStructureArray', x + ' ' + y)
    },
    //设置函数参数的默认值，而不是设置函数参数变量的默认值写法
    //个人理解：传入东西的话，只要传入了就会覆盖掉默认值，那么这个时候如果传入了的{},此时x, y是未定义的， 所以输出的一定是undefined
    setFuncStructureDefaultNotValue: ({ x, y } = { x: 1, y: 2 }) => {
      console.log('setFuncStructureDefaultNotValue', x + ' ' + y)
    },
    //解构赋值的一种技巧使用方法:swap
    swapByStructure: () => {
      let x = 1;
      let y = 5;
      console.log('swap_begin:', x + '  ' + y);
      [x, y] = [y, x];
      console.log('swap_end:', x + '  ' + y);
    },
    //函数返回多个值，其实这里就可以知道promise.all外部的接收为什么是一个数组了，因为用了解构赋值的方法
    returnManyByArray: () => {
        return [1, 2, 3];
    },
    //函数返回多个值，其实这里就可以知道promise.all外部的接收为什么是一个数组了，因为用了解构赋值的方法
    returnManyByObj: () => {
        return {
            count: [
                'hello',
                {p: 'world'}
            ]
        };
    }
  },
  components: {},
}
</script>

<style></style>
