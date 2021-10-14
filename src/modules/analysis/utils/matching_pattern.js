import Code from "./code.js"
/**
 * @class MatchPattern 模式匹配类
 */
class MatchPattern {
    constructor() {
        this.title = /(?<titleCount>^#{1,6})(\s{1,})(.+?)/;
        this.codeFragment = /^(\s*)?(`{3})(\s*)?$/;
        this.code = new Code();
        //TODO 注意，加粗匹配一定要在倾斜匹配之前
        this.specialChar = {
            bold: /(\*{2})(.+?)(\1)/gi,
            tilt: /(\*)(.+?)\1/gi,
            boldTilt: /(\*{3})(.+?)(\1)/gi,
            underline: /(<u>)(.+?)(<\/u>)/gi,
            inlineCode: /(`{1,5})(.+?)\1/gi,
            deleteLine: /(~{2})(.+?)(\1)/gi,
            highlight: /(={2})(.+?)\1/gi,
            hyperlinks: /(\[(.+?)\])(\((.+?)\))/gi
        }
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
        for (let i = 0; i < data.length; i++) {
            if (this.codeFragment.test(data[i]) && !this.codeFlag) {
                this.codeFlag = true;
                this.codeStartIndex = i;
            } else if (this.codeFragment.test(data[i]) && this.codeFlag) {
                this.codeFlag = false;
                this.codeEndIndex = i;
                this.allCodeData.push({
                    startIndex: this.codeStartIndex,
                    endIndex: this.codeEndIndex,
                    codeData: this.codeData
                })
                this.codeStartIndex = undefined;
                this.codeEndIndex = undefined;
                this.codeData = [];
            } else if (this.codeFlag) {
                this.codeData.push(data[i]);
            }
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
     * @method matchSpecialChar 匹配特殊字符
     * @param {String} value 
     */
    matchSpecialChar(value) {
        for (let key in this.specialChar) {
            let reg = new RegExp(this.specialChar[key]);
            if (reg.test(value)) {
                if (key == 'hyperlinks') {
                    value = value.replace(reg, this.handleSpecialChar('$2', key, '$4'));
                } else {
                    value = value.replace(reg, this.handleSpecialChar('$2', key))
                }
            }
        }

        return value;
    }

    /**
     * @method handleSpecialChar 将特殊字符转为对应的html标签
     * @param {*} value 插入检索值
     * @param {*} type 类型
     * @param {*} url 链接标签时的url
     */
    handleSpecialChar(value, type, url = '') {
        switch (type) {
            case 'tilt':
                return `<font class='tilt_char'>${value}</font>`
            case 'bold':
                return `<font class='bold_char'>${value}</font>`
            case 'underline':
                return `<font class='underline_char'>${value}</font>`
            case 'inlineCode':
                return `<span class='inlineCode_char'>${value}</span>`
            case 'deleteLine':
                return `<del class='deleteline_char'>${value}</del>`
            case 'highlight':
                return `<font class='highlight_char'>${value}</font>`
            case 'hyperlinks':
                return `<a href='${url}' rel='noopener noreferrer' target='_blank'>${value}</a>`
            default:
                break;
        }
    }

    /**
     * @method deleteBlank 去除空白符
     * @param {String} value 待处理字符串
     * @param {*} type 1: 去除全部 2: 去除起始空白符 3: 去除结尾空白符
     */
    deleteBlank(value, type = 1) {
        let returnValue;
        switch (type) {
            case 1:
                returnValue = value.replace('/(^\\s*|\\s*$)/gi', '')
                break;
            case 2:
                returnValue = value.replace('/(^\\s*)/gi', '')
                break;
            case 3:
                returnValue = value.replace('/(\\s*$)/gi', '')
                break
            default:
                break;
        }

        return returnValue;
    }
}

export default MatchPattern