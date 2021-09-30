
<template>
  <div class="catalogue-list">
    <h2 class="catalogue-title">Blog</h2>
    <el-divider></el-divider>
    <div class="page-info" v-for="(value, index) in pageList" :key="index">
      <a target="_blank" @click="goToPageRoute(value.routeLink)">
        <h3>
          <font class="created-at">[{{ value.created_at }}]</font>
          <font class="top" v-if="value.toTop">[置顶]</font>
          {{ value.title }}
        </h3>
      </a>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
/**
 * @description 目录页文章列表组件
 */
import PageList from '@/data/page_list.json'
export default {
  data() {
    return {
      pageList: PageList.page,
    }
  },
  mounted() {
    this.handlePage()
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
  },
}
</script>

<style></style>
