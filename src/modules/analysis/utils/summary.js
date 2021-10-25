import AnalysisIndex from "./index.js"
class Summary extends AnalysisIndex{
    constructor(){
        super();
        /**
         * @property {*} summaryReg 正则匹配的规则
         * @property {*} summaryRule Summary模块的内容记录，比如是一块连续的Summary就需要进行详细的记录进行解析
         */
        this.summaryReg = {
            start: /^\>.+/gi,
            end: /^(\s*)(\n*)?$/i
        }
        this.lastSummaryIndex = null;
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
    }

    /**
     * @method judgeHandle 匹配Summary模块
     * @param {*} value 待匹配字符
     * @param {*} index 行数下标
     */
    judgeSummary(value, index){

    }

    /**
     * @method handleSummary 处理Summary模块的html标签
     */
    handleSummary(){

    }

    /**
     * @method resetData 重置数据
     */
    resetData(){

    }
}

export default Summary;