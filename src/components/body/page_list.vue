<template>
  <div class="page-list">
    <div class="page-info" v-for="(value, index) in showPageingList" :key="index">
      <a @click="goToPageRoute(value.routeLink)">
        <h2 class="title">
          <font class="top" v-if="value.toTop">[置顶]</font>{{ value.title }}
        </h2>
        <div class="subTitle">
          {{ value.description }}
        </div>
      </a>
      <div class="createTime">
        <p>{{ value.createTime }}</p>
      </div>
      <el-divider></el-divider>
    </div>
    <paging
      layout="total,jumper,size"
      @changeShowCount="changeCount"
      @currentPageChange="changePage"
      :totalCount="totalCount"
      :pageSizes="pageSizes"
    />
  </div>
</template>

<script>
/**
 * @description Home页面下文章列表组件
 */
import Paging from "@/components/utils/paging.vue";
export default {
  name: "page_list",
  data() {
    return {
      pageListValue: this.$store.getters.getPageList,
      totalCount: 0,
      pageSizes: [10, 20, 30, 40, 50],
      pagePageingList: [],
      showPageingList: [],
    };
  },
  beforeMount() {
    this.totalCount = this.pageListValue.length;
  },
  mounted() {
    this.handlePage();
    this.resolvePage(this.pageSizes[0]);
    this.changePage();
  },
  methods: {
    /**
     * @method goToPageRoute 前往文章路由
     * @param {String} routerLinker
     */
    goToPageRoute(routerLinker) {
      this.$router.push({ path: routerLinker });
    },
    /**
     * @method handlePage 处理一下文章的排序，按照置顶优先再按照时间进行排序
     */
    handlePage() {
      this.pageListValue = this.pageListValue.sort((a, b) => {
        if (a.toTop == b.toTop) {
          let aDate = new Date(a.created_at);
          let bDate = new Date(b.created_at);
          return bDate.getTime() - aDate.getTime();
        }
        return b.toTop - a.toTop;
      });
    },
    /**
     * @method resolvePage 按分页数量分解数组
     * @param {Number} count 分页数量
     */
    resolvePage(count = 10) {
      this.pagePageingList = [];
      this.pageListValue.forEach((value, index) => {
        const page = Math.floor(index / count);
        if (!this.pagePageingList[page]) {
          this.pagePageingList[page] = [];
        }
        this.pagePageingList[page].push(value);
      });
    },
    changeCount(val) {
      let [count, page] = val;
      this.resolvePage(count);
      this.changePage(page);
    },
    changePage(val = 1) {
      console.log(val)
      this.showPageingList = this.pagePageingList[(val - 1)];
    },
  },
  components: {
    Paging,
  },
};
</script>

<style></style>
