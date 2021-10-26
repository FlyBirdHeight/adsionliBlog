# Render MarkdownAnalysis之后页面解析遇到的问题及解决记录

| 文档创建人 | 创建日期   | 文档内容           | 更新时间 |
| ---------- | ---------- | ------------------ | -------- |
| adsionli   | 2021-10-25 | 页面解析问题的解决 | 暂无     |

## 1. Render开发时遇到的问题
1. 在vue中，可以首先想到的就是v-html, 但是在实际开发过程中，却遭遇了问题，就是因为为了可以更好地管理自己的内容，我将table创建为了组件内容，所以使用v-html标签的时候就无法解析出table的组件标签，这时候因为没有使用vue函数组件以及模块渲染的知识，浪费了好多时间进行查阅资料。
2. 对于jsx以及模块渲染的使用不熟练，导致在书写render的时候出现了很多的问题，始终无法进行解决。

## 2. 问题解决
1. 代码示例
```
import TableList from '@/components/utils/table/table.vue'
import TableColumn from '@/components/utils/table/table-column.js'
import Vue from 'vue'
export default {
    name: "RenderPage",
    render(h) {
        const com = Vue.extend({
            template: `<div>${this.renderHtml}</div>`
        });
        return h(com, {})
    },
    mounted() {
        this.changeHtmlData();
    },
    props: {
        renderHtml: {
            type: String,
            default: ''
        }
    },
    methods: {
        changeHtmlData(){
        }
    },
    components: {
        TableList,
        TableColumn
    }
}
```
2. 代码解读
   这里创建了一个函数组件，同时使用了vue中提供的模块渲染，通过`h(也就是this.$createElement)`这个方法，在创建了com组件，然后将`renderHtml`放入到这个组件中的`template`中，然后再创建出来，同时这里需要引入`table`组件的内容，不过我的处理是直接在全局注册了`table`的组件,这样就不会出现找不到内置组建的问题了