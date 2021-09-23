class Analysis {
    constructor(){
        this.handleContent = null;
    }

    /**
     * @method setHandleContent 设置待处理内容
     * @param {String} content 待处理内容
     */
    setHandleContent(content){
        this.handleContent = content;
        
        return this;
    }
}

export default Analysis;