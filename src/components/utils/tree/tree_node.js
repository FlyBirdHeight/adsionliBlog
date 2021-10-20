export default {
    name: 'TreeNode',
    render(h) {
        const data = this.data;
        const padding = this.paddingSet;
        return (
            <div class="tree-node">
                <div vOn:click={this.clickTree(data.index)} style={`padding-left: ${(data.level - 1) * padding}px`} class="tree-node-content" id={`treeNode${value['index']}`}>
                    <span class="tree-node_icon  el-icon-caret-right"></span>
                    <span class="tree-nodel_label">{value.label}</span>
                </div>
                <div class="tree-node-content_children">
                    <tree-node data={value.leave}></tree-node>
                </div>
            </div>
        )
    },
    methods: {
        clickTree(index){
            console.log(index);
        }
    },
    mounted() {
        console.log(this);
    },
    props: {
        data: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data: {
        paddingSet: 18
    }
}