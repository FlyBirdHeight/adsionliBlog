<template>
  <div class="table">
    <table-header class="table-header"></table-header>
    <slot></slot>
    <table-body class="table-body"></table-body>
  </div>
</template>

<script>
import TableStore from './table-store.js'
import TableLayout from './table-layout.js'
import TableColumn from './table-column.js'
import TableHeader from './table-header.js'
import TableBody from './table-body.js'
export default {
  data() {
    const store = new TableStore(this)
    const layout = new TableLayout({
      table: this,
      store: store,
    })
    return {
      store,
      layout,
    }
  },
  mounted() {
    this.store.commit('init')
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      },
    },
    height: [String, Number],
  },
  methods: {},
  components: {
    TableHeader,
    TableBody,
    TableColumn,
  },
}
</script>

<style lang="scss" scoped>
.table {
  text-align: left;
  margin: 20px;
}
table {
  border-spacing: 0px;
  color: #606266;
}
.table-header,
.table-body {
  border: 1px solid #ebeef5;
}
.table-body {
  border-top: none;
  // border-bottom: none;
}
.table-header {
  border-bottom: none;
}
</style>
