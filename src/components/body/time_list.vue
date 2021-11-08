<template>
  <div class="time_list">
    <el-divider></el-divider>
    <h4 class="time_list-title">建站历史</h4>
    <time-line class="time_list-timeline">
      <time-line-item
        v-for="(value, index) in timelineList"
        :key="index"
        :size="value.size"
        :timestamp="value.timestamp"
        :icon="value.icon"
        :color="value.color"
        :hideTimestamp="value.hideTimestamp"
      >
        {{ value.content }}
      </time-line-item>
    </time-line>
  </div>
</template>

<script>
export default {
  mounted() {
    this.axios
      .get('./config/blog-timeline.json')
      .then((res) => {
        this.timelineList = res.data.timeline
      })
      .catch((error) => {
        console.log(error)
      })
  },
  data() {
    return {
      timelineList: [],
    }
  },
}
</script>

<style lang="scss" scoped>
.time_list {
  text-align: left;
  .time_list-title {
    font-weight: 800;
    color: #a3a3a3;
  }
  .time_list-timeline {
    width: 100%;
    @media screen and (max-width: 760px) {
      height: 350px;
    }
    @media screen and (min-width: 992px) {
      height: 450px;
    }
    @media screen and (min-width: 1200px) {
      height: 550px;
    }
    @include overflow('y');
    margin-bottom: 20px;
  }
}
</style>
