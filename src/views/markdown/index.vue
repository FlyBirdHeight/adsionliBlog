<template>
  <div class="page" :key="key()">
    <render-page> </render-page>
    <turn></turn>
  </div>
</template>

<script>
import Turn from '@/components/pages/turn.vue'
import RenderPage from '@/components/pages/render/render_page.js'
export default {
  name: 'Markdown',
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    key() {
      const randomNumber = Math.random().toString()
      return this.$route.name !== undefined ? this.$route.name + randomNumber : this.$route + randomNumber
    },
  },
  watch: {
    $route: function(to, from) {
      console.log(to, from)
    },
  },
  components: {
    Turn,
    RenderPage,
  },
}
</script>

<style></style>
