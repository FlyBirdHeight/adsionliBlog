<template>
  <div class="tag-cloud">
    <a target="_blank" @click="jumpLabelToFileing(value.label)" v-for="(value, index) in tagList" :key="index">{{
      value.label
    }}</a>
  </div>
</template>

<script>
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
