<template>
  <div class="image-preview"></div>
</template>

<script>
export default {
  name: 'ImagePreview',
  props: {
    srcList: {
      type: Array,
      default: () => [],
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
  },
  methods: {},
  data() {
    return {
      lastShowIndex: 0,
    }
  },
}
</script>

<style></style>
