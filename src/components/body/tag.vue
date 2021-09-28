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
import TagList from '@/data/tag_list.json'
export default {
  data() {
    return {
      tagList: TagList.tag,
    }
  },
  mounted() {},
  methods: {
    /**
     * @method goFileing 前往归档页
     * @param {String} label 前往归档页携带的参数
     */
    goFileing(label) {
      this.$router.push({ path: '/fileing', query: { handle: ['SET_COVER', 'JUMP_TO_APPOINT_HEIGHT'], label: label } })
    },
  },
}
</script>

<style></style>
