import AnalysisIndex from "./index.js"
class Title extends AnalysisIndex{
    constructor(){
        super();
        this.title = /(?<titleCount>^#{1,6})(\s{1,})(.+)/;
        this.titleList = [];
        this.titleHtml = [];
    }

    /**
     * @method judgeTitle 判断是否是Title
     * @param {*} value 待判断值
     * @param {Number} index 文件中下标
     */
    judgeTitle(value, index){
        if(this.title.test(value)){

        }
    }

    /**
     * @method handleTitleLevel 处理Title的分级
     */
    handleTitleLevel(){

    }

    /**
     * @method generateTitleLevel 生成title分级列表
     */
    generateTitleLevel(){

    }
}

export default Title;