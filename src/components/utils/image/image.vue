<template>
  <div class="image">
    
    <div class="image-error" v-if="src.length == 0">
      <slot name="error-image" > 
        加载失败
      </slot>
    </div>
    <img :src="src" :alt="alt" :style="{ objectFit: fit }" v-else />
    <template v-if="preview">
      <image-preview :srcList="previewSrcList" :zIndex="z - index" v-show="showViewer"></image-preview>
    </template>
  </div>
</template>

<script>
import ImagePreview from './image-preview'
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    fit: {
      type: String,
      default: 'fill',
    },
    alt: {
      type: String,
      default: 'image',
    },
    preview: {
      type: Boolean,
      default: false,
    },
    'z-index': {
      type: Number,
      default: 2000,
    },
    previewSrcList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.loadImage()
  },
  data() {
    return {
      showViewer: false,
      imageWidth: 0,
      imageHeight: 0,
    }
  },
  methods: {
    //图片加载过程
    loadImage() {
      if(this.$isServer) return;
      this.loading = true;
      this.error = false;
    },
    //图片加载时添加图片样式
    addImageStyle() {},
    //图片加载失败时的回调
    imageLoadError() {},
    //图片被点击时事件
    clickImage() {},
  },
  components: {
    ImagePreview,
  },
}
</script>

<style lang="scss" scoped>
@import './image.scss';
</style>
