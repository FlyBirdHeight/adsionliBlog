<template>
  <el-button-group>
    <el-button type="primary" @click="goPre()" icon="el-icon-arrow-left">上一篇</el-button>
    <el-button type="primary" @click="goBack()">下一篇<i class="el-icon-arrow-right el-icon--right"></i></el-button>
  </el-button-group>
</template>

<script>
/**
 * @description 分页按钮
 */
export default {
  props: {
    pre: {
      type: String,
      default: '',
    },
    back: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      
    }
  },
  mounted() {
    
  },
  methods: {
    goPre() {
      if (!this.pre) {
        this.$message({
          type: 'warning',
          message: '已经是第一页啦，无法跳转啦',
        })
      }
    },
    goBack() {
      if (!this.back) {
        this.$message({
          type: 'warning',
          message: '已经是最后一页啦，无法跳转啦',
        })
      }
    },
  },
  watch: {
    
  }
}
</script>

<style></style>
