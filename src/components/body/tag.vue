<template>
  <div class="tag-list">
    <el-divider></el-divider>
    <div class="body">
      <h4>标签</h4>
      <div class="list">
        <a target="_blank" v-for="(value, index) in tagList" :key="index" @click="goFileing(value.label)">
          {{ value.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @description Home与Catalogue下的标签栏组件
 */
export default {
  data() {
    return {
      tagList: this.$store.getters.getTagList,
    }
  },
  mounted() {},
  methods: {
    /**
     * @method goFileing 前往归档页
     * @param {String} label 前往归档页携带的参数
     */
    goFileing(label) {
      this.$store.commit('SET_SIDEBAR_TAG_LABEL', label);
      this.$router.push({ path: '/fileing' })
    },
  },
}
</script>

<style></style>
