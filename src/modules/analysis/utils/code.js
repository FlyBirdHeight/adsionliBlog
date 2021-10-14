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
        /**
         * @description 定义正则规则表达式参数
         * @property {String} removeEndSpace 去除尾部空格
         * @property {String} space 获取空格数量
         * @property {Array} nodeSign 注释标记
         * @property {RegExp} morelineAnnotation 多行注释的匹配(暂时没啥用)
         */
        this.removeEndSpace = /\s*$/;
        this.space = /^\s*/g;
        this.morelineAnnotation = /^(\/\*{1,}\n)?((\*{1}.*)\n)*(\*{1,}\/)$/gmi
        this.slashAnnotation = /^(\/{2})(.+)/;
        this.nodeSign = [];
        this.startIndex = undefined;
        this.endIndex = undefined;
    }

    /**
     * @method setHandleValue 设置待处理内容值
     * @param {*} value 待处理内容
     * @param {Number} startIndex 在数组中code标签开始下标
     * @param {Number} endIndex 在数组中code标签结束下标
     */
    setHandleValue(value, startIndex, endIndex) {
        this.handleValue = value
        this.startIndex = startIndex;
        this.endIndex = endIndex;

        return this;
    }


    /**
     * @method handle 处理代码模块的输入值
     */
    handle() {
        let returnHtml = this.handleTag.start;
        this.handleValue.map((currentValue, index) => {
            let innerHtml = this.handleTag.pS;
            if (this.slashAnnotation.test(currentValue)) {
                innerHtml = this.handleNote(currentValue, innerHtml);
                returnHtml += innerHtml;
            } else {
                if (currentValue.length == 0) {
                    returnHtml += this.handleTag.br;
                    return;
                }
                /**
                 * @note 去除字符串尾部的空格，避免污染计算空格数量
                 */
                currentValue = currentValue.replace(this.removeEndSpace, '')
                let spaceCount = currentValue.match(this.space)[0].length;
                let tabLayour = this.getTabNum(spaceCount);
                innerHtml = innerHtml.substr(0, innerHtml.length - 2) + (tabLayour != '' ? ` ${tabLayour}` : '') + innerHtml.substr(innerHtml.length - 2, innerHtml.length);
                innerHtml += currentValue.replace(this.space, '') + this.handleTag.pE;
                returnHtml += innerHtml;
            }
        })

        returnHtml += this.handleTag.end;

        return returnHtml;
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
        let last = undefined;
        for (let key in this.handleTag.tab) {
            if (spaceCount < this.handleTag.tab[key]) {
                returnData = last;
                break;
            }
            last = key;
        }
        return returnData;
    }

    /**
     * @method handleNote 处理note
     * @param {String} handleValue 待处理参数
     */
    handleNote(handleValue, innerHtml) {
        innerHtml.substr(0, innerHtml.indexOf("code_font")) + this.handleTag.note + innerHtml.substr(innerHtml.length - 2, innerHtml.length);
        innerHtml += handleValue.match(this.slashAnnotation)[0] + this.handleTag.pE;

        return innerHtml
    }
}

export default Code;