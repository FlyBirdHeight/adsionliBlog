<template>
  <div class="page">
    <el-divider>image组件测试</el-divider>
    <!-- <image-data :preview="true" :previewSrcList="imageList" :fit="fit" id="imageData01" :src="src"> </image-data> -->
    <el-button @click="changeImage">切换图片</el-button>
  </div>
</template>

<script>
import ImageData from '@/components/utils/image/image.vue'
export default {
  data() {
    return {
      src: './globe.png',
      imageList: ['./globe.png', '', './image/dog/dog01.gif', './image/dog/dog02.gif', './image/dog/dog03.gif', './image/dog/dog04.jpeg'],
      imageIndex: 0,
      fitList: [
        'cover',
        'contain',
        'none',
        'fill',
        'scale-down',
        'cover'
      ],
      fit: 'cover'
    }
  },
  mounted() {
    this.src = this.imageList[this.imageIndex]
  },
  methods: {
    changeImage() {
      if (this.imageIndex === this.imageList.length - 1) {
        this.src = this.imageList[0]
        this.imageIndex = 0
        this.fit = this.fitList[0]
      } else {
        this.imageIndex += 1
        this.src = this.imageList[this.imageIndex]
        this.fit = this.fitList[this.imageIndex]
      }
    },
  },
  components: {
    ImageData,
  },
}
</script>

<style></style>
