<template>
  <div class="container">
    <div class="error">
      <div class="error-left">
        <div class="error-image">
          <img src="/image/error.gif" alt="error" />
        </div>
      </div>
      <div class="error-right">
        <div class="error-title">
          <div class="error-title-label">
            <font>4</font>
          </div>
          <div class="error-title-label">
            <font>0</font>
          </div>
          <div class="error-title-label">
            <font>4</font>
          </div>
        </div>
        <div class="error-subTitle" id="errorSubTitle"></div>
      </div>
    </div>
    <transition name="el-fade-in-linear">
      <recommend-list v-show="showRecommend"></recommend-list>
    </transition>
  </div>
</template>

<script>
import RecommendList from '@/components/body/recommend_list.vue'
export default {
  name: 'Error404',
  data() {
    return {
      paragraphCount: 5,
      speed: 30,
      paragraph: [
        '很抱歉！',
        '当前路由的页面还未建设！',
        '所以只能传送到404页面！',
        '请耐心等待站主adsionli的搭建，学习也是需要一个过程的嘛......',
        '当然，本站主adsionli在这里向正在浏览的您推荐如下文章，希望可以看得开心',
      ],
      showRecommend: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setLabelShow()
    })
  },
  methods: {
    setLabelShow() {
      let count = 1
      let dom = document.querySelector(`#errorSubTitle`)
      for (let value of this.paragraph) {
        for (let i = 0; i < value.length; ++i) {
          if (i == value.length - 1) {
            setTimeout(() => {
              dom.innerHTML += value[i]
              dom.innerHTML += '<br>'
            }, this.speed * count)
          } else {
            setTimeout(() => {
              dom.innerHTML += value[i]
            }, this.speed * count)
          }
          count++
        }
      }
      setTimeout(() => {
        this.showRecommend = true
      }, this.speed * count)
    },
  },
  components: {
    RecommendList,
  },
}
</script>
