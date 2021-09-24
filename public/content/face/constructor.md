# 原型-原型链-构造方法

```
function f(){}
Object.getPropertyOf(f)
//Object.getPropertyOf方法返回的是指定对象的现实原型->prototype
let a = f1.prototype.constructor.__proto__
```

<div class="paragraph mt-10 mb-10">
    <el-button style="position: relative; left: 72%" type="danger" @click="pipelineRes = ''">重置</el-button>
    <el-button style="position: relative; left: 75%" @click="useGetPropertyOf">运行</el-button>
</div>

运行结果：

```
{{isEqualPrototype}}
```
