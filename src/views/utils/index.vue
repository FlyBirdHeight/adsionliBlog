<template>
  <div class="page">
    <router-view></router-view>
    <turn> </turn>
  </div>
</template>

<script>
import Turn from "@/components/pages/turn.vue"
export default {
  components: {
    Turn
  }
}
</script>

<style>

</style>