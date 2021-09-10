<template>
  <div>
    <div>
      <h1>第七章：函数的拓展 7.1</h1>
    </div>
    <div>
      <div class="top-margin">
        <el-button @click="setStructureFunction('http:127.0.0.1')" class="left-margin">
          测试函数解构参数调用,错误调用
        </el-button>
        <el-button @click="setStructureFunction('http:127.0.0.1', {})" class="left-margin">
          测试函数解构参数调用,传入空对象
        </el-button>
        <el-button @click="setStructureFunction('http:127.0.0.1', { body: { list: '1' } })" class="left-margin">
          测试函数解构参数调用,传入携带值对象
        </el-button>
        <el-button @click="setTwoStructureFunction('http:127.0.0.1')" class="left-margin">
          测试函数解构参数调用,双重默认值
        </el-button>
      </div>
      <div class="top-margin">
        <el-button @click="setStructureFunctionDefaultObj({})" class="left-margin">
          设置解构函数声明，默认值对象时的情况,传入空对象
        </el-button>
        <el-button @click="setStructureFunctionDefaultObj({ x: 1 })" class="left-margin">
          设置解构函数声明，默认值对象时的情况,传入对象
        </el-button>
        <el-button @click="setStructureFunctionDefaultObj()" class="left-margin">
          设置解构函数声明，默认值对象时的情况,不传
        </el-button>
      </div>
      <div class="top-margin">
        <span class="right-margin">函数的length属性:</span>
        <el-button @click="getFunctionLength()">函数的length属性</el-button>
      </div>
      <div class="top-margin">
        <span class="right-margin">函数参数作用域问题:</span>
        <el-button class="left-margin" @click="functionArea()">函数两个参数下，函数内部作用</el-button>
        <el-button class="left-margin" @click="functionAreaOne()">函数单参数下，函数外部作用域传入内部作用域</el-button>
        <el-button class="left-margin" @click="functionAreaInside()">
          函数两个参数下，函数内部作用，其中一个是匿名函数，且函数内部重新声明X
        </el-button>
        <p>
          <el-button class="left-margin" @click="functionAreaInsideTwo()">
            函数两个参数下，函数内部作用，其中一个是匿名函数,函数内部不重新声明X
          </el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * @method setStructureFunction 单重默认值设置解构函数
     */
    setStructureFunction: (url, { body = '', method = 'GET', header = {} }) => {
      console.log('setStructureFunction-body:', body)
      console.log('setStructureFunction-method:', method)
      console.log('setStructureFunction-header:', header)
    },
    /**
     * @method setTwoStructureFunction 双重默认值设置解构函数
     */
    setTwoStructureFunction: (url, { body = '', method = 'GET', header = {} } = {}) => {
      console.log('setTwoStructureFunction-body:', body)
      console.log('setTwoStructureFunction-method:', method)
      console.log('setTwoStructureFunction-header:', header)
    },
    /**
     * @method setStructureFunctionDefaultObj 设置解构函数声明，默认值对象时的情况
     * @description 当前情况就和第三章中提出的情况相似，x与y的默认值是一个函数对象，
     * 那么当调用函数时，如果传入的是一个空对象，那么此时默认对象会被覆盖，x与y会变成undefined状态，
     * 如果传入的对象时单一赋值，那么此时另一个未赋值对象就是undefined状态
     */
    setStructureFunctionDefaultObj: ({ x, y } = { x: 0, y: 0 }) => {
      console.log('setStructureFunctionDefaultObj-x:', x)
      console.log('setStructureFunctionDefaultObj-y:', y)
    },
    /**
     * @method getFunctionLength 获取函数长度
     * @description 实际是获取函数中没有默认值的参数的个数
     * 注：rest函数是不计入函数长度的，因为是不定长的。当默认值参数不是尾函数时，返回只有默认值参数前的参数个数
     */
    getFunctionLength: () => {
      let length = this.setStructureFunction.length
      console.log('setStructureFunction-length:', length)
    },
    /**
     * @method functionArea 单参数作用域传递问题
     * @description y=x中的x不是指向外部作用域的那个x，而是在申明函数参数时构成的作用中，前一个参数x
     */
    functionArea: () => {
      var x = 10
      function f(x, y = x) {
        console.log('functionArea', x + ' ' + y)
      }
      f(2)
    },
    /**
     * @method functionAreaOne 双参数作用域传递问题
     * @description 当外部申明存在x时，而函数内部参数申明时，不存在x参数，那么此时会提取外部的x作为输入，如果外部也未申明时，就会报错
     */
    functionAreaOne: () => {
      var x = 10
      function f(y = x) {
        console.log('functionArea', x + ' ' + y)
      }
      f()
    },
    /**
     * @method functionAreaInside 函数内部作用域，以及参数为匿名函数时的作用域问题
     */
    functionAreaInside: () => {
      var x = 10
      function f(
        x,
        func = () => {
          x = 2
        }
      ) {
        /**
         * @note 这里的x不是函数参数中的x，因为这两个x所属的作用域是不同的，而func的默认值是匿名函数，
         * 且匿名函数中的x实际指向的参数作用域的第一参数x,所以这里输出的x不是参数作用域中的x而是函数内部作用域中的x，所有输出的是5
         */
        var x = 5
        func()
        console.log(x)
      }
      f()
      /**
       * @note 这里的x属于外部作用域中的x，所以不会被函数内部作用域中的x所影响，输出的仍然是5
       */
      console.log(x)
    },
    /**
     * @method functionAreaOne 函数内部作用域，以及参数为匿名函数时的作用域问题,且函数内部作用域中不重新声明。直接使用函数参数作用域中的参数
     */
    functionAreaInsideTwo: () => {
      var x = 10
      function f(x, func = () => (x = 2)) {
        /**
         * @note 这里的x是函数参数中的x，因为未重新声明，所以函数内部作用域会使用参数作用域中提供的参数,所以执行func的时候，x会被重新赋值2而不是3
         */
        x = 5
        func()
        console.log(x)
      }
      f()
      console.log(x)
    },
  },
}
</script>

<style>
.left-margin {
  margin-left: 10px;
}
.top-margin {
  margin-top: 10px;
}
.right-margin {
  margin-right: 10px;
}
</style>
