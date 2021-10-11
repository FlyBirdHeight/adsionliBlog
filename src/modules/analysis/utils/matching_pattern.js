/**
 * @class MatchPattern 模式匹配类
 */
class MatchPattern {
    constructor(){
        this.specialChar = {
            tilt: '/\*.+\*/yi',
            bold: '/\*{2}.+\*{2}/yi',
            underline: '/<u>.+<\/u>/yi',
            inlineCode: '/`.+`/yi',
            deleteLine:  '/~{2}.+~{2}/yi',
            highlight: '/={2}.+={2}/yi',
            hyperlinks: '/\[.+\]\((?<=http\\S{0, 255})[#>*+-]\)/yi'
        }
    }
    /**
     * @method matchLineFeed 匹配空白行
     * @param {*} value 
     * @return {Boolean} 
     */
    matchLineFeed(value) {
        if (value.replace('/(^\\s*|\\s*$)/gi', '') == '') {
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
     * @return {Boolean}
     */
    matchTitle(value) {
        value = this.deleteBlank(value);
        let regular = new RegExp('/^#+/','gi');
        if(regular.test(value)){
            return {
                result: true,
                count: value.match('/^#+/gi')
            }
        }else {
            return {
                result: false
            }
        }
    }

    /**
     * @method matchSpecialChar 匹配特殊字符
     * @param {String} value 
     */
    matchSpecialChar(value){
       
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