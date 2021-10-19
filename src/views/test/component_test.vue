<template>
  <div class="page">
    <table-list :height="200" :dataList="tableListValue" style="width:90%">
      <table-column prop="name" label="名称" width="180"></table-column>
      <table-column prop="province" label="省份" width="180"></table-column>
      <table-column prop="city" label="区县" width="180"></table-column>
      <table-column prop="zip" label="邮编"></table-column>
    </table-list>
    <el-divider></el-divider>

    <el-table max-height="100" :border="true" :data="tableListValue" style="width: 80%;margin:20px;" :row-class-name="tableRowClassName">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="zip" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableListValue: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
          tag: '公司',
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
          tag: '公司',
        },
      ],
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
  }
}
</script>

<style></style>
