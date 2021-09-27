class Code {
    constructor() {
        this.handleValue = new String();
        this.handleTag = {
            start: '<div class="code">',
            pS: '<p class="code_font">',
            pE: '</p>',
            end: '</div>',
            tab: {
                tab_1: 4,
                tab_2: 8,
                tab_3: 12,
                tab_4: 16,
                tab_5: 20,
                tab_6: 24,
                tab_7: 28
            },
            note: "note",
            br: "<br />"
        }
        this.returnHtml = new String();
        /**
         * @description 定义正则规则表达式参数
         * @property {String} removeEndSpace 去除尾部空格
         * @property {String} space 获取空格数量
         * @property {Array} nodeSign 注释标记
         */
        this.removeEndSpace = '/\s*$/g';
        this.space = '/\\s/';
        this.nodeSign = [];
    }

    /**
     * @method setHandleValue 设置待处理内容值
     * @param {*} value 待处理内容
     */
    setHandleValue(value) {
        this.handleValue = value
    }

    /**
     * @method handle 处理代码模块的输入值
     */
    handle() {
        this.returnHtml += this.handleTag.start;
        this.handleValue.map((currentValue, index) => {
            let innerHtml = pS;
            if(currentValue.length == 0){
                this.returnHtml += this.handleTag.br;
                continue;
            }
            /**
             * @note 去除字符串尾部的空格，避免污染计算空格数量
             */
            currentValue = currentValue.replace(this.removeEndSpace)
            let spaceCount = currentValue.match(`${this.space}`).length;
            let tabLayour = this.getTabNum(spaceCount);
            innerHtml = innerHtml.slice(-3)+ " " + tabLayour + innerHtml.slice(-3, 0);
            /**
             * @note 判断是否存在Note的元素，此时去除字符串中全部的空格,并且判断一下是否存在//或者/* *\/ 这里需要分类处理一下
             */
            currentValue = currentValue.replace(this.space);
        })
    }

    /**
     * @method getTabNum 获取空格返回class样式
     * @param {Number} spaceCount 空格数量
     * @return {String} 添加入innerHtml中的tab样式
     */
    getTabNum(spaceCount) {
        let returnData = '';
        if (spaceCount == 0) {
            return returnData;
        } else if (spaceCount > 28) {
            returnData = 'tab_7';
            return returnData;
        }
        for (let [key, value] in this.handleTag.tab) {
            if (spaceCount < value) {
                returnData = key;
                break;
            }
        }
        return returnData;
    }

    /**
     * @method handleNote 处理note
     * @param {String} handleValue 待处理参数
     */
    handleNote(handleValue){
        
    }
}

export default Code;