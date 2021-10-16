const TableStore = function (table, initialState) {
    if (!table) {
        throw new Error('Table is required')
    }
    this.table = table
    this.states = {
        columns: []
    }
    this.tableWidth = 540
    this.syncLeft = 0
    this.theaderUid = undefined;
    this.tbodyUid = undefined;
}
TableStore.prototype.mutations = {
    handleRowClick(row) {
        this.table.$emit('row-click', row)
    },
    handleHoverEvent(row) {
        this.table.$emit('row-hover', row)
    },
    init() {
        // console.log()
        var rows = document.querySelector(`#table-body${this.tbodyUid}`).children[0].rows
        for (let i = 0; i < rows.length; i++) {
            rows[i].onmouseover = () => {
                rows[i].style.background = 'rgba(255, 99, 132, 0.2)'
            }
            rows[i].onmouseout = () => {
                rows[i].style.background = 'white'
            }
        }
    }
}
TableStore.prototype.commit = function (name, ...args) {
    const mutations = this.mutations
    if (mutations[name]) {
        mutations[name].apply(this, args)
    } else {
        throw new Error(`Action not found ${name}`)
    }
}
export default TableStore
