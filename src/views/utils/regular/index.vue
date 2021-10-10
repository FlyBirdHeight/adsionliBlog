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
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="resetHighLight">重置</el-button>
        <el-button @click="handleStringHighLight">运行</el-button>
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
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="changeValue = ''">重置</el-button>
        <el-button @click="handleChange">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <span class="font_emphasize">{{ changeValue }}</span>
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
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="atomicValue = ''">重置</el-button>
        <el-button @click="handleAtom">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <span class="font_emphasize">{{ atomicValue }}</span>
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
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="esacpe = ['', '']">重置</el-button>
        <el-button @click="handleEsacpe">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        <p class="font_emphasize" v-for="(value, index) in esacpe" :key="index">{{ value }}</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>字符边界约束：起始符^ 结束符$</h3>
      <div class="paragraph">
        <p>
          起始符^的所指就是一个字符串的起始字符位置，结束符$则是用来匹配字符串最后一位的终止字符的
        </p>
        <p>代码示例:</p>
      </div>
      <div class="code">
        <p class="note">//判断字符串都是数字，提取字符串中的数字</p>
        <p class="code_font">let value = "1996adsionli"</p>
        <p class="code_font">let rule = "^\\d$"</p>
        <p class="code_font">let regular = new RegExp(rule, "g")</p>
        <p class="code_font">regular.test(value)</p>
        <p class="code_font">value.match(/^\d$s/)</p>
        <p class="note">//这里如想要让其匹配可以如此设置 /^\d{4}$/g 这样就可以匹配了</p>
      </div>
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="borderValue = ''">重置</el-button>
        <el-button @click="handleBorder">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <span class="font_emphasize">{{ borderValue }}</span>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>数字与空白元字符</h3>
      <div class="paragraph">
        <p>数字的标识为\d,\d会用来匹配数值；\D的匹配模式与\d不同,\D则是用来匹配非数值的字符</p>
        <p>空白元字符的匹配为\s，当字符串中存在空白或者换行符的时候都会匹配成功；\S则是除了空白之外</p>
        <p>代码示例:</p>
      </div>
      <div class="code">
        <p class="code_font">let value01 = "adsionli:19960311 猪哥:19960422";</p>
        <p class="code_font">let rule01 = "\\d\\d\\d\\d\\d\\d\\d\\d";</p>
        <p class="code_font">let regular01 = new RegExp(rule01);</p>
        <p class="code_font">regular01.test(value01);</p>
        <p class="code_font">value01.match(/\d\d\d\d\d\d\d/g);</p>
        <p class="code_font">value01.match(/\D/g);</p>
        <p class="code_font">let rule02 = "\\s";</p>
        <p class="code_font">let rule03 = "\\S";</p>
        <p class="code_font">let regular02 = new RegExp(rule02, 'g');</p>
        <p class="code_font">let regular03 = new RegExp(rule03, 'g');</p>
        <p class="code_font">regular02.test(value01);</p>
        <p class="code_font">regular03.test(value01);</p>
        <p class="code_font">value01.match(/\s/g);</p>
        <p class="code_font">value01.match(/\S/g);</p>
        <p class="code_font">value01.match(/[^:\s\d]+/g)</p>
        <p class="note">//去除字符串的前后字符</p>
        <p class="code_font">value01 = value01.replace(/(^\s*|\s*$)/g, '')</p>
      </div>
      <br />
      <div class="summary">
        <span>
          当起始符^在原子组[]中的时候代表的是 <font class="font-emphasize">非</font>的意思
          ，也就是说原子组中的表示就变为 <font class="font-emphasize">!(xxx|xxx|xxx|xxx)</font> 如此形式了
        </span>
      </div>
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="numberSpaceValue = ''">重置</el-button>
        <el-button @click="handleNumberSpace">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试：
        <p class="font_emphasize" v-for="(value, index) in numberSpaceValue" :key="index">{{ value }}</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>w与W元字符</h3>
      <div class="paragraph">
        <p>w元字符主要用来匹配：字符、数字、下划线。所以\w实际囊括了(a-z|A-Z|\d|_)</p>
        <p>W元字符主要用来匹配非字符的特殊符号</p>
        <p>代码示例:</p>
      </div>
      <div class="code">
        <p class="code_font">let username = prompt("请输入用户名(必须字母开头且最多10位字符)")</p>
        <p class="note">//i标识不区分大小写</p>
        <p class="code_font">/^(a-z|A-Z)/w{4,9}$/.test(username)</p>
      </div>
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="judgeInputValue = ''">重置</el-button>
        <el-button @click="handleChar">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <span class="font_emphasize">输入是否符合要求：{{ judgeInputValue }}</span>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>点元字符 .</h3>
      <div class="paragraph">
        <p>点元字符的匹配则是很广的，可以匹配全部字符，无论是特殊字符还是字母还是数字都可以匹配</p>
        <p class="font_emphasize">注：如果想要单纯的匹配.这一个字符的时候，必须进行转义才可以 \.</p>
        <p class="font_emphasize">
          注2：点元字符无法匹配换行符，所以如果要匹配一个带有换行符的所有字符，就必须使用单行模式s，它会自动忽略掉换行符，书写方式：/.+/s
        </p>
        <p>代码示例:</p>
      </div>
      <div class="code">
        <p class="code_font">let value = "blog.adsionli.com"</p>
        <p class="code_font">value.match(/.*/g)</p>
        <p class="code_font">value.match(/\./g).length</p>
        <p class="code_font">value.match(/^\w+\.\w+\.\w+$/)</p>
        <p class="code_font">/^\w+\.\w+\.\w+$/.test(value)</p>
      </div>
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="pointValue = ''">重置</el-button>
        <el-button @click="handlePoint">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <p class="font_emphasize" v-for="(value, index) in pointValue" :key="index">{{ value }}</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>匹配全部字符的一些方式</h3>
      <div class="paragraph">
        <p>代码示例：</p>
      </div>
      <div class="code">
        <p class="code_font">let data = `</p>
        <p class="code_font tab_1">adsionli</p>
        <p class="code_font tab_1">shirley</p>
        <p class="code_font">`;</p>
        <p class="note">//匹配全部字符的一些方式，使用原子表来进行匹配</p>
        <p class="code_font">data.match(/.+/s);</p>
        <p class="code_font">data.match(/[\w\W]+/);</p>
        <p class="code_font">data.match(/[\d\D]+/);</p>
        <p class="code_font">data.match(/[\s\S]+/)</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>模式修正符i与g</h3>
      <div class="paragraph">
        <p>模式修正符i: 匹配时不区分大小写</p>
        <p>模式修正符g: 匹配时，匹配全部符合的字符</p>
        <p class="font_emphasize">模式修正符在使用的时候是可以组合的，也就是可以同时使用在正则匹配中</p>
        <p>代码示例：</p>
      </div>
      <div class="code">
        <p class="code_font">let value = adsionlI@foxmail.com;</p>
        <p class="code_font">value.match(/i/i);</p>
        <p class="code_font">value.match(/i/g);</p>
        <p class="code_font">value.match(/i/gi);</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>m多行匹配修正符</h3>
      <div class="paragraph">
        <p>m多行匹配就可以将字符串的每一行都进行单独处理，并且可以使用map进行遍历</p>
        <p>代码示例：</p>
      </div>
      <div class="code">
        <p class="code_font">let value = `</p>
        <p class="code_font tab_1">#1 js,200元 #</p>
        <p class="code_font tab_1">#2 php,300元 #</p>
        <p class="code_font tab_1">#3 adsionli # shirley</p>
        <p class="code_font tab_1">#4 node.js,200元 #</p>
        <p class="code_font">`;</p>
        <p class="code_font">let handleData = value.match(/^\s*#\d+\s.+\s+#\s*$/gm).map((val) => {</p>
        <p class="code_font tab_1">let handleVal = val.replace(/\s*#\d+\s/, '').replace(/\s+#\s*$/, '');</p>
        <p class="code_font tab_1">[name, value] = handleVal.split(',')</p>
        <p class="code_font tab_1">return { name, value }</p>
        <p class="code_font">});</p>
      </div>
      <div class="paragraph mt-10 mb-10" style="text-align:right">
        <el-button type="danger" @click="moreParagraphValue = ''">重置</el-button>
        <el-button @click="handleMoreParagraphValue">运行</el-button>
      </div>
      <div class="paragraph mb-10">
        运行测试:
        <p class="font_emphasize">{{ moreParagraphValue }}</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>字符与字符属性</h3>
      <div class="paragraph">
        <p>每个字符都有属性，如L属性表示是字母，P 表示标点符号</p>
        <p class="font_emphasize">
          这些字符属性需要结合u修正符才有效。其他属性简写可以访问
          <a
            href="https://www.unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt"
            target="_blank"
            rel="noopener noreferrer"
            >属性的别名</a
          >
          网站查看。
        </p>
        <p>同时为了查找具有某种属性的字符，需要使用\p这个元字符，写作/p{...}</p>
      </div>
      <div class="summary">
        <span>这里列举一些常用的字符属性</span>
        <tree-list :structure="structure" :treeData="treeData"></tree-list>
        <a target="_blank" rel="noopener noreferrer" href="https://zh.javascript.info/regexp-unicode">参考网站</a>
      </div>
      <div class="paragraph">
        <p>代码示例</p>
      </div>
      <div class="code">
        <p class="code_font">let value01 = "你好，中国！ hello China!"</p>
        <p class="note">//匹配中文字符</p>
        <p class="code_font">value01.match(/\p{sc=Han}/gu)</p>
        <p class="note">//匹配字母</p>
        <p class="code_font">value01.match(/\p{L}/gu)</p>
        <p class="note">//匹配小写字母与大写字母</p>
        <p class="code_font">value01.match(/\p{Ll}/gu)</p>
        <p class="code_font">value01.match(/\p{Lu}/gu)</p>
        <p class="note">//匹配标点符号</p>
        <p class="code_font">value01.match(/\p{P}/gu)</p>
        <p class="code_font">......</p>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt-10">
      <h3>RegExp类中的lastIndex静态属性与exec方法以及sticky属性的说明</h3>
      <div class="paragraph">
        <p>
          1. 在RegExp类中，lastIndex这个静态属性是用来记录当使用RegExp进行正则匹配时，设置从第几位开始进行匹配，
          当匹配成功时，<font class="font_emphasize"
            >lastIndex属性会自动变更为匹配成功的那个字符串的结束位置并进行变更。</font
          >
          <font class="font_emphasize">如果匹配失败，lastIndex属性 会变为0。</font>
        </p>
        <p>
          2. exec方法实际就和String类下的match方法是类似的，返回的参数的形式也是
        </p>
        <div class="code">
          <p class="code_font">[1.匹配的字符 2.所在下标 3.原字符串] => ["u", index: , input: , groups: ]</p>
          <p class="code_font">
            但是，当使用g修正符是，其返回的是类似： ["a", "d", "s", "i",
            "o"]的形式，就和单一匹配时完全不同，无法携带全部信息，这是就需要下面的处理了
          </p>
        </div>
        <p>
          但是exec方法与match方法之间不同在于一个是RegExp类下的，一个是String类下的。
          在RegExp类下，则可以通过配合lastIndex这个属性，来循环出每一个符合匹配要求的。代码如下：
        </p>
        <div class="code">
          <p class="code_font">let str = "adsionli";</p>
          <p class="code_font">let reg = new RegExp('/\\w/');</p>
          <p class="note">//当无匹配项时，其返回的是Null，所以可以自动停下来</p>
          <p class="code_font">while(res = reg.exec(str)){</p>
          <p class="code_font tab_1">console.log(res)</p>
          <p class="code_font">}</p>
        </div>
        <p>
          3. sticky属性说明，其代表的是修正符y，反映了搜索是否具有粘性（ 仅从正则表达式的 lastIndex 属性表示的索引处搜索
          ）, 这个属性就是非常依赖于lastIndex的一个属性。
          sticky属性在匹配大文本的时候可以提高效率，我们可以通过通过y修正符的设置， 来提升效率，<font
            class="font_emphasize"
            >因为他不会像g修正符那样去全部匹配，他只会在匹配成功一次之后就会停下来，节省了匹配时间。</font
          >
        </p>
        <div class="code">
          <p class="code_font">const str1 = 'table football';</p>
          <p class="code_font">const regex1 = new RegExp('foo', 'y');</p>
          <p class="code_font">regex1.lastIndex = 6;</p>
          <p class="note">//这里返回的是true, 但是lastIndex会变为9</p>
          <p class="code_font">console.log(regex1.test(str1));</p>
          <p class="note">//这里返回的就是false了，因为他匹配的开始时第9位，就无法找到匹配项了</p>
          <p class="code_font">console.log(regex1.test(str1));</p>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="mt_10">
      <h3>原子表知识的拓展：区间匹配，排除匹配</h3>
      <div class="summary">
        <span>
          在原子表中，如果是在原子表内部的内容，其与不在原子表中的表达是不一样的，比如说[()]、[^]等，
          ()在原子表中只是普通的括号，但是在外面则是原子组的意思；同理^在原子表中是除了的意思，在外面是起始边界符
        </span>
        <br>
        <span class="font_emphasize">
          原子表是不会去解析字符的，所以在使用的时候需要注意！
        </span>
      </div>
      <div class="paragraph">
        <p>1. 区间匹配(代码示例)：</p>
        <div class="code">
          <p class="code_font">let str = 'adsionli';</p>
          <p class="code_font">str.match(/[a-z]+/gi)</p>
          <p class="code_font">str.match(/[0-9]+/gi)</p>
          <p class="code_font">str.match(/^[a-z]\w+/gi)</p>
          <p class="code_font">等等...</p>
        </div>
        <p>
          2. 排除匹配, 字面意思，就是使用原子表时，原子表内容是我们所不需要的，这个时候原子表中的<font class="emphasize">^</font>
          这个符号就不表示起始边界符，而是表示排除的意思，代码示例如下：
        </p>
        <div class="code">
          <p class="code_font">let str = "adsionli: 1996-02-22";</p>
          <p class="note">//这里输出的就是adsionli</p>
          <p class="code_font">str.match(/[^\d\p{P}]/gui);</p>
          <p class="note">//不使用原子表的排除实现方式</p>
          <p class="code_font">str.match(/\p{L}/gui);</p>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
