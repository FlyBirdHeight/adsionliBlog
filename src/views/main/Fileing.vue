<template>
  <div class="container">
    <div class="fileing">
      <tag-cloud @jumpToAssignTag="jumpToAssignTag"></tag-cloud>
      <el-divider></el-divider>
      <div class="fileing-list">
        <div class="member" v-for="(value, index) in showList" :key="index" :id="value[0]">
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
import TagCloud from '@/components/utils/tag_cloud'
import { handleFileing } from '@/funcs/page/fileing.js'
export default {
  name: 'Fileing',
  beforeMount() {
    this.showList = handleFileing(this.pageList, this.tagList)
  },
  mounted() {
    this.jumpTagLabelId = this.$store.getters.getSidebarTagLabel
    this.jumpToTag(this.jumpTagLabelId)
  },
  data() {
    return {
      pageList: PageList.page,
      tagList: TagList.tag,
      showList: undefined,
      jumpTagLabelId: '',
    }
  },
  methods: {
    goToPageRouter(routerLink) {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
      this.$router.push({ path: routerLink })
    },
    jumpToTag(labelId) {
      if (labelId != '') {
        let dom = document.querySelector(`#${labelId}`)
        let position = dom.getBoundingClientRect().y
        window.scrollTo({
          top: position,
          behavior: 'smooth',
        })
        this.$store.commit('SET_SIDEBAR_TAG_LABEL', '')
      }
    },
    jumpToAssignTag(clickLabel){
      this.jumpToTag(clickLabel);
    }
  },
  components: {
    TagCloud,
  },
}
</script>

<style></style>
