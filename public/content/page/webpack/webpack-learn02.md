# webpack学习第二阶段

| 文档创建人 | 创建日期   | 文档内容                                            | 更新时间   |
| ---------- | ---------- | --------------------------------------------------- | ---------- |
| adsionli   | 2021-10-30 | webpack学习第二阶段-文件导入打包以及webpack插件使用 | 2021-10-30 |

### 1.  importLoaders属性说明

> importLoaders是属于css-loader的一个属性，他是可以是css文件中使用@import的一个属性，也就是在另一个css文件中导入一个css文件，但是如果importLoaders如果不配置的话，就出现一些问题，具体分析如下:

假设此时是没有在css-loader中设置过importLoaders的：

1. 首先，css文件会先通过postcss进行解析处理，但是postcss是无法处理@import标签的，只能够转换或是添加相关属性，通过postcss安装的插件。
2. 当postcss-loader处理好标签之后，就会传入到css-loader中，由css-loader来进行处理。
3. 虽然css-loader能够处理@import的标签，但是在这个过程中虽然通过import引入到了另一个文件中，但是这个时候是不能使用Postcss来对css进行处理了的，因为当管道进入到下一个阶段就无法回流了。
4. css-loader处理好之后，就会传给style-loader进行最后一步处理，最终处理成webpack可以打包的js的代码块。

**那么@import这个问题该怎么解决呢，可以通过设置css-loader中的importLoaders来进行解决，他可以表面在处理到import标签之后，跳回到管道的其它层级进行处理，这样就不会造成未处理的问题**

配置代码如下：

```js
module: {
    rule: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: [
                        importLoaders: 1
                    ]
                },
                'postcss-loader',
            ]
        }
    ]
}
```

> 注意，为什么这里设置的是1呢，这就和一阶段学习时所说的有关了，webpack处理loader的顺序是，从右到左，从下到上，所以1指的就是postcss-loader，这样就可以完成处理了

### 2. `File-loader`处理图片

> 使用`file-loader`处理相关文件，让webpack也可以将其当做一个模块进行打包
>
> 功能总结：
>
> 1. 当我们导入一个src或者url的时候能够转成可使用js
> 2. 可以将指定的二进制文件拷贝放在打包后的指定目录下面

在项目中导入`file-loader`

```shell
npm install -D file-loader
```

在`webpack.config.js`中配置识别图片类型文件

```js
module: {
    rules: [
        {
            test: /\.(png|svg|gif|jpe?g)/,
            use: ['file-loader']
        }
    ]
}
```

> 这样配置好之后，在代码中就可以打包出文件，但是也有一些问题

```js
function packImg(imagePath = ''){
    const ole = document.createElement('div');
    const oImg = document.createElement('img');
    oImg.style.width = "400px";
    oImg.style.height = "220px";
    //file-loader为了适配webpack5，将原先require的返回资源地址修改成了需要使用default才可以获取到路径的写法
    oImg.src = require('../img/shadow_qf.png').default;
    ole.appendChild(oImg);

    return ole
}
document.body.appendChild(packImg());
```

这里也通过配置`file-loader`来修改这个问题

```js
module: {
    rules: [
        {
            test: /\.(png|svg|gif|jpe?g)/,
            use: [{
                loader: 'file-loader',
                options: [
                    esModule: false, //是否设置file转成esModule，如果false就保持文件路径
                ]
            }]
        }
    ]
}
```

还有一种方法就是使用`import .. from`的方法来导入图片也可以解决上述问题。

还有一种情况就是在css中使用`background-image`这个标签，然后使用`url`来导入的时候理论上也需要用到`file-loader`，但是css-loader本身也是支持使用file的。

> css-loader处理url的时候，会将后面的地址处理成require的形式，当成一个esmodule来处理，这样就导致了无法找到这个图片，所以这时候还需要增加一个参数给css-loader。
>
> ```js
> module: {
>     rules: [
>          {
>             test: /\.(png|svg|gif|jpe?g)/,
>             use: [{
>                 loader: 'file-loader',
>                 options: [
>                     esModule: false, //是否设置file转成esModule，如果false就保持文件路径
>                 ]
>             }]
>         },
>         {
>             test: /\.css$/,
>             use: ['style-loader', {
>                 loader: 'css-loader',
>                 options: {
>                     importLoaders: 1,
>                     esModule: false
>                 }
>             },{
>                 loader: 'postcss-loader',
>                 options: {
>                     postcssOptions: {
>                         plugins: {
>                             require('autoprefixer'),
>                             require('postcss-pxtorem')({
>                         		rootValue: 16,
>                                 unitPrecision: 5,
>                                 propList: ['font', 'font-size', 'line-height'],
>                                 selectorBlackList: ['letter-spacing', 'height', 'width', 'padding', 'border', 'margin'],
>                                 replace: true,
>                                 minPixelValue: 15
>                     		})
>                         }
>                     }
>                 }
>             }]
>         },
>         {
>             test: /\.scss$/,
>             use: ['style-loader', {
>                 loader: 'css-loader',
>                 options: {
>                     importLoaders: 1,
>                     esModule: false
>                 }
>             },{
>                 loader: 'postcss-loader',
>                 options: {
>                     postcssOptions: {
>                         plugins: {
>                             require('autoprefixer'),
>                             require('postcss-pxtorem')({
>                         		rootValue: 16,
>                                 unitPrecision: 5,
>                                 propList: ['font', 'font-size', 'line-height'],
>                                 selectorBlackList: ['letter-spacing', 'height', 'width', 'padding', 'border', 'margin'],
>                                 replace: true,
>                                 minPixelValue: 15
>                     		})
>                         }
>                     }
>                 }
>             }, 'sass-loader']
>         }
>     ]
> }
> ```



