import PagePath from "@/data/page.json"
import axios from "axios"
class HandlePageList {
    constructor() {
        this.pagePath = PagePath.pageFile;
        this.pageList = [];
    }

    /**
     * @method handlePagePath 处理pagePath，导入全部数据
     */
    async handlePagePath() {
        let returnData = []
        for (let key in this.pagePath) {
            let data = await axios.get(this.pagePath[key]);
            if (data.data.page.length != 0) {
                returnData = returnData.concat(data.data.page)
            }
        }

        return returnData;
    }
}

export default HandlePageList;