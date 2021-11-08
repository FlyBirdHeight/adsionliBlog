<template>
  <li class="timeline_item">
    <div class="left_line"></div>
    <div @click.stop="packUpTime" class="list_icon" :class="`list_icon-${size}`" :style="{ backgroundColor: color }">
      <i
        :class="`iconfont ${icon} list_icon-node`"
        :style="{ fontSize: size == 'normal' ? '12px' : '19px', lineHeight: size == 'normal' ? '15px' : '22px' }"
      ></i>
    </div>
    <div class="list_body">
      <div v-if="!hideTimestamp && timePlacement === 'top'" class="list_body_timestamp is-top">
        {{ timestamp }}
      </div>
      <div class="list_body-content">
        <slot></slot>
      </div>

      <div v-if="!hideTimestamp && timePlacement === 'bottom'" class="list_body_timestamp is-bottom">
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: '#e4e7ed',
    },
    size: {
      type: String,
      default: 'normal',
    },
    icon: String,
    timePosition: {
      type: String,
      default: 'top',
    },
    hideTimestamp: {
      type: Boolean,
      default: false,
    },
    timestamp: String,
  },
  data() {
    return {
      packUp: false,
      timePlacement: this.timePosition,
    }
  },
  method: {
    packUpTime() {
      this.packUp = !this.packUp
      this.timePlacement = this.packUp ? 'top' : this.timePosition
    },
  },
}
</script>

<style lang="scss" scoped>
.timeline_item {
  position: relative;
  padding-bottom: 20px;
  font-size: 15px;
  .left_line {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #e4e7ed;
  }
  .list_icon {
    position: absolute;
    border-radius: 50%;
    background-color: #e4e7ed;
    display: flex;
    justify-content: center;
    align-items: center;
    .list_icon-node {
      color: #ffffff;
    }
  }
  .list_icon-normal {
    left: -3px;
    width: 15px;
    height: 15px;
    font-size: 10px;
  }
  .list_icon-large {
    left: -6px;
    width: 22px;
    height: 22px;
    font-size: 16px;
  }
  .list_body {
    position: relative;
    text-align: left;
    padding-left: 25px;
    top: -3px;
    .list_body_timestamp {
      color: #909399;
      line-height: 1;
      font-size: 13px;
    }
    .is-top {
      padding-top: 8px;
      margin-bottom: 10px;
    }
    .is-bottom {
      margin-top: 10px;
    }
    .list_body-content {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3px;
      color: #303133;
    }
  }
}
</style>
