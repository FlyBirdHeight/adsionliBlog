<template>
  <div class="page">
    <el-divider>date-picker组件测试</el-divider>
    <date-picker :picker-options="getPickOptions" :default-date="timeList[0]"></date-picker>
    <el-divider style="margin-top;100px">时间轴组件测试</el-divider>
    <!-- <time-line style="width: 300px; height: 600px; overflow-y: scroll">
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
    </time-line> -->
    <el-divider style="margin-top;100px">image组件测试</el-divider>
    <!-- <image-data :preview="true" :previewSrcList="imageList" :fit="fit" id="imageData01" :src="src"> </image-data>
    <el-button @click="changeImage">切换图片</el-button> -->
  </div>
</template>

<script>
import ImageData from '@/components/utils/image/image.vue'
import DatePicker from '@/components/utils/form/date_picker/date_picker.vue'
export default {
  data() {
    return {
      src: './globe.png',
      imageList: [
        './globe.png',
        './image/dog/dog01.gif',
        './image/dog/dog02.gif',
        './image/dog/dog03.gif',
        './image/dog/dog04.jpeg',
      ],
      imageIndex: 0,
      fitList: ['cover', 'contain', 'none', 'fill', 'scale-down', 'cover'],
      fit: 'cover',
      timelineList: [],
      timeList: ['20190808', '20210918'],
      getPickOptions: {
        disabledDate(time) {
          let flag = false
          let checkedList = this.dateRange
          for (let value of checkedList) {
            let date = new Date(
              Number(value.substr(0, 4)),
              Number(value.substr(4, 2)) - 1,
              Number(value.substr(6, 2))
            )
            if (time.getTime() == date.getTime()) {
              flag = true
              break
            }
          }
          return flag
        },
        dateRange: [],
      },
    }
  },
  created() {
    this.getPickOptions.dateRange = this.timeList
  },
  mounted() {
    this.src = this.imageList[this.imageIndex]
    this.axios
      .get('./config/blog-timeline.json')
      .then((res) => {
        this.timelineList = res.data.timeline
      })
      .catch((error) => {
        console.log(error)
      })
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
    DatePicker,
  },
}
</script>

<style></style>
