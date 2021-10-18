import TableList from '@/components/utils/table/table.vue'
import TableColumn from '@/components/utils/table/table-column.js'
export default {
    name: "RenderPage",
    render() {
        return (
            this.renderHtml
        )
    },
    props: {
        renderHtml: {
            type: String,
            default: ''
        }
    },
    components: {
        TableList,
        TableColumn
    }
}