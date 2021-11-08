<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="{ span: 16, offset: 2 }" :lg="{ span: 16, offset: 2 }">
        <page-list />
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6">
        <tag-list />
        <time-line style="width: 300px; height: 600px; overflow-y: scroll">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PageList from '@/components/body/page_list.vue'
import TagList from '@/components/body/tag.vue'
export default {
  name: 'Home',
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
  components: {
    PageList,
    TagList,
  },
}
</script>
