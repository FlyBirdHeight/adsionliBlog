<template>
  <div>
    <div>
      <h1>第七章：函数的拓展</h1>
    </div>
    <div>
      <div>
        <button @click="setStructureFunction('http:127.0.0.1')" class="left-margin">
          测试函数解构参数调用,错误调用
        </button>
        <button @click="setStructureFunction('http:127.0.0.1', {})" class="left-margin">
          测试函数解构参数调用,传入空对象
        </button>
        <button @click="setStructureFunction('http:127.0.0.1', { body: { list: '1' } })" class="left-margin">
          测试函数解构参数调用,传入携带值对象
        </button>
        <button @click="setTwoStructureFunction('http:127.0.0.1')" class="left-margin">
          测试函数解构参数调用,双重默认值
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * @method setStructureFunction 单重默认值设置解构函数
     */
    setStructureFunction: (url, { body = '', method = 'GET', header = {} }) => {
      console.log('setStructureFunction', body)
      console.log('setStructureFunction', method)
      console.log('setStructureFunction', header)
    },
    /**
     * @method setTwoStructureFunction 双重默认值设置解构函数
     */
    setTwoStructureFunction: (url, { body = '', method = 'GET', header = {} } = {}) => {
      console.log('setTwoStructureFunction', body)
      console.log('setTwoStructureFunction', method)
      console.log('setTwoStructureFunction', header)
    },
  },
}
</script>

<style>
.left-margin {
  margin-left: 10px;
}
</style>
