<template>
  <div class="page">
    <el-divider>image组件测试</el-divider>
    <image-data :src="src">
    </image-data>
  </div>
</template>

<script>
import ImageData from '@/components/utils/image/image.vue'
export default {
  data() {
    return {
      src: './globe.png'
    }
  },
  mounted() {

  },
  methods: {

  },
  components: {
    ImageData,
  },
}
</script>

<style></style>
