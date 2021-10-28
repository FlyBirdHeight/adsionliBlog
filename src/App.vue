<template>
  <div id="app">
    <navigation />
    <cover v-if="$route.name != 'Error'"/>
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
  components: {
    Navigation,
    Cover,
  },
}
</script>
<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

</style>
