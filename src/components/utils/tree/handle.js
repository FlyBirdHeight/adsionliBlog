const TreeHandle = function (tree) {
    if (!tree) {
        throw new Error('Tree is required')
    }
    /**
     * @property {*} table 组件本体
     * @property {Array} treeHtml treeHtml数据本体处理后的html
     * @property {Boolean} accordion 是否开启手风琴模式
     * @property {Boolean} highlight 是否在鼠标在某个节点上进行高亮
     * @property {Boolean} expandAll 是否默认展开全部节点
     */
    this.tree = tree;
    this.treeHtml = [];
    this.accordion = false;
    this.highlight = false;
    this.expandAll = false;
    this.padding = 18;
    this.index = 0;
    this.innerHtml = ''
}

TreeHandle.prototype.mutations = {
    /**
     * @method handleTreeData 用来处理根节点的数据
     * @param {*} data 
     */
    handleTreeData(data) {
        for (let value of data) {
            value['index'] = this.index;
            this.innerHtml = `
                <div class="tree-node">
                    <div style="padding-left: ${(value.level - 1) * this.padding}px" class="tree-node-content" id="treeNode${value['index']}">
                        
                        <span class="tree-nodel_label">${value.label}</span>
                    </div>
            `
            let leave = value.leave;
            this.index++;
            if (leave.length != 0) {
                this.innerHtml += '<div class="tree-node-content_children">';
                this.commit('traverseleave', leave);
                this.innerHtml += '</div>'
            }
            this.innerHtml += `
                </div>
            `
            this.treeHtml.push(this.innerHtml);
            this.innerHtml = '';
        }
    },
    /**
     * @method traverseleave 用来处理除了根节点外的子节点数据
     * @param {*} data 
     */
    traverseleave(data) {
        for (let value of data) {
            value['index'] = this.index;
            this.innerHtml += `
                <div class="tree-node">
                    <div style="padding-left: ${(value.level - 1) * this.padding}px" class="tree-node-content" id="treeNode${value['index']}">
                        
                        <span class="tree-nodel_label">${value.label}</span>
                    </div>
            `
            this.index++;
            let leave = value.leave;
            if (leave.length != 0) {
                this.innerHtml += `
                    <div class="tree-node-content_children">
                `
                this.commit('traverseleave', leave);
                this.innerHtml += `</div>`
            }
            this.innerHtml += `
                </div>
            `
        }
    },
    getData(index){
        console.log(index)
    }
}

TreeHandle.prototype.commit = function (name, ...args) {
    const mutations = this.mutations
    if (mutations[name]) {
        mutations[name].apply(this, args)
    } else {
        throw new Error(`Action not found ${name}`)
    }
}

export default TreeHandle;

