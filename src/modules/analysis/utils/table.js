import AnalysisIndex from "./index.js"
/**
 * 1. 表头必须使用| | | | | |这种形式，里面可以没有字符存在，但是必须以这种形式才可以被识别未表头
 * 2. 表格设置：| - | - | - | - |，必须以这种形式，但是其中的-个数不固定，随意多少均可，但是|的数量必须与表头的完全相同才可以，同时可以在-的两侧来设置:来设置表格数据的字体的位置,:-:居中，:-居左，-:居右。注意-是一定要存在，只是数量随意。
      修正：表格形式的收尾|可以不添加，但是中间是一定要添加的。
 * 3. 表格中，表格体中的|数量是随意的，如果少于表头数量就填充部分，如果等于就全部填充，如果大于就直接舍弃。特别注意：在其开头可以不用添加|符号，如果没添加，直接归于第一列，但是如果要设置在其他列，就必须要添加|符号，否则只会在第一列
 * 4. 判定一个表格结束，必须是一行什么都没有的内容，可以有空格和换行符！
 */
class Table extends AnalysisIndex {
    constructor() {
        super();
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
            start: /^((\|?)[^|]+(\|{1}))([^|]+(\|?))*([^|]+)$/i,
            rule: /((\|)?(\s*)((:{1})?-{1,}(:{1})?)(\s*)(\|*))+/i,
            body: /((\|?).*?)+(\|+)/i,
            end: /^(\s*)(\n*)?$/i
        };
    }

    /**
     * @method judgeHandle 匹配表格模块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标
     * @param {*} length 数据长度
     */
    judgeHandle(value, index, length) {
        if (!this.tableParameter.start && !this.tableParameter.is && this.tableReg.start.test(value)) {
            this.tableParameter.start = true;
            this.tableParameter.headerIndex = index;
            this.tableParameter.tableData.push(value);
        } else if (this.tableParameter.start && !this.tableParameter.is && this.tableReg.rule.test(value)) {
            if (index - this.tableParameter.headerIndex == 1) {
                this.tableParameter.startIndex = index;
                this.tableParameter.tableData.push(value);
                this.tableParameter.is = true;
                if (index == length - 1) {
                    this.tableParameter.endIndex = index;
                    this.recordData();
                }
                return;
            } else {
                this.tableParameter.start = false;
                this.tableParameter.tableData = [];
                return;
            }
        } else if (this.tableParameter.start && this.tableParameter.is && this.tableReg.body.test(value) && !this.tableReg.end.test(value)) {
            if (typeof (this.tableParameter.lastBodyIndex) == 'undefined') {
                this.tableParameter.lastBodyIndex = index
            }
            if (index - this.tableParameter.lastBodyIndex == 0 || index - this.tableParameter.lastBodyIndex == 1) {
                this.tableParameter.lastBodyIndex = index;
                this.tableParameter.tableData.push(value);
                return;
            } else {
                this.tableParameter.endIndex = index;
                this.recordData();
                return;
            }
        } else if (this.tableParameter.start && this.tableParameter.is && this.tableReg.end.test(value)) {
            this.tableParameter.endIndex = index;
            this.recordData();
            return;
        }
    }

    /**
     * @method recordData 记录数据并重置
     */
    recordData() {
        this.tableParameter.start = false;
        this.tableParameter.is = false;
        this.tableParameter.allTableData.push({
            startIndex: this.tableParameter.headerIndex,
            endIndex: this.tableParameter.endIndex,
            codeData: this.tableParameter.tableData,
        });
        this.tableParameter.headerIndex = undefined;
        this.tableParameter.startIndex = undefined;
        this.tableParameter.lastBodyIndex = undefined;
        this.tableParameter.endIndex = undefined;
        this.tableParameter.tableData = [];
    }

    /**
     * @method filterTableData 清洗table数据表，剔除不符合要求数据
     */
    filterTableData() {
        let filterData = [];
        let filterArray = (value) => {
            return value != '';
        }
        for (let value of this.tableParameter.allTableData) {
            let valueCode = value.codeData;
            let header = valueCode[0].replace(/\s/g, '');
            let rule = valueCode[1].replace(/\s/g, '');
            let headerList = header.split('|').filter(filterArray);
            let ruleList = rule.split('|').filter(filterArray);
            if (headerList.length == ruleList.length) {
                let headerData = this.handleHeaderData(headerList);
                let ruleData = this.handleRuleData(ruleList);
                if (ruleData.length == 0) {
                    continue;
                }
                let bodyData = this.handleBodyData(valueCode.splice(2, valueCode.length - 2), headerList.length);
                filterData.push({
                    headerData, ruleData, bodyData, startIndex: value.startIndex, endIndex: value.endIndex
                });
            }
        }
        this.tableParameter.allTableData = filterData;

        return this;
    }

    /**
     * @method handleHeaderData 处理头部数据
     * @param {*} value 待处理数据
     */
    handleHeaderData(value) {
        let returnData = [];
        for (let data of value) {
            let addData = this.matchSpecialChar(data);
            returnData.push(addData);
        }

        return returnData;
    }

    /**
     * @method handleRuleData 处理自定义部分数据
     * @param {*} value 待处理数据
     */
    handleRuleData(value) {
        let returnData = [];
        let conformFlag = false;
        for (let data of value) {
            let alignLength = data.match(/:/g) ? data.match(/:/g).length : 0;
            if (alignLength > 2) {
                conformFlag = true;
                break;
            }
            data = this.deleteBlank(data, 1);
            if (alignLength == 1 && data.indexOf(':') == 0) {
                returnData.push('left');
            } else if (alignLength == 1 && data.indexOf(':') != 0) {
                returnData.push('right');
            } else if (alignLength == 2) {
                returnData.push('center');
            } else {
                returnData.push('center')
            }
        }

        return returnData;
    }

    /**
     * @method handleBodyData 处理主数据
     * @param {*} value 待处理数据
     * @param {Number} length 数据长度
     */
    handleBodyData(value, length) {
        let returnArray = [];
        for (let key in value) {
            returnArray[key] = [];
            let body = value[key].split('|');
            for (let bodyValue of body) {
                returnArray[key].push(this.matchSpecialChar(bodyValue));
            }
            if (returnArray[key].length > length) {
                returnArray[key].splice(0, 1);
                returnArray[key].splice(length, returnArray[key].length - length);
            } else if (returnArray[key].length < length) {
                for (let i = returnArray[key].length; i < length; i++) {
                    returnArray[key][i] = '';
                }
            }
        }

        return returnArray;
    }

    /**
     * @method generateTableData 生成表格数据
     */
    generateTableData() {
        for (let key in this.tableParameter.allTableData) {
            let value = this.tableParameter.allTableData[key];
            let tableData = [];
            if (value.bodyData.length != 0) {
                for (let index in value.bodyData) {
                    tableData[index] = new Object;
                    for (let bodyIndex in value.bodyData[index]) {
                        tableData[index][bodyIndex] = value.bodyData[index][bodyIndex];
                    }
                }
            }
            value['tableData'] = tableData;
        }

        return this;
    }

    /**
     * @method generateSpan 生成Html标签
     */
    generateSpan() {
        let returnData = [];
        for (let value of this.tableParameter.allTableData) {
            let returnHtml = `<table-list :height="200" dataList="${JSON.stringify(value.tableData)}">`
                + this.getTableColumn(value.headerData, value.ruleData) + `</table-list>`
            returnData.push({
                returnHtml,
                startIndex: value.startIndex,
                endIndex: value.endIndex
            })
        }

        return returnData;
    }

    /**
     * @method getTableColumn 获取table-column的html片段
     * @param {*} header header数据
     * @param {*} rule ruleAlign数据
     */
    getTableColumn(header, rule) {
        let returnHtml = '';
        for (let key in header) {
            returnHtml += `<table-column prop="${key}" label="${header[key]}" align="${rule[key]}"></table-column>`
        }

        return returnHtml;
    }
}

export default Table;