<template>
  <div class="friend_link">
    <el-divider></el-divider>
    <h4 class="friend_link-title">友情链接</h4>
    <ul class="friend_link-list">
      <li class="friend_link-info" v-for="(value, index) in friendLinkList" :key="index">
        <a class="friend_link-href" :href="value.path" target="_blank">{{ `${value.name}: ${value.path}` }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Config from '@/data/config.json'
export default {
  data() {
    return {
      friendLinkList: Config.friendLink,
    }
  },
}
</script>

<style lang="scss" scoped>
.friend_link {
  text-align: left;
  padding: 10px;
  .friend_link-title {
    color: #a3a3a3;
    font-weight: 800;
  }
  .friend_link-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .friend_link-info {
    margin-bottom: 15px;
  }
  .friend_link-info > a {
    color: getPageValue('utils', 'hrefColor');
    font-weight: 500;
    text-decoration: none;
  }
  .friend_link-info > a:hover {
    color: #409eff;
  }
}
</style>
