<template>
  <div
    v-show="show"
    class="date-picker-list_container"
    :style="{ position: 'absolute', top: top, left: left, zIndex: '2000' }"
  >
    <div class="date-picker-list_warpper">
      <div class="date-picker-list_header">header</div>
      <div class="date-picker-list_body">body</div>
    </div>
    <div class="date-picker-list_arrow"></div>
  </div>
</template>

<script>
export default {
  name: 'DateList',
  mounted() {
    this.settingPosition(this.$parent.$el.getBoundingClientRect())
  },
  props: {
    showDate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: this.showDate,
      top: '0px',
      left: '0px',
    }
  },
  methods: {
    settingPosition(client) {
      this.top = parseInt(client.height + client.top + 10) + 'px'
      this.left = parseInt(client.left) + 'px'
    },
  },
  watch: {
    showDate(nVal, oVal) {
      console.log(this.show)
      this.show = nVal
    },
  },
}
</script>

<style scoped>
.date-picker-list_container {
  color: #606266;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background: #fff;
  border-radius: 4px;
  line-height: 30px;
  margin: 5px 0;
}
.date-picker-list_warpper {
  width: 300px;
}
.date-picker-list_arrow {
  top: -12px;
  left: 35px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent transparent #e4e7ed;
  border-width: 6px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
}
</style>
