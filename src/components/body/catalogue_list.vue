<template>
  <div class="catalogue-list">
    <h2 class="catalogue-title">Blog</h2>
    <el-divider></el-divider>
    <div class="page-info" v-for="(value, index) in showPageingList" :key="index">
      <a target="_blank" @click="goToPageRoute(value.routeLink)">
        <h3>
          <font class="created-at">[{{ value.created_at }}]</font>
          <font class="top" v-if="value.toTop">[置顶]</font>
          {{ value.title }}
        </h3>
      </a>
      <el-divider></el-divider>
    </div>
    <paging
      layout="total,jumper,size"
      @changeShowCount="changeCount"
      @currentPageChange="changePage"
      :totalCount="totalCount"
      :pageSizes="pageSizes"
    />
  </div>
</template>

<script>
/**
 * @description 目录页文章列表组件
 */
import PageList from '@/data/page_list.json'
import Paging from '@/components/utils/paging.vue'
export default {
  data() {
    return {
      pageList: PageList.page,
      totalCount: 0,
      pageSizes: [10, 20, 30, 40, 50],
      pagePageingList: [],
      showPageingList: []
    }
  },
  beforeMount() {
    this.totalCount = this.pageList.length
  },
  mounted() {
    this.handlePage()
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
      this.pagePageingList = [];
      this.pageList.forEach((value, index) => {
        const page = Math.floor(index / count)
        if (!this.pagePageingList[page]) {
          this.pagePageingList[page] = []
        }
        this.pagePageingList[page].push(value)
      })
    },
    changeCount(val) {
      let [count, page] = val;
      this.resolvePage(count);
      this.changePage(page)
    },
    changePage(val = 1) {
      this.showPageingList = this.pagePageingList[(val - 1)];
    },
  },
  components: {
    Paging,
  },
}
</script>

<style></style>
