import AnalysisIndex from "./index.js"
import Title from "./title.js"
import Code from "./code.js"
import Table from "./table.js"
import OrderList from "./order_list.js"
import Summary from "./summary.js"
import Normal from "./normal.js"
/**
 * @class MatchPattern 模式匹配类
 */
class MatchPattern extends AnalysisIndex {
    constructor() {
        super();
        this.codeFragment = /^(\s*)?(`{3})(\s*)?$/;
        this.code = new Code();
        this.table = new Table();
        this.orderList = new OrderList();
        this.summary = new Summary();
        this.title = new Title();
        this.normal = new Normal();
        this.htmlSpanList = [];
        this.returnCodeHtml = '';
        /**
         * @property {Boolean} codeFlag 是否是代码片段的标记
         * @property {Number} codeStartIndex 代码片段开始位置
         * @property {Number} codeEndIndex 代码片段结束的位置
         * @property {Array} codeData 记录一段代码片段的数据
         * @property {Array} allCodeData 记录全部代码片段的位置
         * @property {Array} normalData 无符合大片段数据记录
         */
        this.codeFlag = false;
        this.codeStartIndex = undefined;
        this.codeEndIndex = undefined;
        this.codeData = [];
        this.allCodeData = [];
        this.normalData = [];
    }

    /**
     * @method handle 开始处理全部传入数据
     */
    handle(value) {
        let data = value.split('\n');
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (this.codeFlag) {
                this.matchCodeFragment(data[i], i);
                continue;
            }
            if (this.table.tableParameter.start) {
                this.table.judgeHandle(data[i], i, length);
                continue;
            }
            this.matchCodeFragment(data[i], i);
            this.table.judgeHandle(data[i], i, length);
            this.title.judgeTitle(data[i], i);
        }
        //NOTE: 非普通数据的渲染标签替换
        this.replaceToSpan();
        if (this.htmlSpanList.length != 0) {
            this.htmlSpanList.sort((a, b) => {
                return a.startIndex - b.startIndex;
            })
        }
        console.log(this.htmlSpanList)
        //NOTE: 处理普通数据，因为这里没有做处理
        this.handleNormalData(data);


        this.htmlSpanList.map((value, index) => {
            this.returnCodeHtml += value.returnHtml;
        })

        return {
            html: this.returnCodeHtml,
            title: this.title.titleValueList
        }
    }

    /**
     * @method replaceToSpan 替换全部markdown语法为标签
     */
    replaceToSpan() {
        if (this.allCodeData.length != 0) {
            for (let value of this.allCodeData) {
                this.htmlSpanList.push(this.code.setHandleValue(value.codeData, value.startIndex, value.endIndex).handle())
            }
        }
        if (this.table.tableParameter.allTableData.length != 0) {
            this.htmlSpanList = this.htmlSpanList.concat(this.table.filterTableData().generateTableData().generateSpan());
        }
        if (this.title.titleList.length != 0) {
            this.htmlSpanList = this.htmlSpanList.concat(this.title.handleTitleLevel().generateTitleLevel());
        }
    }

    /**
     * @method matchCodeFragment 匹配代码块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标 
     */
    matchCodeFragment(value, index) {
        if (this.codeFragment.test(value) && !this.codeFlag) {
            this.codeFlag = true;
            this.codeStartIndex = index;
        } else if (this.codeFragment.test(value) && this.codeFlag) {
            this.codeEndIndex = index;
            this.allCodeData.push({
                startIndex: this.codeStartIndex,
                endIndex: this.codeEndIndex,
                codeData: this.codeData
            })
            this.codeStartIndex = undefined;
            this.codeEndIndex = undefined;
            this.codeFlag = false;
            this.codeData = [];
        } else if (this.codeFlag) {
            this.codeData.push(value);
        }
    }

    /**
     * @method handleNormlaData 处理普通数据
     * @param {Array} data 原始数据
     */
    handleNormalData(data) {
        let noHandleIndex = 0;
        //NOTE 首先先获取到待处理数据内容
        this.htmlSpanList.map(value => {
            if (noHandleIndex != value.endIndex) {
                this.normalData.push({
                    data: data.slice(noHandleIndex, (noHandleIndex + (value.startIndex - noHandleIndex))),
                    startIndex: value.startIndex - noHandleIndex == 1 ? noHandleIndex + (value.startIndex - noHandleIndex) - 1 : noHandleIndex,
                    endIndex: noHandleIndex + (value.startIndex - noHandleIndex) - 1
                })
                noHandleIndex = value.endIndex + 1;
            } else {
                noHandleIndex = value.endIndex + 1;
            }
        })
        if (data.length > this.htmlSpanList[this.htmlSpanList.length - 1].endIndex) {
            this.normalData.push({
                data: data.slice(this.htmlSpanList[this.htmlSpanList.length - 1].endIndex + 1),
                startIndex: this.htmlSpanList[this.htmlSpanList.length - 1].endIndex + 1,
                endIndex: data.length - 1
            })
        }
        console.log(this.normalData)

        this.normal.setHandleData(this.normalData).handleDataToSpan();
        console.log(this.normal.returnData)
        this.htmlSpanList = this.htmlSpanList.concat(this.normal.returnData).sort((a, b) => {
            return a.startIndex - b.startIndex;
        })
    }

    /**
     * @method resetData 重置数据
     */
    resetData() {
        this.htmlSpanList = [];
        this.returnCodeHtml = '';
        this.codeFlag = false;
        this.codeStartIndex = undefined;
        this.codeEndIndex = undefined;
        this.codeData = [];
        this.allCodeData = [];
        this.tableFlag = false;
        this.tableParameter = {
            startIndex: undefined,
            endIndex: undefined,
            allTableData: [],
            tableData: []
        };
    }
}

export default MatchPattern