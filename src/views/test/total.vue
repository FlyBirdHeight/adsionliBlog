<template>
  <div style="margin-top: 100px">
    <el-button-group >
      <el-button @click="goToPath('/test/regular_test')">前往正则测试页</el-button>
      <el-button @click="goToPath('/test/component_test')">前往组件测试页</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  methods: {
    goToPath(path) {
      this.$router.push({ path: path })
    },
  },
}
</script>

<style></style>
