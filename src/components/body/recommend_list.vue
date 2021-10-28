<template>
  <div class="recommend_list">
    <div class="recommend_body">
      <div class="page-info" v-for="(value, index) in showPageingList" :key="index">
        <a target="_blank" @click="goToPageRoute(value.routeLink)">
          <h3>
            <font class="created-at">[{{ value.created_at }}]</font>
            <font class="recommend-label" v-if="value.recommend">[推荐]</font>
            {{ value.title }}
          </h3>
        </a>
        <el-divider style="margin:0"></el-divider>
      </div>
    </div>
    <paging
      class="recommend_page"
      layout="total,jumper,size"
      @changeShowCount="changeCount"
      @currentPageChange="changePage"
      :totalCount="totalCount"
      :pageSizes="pageSizes"
    />
  </div>
</template>

<script>
import Paging from '@/components/utils/paging.vue'
export default {
  data() {
    return {
      pageList: this.$store.getters.getPageList,
      totalCount: 0,
      pageSizes: [10, 20, 30, 40, 50],
      pagePageingList: [],
      showPageingList: [],
    }
  },
  beforeMount() {
    this.handlePage()
    this.totalCount = this.pageList.length
  },
  mounted() {
    this.resolvePage(this.pageSizes[0])
    this.changePage()
  },
  methods: {
    /**
     * @method handlePage 处理一下文章的排序，按照置顶优先再按照时间进行排序
     */
    handlePage() {
      this.pageList = this.pageList.sort((a, b) => {
        if (a.toTop == b.toTop) {
          let aDate = new Date(a.created_at)
          let bDate = new Date(b.created_at)
          return bDate.getTime() - aDate.getTime()
        }
        return b.toTop - a.toTop
      })
      this.pageList = this.pageList.filter((value) => {
        if (value.recommend) {
          return value
        }
      })
    },
    /**
     * @method goToPageRoute 前往文章路由
     * @param {String} routerLinker
     */
    goToPageRoute(routerLinker) {
      this.$router.push({ path: routerLinker })
    },
    /**
     * @method resolvePage 按分页数量分解数组
     * @param {Number} count 分页数量
     */
    resolvePage(count = 10) {
      this.pagePageingList = []
      this.pageList.forEach((value, index) => {
        const page = Math.floor(index / count)
        if (!this.pagePageingList[page]) {
          this.pagePageingList[page] = []
        }
        this.pagePageingList[page].push(value)
      })
    },
    changeCount(val) {
      let [count, page] = val
      this.resolvePage(count)
      this.changePage(page)
    },
    changePage(val = 1) {
      this.showPageingList = this.pagePageingList[val - 1]
    },
  },
  components: {
    Paging,
  },
}
</script>

<style lang="scss" scoped>
.recommend_list {
  border: 2px solid #dcdfe6;
  padding: 10px;
  @media screen and(min-width: 768px) {
    margin: 0 10%;
    text-align: left;
  }
  @media screen and(max-width: 768px) {
    margin: 0 5%;
    text-align: left;
  }
}
.recommend_body {
  text-align: left;
  @media screen and(min-width: 768px) {
    margin: 0 5%;
  }
}
.recommend-label {
  color: rgba(144, 238, 144, 1);
}
.created-at {
  color: rgba(30, 144, 255, 1);
}
.recommend_page {
  @media screen and (max-width: 710px) {
    padding: 10px 15px;
    text-align: left;
  }
}
</style>
