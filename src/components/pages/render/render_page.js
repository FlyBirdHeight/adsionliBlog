import TableList from '@/components/utils/table/table.vue'
import TableColumn from '@/components/utils/table/table-column.js'
import Vue from 'vue'
export default {
    name: "RenderPage",
    render(h) {
        const com = Vue.extend({
            template: `<div>${this.renderHtml}</div>`
        });
        return h(com, {})
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