import TreeList from '@/components/utils/tree_list.vue'
import RegularChar from '@/data/regular_char.json'
export default {
  data() {
    return {
      changeValue: '',
      atomicValue: '',
      esacpe: ['', ''],
      borderValue: '',
      numberSpaceValue: [],
      judgeInputValue: '',
      pointValue: [],
      moreParagraphValue: '',
      structure: RegularChar.structure,
      treeData: RegularChar.data,
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
      this.esacpe.splice(0, 1, '\d+\.\d+ 正确转义: \\d+\\.\\d+')
      let reg = new RegExp(esacpeRule)
      console.log(reg.test(value))
      let urlValue = 'http:blog.adsionli.com'
      let esacpeRuleUrl = 'https?\\:\\w+\\.\\w+\\.\\w+'
      this.esacpe.splice(1, 1, 'https?\:\w+\.\w+\.\w+ 正确转义: https?\\:\\w+\\.\\w+\\.\\w+')
      let regUrl = new RegExp(esacpeRuleUrl)
      console.log(regUrl.test(urlValue))
    },
    /**
     * @method handleBorder 处理边界字符
     */
    handleBorder() {
      this.borderValue = ''
      let value = '1996adsionli'
      let rule = '^\\d$'
      let regular = new RegExp(rule, 'g')
      this.borderValue += 'test结果:' + (regular.test(value) ? '匹配' : '不匹配')
      this.borderValue += '   match结果:' + value.match(/^\d$/)
    },
    /**
     * @method handleNumberSpace 处理数字和空白元字符
     */
    handleNumberSpace() {
      let value01 = '     adsionli:19960311 猪哥:19960422       '
      value01 = value01.replace(/(^\s*|\s*$)/g, '')
      this.numberSpaceValue.splice(0, 1, `去除字符串前后的空格: ${value01}`)
      this.numberSpaceValue.splice(1, 1, `去除字符串前后的空格后字符串内的空格数量: ${value01.match(/\s/g).length}`)
      let rule01 = '\\d\\d\\d\\d\\d\\d\\d\\d'
      let regular01 = new RegExp(rule01)
      this.numberSpaceValue.splice(2, 1, `规则1：${regular01.test(value01) ? '匹配' : '不匹配'}`)
      this.numberSpaceValue.splice(
        3,
        1,
        `字符串match /${rule01}/g的结果：${value01.match(/\d\d\d\d\d\d\d\d/g).join(',')}`
      )
      this.numberSpaceValue.splice(4, 1, `字符串match /\\D/g的结果：${value01.match(/\D/g).join(',')}`)
      let rule02 = '\\s'
      let rule03 = '\\S'
      let regular02 = new RegExp(rule02, 'g')
      let regular03 = new RegExp(rule03, 'g')
      this.numberSpaceValue.splice(5, 1, `规则2：${regular02.test(value01) ? '匹配' : '不匹配'}`)
      this.numberSpaceValue.splice(6, 1, `规则3：${regular03.test(value01) ? '匹配' : '不匹配'}`)
      this.numberSpaceValue.splice(7, 1, `字符串match /\\s/g的结果：${value01.match(/\s/g).join(',')}`)
      this.numberSpaceValue.splice(8, 1, `字符串match /\\S/g的结果：${value01.match(/\S/g).join(',')}`)
      this.numberSpaceValue.splice(9, 1, `字符串match /[^:\\s\\d]+/g的结果：${value01.match(/[^:\s\d]+/g).join(',')}`)
      this.numberSpaceValue.splice(10, 1, `字符串中空格的个数: ${value01.match(/\s/g).length}`)
    },
    /**
     * @method handleChar 处理w元字符
     */
    handleChar() {
      let username = prompt('请输入用户名(必须字母开头且最多10位字符)')
      //i标识不区分大小写
      this.judgeInputValue = /^[a-z]\w{4,9}$/i.test(username) ? '符合' : '不符合'
    },
    /**
     * @method handlePoint 处理点元字符
     */
    handlePoint() {
      let value = 'blog.adsionli.com'
      this.pointValue.splice(0, 1, `匹配全部字符: ${value.match(/.*/g).join(',')}`)
      this.pointValue.splice(1, 1, `字符串中.的数量: ${value.match(/\./g).length}`)
      this.pointValue.splice(2, 1, `简单的网址匹配: ${/^\w+\.\w+\.\w+$/.test(value) ? '匹配' : '不匹配'}`)
    },
    /**
     * @method handleMoreParagraphValue 处理多行匹配修正符
     */
    handleMoreParagraphValue() {
      let value = `
            #1 js,200元 #
            #2 php,300元 #
            #3 adsionli # shirley
            #4 node.js,200元 #
        `
      let handleData = value.match(/^\s*#\d+\s.+\s+#\s*$/gm).map((val) => {
        let handleVal = val.replace(/\s*#\d+\s/, '').replace(/\s+#\s*$/, '')
        ;[name, value] = handleVal.split(',')
        return { name, value }
      })
      this.moreParagraphValue = JSON.stringify(handleData, null, 2)
    },
  },
  components: {
    TreeList,
  },
}
</script>

<style></style>