### 3. 设置图片名称与输出tscproj

> 处理file-loader打包之后，设置打包之后图片的名称以及文件名称按照打包之前的目录区分。

通过配置`file-loader`的`options`可以设置打包之后的输出文件形式：

```js
/**
* 占位符的说明(就是一种命名规则)
* [ext]: 扩展名(文件后缀类型)
* [name]: 文件名
* [hash]: 文件名重复的时候，会使用md4算法将文件内容算成一个128位的内容来解决冲突文件
* [contentHash]: 结果与hash结果相同，在webpack中
* [path]: 文件路径，用得不多
* [hash:(length)] 可以规定hash的长度
*/
//outputPath可以指定打包文件是在什么文件夹下面，这样就可以在dist/img文件夹下面找到我们所需要的文件。
{
     test: /\.(jpe?g|git|png|svg)$/,
     use: [{
         loader: 'file-loader',
         options: {
             name: '[name].[hash:6].[ext]',
             outputPath: 'img'
         }
     }]
 }
```

### 4. Url-loader处理图片为外链形式



### 5. asset处理图片



### 6. asset处理图标字体



### 7. webpack插件的使用



### 8. Html-webpack-plugin的使用



##  总结

1. loader总结

| loader名称     | 作用                                                         |
| -------------- | ------------------------------------------------------------ |
| style-loader   | 解析css,class,src,link,style等标签                           |
| css-loader     | 解析css标签，就是css文件中的那些选择器等内容                 |
| file-loader    | 解析代码中的文件路径，使其成为可打包的js代码                 |
| sass-loader    | 解析sass文件，需要配合使用node-sass                          |
| postcss-loader | postcss的loader文件，避免手动去处理postcss，直接在webpack打包中集成进来 |

配置示例：

```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        esModule: false
                    }
                },
                'postcss-loader'
            ]
        }
    ]
}
```



2. css-loader说明

| 参数名        | 作用                                                         | 参数类型 |
| ------------- | ------------------------------------------------------------ | -------- |
| importLoaders | 在css-loader处理css文件中@import之后，再回到管道中的指定位置，在进行其他相应的处理 | Number   |
| esModule      | 是否将文件转换成esModule，如果false就不转换只返回文件路径，否则转换 | Boolean  |
|               |                                                              |          |

配置示例：

```js
{
    loader: 'css-loader',
    options: {
        importLoaders: 1,
        esModule: false
    }
}
```

3. file-loader说明

| 参数名     | 作用                                                         | 参数类型 |
| ---------- | ------------------------------------------------------------ | -------- |
| esModule   | 是否将文件转换成esModule，如果false就不转换只返回文件路径，否则转换 | Boolean  |
| name       | 输出文件的名称，其中包括几种占位符的使用，可以查看上面的内容 | String   |
| outputPath | 文件输出路径，可以将文件按照指定的路径进行输出               | String   |

配置示例：

```js
{
    test: /\.(jpe?g|git|png|svg)$/,
    use: [{
        loader: 'file-loader',
        /**
        * 占位符的说明(就是一种命名规则)
        * [ext]: 扩展名(文件后缀类型)
        * [name]: 文件名
        * [hash]: 文件名重复的时候，会使用md4算法将文件内容算成一个128位的内容来解决冲突文件
        * [contentHash]: 结果与hash结果相同，在webpack中
        * [path]: 文件路径，用得不多
        * [hash:(length)] 可以规定hash的长度
        */
        options: {
            name: '[name][hash:6].[ext]',
            outputPath: 'img',
            esModule: false
        }
    }]
}
```

4. postcss-loader说明

> postcss中的参数就是其使用的各种插件

| 参数名             | 作用                                                         | 参数类型     |
| ------------------ | ------------------------------------------------------------ | ------------ |
| autoprefixer       | 根据browserslist，添加各个不同平台的css规则                  | Broswerslist |
| postcss-preset-env | postcss中一个预设了一些内容的插件，如果无需特别的定制化内容，可以直接使用这个preset-env的预设插件 | Object       |
| postcss-pxtorem    | postcss中一款用于处理px转换成rem单位的插件                   | Object       |

配置示例：

```js
{
    loader: 'postcss-loader',
    options: {
        postcssOptions: {
            plugins: {
                require('autoprefixer'),
                require('postcss-pxtorem')({
                    rootValue: 16,
                    unitPrecision: 5,
                    propList: ['font', 'font-size', 'line-height'],
                    selectorBlackList: ['letter-spacing', 'height', 'width', 'padding', 'border', 'margin'],
                    replace: true,
                    minPixelValue: 15
                })
            }
        }
    }
}
```

