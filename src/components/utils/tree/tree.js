import HandleTree from "./handle.js"
import "./tree.scss"
export default {
    name: 'TreeList',
    data() {
        const handle = new HandleTree(this);
        return {
            handle,
            handleHtml: '',
            emptyText: '暂无数据'
        }
    },
    mounted() {
        if (this.$attrs.hasOwnProperty('accordion')) {
            this.handle.accordion = true;
        }
        if (this.$attrs.hasOwnProperty('highlight-current')) {
            this.handle.highlight = true;
        }
        if (this.$attrs.hasOwnProperty('default-expand-all')) {
            this.handle.expandAll = true;
        }
        this.handle.commit('handleTreeData', this.data);
    },
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    render(h) {
        const html = this.handle.treeHtml.join('');
        return (
            <div class="tree-list">
                {
                    html == '' ?
                        <div class="no-data">{this.emptyText}</div> :
                        <div domPropsInnerHTML={html}></div>
                }
            </div>
        )
    },
    methods: {

    },
}