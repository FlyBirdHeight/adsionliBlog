import Config from "@/data/config.json"
class Image {
    constructor() {
        this.imageList = [];
        this.imageRegular = /\!(\[(?<alt>.+?)\])(\((?<url>.+?)\))/gi;
        this.imageData = [];
        this.replaceSrc = Config.imagePreSrc;
    }

    /**
     * @method judgeImage 判断是否是图片
     * @param {*} value 待判断值
     * @param {*} index 文档中下标位置
     * @param {*} level 所处层级，只在summary模块中使用
     */
    judgeImage(value, index, level = undefined) {
        if (this.imageRegular.test(value)) {
            this.imageData.push({
                startIndex: index,
                endIndex: index,
                image: value,
                level
            });
        }
    }

    /**
     * @method handleData 处理图片数据
     */
    handleData() {
        for (let value of this.imageData) {
            this.imageRegular.lastIndex = 0;
            let matchData = this.imageRegular.exec(value.image)
            value['src'] = this.replaceSrc + matchData.groups.url.replace(/\.\.\//g, '');
            value['alt'] = matchData.groups.alt;
            this.imageList.push(value['src']);
        }

        return this;
    }

    /**
     * @method handlePreview 处理图片为html标签
     */
    handlePreview() {
        let previewList = "[";
        for(let value of this.imageList){
            previewList += `'${value}',`
        }
        previewList += "]"
        for (let value of this.imageData) {
            value['returnHtml'] = `
                <image-data fit="contain" src="${value.src}" alt="${value.alt}" :preview="true" :previewSrcList="${previewList}"></image-data>
            `
        }

        return this.imageData;
    }

    resetData() {
        this.imageList = [];
    }
}

export default Image;