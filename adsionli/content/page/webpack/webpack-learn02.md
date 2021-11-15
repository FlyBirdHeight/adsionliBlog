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

### 2. File-loader处理图片

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

### 4. url-loader处理图片为外链形式

`url-loader`的优点：

1. `url-loader`能够将文件处理成`base64uri`形式，这样就可以减少一个页面的请求次数。
2. 生成的打包文件中不包含原文件

`url-loader`的缺点：

1. 影响请求数据的大小，如果数据过大，请求时间就会很长。虽然减少了请求次数，但是加大了请求页面的大小，拖累了加载的速度

`url-loader`与`file-loader`之间的不同：

1. `url-loader`是将文件转换成`base64uri`的形式，但是`file-loader`实际上就是将文件打包到指定的目录下，然后导入文件路径
2. `url-loader`打包后生成的页面只有一次请求;`file-loader`引入文件后，在页面加载时是分多次请求的。

**==`url-loader`内部是有`file-loader`的，这个时候就需要通过设置limit来限制文件的大小，当大于多少时就是用`file-loader`来处理，当小的时候就直接转成base64放在一个页面中处理即可==**。

```js
{
    test: /\.(jpe?g|git|png|svg)$/,
    use: [
            // {
            //     loader: 'file-loader',
            //     options: {
            //         name: '[name][hash:6].[ext]',
            //         outputPath: 'img'
            //     }
            // }
            {
            loader: 'url-loader',
            options: {
                name: 'img/[name][hash:6].[ext]',
                limit: 25 * 1024
            }
        }
    ]
}
```

> `limit`参数控制了当文件大于多少大小时，就是用`file-loader`进行处理，并可以设置`name`来放在指定的打包目录下。同时这里不需要导入`file-loader`,因为这是`url-loader`内部自带的。

### 5. asset(webpack5专属的资源类型模块)处理图片

