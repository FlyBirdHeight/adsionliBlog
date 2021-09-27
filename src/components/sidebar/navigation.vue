<template>
  <div class="toolbar">
    <div class="blogName">
      <a href="/">adsionli</a>
    </div>
    <div class="toolbar-list">
      <ul>
        <li v-for="(value, index) in menuList" :key="index">
          <a @click="goOtherRoute(value.routeLink)">{{ value.label }}</a>
        </li>
      </ul>
    </div>
    <el-dropdown class="drop-list-menu" trigger="click" @command="goOtherRoute">
      <span class="el-dropdown-link">
        <i class="iconfont icon-menu"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(value, index) in menuList" :key="index" :command="value.routeLink">
          {{ value.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import MenuList from '@/data/menu.json'
export default {
  name: 'navigation',
  data() {
    return {
      menuList: MenuList.menu,
    }
  },
  methods: {
    /**
     * @method goOtherRoute 跳转其他路由
     */
    goOtherRoute(routeLink) {
      if (this.$route.path != routeLink) {
        this.$router.push({ path: routeLink })
      }
    },
  },
}
</script>

<style></style>
