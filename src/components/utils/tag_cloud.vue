<template>
  <div class="tag-cloud">
    <a target="_blank" @click="jumpLabelToFileing(value.label)" v-for="(value, index) in tagList" :key="index">{{
      value.label
    }}</a>
  </div>
</template>

<script>
/**
 * @description fileing页面下的标签云组件
 */
export default {
  name: 'TagCloud',
  data() {
    return {
      tagList: this.$store.getters.getTagList,
    }
  },
  methods: {
    jumpLabelToFileing(label) {
      this.$emit('jumpToAssignTag', label)
    },
  },
}
</script>

<style></style>
