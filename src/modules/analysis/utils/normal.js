import AnalysisIndex from "./index.js";

class Normal extends AnalysisIndex {
    constructor(){
        super();
        this.handleData = [];
        this.returnData = [];
        this.handleHtml = {
            start: '<div class="paragraph">',
            startLine: '<p>',
            lineFeed: '</br>',
            endLine: '</p>',
            end: '</div>'
        }
    }

    /**
     * @method setHandleData 设置待处理
     * @param {*} data 待处理数据
     */
    setHandleData(data){
        this.handleData = data;

        return this;
    }

    /**
     * @method handleDataToSpan 处理数据内容
     */
    handleDataToSpan(){
        if(this.handleData.length == 0){
            return ;
        }

        for(let value of this.handleData){
            let innerHtml = '';
            if(value.data.length == 0){
                continue
            }
            if(value.data.length == 1 && /^(\r|\n)$/.test(value.data[0])){
                this.returnData.push({
                    returnHtml: this.handleHtml.lineFeed,
                    startIndex: value.startIndex,
                    endIndex: value.endIndex
                })
                continue;
            }
            innerHtml += this.handleHtml.start;
            for(let i = 0; i < value.data.length; ++i){
                if(/^(\r|\n)$/.test(value.data[i])){
                    continue;
                }
                innerHtml += this.handleHtml.startLine;
                if(value.data[i].length > 1){
                    value.data[i] = value.data[i].replace(/\r/g, '')
                }
                innerHtml += this.matchSpecialChar(value.data[i]);
                innerHtml += this.handleHtml.endLine;
            }
            innerHtml += this.handleHtml.end;
            this.returnData.push({
                returnHtml: innerHtml,
                startIndex: value.startIndex,
                endIndex: value.endIndex
            })
        }
    }
}

export default Normal;