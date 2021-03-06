import store from "../store/index"
import coverList from "../data/cover.json";
class RouteHandle {
    constructor() {
        this.pageList = store.getters.getPageList;
        this.coverList = coverList.cover;
        this.store = store;
        this.concatData = new Map();
        this.switchNone = ['/', '/mine', 'catalogue', 'fileing', '/test/total', '/test/regular_test', '/test/component_test']
    }

    /**
     * @method beforeRouteSkip 在路由跳转之前，处理cover
     * @param {*} to 前往路由对象
     * @param {*} from 来自路由对象
     */
    beforeRouteSkip(to, from) {
        this.handleQuery('SET_COVER', to);
        this.handleQuery('SET_TITLE', to);
        if (this.switchNone.indexOf(to.path) == -1) {
            this.handleQuery('SWITCH_PAGE', {
                toPath: to.path
            })
        }
        // chrome
        document.body.scrollTop = 0
        // firefox
        document.documentElement.scrollTop = 0
        // safari
        window.pageYOffset = 0

    }

    /**
     * @method handleQuery 处理待处理事件
     * @param {*} handleQ 待处理事件
     */
    handleQuery(handleQ, data) {
        switch (handleQ) {
            case 'SET_COVER':
                this.handleCover(data.path);
                break;
            case 'SWITCH_PAGE':
                this.switchPageHandle(data.toPath);
                break;
            case 'SET_TITLE':
                this.changeTitle(data);
                break;
            default:
                break;
        }
    }

    /**
     * @method concatCoverData 将cover数据与page数据合并，并处理成map
     */
    concatCoverData(res) {
        for (let key in this.coverList) {
            this.concatData.set(key, this.coverList[key]);
        }
        for (let page of res) {
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
     * @method switchPageHandle 切换文章时底部切换按钮处理
     * @param {String} toPath 跳转分页路由
     */
    switchPageHandle(toPath) {
        let pageList = this.store.getters.getPageList;
        let that = this;
        let settingStore = (current, pre, next) => {
            that.store.commit('SET_CURRENT_PAGE', current);
            that.store.commit('SET_PRE_PAGE', pre);
            that.store.commit('SET_NEXT_PAGE', next);
        }
        //entries方法能够创建一个可迭代的对象，【a, b, c】 => [1, a], [2, b], [3, c]
        for (let [index, value] of pageList.entries()) {
            if (toPath == value.routeLink) {
                if (index == 0) {
                    settingStore(index, undefined, pageList.length > 1 ? index + 1 : undefined)
                } else if (index == pageList.length - 1) {
                    settingStore(index, index - 1, undefined);
                } else {
                    settingStore(index, index - 1, index + 1);
                }
                break;
            }
        }
    }

    /**
     * @method changeTitle 切换header中的title
     * @param {*} to 路由地址
     */
    changeTitle(to) {
        let pageList = this.store.getters.getPageList;
        if (this.switchNone.indexOf(to.path) == -1) {
            //entries方法能够创建一个可迭代的对象，【a, b, c】 => [1, a], [2, b], [3, c]
            for (let [index, value] of pageList.entries()) {
                if (to.path == value.routeLink) {
                    document.title = value.title;
                }
            }
        }else{
            document.title = 'adsionliBlog'
        }
    }


}

export default RouteHandle;