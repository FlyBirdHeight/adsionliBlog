<template>
  <div class="page" :key="key()">
    <el-row>
      <el-col :xs="24" :sm="24" :md="{ span: 14, offset: 1 }" :lg="{ span: 14, offset: 2 }">
        <render-page :renderHtml="pageRender.html"> </render-page>
      </el-col>
      <el-col :xs="24" :sm="24" :md="{ span: 8, offset: 1 }" :lg="{ span: 7, offset: 1 }">
        <tree-list style="margin-top: 20px;" :nodes="pageRender.titleData" highlight-current default-expand-all></tree-list>
      </el-col>
    </el-row>
    <turn></turn>
  </div>
</template>

<script>
import Turn from '@/components/pages/turn.vue'
import RenderPage from '@/components/pages/render/render_page.js'
export default {
  name: 'Markdown',
  data() {
    return {
      pageData: null,
      pageList: null,
      currentPage: null,
      pageRender: {
        html: '',
        titleData: [],
      },
    }
  },
  created() {
    this.currentPage = this.$store.getters.getCurrentPage
    this.pageList = this.$store.getters.getPageList
    this.pageData = this.pageList[this.currentPage]
    this.analysis.setFilePath(this.pageData.path).then((res) => {
      this.pageRender.html = res.html
      this.pageRender.titleData = res.title
      if (this.pageRender.html == '') {
        this.pageRender.html = '<div class="no-page-data">暂无数据</div>'
      }
    })
  },
  methods: {
    key() {
      const randomNumber = Math.random().toString()
      return this.$route.name !== undefined ? this.$route.name + randomNumber : this.$route + randomNumber
    },
  },
  watch: {
    $route: function(to, from) {
      if (to.fullPath != from.fullPath) {
        this.currentPage = this.$store.getters.getCurrentPage
        this.pageData = this.pageList[this.currentPage]
        this.pageRender.html = ''
        this.pageRender.titleData = []
        if (this.pageData.path) {
          this.analysis.setFilePath(this.pageData.path).then((res) => {
            this.pageRender.html = res
            if (this.pageRender.html == '') {
              this.pageRender.html = '<div class="no-page-data">暂无数据</div>'
              this.pageRender.titleData = res.title
            }
          })
        }
      }
    },
  },
  components: {
    Turn,
    RenderPage,
  },
}
</script>

<style></style>
