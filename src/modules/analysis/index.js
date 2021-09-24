
class Analysis {
    constructor() {
        this.handleContent = undefined;
        this.axios = require("axios");
        
    }
    /**
     * @method setHandleContent 设置待处理内容
     * @param {String} content 待处理内容
     */
    setHandleContent(content) {
        this.handleContent = content.split("\n");

        return this;
    }

    /**
     * @method getFile 读取文件
     * @param {*} filePath 文件路径
     */
    async getFile(filePath){
        try{
            let returnData = await this.axios.get(filePath);
            this.handleContent = returnData.data.split("\n");
            await this.handleContentValue();
        }catch(error){
            console.log(error)
            return false;
        }
    }

    /**
     * @method handleContentValue 处理content传入数据并处理
     */
    async handleContentValue(){
        this.handleContent.map((currentValue, index) => {
            console.log(currentValue);
        });
    }
}

export default Analysis;