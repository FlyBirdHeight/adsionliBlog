<template>
  <div class="container">
    <el-row :gutter="12">
      <el-col :xs="24" :sm="24" :md="{span:16, offset:2}" :lg="{span:16, offset:2}">
        <page-list />
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6">
        <tag-list />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PageList from "@/components/body/page_list.vue";
import TagList from "@/components/body/tag.vue";
export default {
  name: 'Home',
  mounted() {
    
  },
  components: {
    PageList,
    TagList
  },
}
</script>
