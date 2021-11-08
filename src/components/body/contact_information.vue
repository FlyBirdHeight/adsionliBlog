<template>
  <div class="contact_information">
    <el-divider></el-divider>
    <h4 class="contact_information-title">个人联系方式</h4>
    <ul class="contact_information-list">
      <li class="contact_information-list" v-for="(value, index) in contactList" :key="index">
        <div class="contact_information-body">
          <i class="iconfont" :class="value.icon"></i>
          <span class="body-name">{{ value.name }}:</span>
          <span class="body-value">{{ value.data }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Config from '@/data/config.json'
export default {
  data() {
    return {
      contactList: Config.contact,
    }
  },
}
</script>

<style lang="scss" scoped>
.contact_information {
  text-align: left;
  padding: 10px;
  .contact_information-title {
    color: #a3a3a3;
    font-weight: 800;
  }
  .contact_information-list {
    padding: 0;
    margin: 0;
    line-height: 30px;
    .contact_information-list {
      .contact_information-body {
        display: flex;
        align-items: center;
        justify-items: center;
        .body-name {
          color: #303133;
          font-weight: 600;
          padding-right: 10px;
          font-size: 14px;
        }
        .body-value {
          font-size: 14px;
          font-weight: 600;
          color: #606266;
        }
      }
      .contact_information-body > i {
        color: #67c23a;
        padding-right: 10px;
      }
    }
  }
}
</style>
