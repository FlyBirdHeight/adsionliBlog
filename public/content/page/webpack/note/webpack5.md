# 常用webpack5的包的记录

| 文档创建人 | 创建日期   | 文档内容               | 更新时间   |
| ---------- | ---------- | ---------------------- | ---------- |
| adsionli   | 2022-07-28 | 常用webpack5的包的记录 | 2022-07-28 |



1. 单独提取css文件，是首次加载闪屏现象进行消除: MiniCssExtractPlugin

2. postcss-loader解决样式兼容性问题

3. css-loader将css资源解析成commonjs，导入js文件

4. sass-loader处理sass资源文件

5. css-mini-size-plugin，css压缩插件

6. vue-loader, react-hot-loader 都可以支持热模块替换功能，HMR

   如果没有的话，需要自己实现以下代码

   ```js
   if(module.hot) {
       module.hot.accept("....")
   }
   ```

   



