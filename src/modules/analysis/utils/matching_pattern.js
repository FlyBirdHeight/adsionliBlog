import AnalysisIndex from "./index.js"
import Code from "./code.js"
import Table from "./table.js"
import OrderList from "./order_list.js"
import Summary from "./summary.js"
/**
 * @class MatchPattern 模式匹配类
 */
class MatchPattern extends AnalysisIndex{
    constructor() {
        super();
        this.codeFragment = /^(\s*)?(`{3})(\s*)?$/;
        this.code = new Code();
        this.table = new Table();
        this.orderList = new OrderList();
        this.summary = new Summary();
        this.htmlSpanList = [];
        this.returnCodeHtml = '';
        /**
         * @property {Boolean} codeFlag 是否是代码片段的标记
         * @property {Number} codeStartIndex 代码片段开始位置
         * @property {Number} codeEndIndex 代码片段结束的位置
         * @property {Array} codeData 记录一段代码片段的数据
         * @property {Array} allCodeData 记录全部代码片段的位置
         */
        this.codeFlag = false;
        this.codeStartIndex = undefined;
        this.codeEndIndex = undefined;
        this.codeData = [];
        this.allCodeData = [];
    }

    /**
     * @method handle 开始处理全部传入数据
     */
    handle(value) {
        let data = value.split('\n');
        let length = data.length;
        for (let i = 0; i < data.length; i++) {
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
        }

        this.replaceToSpan();
        if (this.htmlSpanList.length != 0) {
            this.htmlSpanList.sort((a, b) => {
                return a.startIndex - b.startIndex;
            })
        }
        
        this.htmlSpanList.map((value, index) => {
            this.returnCodeHtml += value.returnHtml;
        })
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
        if(this.table.tableParameter.allTableData.length != 0){
            this.htmlSpanList = this.htmlSpanList.concat(this.table.filterTableData().generateTableData().generateSpan());
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
     * @method matchLineFeed 匹配空白行
     * @param {*} value 
     * @return {Boolean} 
     */
    matchLineFeed(value) {
        if (value.replace(/(^\s*|\s*$)/gi, '') == '') {
            return {
                result: true
            }
        } else {
            return {
                result: false
            }
        }
    }

    /**
     * @method matchTitle 匹配标题，同时返回其级数
     * @param {String} value
     * @return {*}
     */
    matchTitle(value) {
        value = this.deleteBlank(value);
        if (this.title.test(value)) {
            let count = this.title.match(/(?<titleCount>^#{1,6})(\s{1,})(.+?)/).groups.titleCount.length
            value = this.title.replace(reg, `<h${count}>$<title></h${count}>`);
            value = this.matchSpecialChar(value);
            return value;
        } else {
            return value;
        }
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