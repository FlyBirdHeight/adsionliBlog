export default {
  name: 'TableColumn',
  render(h) {
    return ''
  },
  props: {
    prop: String,
    label: String,
    width: String,
    sortable: Boolean,
    align: {
      type: String,
      default: "center"
    }
  },
  mounted() {
    let store = this.$parent.store
    const option = this.getDefaultColumns({
      prop: this.prop,
      label: this.label,
      width: this.width || '200',
      sortable: this.sortable || false,
      align: this.align || "center"
    })
    store.states.columns.push(option)
  },
  methods: {
    getDefaultColumns(options) {
      const column = {}
      for (let name in options) {
        column[name] = options[name]
      }
      return column
    }
  },
}
