<template>
  <div id="app">
    <navigation />
    <cover />
    <router-view />
    <el-backtop :bottom="30" :right="30" style="font-size:15px;height:30px;width:30px"></el-backtop>
  </div>
</template>
<script>
import Navigation from '@/components/sidebar/navigation.vue'
import Cover from '@/components/sidebar/cover.vue'
export default {
  data() {
    return {
      lastHeight: '',
    }
  },
  mounted() {
    this.testAnalysis();
  },
  methods: {
    testAnalysis(){
      let returnData = this.analysis.getFile('./content/face/constructor.md');
      returnData.then(res => {
        console.log(res)
      })
    }
  },
  components: {
    Navigation,
    Cover,
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

</style>
