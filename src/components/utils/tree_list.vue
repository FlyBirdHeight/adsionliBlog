<template>
  <div class="mt-10 mb-10" v-if="treeData.length != 0">
    <el-tree :data="treeData" :props="structure"></el-tree>
  </div>
</template>

<script>
/**
 * @description 基于elementui的目录树组件
 */
export default {
  props: {
    treeData: {
      type: Array,
      default: [],
    },
    structure: {
      type: Object,
      default: {
        children: 'children',
        label: 'label',
      },
    },
  },
}
</script>

<style></style>
