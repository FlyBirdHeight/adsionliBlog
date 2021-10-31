module.exports = () => ({
    plugins: [
        require('autoprefixer'),
        require('postcss-pxtorem')({
            //根元素字体大小或根据input参数返回根元素字体大小。
            rootValue: 16,
            //REM单位增加的十进制数字
            unitPrecision: 5,
            //需要转换成rem单位的选择器
            propList: ['font', 'font-size', 'line-height'],
            //忽略的选择器，保留px
            selectorBlackList: ['letter-spacing', 'height', 'width', 'padding', 'border', 'margin'],
            //替换包含rem的规则
            replace: true,
            //最小替换元素的大小
            minPixelValue: 15
        }),
        require('postcss-preset-env')
    ]
})