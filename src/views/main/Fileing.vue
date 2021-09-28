<template>
  <div class="container">
    <div class="fileing">
      <div class="tag-cloud"></div>
      <el-divider></el-divider>
      <div class="fileing-list">
        <div class="member" v-for="(value, index) in showList" :key="index">
          <div class="tag-info">
            <span><i class="iconfont icon-discount icon" /> {{ value[0] }}</span>
          </div>
          <div v-show="value[1].length != 0" class="page-list" v-for="(page, pIndex) in value[1]" :key="pIndex">
            <a target="_blank" @click="goToPageRouter(page.routeLink)"
              ><h3>{{ page.title }}</h3></a
            >
            <el-divider></el-divider>
          </div>
          <div v-show="value[1].length == 0" class="no-page">
            <el-divider>{{ value[0] }}标签下暂无数据</el-divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageList from '@/data/page_list.json'
import TagList from '@/data/tag_list.json'
import { handleFileing } from '@/funcs/page/fileing.js'
export default {
  name: 'Fileing',
  mounted() {
    this.showList = handleFileing(this.pageList, this.tagList)
  },
  data() {
    return {
      pageList: PageList.page,
      tagList: TagList.tag,
      showList: undefined,
    }
  },
  methods: {
    goToPageRouter(routerLink) {
      this.$router.push({ path: routerLink })
    },
  },
}
</script>

<style></style>
