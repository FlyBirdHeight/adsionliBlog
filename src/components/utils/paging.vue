<template>
  <div class="paging">
    <div class="total" v-if="showMapping.total">
      <span>{{ `共${totalCount}篇` }}</span>
    </div>
    <div class="setting-count" v-if="showMapping.size">
      <el-select v-model="count" placeholder="请选择" @change="changeShowCount">
        <el-option v-for="(item, index) in pageSizes" :key="index" :label="`${item}条/页`" :value="item"> </el-option>
      </el-select>
    </div>
    <div class="pagination-bar">
      <el-button
        class="pre"
        style="border: none"
        icon="el-icon-arrow-left"
        :disabled="isStart"
        @click="jumperPage(page - 1 < 1 ? 1 : page - 1)"
      ></el-button>
      <ul class="pager-tree">
        <li
          class="pager-value"
          v-for="(item, index) in pagingList"
          @click="currentPageChange(item, index)"
          :key="index"
        >
          <a
            class="el-icon-more"
            :id="`pagerValue${index}`"
            @mouseover="isHover(index)"
            @mouseout="isOut(index)"
            v-if="item == '...'"
          ></a>
          <a :id="`pagerValue${index}`" v-else :class="[isActive(index, item) ? 'active' : '']">{{ item }}</a>
        </li>
      </ul>
      <el-button
        class="next"
        style="border: none"
        icon="el-icon-arrow-right"
        :disabled="isEnd"
        @click="jumperPage(page + 1 > pageTotal ? pageTotal : page + 1)"
      ></el-button>
    </div>
    <div class="jumper" v-if="showMapping.jumper">
      <span>前往</span>
      <el-input-number
        class="jumper-value"
        v-model="page"
        :controls="false"
        :min="1"
        :max="pageTotal"
        @change="jumperPage"
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
  data() {
    /**
     * @property {Number} page 页数
     * @property {Number} pageTotal 分页总数
     * @property {Number} lastShowCount 最后一次显示数量记录
     * @property {*} showMapping 设置显示种类，默认上一页，下一页，页码表均显示；total表示数目总数，jumper表示可设置跳转页，size表示设置显示个数
     * @property {Boolean} isStart 是否是起始页，控制pre按钮是否可点击
     * @property {Boolean} isEnd 是否是结束页，控制next按钮是否可点击
     * @property {Boolean} pagingList 页码选择列表
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
      pagingList: [],
    }
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
    this.generatePagingList()
    console.log(this);
  },
  methods: {
    /**
     * @method isHover 当页数很多的时候，会有省略符的出现，如果hover时，修改其class
     * @param {Number} item 数组下标
     */
    isHover(item) {
      let aValue = document.querySelector(`#pagerValue${item}`)
      if (this.pagingList[item] == '...') {
        let first = this.pagingList.indexOf('...')
        let second = this.pagingList.lastIndexOf('...')
        if (first == second && first == this.pagingList.length - 2) {
          aValue.setAttribute('class', 'el-icon-d-arrow-right')
        } else if (first != second && item == first) {
          aValue.setAttribute('class', 'el-icon-d-arrow-left')
        } else if (first == second && item == 1) {
          aValue.setAttribute('class', 'el-icon-d-arrow-left')
        } else {
          aValue.setAttribute('class', 'el-icon-d-arrow-right')
        }
      }
    },
    /**
     * @method isOut 当页数很多的时候，会有省略符的出现，如果out时，修改其class
     * @param {Number} item 数组下标
     */
    isOut(item) {
      let aValue = document.querySelector(`#pagerValue${item}`)
      if (this.pagingList[item] == '...') {
        aValue.setAttribute('class', 'el-icon-more')
      }
    },
    /**
     * @method isActive 当页数很多的时候，会有省略符的出现，如果hover时，修改其class
     * @param {Number} index 数组下标
     * @param {String} value 数组元素
     */
    isActive(index, value) {
      if (value == '...') {
        return false
      }
      return this.pagingList[index] == this.page ? true : false
    },
    /**
     * @method generatePagingList 生成页码列表
     */
    generatePagingList() {
      if (this.pageTotal > 7) {
        for (let i = 1; i < 7; i++) {
          this.pagingList.push(i)
        }
        this.pagingList.push('...')
        this.pagingList.push(this.pageTotal)
      } else {
        for (let i = 1; i < this.pageTotal + 1; i++) {
          this.pagingList.push(i)
        }
      }
    },
    /**
     * @method handlePagingList 处理分页列表
     */
    handlePagingList() {
      let newP = []
      this.pagingList.splice(0, this.pagingList.length)
      if (this.pageTotal > 7) {
        let startD = this.page - 1
        let endD = this.pageTotal - this.page
        if (startD >= 4 && endD >= 4) {
          newP.push(1)
          newP.push('...')
          for (let i = Number(this.page) - 2; i < Number(this.page) + 3; ++i) {
            newP.push(i)
          }
          newP.push('...')
          newP.push(this.pageTotal)
        } else if (startD >= 4 && endD < 4) {
          newP.push(1)
          newP.push('...')
          for (let i = Number(this.page) - (5 - endD); i < this.pageTotal + 1; ++i) {
            newP.push(i)
          }
        } else if (startD < 4 && endD >= 4) {
          for (let i = 1; i < this.page + (5 - startD) + 1; ++i) {
            newP.push(i)
          }
          newP.push('...')
          newP.push(this.pageTotal)
        } else if (startD < 4 && endD < 4) {
          for (let i = 1; i < this.pageTotal + 1; ++i) {
            newP.push(i)
          }
        }
        this.pagingList = newP
      } else {
        for (let i = 1; i < this.pageTotal + 1; ++i) {
          newP.push(i)
        }
        this.pagingList = newP
      }
    },
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
      this.pageTotal = this.calculatePageTotal(this.count, this.totalCount)
      this.refreshPage()
      this.handlePagingList()
      this.$emit('changeShowCount', [this.count, this.page])
    },
    /**
     * @method currentPageChange 当前显示页数改变
     * @param {String} value 数组元素
     * @param {String} index 数组下标
     */
    currentPageChange(value, index) {
      if (value == '...') {
        let first = this.pagingList.indexOf(value)
        let second = this.pagingList.lastIndexOf(value)
        if (first == second && index == this.pagingList.length - 2) {
          this.page = this.page + 5
        } else if (first != second && index == first) {
          this.page = this.page - 5 < 0 ? 1 : this.page - 5
        } else if (first == second && index == 1) {
          this.page = this.page - 5 < 0 ? 1 : this.page - 5
        } else {
          this.page = this.page + 5
        }
      } else {
        this.page = this.pagingList[index]
      }
      this.handlePagingList()
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
     * @method jumperPage 分页跳转
     * @param {*} value 跳转分页
     */
    jumperPage(value) {
      this.page = value
      this.handlePagingList()
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
