# webpack学习第一阶段内容总结
| 文档创建人 | 创建日期   | 文档内容          | 更新时间 |
| ---------- | ---------- | ----------------- | -------- |
| adsionli   | 2021-10-28 | webpack学习第一阶段内容总结 | 2021-10-29    |

## 1. webpack的作用是什么



## 2. webpack的全局安装以及局部安装的区别

> 在webpack官网中，给出的建议是使用局部安装的方式来使用webpack，但是也可以对webpack进行全局的安装

1. 全局安装

   ```shell
   //安装指令
   npm -g install webpack
   ```

   > 全局安装之后，可以在任意项目的目录下进行webpack的相关指令进行打包，但是这样也会带来一些不好的事情，比如当一个项目是有很多人共同开发来完成的时候，如果使用全局安装的webpack来进行打包，就无法统一所有人的webpack的版本，因为有的人的全局webpack的版本可能是各不相同的。

2. 局部安装

   ```shell
   //安装指令
   npm install --save webpack webpack-cli
   ```

   局部安装的方法可以很好的统一所有开发者的webpack版本，通过npm进行引入，然后使用npx指令进行使用即可。

## 3. webpack的终端指令集合

|    指令名称     |                         指令作用                         |                           示例                            |
| :-------------: | :------------------------------------------------------: | :-------------------------------------------------------: |
|    `--entry`    | 可以指定其目标文件路径，而不再去默认寻找./src/index.js了 |            `npx webpack --entry ./src/main.js`            |
| `--output-path` |                可以指定编译文件的输出目录                | `npx webpack --entry ./src/main.js --output-path ./build` |
|    --config     |                    指定配置文件的地址                    |         npx webpack --config ./webpack.config.js          |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |

## 4.webpack的文件配置

```js
const path = require('path')
module.exports = {
    entry: './src/main.js',
    //output中的path路径必须是一个绝对路径
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

上面就是webpack的文件配置中的部分内容，在项目内部进行webpack打包时，webpack会自动去查找`webpack.config.js`，来进行打包。

这样之后就可以不用再package.json文件中配置了，只需要协商build指令里使用webpack即可

```json
{
    "name": "webpack_01",
    "version": "1.0.0",
    "description": "webpack学习1.0",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        //"build": "webpack --entry ./src/main.js --output-path ./build"
        "build": "webpack --config webpack.config.js"
    },
    "keywords": [
        "webpack1.0"
    ],
    "author": "adsionli",
    "license": "ISC",
    "dependencies": {
        "webpack": "^5.60.0",
        "webpack-cli": "^4.9.1"
    }
}
```

## 5. webpack的使用

### webpack的依赖

 1. 每一个需要使用的modules都应该放入到入口文件处，如main.js中

```js
//无论CommonJs的导入方式，还是es6的模块导入方式，都需要导入进来
import {sum, square} from "./js/util"

const getData = require('./js/api')
console.log(sum(10, 20))
console.log(square(10));
console.log(getData('localhost:8080/getData', 'post'))
```

### loader在webpack中的使用

> 1. 为什么需要loader？
>
> 如果不是loader的话，webpack就无法对除了js**代码之外的内容进行打包**，所以我们需要通过引入loader来让webpack能够获取到loader编译成为js后的内容，然后再作为一个模块进行打包。
>
> 同时loader通过npm安装之后，**还需再webpack中进行配置进行添加，这样才能让loader起效**，不然loader在webpack打包的时候就没有作用！
>
> 2. loader是什么?
>
> loader让 webpack 能够去处理那些非 JavaScript 文件，经过loader处理后可以将所有类型的文件转换为webpack能够处理的有效模块，然后你就可以利用webpack的打包能力，对它们进行处理。

1. loader的使用主要分为两种，一种是行内loader,还有一种就是配置文件中的loader配置

```js
//行内loader,只需要在路径前添加需要使用的loader就可以了，同时用!结尾
import "css-loader!../css/login.css"
```

2. 配置文件的loader配置,配置在modules下

```js
module: {
    rules: [
        {
            test: /\.css$/, //test一般是一个正则表达式，用来匹配需要处理的文件的类型
            use: [
                {
                    loader: 'css-loader'
                }
            ]
        },
        //下面的写法都是简写，主要是当loader没有什么特殊需要的时候，比如不需要额外参数options配置时，就可以使用
        // {
        //     test: /\.css$/,
        //     loader: 'css-loader',
        // },
        // {
        //     test: /\.css$/,
        //     use: ['css-loader']
        // }
    ]
}
```

3. 但是此时的css-loader是没办法解析代码导入的css文件的代码的，只会识别css语法，还需要继续导入style-loader，在可以识别class，style，css link等标签，在通过css-loader转成所需要的内容

```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]
}
```

> ==注意：==loader的use顺序是会影响最后的打包效果的，如果css-loader在use数组中的位置比style-loader的位置要前面的话，还是会无效解析css文件且会报错。只有当style-loader在css-loader之前的时候，打包的时候才可以正确的应用css文件并解析。
>
> **`loader`在`$`中的执行顺序要么是从右到左，要么是从下到上，所以在上述的执行顺序是：`css-loader`去解析css标签然后在传递到style-loader，style-loader在解析代码中class,style,link等标签，最终完成输出**

4. 在webpack中配置sass

   ​		Sass是一款css预处理语言，支持变量，嵌套，mixin和导入等功能，可以很大程度上方便和简化css的写法。

   ​		支持sass支持sass首先需要安装**sass-loader**和**node-sass** 另外还需要安装**style-loader**和**css-loader**

   > 如果说还需要自己测试sass的编译，就需要在项目中安装sass，然后通过npx来进行scss文件的实时编译

   Sass使用在webpack.config.js中的配置

   ```js
   module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
   }
   ```

   > 为什么use中的顺序如上段代码的书写，解释如下：
   >
   > > 首先当我们取到scss文件之后，需要先通过sass-loader对scss文件中的语法进行编译转换成普通的css，然后通过css-loader进行编译，使其成为style-loader可以识别的标签，最后输出给webpack，让webpack完成打包。**这一个过程就像管道处理一样**，一个一个接下去。

### browserslistrc配置

