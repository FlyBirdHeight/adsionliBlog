# leetCode刷题记录

| 文档创建人 | 创建日期   | 文档内容           | 更新时间   |
| ---------- | ---------- | ------------------ | ---------- |
| adsionli   | 2021-11-15 | leetCode刷题1-3 | 2021-11-15 |

> 记录一下leetCode刷题，每天三道，坚持到校招开始，每篇博文30题

## simple题目

### 1. 两数之和

> [原题链接](https://leetcode-cn.com/problems/two-sum/)

这题目不是很难弄，只需要用哈希表，就可以直接完成。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
    let numsMap = new Map();
    for (let i = 0; i < nums.length; ++i) {
        if (numsMap.has(target - nums[i])) {
            return [numsMap.get(target - nums[i]), i]
        }
        numsMap.set(nums[i], i);
    }
};
```



## normal题目

### 1. 两数之和

> [原题链接](https://leetcode-cn.com/problems/add-two-numbers/)

这道题虽然是一道中等题，但是实际也是一个水题，只需要一位一位读过去就可以了，最后再判断一下最后有没有进位就可以了。

```js
//这里我把整个调试代码也放出来，可以复制到vsCode上使用Run Code插件直接运行
function ListNode(val, next) {
    this.val = (val === undefined ? 0 : val)
    this.next = (next === undefined ? null : next)
}
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    let l1Node = l1;
    let l2Node = l2;
    let a = 0;
    let b = 0;
    let addSum = 0;
    let resNode = new ListNode();
    let node = resNode;
    while (l1Node || l2Node) {
        a = l1Node ? l1Node.val : 0;
        b = l2Node ? l2Node.val : 0;
        let sum = a + b + addSum;
        addSum = sum >= 10 ? parseInt(sum / 10) : 0;
        node.val = sum % 10;
        l1Node = l1Node ? l1Node.next : null;
        l2Node = l2Node ? l2Node.next : null;
        if (!l1Node && !l2Node) {
            if (addSum != 0) {
                node.next = new ListNode;
                node = node.next;
                node.val = addSum;
                node.next = null;
            } else {
                node.next = null;
            }

        } else {
            node.next = new ListNode;
            node = node.next;
        }
    }


    return resNode;

};

const l1 = () => {
    let l1 = [9, 9, 9, 9, 9, 9, 9];
    let headNode = new ListNode();
    let node = headNode;
    for (let i = 0; i < l1.length; i++) {
        node.val = l1[i];
        if (i == l1.length - 1) {
            node.next = null;
        } else {
            node.next = new ListNode;
            node = node.next;
        }
    }

    return headNode;
}

const l2 = () => {
    let l2 = [9, 9, 9, 9];
    let headNode = new ListNode();
    let node = headNode;
    for (let i = 0; i < l2.length; i++) {
        node.val = l2[i];
        if (i == l2.length - 1) {
            node.next = null;
        } else {
            node.next = new ListNode;
            node = node.next;
        }
    }

    return headNode;
}

let list1 = l1();
let list2 = l2();

let list = addTwoNumbers(list1, list2);
while (list) {
    console.log(list.val);
    list = list.next;
}
```

这道题目实际可以继续优化，因为写的有点啰嗦了，各位可以自行进行优化即可。

### 2. 无重复字符的最长子串

> [原题链接](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

这道题目其实很像滑动窗口，记得在很早之前就有做过这种题目，主要需要注意一下记录字符的位置变化，不是说遇到重复的之前全部删除掉，而是从删除掉的后一位继续接上去才可以。

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let compareStr = '';
    let max = 0;
    for(let i = 0; i < s.length; i++){
        let indexOf = compareStr.indexOf(s[i]);
        if(indexOf == -1){
            compareStr += s[i];
        }else {
            if(compareStr.length > max){
                max = compareStr.length;
            }
            if(compareStr.length == indexOf){
                compareStr = s[i];
            }else{
                compareStr = compareStr.substr(indexOf + 1) + s[i];
            }
        }
    }
    if(compareStr.length > max){
        max = compareStr.length
    }

    return max;
};
```

