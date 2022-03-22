<template>
  <div
    v-show="show"
    class="date-picker-list_container"
    :style="{ position: 'absolute', top: top, left: left, zIndex: '2000' }"
  >
    <div class="date-picker-list_warpper">
      <div class="date-picker-list_header">
        <button class="date-picker-list_pre" @click.stop="changeDate('pre')">
          <i class="el-icon-d-arrow-left"></i>
        </button>
        <span class="date-picker-list_year">{{ year }}年</span>
        <span class="date-picker-list_month">{{ month }}月</span>
        <button class="date-picker-list_next" @click.stop="changeDate('next')">
          <i class="el-icon-d-arrow-right"></i>
        </button>
      </div>
      <div class="date-picker-list_body">
        <div class="date-picker-list_date">
          <span class="date-picker-list_week_content" v-for="(value, key) in columeShow" :key="key">{{ value }}</span>
        </div>
        <div class="date-picker-list_month_date">
          <div
            class="date-picker-list_day_content"
            :style="{
              color: value.disabled
                ? '#c0c4cc'
                : value.day == checked.day && value.month == checked.month
                ? '#fff'
                : value.color,
              cursor: value.disabled ? 'not-allowed' : 'pointer',
            }"
            v-for="(value, key) in dateList"
            :key="key"
            @click="checkedDate(value)"
          >
            <div
              :style="{ backgroundColor: value.disabled ? '#f5f7fa' : '' }"
              :class="
                value.day == checked.day && value.month == checked.month ? 'date-picker-list_day_content_checked' : ''
              "
            >
              {{ value.day }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="date-picker-list_arrow"></div>
  </div>
</template>

<script>
export default {
  name: 'DateList',
  mounted() {
    this.settingPosition(this.$parent.$el.getBoundingClientRect())
    this.$nextTick(() => {
      ;[this.year, this.month, this.day] = this.date.split('-')
      this.checked.year = this.year
      this.checked.month = this.month
      this.checked.day = this.day
      this.getMonthDate()
    })
  },
  props: {
    showDate: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    date: {
      type: String,
      default: new Date().format('yyyy-MM-dd'),
    },
    pickerOptions: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      show: this.showDate,
      top: '0px',
      left: '0px',
      year: '',
      month: '',
      day: '',
      checked: {
        year: '',
        month: '',
        day: '',
      },
      columeShow: ['日', '一', '二', '三', '四', '五', '六'],
      dateColume: 7,
      dateLine: 6,
      dateList: [],
    }
  },
  methods: {
    getMonthDate() {
      //计算当前月的时间跨度及开始周；前置、后置月填充数量。
      let date = new Date(this.year, Number(this.month), 0)
      let firstDate = new Date(this.year, Number(this.month) - 1, 1)
      let len = date.getDate()
      let startDay = firstDate.getDay()
      let endDay = this.dateColume * this.dateLine - len - startDay
      let preNum = startDay
      let preMonthDate = new Date(this.year, Number(this.month) - 1, 0).getDate()
      let lastMonthDate = 1
      let preMonth = Number(this.month) - 1
      let lastMonth = Number(this.month) + 1
      for (let i = preMonthDate - preNum + 1; i < preMonthDate + 1; i++) {
        this.dateList.push({
          day: i,
          month: preMonth,
          year: Number(this.year),
          color: '#c0c4cc',
          disabled: false,
        })
      }
      for (let i = 1; i < len + 1; i++) {
        this.dateList.push({
          day: i,
          month: Number(this.month),
          year: Number(this.year),
          color: '#606266',
          disabled: false,
        })
      }
      for (let i = lastMonthDate; i < endDay + 1; i++) {
        this.dateList.push({
          day: i,
          month: lastMonth,
          year: Number(this.year),
          color: '#c0c4cc',
          disabled: false,
        })
      }
      this.filterDate()
    },
    filterDate() {
      if (this.pickerOptions.hasOwnProperty('disabledDate')) {
        for (let value of this.dateList) {
          value.disabled = !this.pickerOptions.disabledDate(new Date(value.year, value.month - 1, value.day))
        }
      }
    },
    settingPosition(client) {
      this.top = parseInt(client.height + client.top + 10) + 'px'
      this.left = parseInt(client.left) + 'px'
    },
    changeDate(type) {
      if (this.pickerOptions.hasOwnProperty('dateRange')) {
        let len = this.pickerOptions.dateRange.length
        if (len == 0) {
          return
        }
        let index = this.pickerOptions.dateRange.indexOf(
          new Date(this.year, this.month - 1, this.day).format('yyyyMMdd')
        )
        switch (type) {
          case 'pre':
            if (index > 0) {
              index--
              let date = this.pickerOptions.dateRange[index]
              this.year = Number(date.substr(0, 4))
              this.month = Number(date.substr(4, 2))
              this.day = Number(date.substr(6, 2))
              this.dateList = []
              this.getMonthDate()
            }
            break
          case 'next':
            if (index < len - 1) {
              index++
              let date = this.pickerOptions.dateRange[index]
              this.year = Number(date.substr(0, 4))
              this.month = Number(date.substr(4, 2))
              this.day = Number(date.substr(6, 2))
              this.dateList = []
              this.getMonthDate()
            }
            break
        }
      } else {
        switch (type) {
          case 'pre':
            console.log(234)
            break
          case 'next':
            break
        }
      }
    },
    checkedDate(value) {
      if (value.disabled) {
        return
      }
      let res
      if (this.month != value.month) {
        ;[this.checked.year, this.checked.month, this.checked.day] = [
          Number(value.year),
          Number(value.month),
          Number(value.day),
        ]
        this.dateList = []
        this.getMonthDate()
      } else {
        ;[this.checked.year, this.checked.month, this.checked.day] = [
          Number(value.year),
          Number(value.month),
          Number(value.day),
        ]
      }
      this.$emit(
        'dateChange',
        new Date(this.checked.year, this.checked.month - 1, this.checked.day).format(this.format)
      )
    },
  },
  watch: {
    showDate(nVal, oVal) {
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
.date-picker-list_header {
  text-align: center;
  margin: 12px;
}
.date-picker-list_header .date-picker-list_pre {
  float: left;
  font-size: 12px;
  color: #303133;
  border: 0;
  background: transparent;
  cursor: pointer;
  outline: none;
  margin-top: 8px;
  vertical-align: baseline;
  text-transform: none;
}
.date-picker-list_header .date-picker-list_year {
  font-size: 16px;
  font-weight: 500;
  padding: 0 5px;
  line-height: 22px;
  text-align: center;
  color: #606266;
}
.date-picker-list_header .date-picker-list_month {
  font-size: 16px;
  font-weight: 500;
  padding: 0 5px;
  line-height: 22px;
  text-align: center;
  color: #606266;
}
.date-picker-list_header .date-picker-list_next {
  float: right;
  font-size: 12px;
  color: #303133;
  border: 0;
  background: transparent;
  cursor: pointer;
  outline: none;
  margin-top: 8px;
  vertical-align: baseline;
  text-transform: none;
}
.date-picker-list_body {
  margin: 0 10px;
}
.date-picker-list_body .date-picker-list_date {
  display: flex;
  align-items: center;
  vertical-align: baseline;
  justify-content: center;
  border-bottom: 1px solid #ebeef5;
}
.date-picker-list_body .date-picker-list_week_content {
  font-size: 14px;
  font-weight: 400;
  padding: 5px;
  color: #606266;
  width: 30px;
}
.date-picker-list_body .date-picker-list_day_content {
  font-size: 12px;
  font-weight: 400;
  padding: 5px;
  width: 30px;
}
.date-picker-list_body .date-picker-list_day_content .date-picker-list_day_content_checked {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #409eff;
}
.date-picker-list_body .date-picker-list_month_date {
  margin-top: 10px;
  display: flex;
  flex-flow: wrap;
  align-items: center;
  vertical-align: baseline;
  justify-content: center;
}
</style>
