<template>
  <div class="header">
    <div class="tags" v-if="tags.length != 0">
      <a v-for="item in tags" :key="item.label" class="tags_label" @click="goToFileing(item.label)">
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
  mounted() {
    let coverData = this.$store.getters.getSidebarCover
    this.titleName = coverData.titleName
    this.subTitleName = coverData.subTitleName
    this.createTime = coverData.createTime
    this.tags = coverData.tags
  },
  watch: {
    '$store.getters.getSidebarCover': function(newV, oldV) {
      this.titleName = newV.titleName
      this.subTitleName = newV.subTitleName
      this.createTime = newV.createTime
      this.tags = newV.tags
    },
  },
  methods: {
    goToFileing(label) {
      this.$store.commit('SET_SIDEBAR_TAG_LABEL', label)
      this.$router.push({ path: '/fileing' })
    },
  },
}
</script>

<style></style>
