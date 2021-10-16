import './table-header.scss'

export default {
  name: 'TableHeader',
  render() {
    const columns = this.$parent.store.states.columns
    const width = this.$parent.store.tableWidth;
    return (
      <div ref="tableHeader" ref={`table-header${this._uid}`} id={`table-header${this._uid}`} class="table_header-column">
        <table class='tableStyle' cellspacing="0" cellpadding="0" border="0" style={'width:' + width + 'px'}>
          <colgroup>
            {
              this._l(columns, column =>
                <col width={column.width ? column.width : ''} />
              )
            }
          </colgroup>
          <thead>
            <tr class='theadStyle'>
              {
                this._l(columns, column =>
                  <th class={'theadTd'}>
                    {column.label}
                    {column.sortable
                      ? <span>
                        <i on-click={() => this.sortUp(column)} class={'triangle_up'} />
                        <i on-click={() => this.sortDown(column)} class={'triangle_down'} />
                      </span> : ''
                    }
                  </th>
                )
              }
            </tr>
          </thead>
        </table>
      </div>
    )
  },
  data() {
    return {
      tableHeader: undefined
    }
  },
  mounted() {
    this.tableHeader = document.querySelector(`#table-header${this._uid}`)
    this.$parent.store.theaderUid = this._uid
  },
  methods: {
    sortDown(item) {
      let keyVal = item.prop
      const data = this.$parent.dataSource
      data.sort((a, b) => {
        return b[keyVal] - a[keyVal]
      })
    },
    sortUp(item) {
      let keyVal = item.prop
      const data = this.$parent.dataSource
      data.sort((a, b) => {
        return a[keyVal] - b[keyVal]
      })
    }
  },
  watch: {
    '$parent.store.syncLeft': function (newV, oldV) {
      if (typeof (this.tableHeader) != 'undefined') {
        this.tableHeader.scrollLeft = newV;
      }
      // console.log(newV, oldV);
    }
  }
}