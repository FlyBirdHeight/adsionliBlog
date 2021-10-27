# Markdown 第一期内容测试

## 1. 测试信息记录

| 测试人   | 测试日期   | 测试内容       | 是否通过测试 |
| -------- | ---------- | -------------- | ------------ |
| adsionli | 2021-10-17 | code 模块测试  | 通过         |
| adsionli | 2021-10-17 | table 模块测试 | 通过         |

## 2. 测试用例
### 1. code 模块测试测试用例
``` js
import store from "../store/index"
import pageList from "../data/page_list.json";
import coverList from "../data/cover.json";
class RouteHandle {
    constructor() {
        console.log(123)
        this.pageList = pageList.page;
        this.coverList = coverList.cover;
        this.store = store;
        this.concatData = new Map();
        this.concatCoverData();
        this.switchNone = ['/', '/mine', 'catalogue', 'fileing', '/test/total', '/test/regular_test', '/test/component_test']
    }

    /**
     * @method beforeRouteSkip 在路由跳转之前，处理cover
     * @param {*} to 前往路由对象
     * @param {*} from 来自路由对象
     */
    beforeRouteSkip(to, from) 
    {
        this.handleQuery('SET_COVER', to);
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
}

export default RouteHandle;
```

### 2. table 模块测试

`12`|*12*|**12**| 12 |[adsionliBlog](localhost:8080)
 :---: | - | - | - | - 
|||123   |123|123|123|
|123   |123|123|123|
|123   |123|123|123|
|   ||||
123|
|
||123

