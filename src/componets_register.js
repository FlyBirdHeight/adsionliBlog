import Vue from 'vue'
import TableList from '@/components/utils/table/table.vue'
import TableColumn from '@/components/utils/table/table-column.js'
import TreeList from '@/components/utils/tree/tree.vue'
import ImageData from '@/components/utils/image/image.vue'
import TimeLine from '@/components/body/timeline/timeline.vue'
import TimeLineItem from '@/components/body/timeline/timeline-item.vue'
Vue.component('table-list', TableList);
Vue.component('table-column', TableColumn);
Vue.component('tree-list', TreeList);
Vue.component('image-data', ImageData);
Vue.component('time-line', TimeLine);
Vue.component('time-line-item', TimeLineItem);