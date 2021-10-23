import AnalysisIndex from "./index.js"
class Summary extends AnalysisIndex{
    constructor(){
        super();
        this.summarReg = {
            start: /^\>.+/gi,
            end: /^(\s*)(\n*)?$/i
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