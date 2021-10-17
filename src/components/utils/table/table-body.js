import './table-body.scss'

export default {
  name: 'TableBody',
  render() {
    const columns = this.$parent.store.states.columns
    let options = []
    columns.map(function (column) {
      options.push(column['prop'])
    })
    const dataSource = this.$parent.dataList
    const width = this.$parent.store.tableWidth;
    const uId = this.$parent._uid;
    return (
      <div class="table_body-wrapper" ref={`table-body${this._uid}`} id={`table-body${this._uid}`}>
        <table cellspacing="0" cellpadding="0" border="0" style={'width:' + width + 'px'}>
          <colgroup>
            {
              this._l(columns, (column, index) =>
                <col name={'tb-'+ uId +'-col-column-' + (index)} width={column.width ? column.width : ''} />
              )
            }
          </colgroup>
          <tbody>
            {
              dataSource.length > 0
                ? this._l(dataSource, item =>
                  <tr on-click={() => this.clickTr(item)}
                    on-mouseover={() => this.handleHoverEvent(item)} >
                    {
                      this._l(options, (option, index) =>
                        <td class={`tdStyle ${'td-column-' + (index)}`}>{item[option]}</td>
                      )
                    }
                  </tr>
                ) : <tr>{this.$parent.emptyText}</tr>
            }
          </tbody>
        </table>
      </div>
    )
  },
  mounted() {
    this.$parent.store.tbodyUid = this._uid;
    document.querySelector(`#table-body${this._uid}`).addEventListener('scroll', (e) => {
      let offsetLeft = e.target.scrollLeft;
      this.$parent.store.syncLeft = offsetLeft;

    })
  },
  methods: {
    clickTr(items) {
      this.$parent.store.commit('handleRowClick', items)
    },
    handleHoverEvent(row) {
      this.$parent.store.commit('handleHoverEvent', row)
    }
  }
}
