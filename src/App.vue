<template>
  <div id="app">
    <navigation />
    <cover />
    <router-view />
  </div>
</template>
<script>
import Navigation from '@/components/sidebar/navigation.vue'
import Cover from "@/components/sidebar/cover.vue"
export default {
  components: {
    Navigation,
    Cover
  },
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
