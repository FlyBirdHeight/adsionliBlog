# 动态路由匹配

> 虽然这里说是动态路由匹配，其实只是因为自己太懒了，实在不想每一次写一次page_list.json文件中的内容之后，还要再去router下面的index.js里面添加一条route记录，实在太麻烦了。所以为了一劳永逸，直接使用vue-router中提供的`addRoute`方法，结合`RouteConfig`结构，直接生成路由。然后在main.js添加进去，避免了总是需要自己去添加的麻烦。

## vue-router中使用到的方法及类型说明

1. RouteConfig路由数据

> 通过查阅vue-router的api，可以很简单的找到RouteConfig这种路由数据的结构

官网给出的结构：

```typescript
interface RouteConfig = {
  	path: string,
  	component?: Component,
  	name?: string, // 命名路由
  	components?: { [name: string]: Component }, // 命名视图组件
  	redirect?: string | Location | Function,
  	props?: boolean | Object | Function,
  	alias?: string | Array[string],
  	children?: Array[RouteConfig], // 嵌套路由
  	beforeEnter?: (to: Route, from: Route, next: Function) => void,
  	meta?: any,
	
  	// 2.6.0+
  	caseSensitive?: boolean, // 匹配规则是否大小写敏感？(默认值：false)
  	pathToRegexpOptions?: Object // 编译正则的选项
}
```

> 在本次的动态路由匹配中，实际上主要使用的是以下几个参数: path,component,children,caseSesitive。因为我们的代码是不需要进行权限设置的，所以meta还有beforeEnter方法都不需要写，而且在路由里面已经进行了beforeEach的处理。

2. addRoute方法

> addRoute方法的使用非常简单，只需要传入RouteConfig的类型数据(可以嵌套的哦)，也可以传入Parent Name, RouteConfig的形式。

```typescript
addRoute(parentName: string, route: RouteConfig): () => void
addRoute(route: RouteConfig): () => void
//注意使用addRoute时，添加一条新的路由规则记录作为现有路由的子路由。如果该路由规则有 name，并且已经存在一个与之相同的名字，则会覆盖它。
```

## 具体实现思路

1. 借助数据结构中的树形结构**(劳模)**，来存放数据，这里选用了Js中Map类，因为用来存放数据非常简单，然后再利用了Js中的引用，来修改最初提供的数据。

2. 处理很多特殊情况

   (1) 比如在一开始的时候定义了一个路径为`/vue/router/dynamic`的路由路径，那么这种情况下生成的RouteConfig的结构该是什么样子的呢，如下所示

```js
{
    path: "/vue",
    caseSensitive: true,
    redirect: '/vue/router/dynamic',
    children: [
        {
            path: "router",
        	caseSensitive: true,
            redirect: '/vue/router/dynamic'
            children: [
                {
                    path: "dynamic",
                    caseSensitive: true,
                    children: [],
                    component: Page
                }
            ]
        }
    ]
}
```

> 为什么会是上述的结构呢，因为在最外层的vue,和router中，都没有相关的配置文件，所以此时他们的component一定为空的
>
> ==其实这里忘记处理了一个很重要的东西，这里应该加上redirect，否则会出现问题==

  （2）如果是之前的路由继续设置了内容，那么我们应该去更新路由的内容，**同时删除掉之前给定redirect**，不过这里的redirect还没加上去，之后会进行处理，那么处理之后的代码格式如下：

```js
{
    path: "/vue",
    caseSensitive: true,
    redirect: '/vue/router/dynamic',
    children: [
        {
            path: "router",
        	caseSensitive: true,
            component: Page,
            children: [
                {
                    path: "dynamic",
                    caseSensitive: true,
                    children: [],
                    component: Page
                }
            ]
        }
    ]
}
```

   (3) 如果之前的节点都存在的话，就只要添加在其根节点的children中即可



## 代码

1. 添加子节点，递归添加，类似添加子树

   ```js
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
                   caseSensitive: true
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
   ```

2. 查找父节点，如果没有则自己创建使用addChildren方法, 有的话直接加入父节点的children中

```js
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
```

3. 处理map数据使其成为RouteConfig数据，并添加入Router中

```js
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

            for(let value of this.routeData){
                this.router.addRoute("Page", value);
            }
    }
}
```

## 有待完善

1. 首页就是上面提到的那一点，redirect的处理，这里在2021年10月28日 会进行修改。



