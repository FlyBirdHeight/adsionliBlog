<template>
  <div>
    <div>
      <h1>第七章：函数的拓展 7.2-7.5</h1>
    </div>
    <div>
      <div class="top-margin">
        <h2>7.2 rest对象</h2>
        <div>
          <el-button class="left-margin" @click="functionRestReplaceArgument(1, 2, 3, 4, 5)">
            传入rest对象取代arguments对象来获取实参传入
          </el-button>
          <el-button class="left-margin" @click="functionRestSort(4, 5, 1, 3, 2)">
            传入rest对象并排序
          </el-button>
        </div>
        <p>
          <font style="font-weight:bolder; color: rgb(255, 0, 0)"
            >注：rest对象在函数参数中，只可以放在尾参之中，如果不是在尾参，就会报错</font
          >
        </p>
      </div>
      <el-divider></el-divider>
      <div class="top-margin">
        <h2>7.3 严格模式的使用</h2>
        <div class="top-margin">
          <p style="text-indent:25px">
            在ES5中函数<font style="font-weight:bolder">可以使用严格模式'use strict'</font>。
          </p>
          <p style="text-indent:25px">
            但是到了ES6之后，<font style="font-weight:bolder"
              >如果函数中使用默认值，解构赋值，或者是如rest对象一样的扩展运算符，这时候在函数中显示使用严格模式就会报错</font
            >
          </p>
          <div class="code">
            如何绕过严格模式：
            <p>
              方法1：设置全局严格模式，这种设置是合法的，不会受到es6标准的影响
            </p>
            <div>
              <p class="code_font">'use strict'</p>
              <p class="code_font">function doSomething(a, b = a){</p>
              <p class="code_font tab_1 note">//code</p>
              <p class="code_font">};</p>
            </div>
            <el-divider></el-divider>
            <p>
              方法2：将函数包裹在一个无参数的立即执行的函数中，这样的话就会执行外层的函数执行，而内部函数的参数会在外部函数执行后执行，然后在执行内部函数体
            </p>
            <div>
              <p class="code_font">const doSomething = (function () {</p>
              <p class="code_font tab_1">'use strict'</p>
              <p class="code_font tab_1">return function(value = 42) {</p>
              <p class="code_font tab_2">return value;</p>
              <p class="code_font tab_1">};</p>
              <p class="code_font">}());</p>
            </div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="top-margin">
        <h2>7.4 函数的name属性</h2>
        <h4>(个人感觉在写组件时候很有用，在初始化的时候，可以设置启用什么函数方法)</h4>
        <div class="paragraph">
          <p>
            函数的name属性在ES5中就有实现，但是直到ES6中才被正式列为标准，而且ES5中虽然可以获得函数的名称，但是只能获取到具名函数的名称，无法获取到匿名函数的名称，这一点在ES6中被解决，同时可以获取匿名函数的函数名称
          </p>
        </div>
        <div>
          <el-button @click="getNamedFunction">获取具名函数名称</el-button>
          <el-button @click="getAnonymousFunction">获取匿名函数名称</el-button>
          <el-button @click="getFunctionObj">获取Function对象的函数名称</el-button>
          <el-button @click="getFunctionBindName">获取Function对象bind的名称</el-button>
        </div>
        <div
          style="height:30px;font-size:20px; font-weight: bolder; color:rgb(255, 0, 0); margin-top: 15px; margin-bottom: 40px"
        >
          {{ functionName }}
        </div>
      </div>
      <el-divider></el-divider>
      <div class="top-margin bottom-marigin">
        <h2>7.5 箭头函数</h2>
        <h3>这里不做什么展开了就写一些好玩的箭头函数的使用方法</h3>
        <div class="code">
          <p class="note">//array map方法的箭头函数实现, Es6箭头函数实现：</p>
          <p class="code_font">arr.map(current => current * current)</p>
          <p class="note">//Es5中的实现方式:</p>
          <p class="code_font">arr.map(function(current){</p>
          <p class="code_font tab_1">return current * current;</p>
          <p class="code_font">});</p>
        </div>

        <div class="code">
          <p class="note">//sort方法的箭头函数实现, Es6箭头函数实现：</p>
          <p class="code_font">arr.sort((a, b) => a - b)</p>
          <p class="note">//Es5中的实现方式:</p>
          <p class="code_font">arr.sort(function(a, b){</p>
          <p class="code_font tab_1">return a - b;</p>
          <p class="code_font">});</p>
        </div>
        <div class="code">
          <p class="note">//当返回的是一个obj对象时，最外层需要加一个(), 来防止误读：</p>
          <p class="code_font">let func = () => ({ a: 5, b: 6})</p>
        </div>
        <div class="top-margin summary">
          <span>
            箭头函数的表达式比起一般的函数声明或者函数表达式来的更加简洁，但是这也会造成一定限制，其不加{}的时候只能执行一步操作，且这部操作实际是return操作，需要记住!
          </span>
        </div>
        <div class="top-margin summary">
          <span>箭头函数的注意事项：</span>
          <br />
          <span
            >1.
            函数体内的this对象就是定义时所在的对象，而不是使用时所在的对象，换句话说就是箭头函数中this指向是其在定义时对象，而不是它在运行时的作用域的this。<font
              class="font_emphasize"
              >箭头函数本身是没有this绑定的</font
            ></span
          >
          <br />
          <span>2. 不可以作为构造函数，也就是说不可以使用new命令来创建箭头函数对象，一旦时候就会报错</span>
          <br />
          <span
            >3. 箭头函数<font class="font_emphasize">不具有anguments对象</font
            >，但是可以使用rest对象作为参数传入函数体内！</span
          >
          <br />
          <span>4. 箭头函数不可以作为Generator对象，所以也就不可以使用yield进行停顿。</span>
          <br />
          <span>
            5.
            <font class="font_emphasize"
              >一定要注意，setTimeout是可以改变箭头函数的this的指向的，如果做了一定时间的延迟，那么箭头函数的this就会发生改变，可能会指向使用时的作用域的this!下面是一个代码示例：</font
            >
          </span>
          <div class="code" style="margin: 0px; width: 100%">
            <p class="code_font">function foo() {</p>
            <p class="code_font tab_1">setTimeout(() => {</p>
            <p class="code_font tab_2">console.log('id:', this.id);</p>
            <p class="code_font tab_1">}, 100);</p>
            <p class="code_font">}</p>
            <p class="code_font">var id = 21;</p>
            <p class="note">//这里的call方法实际上是Function对象的一个API,</p>
            <p class="note">//主要就是为了给函数作用一个对象，同时可以在函数作用域中使用this来调用，</p>
            <p class="note">//就是赋值了一个作用域内对象，bind()方法也是这样的</p>
            <p class="code_font">foo.call({ id: 42 });</p>
            <p class="font_emphasize">
              //此时输出的是42,因为如果没有setTimeout的延迟，那么他的对应的对象应该是最外层的对象，那么此时的this.id指向的就是var
              id这个变量，输出21才对！但是这里做了一个延迟，这就导致了在声明箭头函数生效的时候，这里已经对这个Function函数对象设置了
              其this的指向对象，也就使用了call方法，所有这时候其生效的时候，指向的id就是42了，也就是call里面的东西
            </p>
          </div>
        </div>
        <div class="top-margin paragraph">
          <p>
            使用箭头函数有一个非常好的好处，就是在对象中使用箭头函数时，可以固化箭头函数中的this，防止其被外部对象的this给污染，因为其在定义的时候就会被固化this的对象！
          </p>
          <h5>示例代码：</h5>
        </div>
        <div class="code">
          <p class="code_font">var handler = {</p>
          <p class="code_font tab_1">id: '123456';</p>
          <p class="code_font tab_1">init: function() {</p>
          <p class="code_font tab_2">document.addEventListener('click',</p>
          <p class="code_font tab_3">event => this.doSomething(event.type), false);</p>
          <p class="code_font tab_1">),</p>
          <p class="code_font tab_1 ">doSomething: function(type) {</p>
          <p class="code_font tab_2">console.log(`Handling ${type} for ${this.id}`;</p>
          <p class="code_font tab_1">}</p>
          <p class="code_font">};</p>
        </div>
        <div class="top-margin paragraph">
          <p>箭头函数的嵌套使用比起ES5中的函数声明嵌套来说会使其流程更加简洁直观，易于阅读</p>
          <h5>代码示例：</h5>
        </div>
        <div class="code">
          <p class="note">//ES5实现的函数嵌套</p>
          <p class="code_font">const pipeline = (...func) =></p>
          <p class="code_font tab_1">var funcs.reduce((a, b) => b(a), val);</p>
          <p class="code_font">const plus1 = a => a + 1;</p>
          <p class="code_font">const mult1 = a => a * 2;</p>
          <p class="code_font">const addThenMult = pipeline(plus1, mult1);</p>
          <p class="code_font">addThenMult(5);</p>
        </div>
        <div class="paragraph top-margin bottom-marigin">
          <el-button style="position: relative; left: 72%" type="danger" @click="pipelineRes = ''">重置</el-button>
          <el-button style="position: relative; left: 75%" @click="showPipelineFunction">运行嵌套函数</el-button>
        </div>
        <div
          style="height:30px;font-size:25px; font-weight: bolder; color:rgb(255, 0, 0); margin-top: 15px; margin-bottom: 40px"
        >
          嵌套函数结果: {{ pipelineRes }}
        </div>
        <div class="top-margin summary">
          <span
            >在函数嵌套中，如果使用了箭头函数进行嵌套，那么上一个函数的输出就可以作为下一个函数的输入,
            也就是说在嵌套函数的最后一个执行函数中，可以调用前面输出的全部参数值，且无需特殊操作！</span
          >
          <br />
          <span
            >对于上面给出的pipeline示例，就是在传入一个value后，传入到下一个reduce处理函数中，然后通过设置callback方法及initValue,来完成相加的操作！</span
          >
          <span>其展开后的写法如下</span>
          <div class="code">
            <p class="code_font">var funcs = (...func) => (val) => {</p>
            <p class="code_font tab_1">return func.reduce(function(a, b) {</p>
            <p class="code_font tab_2">return b(a);</p>
            <p class="code_font tab_1">}, val)</p>
            <p class="code_font">}</p>
            <p class="code_font">let res = funcs(plus1, mult1)(5)</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Seventh from '@/funcs/seventh/seventh.js'
export default {
  data() {
    return {
      functionName: '',
      pipelineRes: '',
      seventh: undefined,
    }
  },
  mounted() {
    this.seventh = new Seventh()
  },
  methods: {
    /**
     * @method functionRestReplaceArgument 使用rest对象代替arguments对象来获取多实参传入，而且具有iteration接口
     */
    functionRestReplaceArgument: (...arr) => {
      let sum = 0
      for (let i of arr) {
        sum += Number.parseInt(i)
      }
      console.log(sum)
    },
    /**
     * @method functionRestSort 使用rest对象实现直接排序
     */
    functionRestSort: (...arr) => {
      arr.sort()
      console.log(arr)
    },
    /**
     * @method getNamedFunction 获取具名函数的名称
     */
    getNamedFunction() {
      function getName() {
        console.log('getNamedFunction')
      }
      getName()
      console.log(getName.name)
      this.functionName = getName.name
    },
    /**
     * @method getAnonymousFunction 获取匿名函数的名称
     * @note 如果是变量被赋予了一个具名函数的写法，那么获取name的时候返回的是具名函数的函数名称
     */
    getAnonymousFunction() {
      let anonymousF = () => {
        console.log('getAnonymousFunction')
      }
      this.functionName = anonymousF.name
    },
    /**
     * @method getFunctionObj 获取Function对象的名称
     * @note Function对象的名称就是anonymous这个匿名的名称
     */
    getFunctionObj() {
      let function001 = new Function()
      this.functionName = function001.name
    },
    /**
     * @method getFunctionBindName 获取Function对象的名称
     * @note Function对象bind后获取的名称会先返回一个bound 然后后面加的是具名函数或者匿名函数的名称
     */
    getFunctionBindName() {
      let foo = () => {}
      this.functionName = foo.bind({}).name
    },
    /**
     * @method showPipelineFunction 显示嵌套函数结果
     */
    showPipelineFunction() {
      const pipeline = (...func) => (val) => func.reduce((a, b) => b(a), val)
      const plus1 = (a) => a + 1
      const mult1 = (a) => a * 2
      const addThenMult = pipeline(plus1, mult1)

      this.pipelineRes = addThenMult(5)
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
.bottom-marigin {
  margin-bottom: 20px;
}
.code {
  background-color: #f8f8f8;
  padding: 10px;
  color: #000;
  width: 50%;
  margin-left: 25%;
  border-radius: 15px;
  text-align: left;
  text-indent: 35px;
  border: 1px solid #f8f8f8;
}
.code_font {
  font-weight: bolder;
  font-size: 16px;
}
.tab_1 {
  text-indent: 75px;
}
.tab_2 {
  text-indent: 100px;
}
.tab_3 {
  text-indent: 125px;
}
.note {
  color: #ac5715;
}
.paragraph {
  margin-left: 20%;
  margin-right: 20%;
  text-align: left;
}
.paragraph p {
  text-indent: 30px;
}
.summary {
  color: #afafaf;
  border-left: 3px solid #dfe2e5;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: bolder;
  padding: 10px;
  text-align: left;
  margin-left: 25%;
  margin-right: 25%;
}
.summary span {
  padding-left: 30px;
}
.summary .code {
  background-color: #f8f8f8;
  padding: 10px;
  color: #000;
  width: 50%;
  margin-left: 25%;
  border-radius: 15px;
  text-align: left;
  text-indent: 35px;
  border: 1px solid #f8f8f8;
  margin: 0px;
  width: 100%;
}
.font_emphasize {
  font-weight: bolder;
  color: rgb(255, 0, 0);
}
</style>
