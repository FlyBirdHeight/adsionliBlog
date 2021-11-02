<template>
  <div class="image-preview" :style="{ zIndex: zIndex }">
    <div class="image-preview-board" @click="closePreview"></div>
    <span style="z-index: 1" @click="closePreview" class="image-preview-btn image-preview-close"
      ><i class="iconfont icon-close"></i
    ></span>
    <span style="z-index: 1" @click="next" class="image-preview-btn image-preview-next"
      ><i class="el-icon-right"></i
    ></span>
    <span style="z-index: 1" @click="pre" class="image-preview-btn image-preview-pre"
      ><i class="el-icon-back"></i
    ></span>
    <div class="image-preview-btn image-preview-btn-group" style="z-index: 1">
      <div class="image-preview-bottom-btn">
        <i style="cursor: pointer" class="el-icon-zoom-in" @click="zoomIn"></i>
        <i style="cursor: pointer" class="el-icon-zoom-out" @click="zoomOut"></i>
        <i
          style="cursor: pointer"
          :class="aspectSetting ? 'el-icon-c-scale-to-original' : 'el-icon-full-screen'"
          @click="setAspect"
        ></i>
        <i style="cursor: pointer" class="el-icon-refresh-left" @click="rotateLeft"></i>
        <i style="cursor: pointer" class="el-icon-refresh-right" @click="rotateRight"></i>
      </div>
    </div>
    <div class="image-preview-main-body">
      <img
        @load="imageLoad"
        @error="imageLoadError"
        :style="getMainBodyImageStyle()"
        :src="currentImage"
        alt="imageList"
      />
    </div>
  </div>
</template>

<script>
import { on, off } from '@/funcs/utils/dom.js'
export default {
  name: 'ImagePreview',
  props: {
    srcList: {
      type: Array,
      default: () => [],
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
  },
  data() {
    return {
      loading: true,
      lastShowIndex: 0,
      aspectSetting: false,
      currentImage: '',
      rotateStep: 90,
      scaleStep: 0.2,
      keyDownEvent: null,
      transform: {
        rotate: 0,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
    }
  },
  mounted() {
    this.getImage()
    this.supportInput()
  },
  computed: {
    imageStyle() {
      return this.getMainBodyImageStyle()
    },
  },
  methods: {
    supportInput() {
      this.keyDownEvent = (e) => {
        e.stopPropagation()
        switch (e.keyCode) {
          //方向键左键
          case 37:
            this.pre()
            break
          //方向键上键
          case 38:
            this.zoomIn()
            break
          //方向键右键
          case 39:
            this.next()
            break
          //方向键下键
          case 40:
            this.zoomOut()
            break
          case 27:
            this.closePreview()
            break
          default:
            break
        }
      }
      on(this.$isServer)(document, 'keydown', this.keyDownEvent)
    },
    /**
     * @method imageLoad 图片加载完成的回调
     */
    imageLoad(e) {
      this.loading = false
      this.resetTransfrom()
    },
    /**
     * @method imageLoadError 图片加载失败的回调
     */
    imageLoadError(e) {
      this.loading = false
      this.resetTransfrom()
      e.target.alt = '加载失败'
    },
    /**
     * @method getMainBodyImageStyle 获取展示图片的Style
     */
    getMainBodyImageStyle() {
      let rotate = this.transform.rotate
      let scale = this.transform.scale
      return {
        'max-width': '100%',
        'max-height': '100%',
        margin: 0,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        transition: this.transform.enableTransition ? 'transform 0.3s ease 0s' : '',
      }
    },
    /**
     * @method closePreview 关闭预览页面
     */
    closePreview() {
      off(this.$isServer)(document, 'keydown', this.keyDownEvent)
      this.$emit('closePreview')
    },
    /**
     * @method next 前往下一张图片
     */
    next() {
      if (this.lastShowIndex == this.srcList.length - 1) {
        this.lastShowIndex = 0
        this.getImage()
      } else {
        this.lastShowIndex++
        this.getImage()
      }
    },
    /**
     * @method next 前往上一张图片
     */
    pre() {
      if (this.lastShowIndex == 0) {
        this.lastShowIndex = this.srcList.length - 1
        this.getImage()
      } else {
        this.lastShowIndex--
        this.getImage()
      }
    },
    /**
     * @method zoomOut 图片缩小
     */
    zoomOut() {
      if (this.transform.scale < 0.3) {
        return
      }
      this.transform.enableTransition = true
      this.transform.scale = parseFloat((this.transform.scale - this.scaleStep).toFixed(3))
    },
    /**
     * @method zoomIn 图片放大
     */
    zoomIn() {
      this.transform.enableTransition = true
      this.transform.scale = parseFloat((this.transform.scale + this.scaleStep).toFixed(3))
    },
    /**
     * @method setAspect 修改图片分辨率：一种是宽高1:1，一种是实际大小
     */
    setAspect() {
      this.aspectSetting = !this.aspectSetting
    },
    /**
     * @method setAspect 图片左旋
     */
    rotateLeft() {
      this.transform.rotate -= this.rotateStep
      this.transform.enableTransition = true
    },
    /**
     * @method setAspect 图片右旋
     */
    rotateRight() {
      this.transform.rotate += this.rotateStep
      this.transform.enableTransition = true
    },
    getImage() {
      if (this.srcList.length == 0) {
        return
      }
      this.currentImage = this.srcList[this.lastShowIndex]
    },
    /**
     * @method resetTransfrom 重置transfrom数据
     */
    resetTransfrom() {
      this.transform = {
        rotate: 0,
        scale: 1.0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './image.scss';
</style>
