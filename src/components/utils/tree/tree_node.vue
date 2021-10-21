<template>
  <div class="tree-node" :ref="`treeNode${node.index}`">
    <div
      :style="{ paddingLeft: (node.level - 1) * padding + 'px' }"
      class="tree-node-content"
      @click.stop="expandNode(node.index)"
    >
      <span
        :class="{ expanded: isExpanded, 'tree-node-icon_is_leaf': isLeaf }"
        class="tree-node_icon  el-icon-caret-right"
      ></span>
      <span class="tree-nodel_label">{{ node.label }}</span>
    </div>
    <div
      class="tree-node-content_children"
      v-if="typeof node.leave != 'undefined' || node.leave.length != 0"
      v-show="node.expanded"
      :ref="`treeNodeChild${node.index}`"
    >
      <tree-node v-for="child in node.leave" :key="child.index" :node="child"></tree-node>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',
  props: {
    node: {
      default() {
        return {
          expanded: true,
        }
      },
    },
  },
  data() {
    return {
      isExpanded: true,
      padding: 18,
      isLeaf: false,
      show: true,
      tree: null,
      flyHigh: undefined
    }
  },
  created() {
    const parent = this.$parent
    if (this.node.leave.length == 0) {
      this.isLeaf = true
    }
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }

    const tree = this.tree
    if (!tree) {
      console.warn("Can not find node's tree.")
    }
  },
  methods: {
    expandNode(index) {
      this.isExpanded = !this.isExpanded
      if (!this.isLeaf) {
        this.node.expanded = !this.node.expanded
        if(!this.node.expanded){
            this.$refs[`treeNodeChild${this.node.index}`].style.transition = "transform 0.5s ease-in-out"
            this.$refs[`treeNodeChild${this.node.index}`].style.transform = `translateY(-${this.$el.clientHeight - 24}px)`
        }
      }
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
@import './tree.scss';
</style>
