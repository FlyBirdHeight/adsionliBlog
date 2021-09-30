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
import TagList from '@/data/tag_list.json'
export default {
  name: 'TagCloud',
  data() {
    return {
      tagList: TagList.tag,
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
