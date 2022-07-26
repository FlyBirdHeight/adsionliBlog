前面的章节，我们学习了 babel 的编译流程，也深入了下原理，知道了怎么用 babel 的 api 来完成一些代码转换功能。但平时我们很少单独使用 babel 的 api，更多是封装成插件，插件可以上传到 npm 仓库来复用。

这一节，我们学习一下 babel 插件的格式以及 preset。

## plugin 的使用

首先，我们回顾一下 plugin 的使用，babel 的 plugin 是在配置文件里面通过 plugins 选项配置，值为字符串或者数组。

```javascript
{
  "plugins": ["pluginA", ["pluginB"], ["pluginC", {/* options */}]]
}
```

**如果需要传参就用数组格式，第二个元素为参数。**

## plugin的格式

babel plugin 有两种格式：

### 返回对象的函数

第一种是一个函数返回一个对象的格式，对象里有 visitor、pre、post、inherits、manipulateOptions 等属性。

```javascript
export default function(api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
        options.xxx = '';
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(file) {
      console.log(this.cache);
    }
  };
} 
```

首先，插件函数有 3 个参数，api、options、dirname。

- api 里包含了各种 babel 的 api，比如 types、template 等，这些包就不用在插件里单独单独引入了，直接取来用就行。
- options 就是外面传入的参数(数组第二个元素传入的参数)
- dirname 是目录名（不常用）

返回的对象有 inherits、manipulateOptions、pre、visitor、post 等属性。

- inherits 指定继承某个插件，和当前插件的 options 合并，通过 Object.assign 的方式。

  > inherits也可以理解为是对某一个插件的扩展

- visitor 指定 traverse 时调用的函数。

  > 这个就是之前用的，用来观察AST树解析位置的。

- pre 和 post 分别在遍历前后调用，可以做一些插件调用前后的逻辑，比如可以往 file（表示文件的对象，在插件里面通过 state.file 拿到）中放一些东西，在遍历的过程中取出来。

  > pre是在遍历前放入，post则是在遍历后进行处理

- manipulateOptions 用于修改 options，是在插件里面修改配置的方式，比如 syntaxt plugin一般都会修改 parser options： ![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2512f37b312a4c1a8ddb4c59c4a8f09f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

插件做的事情就是通过 api 拿到 types、template 等，通过 state.opts 拿到参数，然后通过 path 来修改 AST。可以通过 state 放一些遍历过程中共享的数据，通过 file 放一些整个插件都能访问到的一些数据，除了这两种之外，还可以通过 this 来传递本对象共享的数据。

> plugin主要作用的位置是在babel的traverse阶段