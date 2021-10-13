/**
 * @class MatchPattern 模式匹配类
 */
class MatchPattern {
    constructor() {
        this.specialChar = {
            tilt: /\*(\S+)\*/gi,
            bold: /\*{2}(\S+)\*{2}/gi,
            underline: /<u>(\S+)<\/u>/gi,
            inlineCode: /`(\S+)`/gi,
            deleteLine: /~{2}(\S+)~{2}/gi,
            highlight: /={2}(\S+)={2}/gi,
            hyperlinks: /(\[(?<name>\s*\S+\s*)\]\((?<url>http?\S{0, 255}[#>*+-])\))/gi
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
        let regular = new RegExp('/^#+/', 'gi');
        if (regular.test(value)) {
            return {
                result: true,
                count: value.match('/^#+/gi')
            }
        } else {
            return {
                result: false
            }
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
                    value = value.replace(reg, this.handleSpecialChar('$<name>', key, '$<url>'));
                } else {
                    value = value.replace(reg, this.handleSpecialChar('$&', key))
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
        console.log(value);
        switch (type) {
            case 'tilt':
                return `<font class='tilt_char'>${value}</font>`
            case 'bold':
                return `<font class='underline_char'>${value}</font>`
            case 'underline':
                return `<font class='bold_char'>${value}</font>`
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