<template>
  <div class="tree-list">
    <div class="no-data" v-if="data.length == 0">{{ emptyText }}</div>
    <tree-node :canExpand="false" v-else v-for="node in data" :node="node" :key="node.index"></tree-node>
  </div>
</template>

<script>
import HandleTree from './handle.js'
import TreeNode from './tree_node.vue'

export default {
  name: 'TreeList',
  data() {
    const handle = new HandleTree(this)
    return {
      handle,
      handleHtml: '',
      emptyText: '暂无数据',
      isTree: true,
    }
  },
  created() {
    if (this.$attrs.hasOwnProperty('accordion')) {
      this.handle.accordion = true
    }
    if (this.$attrs.hasOwnProperty('highlight-current')) {
      this.handle.highlight = true
    }
    if (this.$attrs.hasOwnProperty('default-expand-all')) {
      this.handle.expandAll = true
    }
    this.handle.commit('handleTreeData', this.data)
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  methods: {},
  components: {
    TreeNode,
  },
}
</script>

<style lang="scss" scoped>
@import './tree.scss';
</style>
