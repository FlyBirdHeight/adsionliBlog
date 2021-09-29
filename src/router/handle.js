import store from "../store/index"
import pageList from "../data/page_list.json";
import coverList from "../data/cover.json";
class RouteHandle {
    constructor() {
        this.pageList = pageList.page;
        this.coverList = coverList.cover;
        this.store = store;
        this.concatData = new Map();
        this.concatCoverData();

    }

    /**
     * @method beforeRouteSkip 在路由跳转之前，处理cover
     * @param {*} to 前往路由对象
     * @param {*} from 来自路由对象
     */
    beforeRouteSkip(to, from) {
        this.handleQuery('SET_COVER', to);

        return true;
    }

    /**
     * @method handleQuery 处理待处理事件
     * @param {*} handleQ 待处理事件
     */
    handleQuery(handleQ, to) {
        switch (handleQ) {
            case 'SET_COVER':
                this.handleCover(to.path);
                break;
            case 'JUMP_TO_APPOINT_HEIGHT':
                this.setTagLabel(to.query.label);
                break;
            default:
                break;
        }
    }

    /**
     * @method concatCoverData 将cover数据与page数据合并，并处理成map
     */
    concatCoverData() {
        for (let key in this.coverList) {
            this.concatData.set(key, this.coverList[key]);
        }
        for (let page of this.pageList) {
            this.concatData.set(page.routeLink, page);
        }
    }

    /**
     * @method handleCover 处理Cover组件中数据赋予
     * @param {*} linkPath 目标地址信息
     */
    handleCover(linkPath) {
        if (this.concatData.has(linkPath)) {
            let commitData = this.concatData.get(linkPath);
            this.store.commit('SET_SIDEBAR_COVER', {
                titleName: commitData.title,
                subTitleName: commitData.subTitle,
                createTime: typeof (commitData.createTime) == 'undefined' ? "" : commitData.createTime,
                tags: typeof (commitData.tags) == 'undefined' ? [] : commitData.tags,
            })
        }
    }

    /**
     * @method setTagLabel 设置跳转标签时，所需的标签vuex
     * @param {*} label 标签Id
     */
    setTagLabel(label) {
        this.store.commit('SET_SIDEBAR_TAG_LABEL', label);
    }
}

export default RouteHandle;