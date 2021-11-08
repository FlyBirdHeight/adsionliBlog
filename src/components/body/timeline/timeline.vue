<template>
  <div class="timeline">
    <ul class="timeline_list">
        <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
    mounted() {
        console.log(this.$slots.default)
    },
}
</script>

<style lang="scss" scoped>
.timeline {
  margin: auto;
  padding: 10px 10px;
  position: relative;
  .timeline_list {
    list-style-type: none;
  }
}
</style>
