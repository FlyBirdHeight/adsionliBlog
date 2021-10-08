<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="{ span: 17, offset: 1 }" :lg="{ span: 16, offset: 2 }">
        <catalogue-list />
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6">
        <tag-list />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TagList from '@/components/body/tag.vue'
import CatalogueList from '@/components/body/catalogue_list.vue'
export default {
  name: 'Catalogue',
  methods: {},
  components: {
    TagList,
    CatalogueList
  },
}
</script>

<style></style>
