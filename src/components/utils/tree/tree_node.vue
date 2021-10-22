<template>
  <div class="tree-node" :ref="`treeNode${node.index}`">
    <div
      :style="{ paddingLeft: (node.level - 1) * padding + 'px' }"
      class="tree-node-content"
      @click.stop="handleNode()"
    >
      <a style="padding:5px" @click.stop="goSpecified()" target="_blank" @click="goSpecified" v-if="flyHeight">#</a>
      <span
        @click.stop="expandNode()"
        v-show="canExpand"
        :class="{ expanded: isExpanded, 'tree-node-icon_is_leaf': isLeaf }"
        class="tree-node_icon  el-icon-caret-right"
      ></span>
      <span class="tree-node_label">{{ node.label }}</span>
    </div>
    <collapse>
      <div
        class="tree-node-content_children"
        v-if="typeof node.leave != 'undefined' || node.leave.length != 0"
        v-show="node.expanded"
        :ref="`treeNodeChild${node.index}`"
      >
        <tree-node
          :canExpand="canExpand"
          :canFlyHeight="canFlyHeight"
          v-for="child in node.leave"
          :key="child.index"
          :node="child"
        ></tree-node>
      </div>
    </collapse>
  </div>
</template>

<script>
import Collapse from '@/components/utils/translate/collapse.js'
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
    canExpand: {
      type: Boolean,
      default: true,
    },
    canFlyHeight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isExpanded: true,
      padding: 18,
      isLeaf: false,
      tree: null,
      flyHeight: null,
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
  mounted() {
    this.$nextTick(() => {
      this.flyHeight = this.node.height
    })
  },
  methods: {
    handleNode() {
      if (this.canExpand) {
        this.expandNode()
      }
      if (this.canFlyHeight) {
        this.goSpecified()
      }
    },
    expandNode() {
      this.isExpanded = !this.isExpanded
      if (this.canExpand && !this.isLeaf) {
        console.log(this.node.expanded)
        this.node.expanded = !this.node.expanded
      }
    },
    goSpecified() {
      if (this.canFlyHeight && this.flyHeight) {
        console.log(this.flyHeight)
      }
    },
  },
  watch: {
    'node.height'(val) {
      console.log(val)
    }
  },
  components: {
    Collapse,
  },
}
</script>

<style lang="scss" scoped>
@import './tree.scss';
</style>
