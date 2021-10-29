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

## 3. webpack的简单实用



## 4. webpack的终端指令集合

|    指令名称     |                         指令作用                         |                           示例                            |
| :-------------: | :------------------------------------------------------: | :-------------------------------------------------------: |
|    `--entry`    | 可以指定其目标文件路径，而不再去默认寻找./src/index.js了 |            `npx webpack --entry ./src/main.js`            |
| `--output-path` |                可以指定编译文件的输出目录                | `npx webpack --entry ./src/main.js --output-path ./build` |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |
|                 |                                                          |                                                           |

## 5.webpack的文件配置

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
        "build": "webpack"
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

