<template>
  <div class="page">
    <div class="title-list">
      <!-- <div class="title-toggle" @click="hiddenTreeList">
        <i v-if="hiddenTree" class="el-icon-remove-outline" style="font-size: 14px"></i>
        <i v-else class="el-icon-circle-plus-outline" style="font-size: 14px"> </i>
        CATALOG
      </div> -->
      <tree-list
        :nodes="pageRender.titleData"
        :key="$route.fullPath"
        default-expand-all
        :expandAll="false"
        :flyHeight="true"
      ></tree-list>
    </div>

    <transition name="page-change" mode="out-in">
      <div :key="key()">
        <el-row style="position: relative">
          <el-col :xs="24" :sm="24" :md="{ span: 18, offset: 6 }" :lg="{ span: 20, offset: 4 }">
            <render-page class="marginAll" :renderHtml="pageRender.html"> </render-page>
            <turn></turn>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import Turn from '@/components/pages/turn.vue'
import RenderPage from '@/components/pages/render/render_page.js'
import Collapse from '@/components/utils/translate/collapse.js'
var getTitleHeight = (data) => {
  if (data.length != 0) {
    for (let value of data) {
      let dom = document.querySelector(`#title${value.startIndex}`)
      value['height'] = dom.getBoundingClientRect().y
      if (value.leave.length != 0) {
        getTitleHeight(value.leave)
      }
    }
  } else {
    return
  }
}
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
      hiddenTree: true,
      showCatalog: false,
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
  mounted() {
    this.$nextTick
  },
  updated() {
    setTimeout(() => {
      getTitleHeight(this.pageRender.titleData)
    }, 500)
  },
  methods: {
    key() {
      const randomNumber = Math.random().toString()
      return this.$route.name !== undefined ? this.$route.name + randomNumber : this.$route + randomNumber
    },
    hiddenTreeList() {
      this.hiddenTree = !this.hiddenTree
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
            this.pageRender.html = res.html
            this.pageRender.titleData = res.title
            if (this.pageRender.html == '') {
              this.pageRender.html = '<div class="no-page-data">暂无数据</div>'
              this.pageRender.titleData = []
            }
          })
        }
      }
    },
  },
  components: {
    Turn,
    RenderPage,
    Collapse,
  },
}
</script>

<style lang="scss" scoped>
.title-list {
  z-index: 1000;
  @media screen and (min-width: 1000px) {
    @include titleList(20px);
  }
  @media screen and (min-width: 1300px) {
    @include titleList(30px);
  }

  @media screen and (min-width: 1600px) {
    @include titleList(50px);
  }

  @media screen and (min-width: 1800px) {
    @include titleList(80px);
  }

  @media screen and (min-width: 2000px) {
    @include titleList(110px);
  }
  @media screen and (min-width: 2200px) {
    @include titleList(190px);
  }
  @media screen and (min-width: 2300px) {
    @include titleList(260px);
  }

  @media screen and (max-width: 977px) {
    margin: 10px;
    padding: 5px;
    text-align: left;
    border: 2px solid #dfe2e5;
    height: auto;
    cursor: pointer;
  }
  .title-toggle {
    padding: 20px 0;
    font-size: 15px;
    font-weight: bolder;
    color: #a3a3a3;
  }
}
.marginAll {
  margin: 30px;
  @media screen and (max-width: 715px) {
    margin: 5px;
  }
}
.page-change-enter-active,
.page-change-leave-active {
  transition: all 0.3s;
}
.page-change-enter,
.page-change-leave-to {
  opacity: 0;
  transform: translateX(30%)
}
</style>
