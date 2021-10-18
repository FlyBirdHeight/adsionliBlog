const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
    //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了
    runtimeCompiler: true,
    // 基本路径  3.6之前的版本时 baseUrl
    publicPath: "./",
    // 输出文件目录
    outputDir: "adsionli",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 8080,
        https: false,
        hotOnly: false,
        // proxy: {

        // },
    },
    css: {
        loaderOptions: {
            sass: {
                // 全局sass变量	
                //sass-loader 新版本
                prependData: `
                    @import "@/assets/scss/variable.scss";
                    @import "@/assets/scss/mixin.scss";
                `
            }
        }
    },
};