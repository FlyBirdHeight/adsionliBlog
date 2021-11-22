<template>
  <div class="date_picker">
    <div class="date_picker-warpper">
      <input
        @keyup="inputDate"
        @focus="openDateWindows"
        @blur="closeDateWindows"
        :placeholder="placeholder"
        type="text"
        class="input-date"
        id="datePicker"
        v-model="dateValue"
      />
      <span class="input-date-icon"><i class="el-icon-date"></i></span>
      <span class="clear-input-date-icon" @click="dateValue = ''"><i class="el-icon-circle-close"></i></span>
    </div>
    <template>
      <date-list :showDate="showDatePickerList"></date-list>
    </template>
  </div>
</template>

<script>
import DateList from './date_list.vue'
export default {
  name: 'DatePicker',
  props: {
    placeholder: {
      type: String,
      default: '请选择日期',
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd',
    },
  },
  data() {
    return {
      dateValue: new Date().format(this.format),
      showDatePickerList: true,
    }
  },
  mounted() {},
  methods: {
    openDateWindows() {
      // this.showDatePickerList = true
    },
    closeDateWindows() {
      // this.showDatePickerList = false
    },
    inputDate(e) {
      console.log(e)
    },
  },
  components: {
    DateList,
  },
}
</script>

<style scoped>
.date_picker {
  width: 220px;
  height: 40px;
  line-height: 40px;
  display: inline-block;
}
.date_picker-warpper {
  position: relative;
}
#datePicker {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  border: 1px solid rgb(220, 220, 222);
  border-radius: 4px;
  line-height: 40px;
  padding: 0 30px 0 30px;
  cursor: pointer;
  outline: none;
}
#datePicker:hover {
  border: 1px solid #909399;
}
#datePicker:focus {
  border: 1px solid #409eff;
}
#datePicker::placeholder {
  color: #a1a1a1;
}
.input-date-icon {
  position: absolute;
  left: 5px;
  top: 1px;
  color: #909399;
}
.clear-input-date-icon {
  position: absolute;
  right: 5px;
  top: 1px;
  color: #909399;
}
</style>
