<template>
  <div class="paging">
    <div class="total" v-if="showMapping.total">
      <span>{{ `共${totalCount}页` }}</span>
    </div>
    <div class="setting-count" v-if="showMapping.size">
      <el-select v-model="count" placeholder="请选择" @change="changeShowCount">
        <el-option v-for="(item, index) in pageSizes" :key="index" :label="`${item}条/页`" :value="item"> </el-option>
      </el-select>
    </div>
    <div class="pagination-bar">
      <div class="pre">
        <el-button icon="el-icon-arrow-left" :disabled="isStart"></el-button>
      </div>
      <div class="pager">
        <ul v-if="pageTotal.length < 8">
          <li v-for="item in pageTotal" :key="item" @click="currentPageChange(item)">{{ item }}</li>
        </ul>
        <ul v-else>
          <li v-for="item in pageTotal" @click="currentPageChange(item)" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="next">
        <el-button icon="el-icon-arrow-right" :disabled="isEnd"></el-button>
      </div>
    </div>
    <div class="jumper" v-if="showMapping.jumper">
      <span>前往</span>
      <el-input-number
        v-model="page"
        :controls="false"
        :min="1"
        :max="pageTotal"
        @change="currentPageChange"
      ></el-input-number>
      <span>页</span>
    </div>
  </div>
</template>

<script>
/**
 * @description 分页组件
 */
export default {
  name: 'paging',
  props: {
    /**
     * @property {Array} pageSizes 显示页数数量设置
     * @property {Number} totalCount 显示总数
     */
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50],
    },
    totalCount: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    if (this.$attrs.hasOwnProperty('layout')) {
      this.handleShowList(this.$attrs.layout)
    }
    if (this.totalCount != 0) {
      this.pageTotal = this.calculatePageTotal(this.count, this.totalCount)
      this.lastShowCount = 1
      if (this.pageTotal > 1) {
        this.isEnd = false
      }
    }
  },
  data() {
    /**
     * @property {Number} page 页数
     * @property {Number} pageTotal 分页总数
     * @property {Number} lastShowCount 最后一次显示数量记录
     * @property {*} showMapping 设置显示种类，默认上一页，下一页，页码表均显示；total表示数目总数，jumper表示可设置跳转页，size表示设置显示个数
     */
    return {
      count: this.pageSizes[0],
      page: 1,
      pageTotal: 1,
      lastShowCount: 0,
      showMapping: {
        total: false,
        jumper: false,
        size: false,
      },
      isStart: true,
      isEnd: true,
    }
  },
  methods: {
    /**
     * @method handleShowList 处理显示项
     */
    handleShowList(showList) {
      let show = showList.split(',')
      if (show.length > 0) {
        for (let value of show) {
          if (this.showMapping.hasOwnProperty(value)) {
            this.showMapping[value] = true
          }
        }
      }
    },
    /**
     * @method changeShowCount 改变显示数量
     */
    changeShowCount(value) {
      this.count = value
      this.calculatePageTotal(this.count, this.totalCount)
      this.refreshPage()
      this.$emit('changeShowCount', [this.count, this.page])
      
    },
    /**
     * @method currentPageChange 当前显示页数改变
     */
    currentPageChange(page) {
      this.page = page
      this.isStart = false
      this.isEnd = false
      this.lastShowCount = this.count * (this.page - 1) + 1
      if (this.page == 1) {
        this.isStart = true
      }
      if (this.page == this.pageTotal) {
        this.isEnd = true
      }
      this.$emit('currentPageChange', this.page)
    },
    /**
     * @method calculatePageTotal 计算分页总数
     * @param {Number} count 展示数
     * @param {Number} totalCount 总数
     */
    calculatePageTotal(count, totalCount) {
      let remainder = totalCount % count == 0 ? 0 : 1
      let pageCount = Math.trunc(totalCount / count) + remainder

      return pageCount
    },
    /**
     * @method refreshPage 当改变count显示数量时，刷新所在页数
     */
    refreshPage() {
      this.page = Math.ceil(this.lastShowCount / this.totalCount)
    },
  },
  watch: {
    totalCount: (newV, oldV) => {
      this.pageTotal = this.calculatePageTotal(this.count, newV)
      if (this.pageTotal > 1) {
        this.isEnd = false
      }
    },
  },
}
</script>

<style></style>
