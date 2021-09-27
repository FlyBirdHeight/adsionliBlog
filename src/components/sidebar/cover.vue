<template>
  <div class="header">
    <div class="tags" v-if="tags.length != 0">
      <a v-for="item in tags" :key="item.label" class="tags_label">
        <span>{{ item.label }}</span>
      </a>
    </div>
    <h1 v-if="titleName != ''">{{ titleName }}</h1>
    <span class="subTitle" v-if="subTitleName != ''">{{ subTitleName }}</span>
    <span class="createTime" v-if="createTime != ''">{{ createTime }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleName: '',
      subTitleName: '',
      createTime: '',
      tags: [],
    }
  },
  watch: {
    '$store.getters.getSidebarCover': function(newV, oldV) {
      this.titleName = newV.titleName
      this.subTitleName = newV.subTitleName
      this.createTime = newV.createTime
      this.tags = newV.tags
    },
  },
}
</script>

<style></style>
