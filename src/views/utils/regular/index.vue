<template>
  <div class="page">
    <h1>正则学习</h1>
    <el-divider></el-divider>
    <div>
      <div class="paragraph">字符串高亮显示案例：</div>
      <div class="code">
        <p class="code_font">let con = prompt("输入需要替换的内容,可用正则")</p>
        <p class="code_font">let reg = new RegExp(con, "g")</p>
        <p class="code_font">let data = document.getElementById("string_high_light")</p>
        <p class="code_font">data.innerHTML = data.innerHTML.replace(reg, search => {</p>
        <p class="code_font tab_1">return span style="color:red" ${search} /span</p>
        <p class="code_font">});</p>
      </div>
      <div class="paragraph mt-10 mb-10">
        <el-button style="position: relative; left: 72%" type="danger" @click="resetHighLight">重置</el-button>
        <el-button style="position: relative; left: 75%" @click="handleStringHighLight">运行</el-button>
      </div>
      <div class="paragraph">
        运行测试:
        <span id="string_high_light">adsionli1996</span>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>选择符 |</h3>
      <div class="paragraph">代码示例:</div>
      <div class="code">
        <p class="code_font">let tel = 021-88888888</p>
        <p class="code_font">let regular = /(010|021)\-\d{7,8}/.test(tel)</p>
      </div>
      <div class="paragraph mt-10 mb-10">
        <el-button style="position: relative; left: 72%" type="danger" @click="changeValue = ''">重置</el-button>
        <el-button style="position: relative; left: 75%" @click="handleChange">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <span class="font_emphasize" id="string_high_light">{{ changeValue }}</span>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>原子表[]与原子组()</h3>
      <div class="summary">
        <span
          >原子表中的每一个元素都是一个或，比如说[123456]可以转化为(1|2|3|4|5|6),也就是说
          <font class="font_emphasize">原子表中写入的都是按照单个进行选择符的分割的。</font>
        </span>
        <br />
        <span
          >原子组中则 <font class="font_emphasize">可以声明按块来进行添加选择符进行分割</font> ，比如说(123|345)。</span
        >
      </div>
      <div class="code">
        <p class="code_font">let value = "1996031119960422";</p>
        <p class="code_font">console.log(value.match(/[199603]/g));</p>
        <p class="code_font">console.log(value.match(/(1996|03)/g));</p>
      </div>
      <div class="paragraph mt-10 mb-10">
        <el-button style="position: relative; left: 72%" type="danger" @click="atomicValue = ''">重置</el-button>
        <el-button style="position: relative; left: 75%" @click="handleAtom">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <span class="font_emphasize" id="string_high_light">{{ atomicValue }}</span>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>转义</h3>
      <div class="paragraph">
        <p>
          在正则中的转义字符\的作用实际上和在其他编程语言的转义字符的作用是完全相同的，都是用来对一些特殊字符添加转义字符后，符合我们所定义的效果!
        </p>
        代码示例：
      </div>
      <div class="code">
        <p class="code_font">let value = 23.34</p>
        <p class="note">//这是在不是对象的时候的正则写法</p>
        <p class="code_font">console.log(/\d+\.\d+/.test(value))</p>
        <p class="note">//创建RegExp对象后的正则写法</p>
        <p class="code_font">let regularRule = '\\d+\\.\\d+'</p>
        <p class="code_font">console.log(regularRule)</p>
        <p class="code_font">let regular = new RegExp(regularRule)</p>
        <p class="code_font">console.log(regular.test(value))</p>
      </div>
      <div class="paragraph mt-10 mb-10">
        <el-button style="position: relative; left: 72%" type="danger" @click="esacpe = ['', '']">重置</el-button>
        <el-button style="position: relative; left: 75%" @click="handleEsacpe">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        <p class="font_emphasize" v-for="(value,index) in esacpe" :key="index">{{value}}</p>
      </div>
      <el-divider></el-divider>
      <div class="mt-10">
          
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeValue: '',
      atomicValue: '',
      esacpe: ['', ''],
    }
  },
  methods: {
    handleStringHighLight() {
      this.resetHighLight()
      let con = prompt('请输入需要替换的内容，可用正则')
      let reg = new RegExp(con, 'g')
      let data = document.getElementById('string_high_light')
      data.innerHTML = data.innerHTML.replace(reg, (search) => {
        return `<span style="color:red">${search}</span>`
      })
    },
    resetHighLight() {
      let data = document.getElementById('string_high_light')
      data.innerHTML = 'adsionli1996'
    },
    /**
     * @method handleChange 处理选择符
     */
    handleChange() {
      let tel = '021-88888888'
      let regular = /(010|021)\-\d{7,8}/.test(tel)
      this.changeValue = regular ? '匹配' : '不匹配'
    },
    /**
     * @method handleAtom 处理原子组与原子表
     */
    handleAtom() {
      this.atomicValue = ''
      let handle = '1996031119960422'
      let result01 = handle.match(/[199603]/g)
      let result02 = handle.match(/(1996|03)/g)
      this.atomicValue += `atom group:${result01.join(',')}     atom list: ${result02.join(',')}`
    },
    /**
     * @method handleEsacpe 处理转义字符
     */
    handleEsacpe() {
      let value = 233.345
      console.log(/\d+\.\d+/.test(value))
      let esacpeRule = '\\d+\\.\\d+'
      this.esacpe.splice(0, 1, '\d+\.\d+ 正确转义: \\d+\\.\\d+');
      let reg = new RegExp(esacpeRule)
      console.log(reg.test(value))
      let urlValue = 'http:blog.adsionli.com'
      let esacpeRuleUrl = 'https?\\:\\w+\\.\\w+\\.\\w+'
      this.esacpe.splice(1, 1, 'https?\:\w+\.\w+\.\w+ 正确转义: https?\\:\\w+\\.\\w+\\.\\w+');
      let regUrl = new RegExp(esacpeRuleUrl)
      console.log(regUrl.test(urlValue))
    },
  },
}
</script>

<style></style>
