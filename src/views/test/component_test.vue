<template>
  <div class="page">
    <table-list :height="200" :dataList="tableListValue" style="width:90%">
      <table-column prop="name" label="名称" width="180"></table-column>
      <table-column prop="province" label="省份" width="180"></table-column>
      <table-column prop="city" label="区县" width="180"></table-column>
      <table-column prop="zip" label="邮编"></table-column>
    </table-list>
    <el-divider></el-divider>

    <el-table :border="true" :data="tableListValue" style="width: 80%;margin:20px;" :row-class-name="tableRowClassName">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="zip" label="地址"> </el-table-column>
    </el-table>
    <el-divider>测试树状结构</el-divider>

    <tree-list :data="treeData" highlight-current default-expand-all></tree-list>
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
      treeData: [
        {
          startIndex: 0,
          label: '1. 代码构建',
          level: 1,
          leave: [
            {
              startIndex: 18,
              label: '1.1 测试 `table`',
              level: 2,
              root: 0,
              leave: [
                {
                  startIndex: 24,
                  label: '1.1.1 测试==特殊字符==匹配',
                  level: 3,
                  root: 18,
                  leave: [],
                },
              ],
            },
            {
              startIndex: 28,
              label: '1.2 测试2级标题2',
              level: 2,
              root: 0,
              leave: [
                {
                  startIndex: 30,
                  label: '1.2.1 测试3级标题1',
                  level: 3,
                  root: 28,
                  leave: [
                    {
                      startIndex: 32,
                      label: '1.2.1.1 测试4级标题1',
                      level: 4,
                      root: 30,
                      leave: [
                        {
                          startIndex: 34,
                          label: '1.2.1.1.1.1 测试6级标题1',
                          level: 6,
                          root: 32,
                          leave: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              startIndex: 36,
              label: '1.3 测试2级标题3',
              level: 2,
              root: 0,
              leave: [],
            },
          ],
        },
        {
          startIndex: 38,
          label: '2. 匹配内容的记录',
          level: 1,
          leave: [
            {
              startIndex: 40,
              label: '2.1 特殊字符匹配',
              level: 2,
              root: 38,
              leave: [],
            },
            {
              startIndex: 55,
              label: '2.2 表格匹配',
              level: 2,
              root: 38,
              leave: [],
            },
            {
              startIndex: 66,
              label: '2.3 代码匹配（含普通注释及多行注释匹配）',
              level: 2,
              root: 38,
              leave: [],
            },
            {
              startIndex: 88,
              label: '2.4 标题匹配',
              level: 2,
              root: 38,
              leave: [
                {
                  startIndex: 89,
                  label: '2.4.1 普通标题匹配',
                  level: 3,
                  root: 88,
                  leave: [],
                },
                {
                  startIndex: 93,
                  label: '2.4.2 多级标题的构建',
                  level: 3,
                  root: 88,
                  leave: [],
                },
              ],
            },
          ],
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
  },
}
</script>

<style></style>
