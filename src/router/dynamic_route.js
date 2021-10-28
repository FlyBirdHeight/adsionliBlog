import axios from 'axios'
import Page from "@/views/page/index.vue"
import store from "@/store/index.js"
var DynamicRoute = function (routeInfo, router) {
    /**
     * @property {*} routeInfo 路由信息
     * @property {*} axios 请求组件
     * @property {*} routeMap 路由Map,需要处理子路由嵌套的内容
     */
    this.routeInfo = routeInfo;
    this.axios = axios;
    this.routeMap = new Map();
    this.routeData = [];
    this.router = router;
    this.remRedirct = '';
    this.RouteConfig = {
        path: '',
        component: null,
        name: '',
        children: [],
        caseSensitive: true,
    }
}

DynamicRoute.prototype.handleAndCreate = function (routeData) {
    for (let value of routeData) {
        let route = value.routeLink.split('/');
        route.splice(0, 1);
        if (route[0] == 'page') {
            this.createRouteMap(route);
        }
    }
}

DynamicRoute.prototype.createRouteMap = function (data) {
    data.splice(0, 1);
    if (this.routeMap.has(data[0])) {
        if (data.length > 1) {
            this.findRoot(data, this.routeMap);
        } else{
            if(typeof(this.routeMap.get(data[0]).component) == 'undefined'){
                this.routeMap.get(data[0])['component'] = Page;
                delete this.routeMap.get(data[0]).redirect;
            }
        }
    } else {
        let children = new Map();
        let path = data[0];
        data.splice(0, 1)
        if (data.length > 0) {
            this.routeMap.set(path, {
                path,
                children,
                caseSensitive: true,
                redirect: ''
            });
            children = this.addChildren(data, children, 'no-root')
        } else {
            this.routeMap.set(path, {
                path,
                children,
                component: Page,
                caseSensitive: true
            });
        }

    }
}

DynamicRoute.prototype.generateRoute = function () {
    this.handleAndCreate(this.routeInfo);
    //处理数据，生成最终路由表，如果
    if (this.routeMap.size != 0) {
        this.routeData = Array.from(this.routeMap).flat().filter(value => {
            if (typeof (value) != 'string') {
                return value
            }
        })
        this.handleRouteDataForNormal(this.routeData);
        this.filterRouteData(this.routeData);
        for(let value of this.routeData){
            this.router.addRoute("Page", value);
        }
        
        store.commit('SET_PAGE_DATA_ROUTER', this.routeData);
    }
}
/**
 * @method filterRouteData 过滤路由数据，为没有组件的前置路由添加redirect
 * @param {*} data
 */
DynamicRoute.prototype.filterRouteData = function(data){
    let findRedirectPath = function(data, path){
        let completePath = path;
        if(data.length > 0){
            for(let value of data){
                if(typeof(value.component) != 'undefined'){
                    return `${completePath}/${value.path}`;
                }else if(value.children.length > 0){
                    return findRedirectPath(value.children, `${completePath}/${value.path}`);
                }
            }
        }
    }
    let setRedirectPath = function(data, path){
        for(let value of data){
            if(typeof(value.component) == 'undefined'){
                value['redirect'] = path;
            }else {
                delete value.redirect;
            }
            if(value.children.length != 0){
                setRedirectPath(value.children, path)
            }
        }
    }

    for(let value of data){
        if(value.children.length != 0 && typeof(value.component) == 'undefined'){
            let redirectPath = findRedirectPath(value.children, `/page/${value.path}`);
            value['redirect'] = redirectPath;
            setRedirectPath(value.children, redirectPath)
        }else{
            continue;
        }
    }
}
/**
 * @method handleRouteDataForNormal 处理路由数据，处理成 RouteConfig类型，方便最后的添加
 * @param {*} routeData 等待处理数据
 */
DynamicRoute.prototype.handleRouteDataForNormal = function (routeData) {
    for (let value of routeData) {
        if (value.children.size == 0) {
            value.children = [];
        } else {
            value.children = Array.from(value.children).flat().filter(value => {
                if (typeof (value) != 'string') {
                    return value
                }
            })
            this.handleRouteDataForNormal(value.children);
        }
    }
}
/**
 * @method addChildren 添加子节点，递归添加，类似添加子树
 * @param {*} data 待处理数据
 * @param {*} routeMap 父节点的children数据集
 * @param {*} type 添加类型 normal:普通(含有父结点) no-root:无父结点，全部重新创建
 */
DynamicRoute.prototype.addChildren = function (data, root, type = 'normal') {
    let path = data.splice(0, 1)[0];
    if (type == 'no-root') {
        if (data.length == 0) {
            root.set(path, {
                path,
                children: new Map(),
                component: Page,
                caseSensitive: true
            })

            return root;
        } else {
            root.set(path, {
                path,
                children: new Map(),
                caseSensitive: true,
                redirect: ''
            })
            if (data.length >= 1) {
                return this.addChildren(data, root.get(path).children, 'no-root');
            }
        }
    } else {
        root.set(path, {
            path,
            children: new Map(),
            component: Page,
            caseSensitive: true
        })
        if (data.length > 1) {
            return this.addChildren(data, root.get(path).children, 'normal');
        } else {
            return root;
        }
    }


}

/**
 * @method findRoot 查找父节点，如果没有则自己创建使用addChildren方法, 有的话直接加入父节点的children中
 * @param {*} data 待查找数据
 * @param {*} routeMap 父节点的children数据集
 */
DynamicRoute.prototype.findRoot = function (data, routeMap) {
    let findMap = routeMap;
    let findCount = 0;
    let length = data.length;
    for (let value of data) {
        if (findMap.has(value) && findCount < length - 1) {
            findMap = findMap.get(value).children;
            findCount++;
        } else if (!findMap.has(value) && findCount < length) {
            findMap = this.addChildren(data.splice(findCount, data.length - findCount), findMap, 'no-root');
            break;
        } else if (!findMap.has(value) && findCount == length) {
            findMap.set({
                path: value,
                children: new Map(),
                component: Page,
                caseSensitive: true
            })
            break;
        } else if (findMap.has(value) && findCount == length - 1) {
            if (typeof (findMap.get(value).component) == 'undefined') {
                findMap.get(value)['component'] = Page;
            }
            break;
        }
    }
}




export default DynamicRoute;