import AnalysisIndex from "./index.js"
class Summary extends AnalysisIndex {
    constructor() {
        super();
        /**
         * @property {*} summaryReg 正则匹配的规则
         * @property {Number} startSummaryIndex Summary开始位置
         * @property {Number} lastSummaryIndex 记录上一次Summary的位置
         * @property {Number} endSummaryIndex Summary结束位置
         * @property {*} summaryRule Summary模块的内容记录，比如是一块连续的Summary就需要进行详细的记录进行解析
         * @property {*} summarySpan Summary标签替换
         * @property {Boolean} summaryStart 是否是Summary开始
         * @property {Array} summaryCacheData summary缓存数据
         * @property {Array} summaryHandleData 待处理Summary数据
         * @property {Array} returnData 返回的html片段数据
         */
        this.summaryReg = {
            start: /(^\>)(.*)/i,
            end: /^(\s*)(\n*)?$/i
        }
        this.startSummaryIndex = null;
        this.lastSummaryIndex = null;
        this.endSummaryIndex = null;
        this.summaryRule = {
            startIndex: null,
            endIndex: null,
            lineCount: null
        }
        //TODO 这里是否可以使用Jsx拓展来进行书写，等待调研
        this.summarySpan = {
            start: '<div class="summary">',
            normalSpanStart: '<span>',
            normalSpanEnd: '</span>',
            end: '</div>'
        }
        this.summaryStart = false;
        this.summaryCacheData = [];
        this.summaryHandleData = [];
        this.returnData = [];
    }

    /**
     * @method judgeHandle 匹配Summary模块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标
     */
    judgeSummary(value, index) {
        if (this.summaryReg.start.test(value) && !this.summaryStart) {
            this.lastSummaryIndex = index;
            this.startSummaryIndex = index;
            this.summaryStart = true;
            this.summaryCacheData.push(value);
        } else if (this.summaryStart && this.summaryReg.start.test(value)) {
            if (Number(index) - Number(this.lastSummaryIndex) == 1) {
                this.lastSummaryIndex = index;
                this.summaryCacheData.push(value);
            } else {
                this.summaryHandleData.push({
                    startIndex: this.startSummaryIndex,
                    endIndex: this.lastSummaryIndex,
                    handleData: this.summaryCacheData
                });
                this.resetData();
            }
        } else if (this.summaryReg.end.test(value) && this.summaryStart) {
            this.endSummaryIndex = index;
            this.summaryCacheData.push(value);
            this.summaryHandleData.push({
                startIndex: this.startSummaryIndex,
                endIndex: this.endSummaryIndex,
                handleData: this.summaryCacheData
            });
            this.resetData();
        }
    }

    /**
     * @method handleSummaryData 处理Summary模块的html标签
     */
    handleSummaryData() {
        for (let value of this.summaryHandleData) {
            let innerHtml = this.summarySpan.start;
            if (value.handleData.length > 1) {
                //NOTE:这里最特殊的是因为在Summary模块中也还是支持对table,title,code的辨析，所以，需要重复处理
                for (let label of value.handleData) {
                    let addLabel = label.replace(this.summaryReg.start, '$2')
                    innerHtml += addLabel == '' ? '</br>' : this.summarySpan.normalSpanStart +
                        addLabel
                        + this.summarySpan.normalSpanEnd;
                }
            } else {
                innerHtml += this.summarySpan.normalSpanStart +
                    this.matchSpecialChar(value.handleData[0].replace(this.summaryReg.start, '$2'))
                    + this.summarySpan.normalSpanEnd;
            }
            innerHtml += this.summarySpan.end;
            this.returnData.push({
                startIndex: value.startIndex,
                endIndex: value.endIndex,
                returnHtml: innerHtml
            })
        }

        return this.returnData
    }

    /**
     * @method resetData 重置数据
     */
    resetData() {
        this.summaryStart = false;
        this.endSummaryIndex = null;
        this.startSummaryIndex = null;
        this.lastSummaryIndex = null;
        this.summaryCacheData = [];
    }
}

export default Summary;