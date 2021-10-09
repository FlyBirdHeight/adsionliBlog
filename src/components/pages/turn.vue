<template>
  <div class="turn-page">
    <a class="pre" @click="goPre">
      <div class="preT">上一篇</div>
      <div class="preInfo">
        {{ typeof pre == 'undefined' ? '已到最前一篇！' : $store.getters.getPageList[pre].title }}
      </div>
    </a>

    <a class="next" @click="goBack">
      <div class="nextT">下一篇</div>
      <div class="nextInfo">
        {{ typeof next == 'undefined' ? '已到最后一篇！' : $store.getters.getPageList[next].title }}
      </div>
    </a>
  </div>
</template>

<script>
/**
 * @description 分页按钮
 */
export default {
  data() {
    return {
      pre: this.$store.getters.getPrePage,
      next: this.$store.getters.getNextPage,
    }
  },
  mounted() {
    // this.$store.commit('', );
  },
  methods: {
    goPre() {
      if (typeof this.pre == 'undefined') {
        this.$message({
          type: 'warning',
          message: '已经是第一篇啦，无法跳转啦',
        })
      }else {
        this.$router.push({ path: this.$store.getters.getPageList[this.pre].routeLink })
      }
    },
    goBack() {
      if (typeof this.next == 'undefined') {
        this.$message({
          type: 'warning',
          message: '已经是最后一篇啦，无法跳转啦',
        })
      }else {
        this.$router.push({ path: this.$store.getters.getPageList[this.next].routeLink })
      }
    },
  },
  watch: {
    '$store.getters.getPrePage': function(newV, oldV) {
      if(newV != this.pre){
        this.pre = newV;
      }
    },
    '$store.getters.getNextPage': function(newV, oldV) {
      if(newV != this.next){ 
        this.next = newV;
      }
    }
  },
}
</script>

<style lang="scss">
.turn-page {
  @include marginSet(10px 0 20px 0);
  @include paddingSet(auto);
  width: 100%;
  height: 100px;
  text-align: center;

  .pre {
    display: inline-block;
    border: 1px solid #a3a3a3;
    width: 45%;
    @include marginSet(0 1%);
    line-height: 40px;
    color: #000;
    .preT {
      margin-top: 10px;
      @media screen and (min-width: 750px) {
        font-size: 20px;
      }
      @media screen and (max-width: 750px) {
        font-size: 16px;
      }
      font-weight: 700;
    }
    .preInfo {
      color: #a3a3a3;
      @media screen and (min-width: 750px) {
        font-size: 14px;
      }
      @media screen and (max-width: 750px) {
        font-size: 13px;
      }
      letter-spacing: 0.5px;
      font-weight: 600;
    }
  }
  .pre:hover {
    background-color: #409eff;
    color: #f1f2f3;
    .preInfo {
      color: #f1f2f3;
    }
  }

  .next {
    border: 1px solid #a3a3a3;
    width: 45%;
    display: inline-block;
    line-height: 40px;
    color: #000;
    .nextT {
      margin-top: 10px;
      @media screen and (min-width: 750px) {
        font-size: 20px;
      }
      @media screen and (max-width: 750px) {
        font-size: 16px;
      }
      font-weight: 700;
    }
    .nextInfo {
      color: #a3a3a3;
      @media screen and (min-width: 750px) {
        font-size: 14px;
      }
      @media screen and (max-width: 750px) {
        font-size: 13px;
      }
      
      letter-spacing: 0.5px;
      font-weight: 600;
    }
  }
  .next:hover {
    background-color: #409eff;
    color: #f1f2f3;
    .nextInfo {
      color: #f1f2f3;
    }
  }
}
</style>
