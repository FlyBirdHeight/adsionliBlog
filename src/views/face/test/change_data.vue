<template>
  <div>
    <button @click="handleData(list)">处理数据</button>
  </div>
</template>

<script>
/**
 * @method findPre 寻找其前驱是否存在
 */
var findParent = (pre, data) => {
  if (pre.length < 1) {
    return null
  }
  if (typeof data[pre] == 'undefined') {
    pre = pre.substr(0, pre.length - 2)
    return findParent(pre, data)
  } else {  
    return data[pre].id
  }
}
export default {
  mounted() {},
  data() {
    return {
      list: [
        { id: '0', name: 'title-0' },
        { id: '0.1', name: 'title-0.1' },
        { id: '0.1.1', name: 'title-0.1.1' },
        { id: '0.2', name: 'title-0.2' },
        { id: '0.2.1', name: 'title-0.2.1' },
        { id: '0.2.2', name: 'title-0.2.2' },
        { id: '0.2.2.1', name: 'title-0.2.2.1' },
        { id: '0.2.3.1', name: 'title-0.2.3.1' },
        { id: '0.3.1', name: 'title-0.3.1' },
      ],
    }
  },
  methods: {
    handleData: (list) => {
      let newA = new Object()
      let returnData = new Object()
      for (let i in list) {
        let listLength = list[i].id.length
        let numLength = listLength - Math.floor(listLength / 2)
        if (numLength > 1) {
          let pre = list[i].id.substr(0, listLength - 2)
          list[i]['pre'] = pre
        }
        newA[list[i].id] = list[i]
      }
      console.log(newA);

      for (let key in newA) {
        let data = newA[key]
        if (typeof data['pre'] == 'undefined') {
          returnData[data.id] = data;
          continue
        }
        if (typeof newA[data.pre] != 'undefined') {
          if (typeof newA[data.pre]['children'] == 'undefined') {
            newA[data.pre]['children'] = []
          }
          newA[data.pre]['children'].push(data)
          delete newA[key]['pre']
        }else{
          let pre = findParent(data.pre, newA);
          if (typeof newA[pre]['children'] == 'undefined') {
            newA[pre]['children'] = []
          }
          newA[pre]['children'].push(data)
          delete newA[key]['pre']
        }
      }
      console.log(returnData);
    },
  },
}
</script>

<style></style>
