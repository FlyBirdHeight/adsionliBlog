<template>
  <div class="page-list">
    <div class="page-info" v-for="(value, index) in pageListValue" :key="index">
      <a @click="goToPageRoute(value.routeLink)">
        <h2 class="title"><font class="top" v-if="value.toTop">[置顶]</font>{{ value.title }}</h2>
        <div class="subTitle">
          {{ value.description }}
        </div>
      </a>
      <div class="createTime">
        <p>{{ value.createTime }}</p>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
/**
 * @description Home页面下文章列表组件
 */
import pageList from '@/data/page_list.json'
export default {
  name: 'page_list',
  data() {
    return {
      pageListValue: pageList.page,
    }
  },
  mounted() {
    this.pageListValue.sort((a, b) => {
      return b.toTop - a.toTop
    })
  },
  methods: {
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
