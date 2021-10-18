<template>
  <div class="page" style="margin-bottom: 30px">
    <h3>测试用例：{{ testData }}</h3>
    <el-button-group>
      <el-button @click="testUnderline">测试下划线</el-button>
      <el-button @click="testInlineCode">测试内联代码</el-button>
      <el-button @click="testBold">测试加粗</el-button>

      <el-button @click="testHighlight">测试高亮</el-button>
      <el-button @click="testTilt">测试倾斜</el-button>
      <el-button @click="testDeleteLine">测试删除线</el-button>
      <el-button @click="testHypersLink">测试超链接</el-button>
    </el-button-group>
    <h4>处理顺序：1. 加粗 2. 倾斜 3.高亮</h4>
    <div v-html="testData"></div>
    <el-divider></el-divider>
    <h3>测试匹配标题:{{ title }}</h3>
    <el-button @click="testTitle">测试标题</el-button>
    <div v-html="title"></div>
    <el-divider>测试code的markdown替换</el-divider>
    <h3>测试内容:</h3>
    <div
      style="
        text-align: left;
        background-color: #000;
        color: #fff;
        margin: 0 10%;
        height: 400px;
        overflow-y: scroll;
      "
    >
      <p style="padding: 5px" v-for="(item, index) in showCodeValue" :key="index">
        {{ item }}
      </p>
    </div>
    <div style="height: 500px; overflow-y: scroll" v-html="codeHtml"></div>
    <el-divider>测试table模块的正则表现</el-divider>
    <h3>测试内容</h3>
    <div class="table-regular">
      <p v-for="(item, index) in tableRegular.showDataHtml" :key="index">{{ item }}</p>
    </div>
    <h4>处理内容结果如下</h4>
    <font v-if="tableRegular.html == ''" style="color:red;font-weight:bolder;font-size:20px">暂未完成处理</font>
    <div v-else>
      {{ tableRegular.html }}
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
import Code from '@/modules/analysis/utils/code.js'
import MatchingPattern from '@/modules/analysis/utils/matching_pattern.js'
import TableList from '@/components/utils/table/table.vue'
import TableColumn from '@/components/utils/table/table-column.js'
export default {
  data() {
    return {
      testData:
        '**这里是一个测试的语句**，[adsionlBlog](blog.adsionli.com),包括加粗，`内联code`，==高亮显示==,<u>下划线测试</u>，~~这里是删除线哟~~，[adsionlBlog的超链接](blog.adsionli.com),*倾斜字体！！*，**究极加粗**，==高亮显示==',
      title: '# 标题++++++`code`**加粗***切斜*[adsionlBlog](blog.adsionli.com) ***123***',
      specialChar: {
        bold: /(\*{2})(.+?)(\1)/gi,
        tilt: /(\*{1})(.+?)\1/gi,
        underline: /(<u>)(.+?)(<\/u>)/gi,
        inlineCode: /(`{1,5})(.+?)\1/gi,
        deleteLine: /(~{2})(.+?)(\1)/gi,
        highlight: /(={2})(.+?)\1/gi,
        hyperlinks: /(\[(.+?)\])(\((.+?)\))/gi,
      },
      code: new Code(),
      testCodeValue: '',
      showCodeValue: [],
      codeHtml: '',
      matchingPattern: new MatchingPattern(),
      mdPath: ['/content/test/code.md', '/content/test/table.md'],
      tableRegular: {
        data: undefined,
        html: [],
        showDataHtml: undefined,
      },
    }
  },
  mounted() {
    this.axios
      .get(this.mdPath[0])
      .then((res) => {
        this.testCodeValue = res.data
        this.matchingPattern.handle(this.testCodeValue)
        this.codeHtml = this.matchingPattern.returnCodeHtml
        this.showCodeValue = this.testCodeValue.split('\n')
      })
      .catch((error) => {
        console.log(error)
      })
    this.axios
      .get(this.mdPath[1])
      .then((res) => {
        let matchingPattern = new MatchingPattern()
        this.tableRegular.data = res.data.replace(/\r/gim, '')
        this.tableRegular.showDataHtml = this.tableRegular.data.split('\n')
        matchingPattern.resetData()
        matchingPattern.handle(this.tableRegular.data)
        this.tableRegular.html = matchingPattern.returnCodeHtml
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    testTitle() {
      this.title = this.title.replace(/(^\s+|\s+$)/gi, '')
      let reg = /(?<titleCount>^#{1,6})(\s{1,})(?<title>.+)/
      if (reg.test(this.title)) {
        let count = this.title.match(/(?<titleCount>^#{1,6})(\s{1,})(.+?)/).groups.titleCount.length
        this.title = this.title.replace(reg, `<h${count}>$<title></h${count}>`)
      }
      this.title = this.matchSpecialChar(this.title)
    },
    /**
     * @method matchSpecialChar 匹配特殊字符
     * @param {String} value
     */
    matchSpecialChar(value) {
      for (let key in this.specialChar) {
        let reg = new RegExp(this.specialChar[key])
        if (reg.test(value)) {
          if (key == 'hyperlinks') {
            value = value.replace(reg, this.handleSpecialChar('$2', key, '$4'))
          } else {
            value = value.replace(reg, this.handleSpecialChar('$2', key))
          }
        }
      }

      return value
    },
    /**
     * @method handleSpecialChar 将特殊字符转为对应的html标签
     * @param {*} value 插入检索值
     * @param {*} type 类型
     * @param {*} url 链接标签时的url
     */
    handleSpecialChar(value, type, url = '') {
      switch (type) {
        case 'tilt':
          return `<font class='tilt_char'>${value}</font>`
        case 'bold':
          return `<font class='bold_char'>${value}</font>`
        case 'underline':
          return `<font class='underline_char'>${value}</font>`
        case 'inlineCode':
          return `<span class='inlineCode_char'>${value}</span>`
        case 'deleteLine':
          return `<del class='deleteline_char'>${value}</del>`
        case 'highlight':
          return `<font class='highlight_char'>${value}</font>`
        case 'hyperlinks':
          return `<a href='${url}' rel='noopener noreferrer' target='_blank'>${value}</a>`
        default:
          break
      }
    },
    testUnderline() {
      let reg = new RegExp(/(<u>)(.+?)(<\/u>)/gi)
      this.testData = this.testData.replace(reg, `<font class='underline_char'>$2</font>`)
    },
    testInlineCode() {
      let reg = new RegExp(/(`{1})(.+?)\1/gi)
      this.testData = this.testData.replace(reg, `<span class='inlineCode_char'>$2</span>`)
    },
    testBold() {
      let reg = new RegExp(/(\*{2})(.+?)(\1)/gi)
      this.testData = this.testData.replace(reg, `<font class='bold_char'>$2</font>`)
    },
    testHighlight() {
      let reg = new RegExp(/(={2})(.+?)\1/gi)
      this.testData = this.testData.replace(reg, `<font class='highlight_char'>$2</font>`)
    },
    testTilt() {
      let reg = new RegExp(/(\*)(.+?)\1/gi)
      this.testData = this.testData.replace(reg, `<font class='tilt_char'>$2</font>`)
    },
    testDeleteLine() {
      let reg = new RegExp(/(~{2})(.+?)(\1)/gi)
      this.testData = this.testData.replace(reg, `<del class='deleteline_char'>$2</del>`)
    },
    testHypersLink() {
      let reg = new RegExp(/(\[(.+?)\])(\((.+?)\))/gi)
      console.log(reg.exec(this.testData))
      for (let value of this.testData.matchAll(/(\[(?<name>.+?)\])(\((?<url>.+?)\))/gi)) {
        console.log(value)
      }
      this.testData = this.testData.replace(reg, `<a href='$4' rel='noopener noreferrer' target='_blank'>$2</a>`)
    },
  },
  components: {
    TableList,
    TableColumn,
  },
}
</script>

<style lang="scss" scoped>
.table-regular {
  background-color: #a3a3a3;
  border: 1px solid #a5a5a5;
  border-radius: 15px;
  padding: 15px;
  color: #fff;
  margin: auto;
  width: 400px;
  text-align: left;
  height: 400px;
  overflow-y: scroll;
  letter-spacing: 1px;
}
</style>