> asset模块是webpack5中新增加的内容，有了asset模块之后，就不需要再去配置url-loader或者是file-loader了。
>
> asset模块的详情可见webpack官网: [asset Module模块详解](https://webpack.js.org/guides/asset-modules/)

常见的配置选项如下:

| 配置名称 | 作用                                                         | 使用例子 |
| -------- | ------------------------------------------------------------ | -------- |
| resource | 和file-loader的功能一样，将文件打包到指定路径下              |          |
| line     | 和url-loader的功能一样，将文件转成base64uri行内处理          |          |
| source   | 和row-loader功能一样，可以将文件作为字符串导入到js文件中，感觉类似比如将.txt文件或是.json文件通过`import ... from "raw-loader!./file.txt"`这种，有点类似css-loader在文件中直接使用的形式，但是用处不大 |          |
| limit    | 和url-loader中的limit是一样的，可以动态调整resource和line的使用 |          |
|          |                                                              |          |
|          |                                                              |          |

1. 使用asset模块

```js
//使用如下代码就可以替代file-loader,raw-loader,url-loader，这块内容依然是放在module-rules下的
{
    test: /\.(jpe?g|git|png|svg)$/,
    type: 'asset/resource'
}
```

2. 具体配置asset模块

```js
//可以在output中去配置全局的assetModuleFileName
{
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFileName: "img/[name][hash:4].[ext]"
    }
}
```

> 不过上述的配置又不好的地方，如果说我们需要将不同的文件打包在不同路径下就无法做到了，所以这个时候还有一种配置方式,这是针对asset/resource来说的

```js
{
    test: /\.(jpe?g|git|png|svg)$/,
    type: 'asset/resource',
    generator: {
        filename: "img/[name][hash:4].[ext]"
    }
}
```

3. 同时使用asset/resource和asset/inline两块内容的使用方式

```js
{
    test: /\.(jpe?g|git|png|svg)$/,
    //如果同时需要输入多个模块内容，那这里的只需要指定asset就可以了
    type: 'asset',
    //这里用来设置asset/resource的输出路径
    generator: {
        filename: "img/[name][hash:4].[ext]"
    },
    parser: {
        //设置数据转成line的条件
        dataUrlCondition: {
            maxSize: 30 * 1024
        }
    }
}
```

### 6. asset处理图标字体

asset处理图标字体的处理流程总结：

1. 首先我们需要知道图标字体文件基本会包含如下几个模块：

   (1)    **iconfont.css** 

   (2)    **iconfont.ttf**

   (3)    **iconfont.woff**

   (4)    **iconfont.woff2**

2. 在iconfont.css中存在如下一段代码

   ```css
   @font-face {
       font-family: "iconfont"; /* Project id 2838392 */
       src: url('iconfont.woff2?t=1632727489161') format('woff2'),
           url('iconfont.woff?t=1632727489161') format('woff'),
           url('iconfont.ttf?t=1632727489161') format('truetype');
   }
   ```

   上述代码中可以看出，在`iconfont.css`中会导入`iconfont`字体图标的三个文件，然后可以通过`css-loader`进行解析url来获取到，但是这里还需要**file-loader**的支持。但是在`webpack5`中，只需要通过**asset-module**(资源管理模块)就可以完成文件的导入。

3. 配置字体图标asset模块的支持

   ```js
   {
       test: /\.(ttf|woff|woff2)/,
       type: 'asset/resource',
       generator: {
           filename: 'font/[name][hash:6].[ext]'
       }
   }
   ```

4. 配置好之后,npm run build，就可以完成啦！很简单的几步操作

### 7. webpack插件的使用

> 在webpack打包中，webpack插件是必不可少的。比如说在每一次重新打包之后，我们需要手动删除上一次的打包内容，这样会显得很繁琐。那么可以通过插件，让其在每一次重新打包之后，都会完全覆盖掉上一次打包的内容，皆可以免去这一步操作。

loader在webpack中主要实现的功能主要就是: 转换特定类型的文件或代码

**plugin(插件)能在webpack中做一些什么:** 

==更多的事情，在整个webpack打包过程中的任意一个阶段进行插入处理相关内容，贯穿webpack生成的整个周期==

以css压缩的来举例：

1. 当我们在index.js中使用import导入css文件的时候，这个时候css-loader会进行生效，解析css文件。
2. 在css-loader解析完成之后，我们可以对css文件进行压缩，以减小代码打包后的大小，然后在使用style-loader去解析那些css的标签，如style, class, link等。
3. 那么在本例中我们就可以发现，我们会把一个插件放在css-loader和style-loader处理的中间，这样就可以去实现一些目标。这就可以体现出插件的一些用途



这里在使用一个实际例子，在webpack打包前，清除上一次的打包记录的例子：

1. 首先需要通过npm将clean-webpack-plugin导入到项目中来。

   ```shell
   npm install -D clean-webpack-plugin
   ```

2. 然后我们需要明确的就是，实际上这个webpack的每一个plugin其实都是一个类，所以我们需要把这个类导入到webpack中去

3. 然后配置webpack.config.js

   ```js
   const {CleanWebpackPlugin} = require('clean-webpack-plugin');
   
   export.modules = {
       plugins: [
           new CleanWebpackPlugin()
       ]
   }
   ```

4. 上述就可以完成一个webpack-plugin的配置，如果需要配置插件constructor就可以前往插件的官网查看需要输入的参数，来完成相关配置，在new的时候直接传入就可以了。

### 8. html-webpack-plugin的使用

> html-webpack-plugin可以在根目录下没有创建index.html的时候自动创建index.html在打包的时候。当然还会提供一些额外功能

1. html-webpack-plugin插件自动在打包时，创建一个index.html文件，并且导入相关的js文件，这样就可以让webpack打包完成之后直接进行发布。在vue2.x的vue-cli4中，也是使用了html-webpack-plugin进行的打包

2. 首先是导入html-webpack-plugin

3. 其次在webpack.config.js中配置，同样和上面的操作一样，将plugin做为模块导入，然后再添加到plugins中去

   ```js
   const HtmlWebpackPlugin = require('html-webpack-plugin')
   export.modules = {
       plugins: [
            new HtmlWebpackPlugin({
               title: 'adsionli的webpack学习之路',
               template: './public/index.html'
           }),
       ]
   }
   ```

4. 这样就可以将模板文件导入进来打包到index.html文件中

5. 如果模板文件中存在未定义变量，这个时候就需要到如webpack本身存在的一个plugin，叫做DefinePlugin,他可以设置全局的变量来进行使用，比如模板文件中的BASE_URL就可以设置在其中

   ```js
   const { DefinePlugin } = require('webpack')
   export.modules = {
   	plugins: [
   		new DefinePlugin({
               BASE_URL: '"./"'
           })
   	]
   }
   ```

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

5. plugin说明：

   插件对于webpack来说是非常重要的一个模块，它可以作用在webpack各个阶段来对打包时的文件进行处理，这样可以让打包出来的文件更加符合我们部署的要求，是一种十分有用且便利的一个工具。
