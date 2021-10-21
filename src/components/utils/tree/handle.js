const TreeHandle = function (tree) {
    if (!tree) {
        throw new Error('Tree is required')
    }
    /**
     * @property {*} table 组件本体
     * @property {Boolean} accordion 是否开启手风琴模式
     * @property {Boolean} highlight 是否在鼠标在某个节点上进行高亮
     * @property {Boolean} expandAll 是否默认展开全部节点
     */
    this.tree = tree;
    this.accordion = false;
    this.highlight = false;
    this.expandAll = false;
    this.padding = 18;
    this.index = 0;
}

TreeHandle.prototype.mutations = {
    /**
     * @method handleTreeData 用来处理根节点的数据
     * @param {*} data 
     */
    handleTreeData(data) {
        for (let value of data) {
            value['index'] = this.index;
            value['expanded'] = true;
            let leave = value.leave;
            this.index++;
            if (leave.length != 0) {
                this.commit('traverseleave', leave);
            }
        }
    },
    /**
     * @method traverseleave 用来处理除了根节点外的子节点数据
     * @param {*} data 根节点数据
     */
    traverseleave(data) {
        for (let value of data) {
            value['index'] = this.index;
            value['expanded'] = true;
            this.index++;
            let leave = value.leave;
            if (leave.length != 0) {
                this.commit('traverseleave', leave);
            }
        }
    },
    /**
     * @method controllerExpand 控制显隐
     * @param {*} data 根节点数据
     * @param {Boolean} show 是否显示节点
     */
    controllerExpand(data, show) {
        if (data.leave.length != 0) {
            for (let value of data.leave) {
                value.expanded = show;
                if(value.leave.length != 0){
                    this.commit('controllerExpand', value, show);
                }
            }
        }
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

