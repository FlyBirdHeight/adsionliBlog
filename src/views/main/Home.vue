<template>
  <div class="container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="{ span: 15, offset: 1 }" :lg="{ span: 15, offset: 1 }">
        <page-list />
      </el-col>
      <el-col :xs="24" :sm="24" :md="{ span: 7, offset: 1 }" :lg="{ span: 7 }">
        <tag-list />
        <contact-information />
        <friend-link />
        <time-list />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PageList from '@/components/body/page_list.vue'
import TagList from '@/components/body/tag.vue'
import TimeList from '@/components/body/time_list.vue'
import FriendLink from "@/components/body/friend_link.vue"
import ContactInformation from "@/components/body/contact_information.vue"
export default {
  name: 'Home',
  components: {
    PageList,
    TagList,
    TimeList,
    FriendLink,
    ContactInformation
  },
}
</script>
