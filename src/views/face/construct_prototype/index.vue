<template>
  <div class="page">
    <div class="title">
      <h2>原型-原型链-构造</h2>
    </div>
    <div class="body">
      <el-divider></el-divider>
      <div class="code">
        <p class="code_font">function f(){}</p>
        <p class="code_font">Object.getPropertyOf(f)</p>
        <p class="code_font note">//Object.getPropertyOf方法返回的是指定对象的现实原型->prototype</p>
        <p class="code_font">let a = f1.prototype.constructor.__proto__</p>
      </div>
      <div class="paragraph mt-10 mb-10">
        <el-button style="position: relative; left: 72%" type="danger" @click="pipelineRes = ''">重置</el-button>
        <el-button style="position: relative; left: 75%" @click="useGetPropertyOf">运行</el-button>
      </div>
      <div class="paragraph">运行结果：</div>
      <div class="code">
        <p class="code_font">{{ isEqualPrototype }}</p>
      </div>
    </div>
    <div class="foot"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getPropertyOfValue: '',
      isEqualPrototype: '',
    }
  },
  methods: {
    useGetPropertyOf() {
      function f1() {}
      this.getPropertyOfValue = Object.getPrototypeOf(f1)
      let a = f1.prototype.constructor.__proto__
      this.isEqualPrototype = a === this.getPropertyOfValue ? 'yes' : 'no'
      console.dir(a)
      console.dir(this.getPropertyOfValue)
      console.dir(f1)
    },
  },
}
</script>

<style></style>
