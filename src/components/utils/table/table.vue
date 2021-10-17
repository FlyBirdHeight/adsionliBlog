<template>
  <div class="table" :id="`table${_uid}`">
    <table-header class="table-header"></table-header>
    <slot></slot>
    <table-body class="table-body"></table-body>
    <div :id="`tableResize${_uid}`"  v-show="store.resize.showResizeLine" class="resize-table-column-width"></div>
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
    this.store.tablePositionLeft = document.querySelector(`#table${this._uid}`).getBoundingClientRect().left;
    this.store.resize.resizeLine = document.querySelector(`#tableResize${this._uid}`);
    console.log(this.store.resize.resizeLine.getBoundingClientRect())
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
  margin: 20px;
  position: relative;
  .resize-table-column-width {
    position: absolute;
    left: 200px;
    top: 0;
    bottom: 0;
    width: 0;
    border-left: 1px solid #ebeef5;
    z-index: 10;
  }
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
