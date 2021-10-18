class Table {
    constructor() {
        /**
         * @property {Object} tableParameter 表格元素
         * @property {Boolean} tableParameter.start 表格头判断
         * @property {Boolean} tableParameter.is 是否是表格
         * @property {Number} tableParameter.headerIndex 表格头所在下标
         * @property {Number} tableParameter.startIndex 表格设定所在下标
         * @property {Number} tableParameter.lastBodyIndex 表格体下标记录
         * @property {Number} tableParameter.endIndex 表格尾下标
         * @property {Array} tableParameter.htmlSpan 表格html标签记录
         * @property {Array} tableParameter.allTableData 表格全部数据存放
         * @property {Array} tableParameter.tableData 表格单次数据存放
         * @property {RegExp} tableReg 表格元素判断 start:开始，end:结束，body:表格题，rule:表格属性
         */
        this.tableParameter = {
            start: false,
            is: false,
            headerIndex: undefined,
            startIndex: undefined,
            lastBodyIndex: undefined,
            endIndex: undefined,
            htmlSpan: [],
            allTableData: [],
            tableData: []
        };
        this.tableReg = {
            start: /(\|?).+((\|).+(\|))*(.+\1)*/gi,
            rule: /((\|)?(\s*)((:+)?-{1,}(:+)?)(\s*)(\|*))+/gi,
            body: /((\|?).*?)+/gi,
            end: /^(\s*)(\n+)$/gi
        };
        this.handleTag = {

        }
    }

    /**
     * @method judgeHandle 匹配表格模块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标
     */
    judgeHandle(value, index) {
        if (!this.tableParameter.start && this.tableReg.start.test(value)) {
            this.tableParameter.headerIndex = index;
        } else if (this.tableParameter.start && !this.tableParameter.is && this.tableReg.rule.test(value)) {
            if (index - this.tableParameter.headerIndex == 1) {
                this.tableParameter.startIndex = index;
                this.tableParameter.tableData.push(value);
                this.tableParameter.is = true;
            } else {
                this.tableParameter.start = false;
                this.tableParameter.tableData = [];
                return;
            }
        } else if (this.tableParameter.start && this.tableParameter.is && this.tableReg.body.test(value)) {
            if (typeof (this.tableParameter.lastBodyIndex) == 'undefined') {
                if (index - this.tableParameter.startIndex == 1) {
                    this.tableParameter.lastBodyIndex = index;
                    this.tableParameter.tableData.push(value);
                }

            }
        } else if (this.tableParameter.start && this.tableParameter.is && this.tableReg.end.test(value)) {
            this.tableParameter.start = false;
            this.tableParameter.is = false;
            this.tableParameter.allTableData.push(this.tableParameter.tableData);
            this.tableParameter.tableData = [];
        }
    }

    /**
     * @method setHandleValue 设置待处理数据
     * @param {Number} startIndex 在数组中code标签开始下标
     * @param {Number} endIndex 在数组中code标签结束下标
     */
    setHandleValue(value, startIndex, endIndex) {

    }

    /**
     * @method handle 处理代码模块的输入值
     */
    handle() {

    }

    /**
     * @method calculateTableParameter 计算表格的相关参数，n行n列
     */
    calculateTableParameter() {

    }

    /**
     * @method handleTableHeader 处理表格的表头相关标签内容
     */
    handleTableHeader() {

    }

    /**
     * @method handleTableBody 处理表格的表格内内容
     */
    handleTableBody() {

    }
}

export default Table;