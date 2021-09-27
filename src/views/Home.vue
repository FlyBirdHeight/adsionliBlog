<template>
  <div class="page"></div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    this.$store.commit('SET_SIDEBAR_COVER', {
      titleName: 'adsionli',
      subTitleName: '失意得意切莫在意，顺境逆境切莫止境',
      createTime: '',
      tags: [],
    })
  },
  components: {},
}
</script>
