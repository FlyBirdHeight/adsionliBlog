# leetCode刷题记录

| 文档创建人 | 创建日期   | 文档内容           | 更新时间   |
| ---------- | ---------- | ------------------ | ---------- |
| adsionli   | 2021-11-15 | leetCode刷题1-3 | 2021-11-15 |

> 记录一下leetCode刷题，每天三道(如果有hard题，就一道hard，一道normal)，坚持到校招开始，每篇博文30题

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

### 3. 最长回文子串

> [原题链接](https://leetcode-cn.com/problems/longest-palindromic-substring/)

这道题目就是求一个字符串，倒过来和正过来是一样的，这就是回文子串，这道题目可以直接进行暴力破解或者使用中心拓展法，因为在之前做过这道题目，所以直接用了中心拓展，来ac掉题目，没有测试暴力是否可以ac

```js
//这里其实很简单，就是看从当前这个位置的左右两端是否完全一致。不过这里需要注意的就是可能存在奇数个和偶数个的情况，所以采样点需要去两个，确保不会少。
var aroundCenter = function (s, start, end) {
    let l = start, r = end;
    while (l >= 0 && r < s.length && s[r] == s[l]) {
        l--;
        r++;
    }
    return r - l - 1;
}
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
    let sl = s.length;
    if (sl == 0 || sl == 1) {
        return s;
    }
    let start = 0, end = 0, mLen = 0;
    for (let i = 0; i < s.length; i++) {
        let len1 = aroundCenter(s, i, i);
        let len2 = aroundCenter(s, i, i + 1);
        mLen = Math.max(Math.max(len1, len2), mLen);
        if (mLen > end - start + 1) {
            start = i - parseInt((mLen - 1) / 2);
            end = i + parseInt(mLen / 2);
        }
    }
    return s.substr(start, mLen);
};
```

## hard题目
1. 寻找两个正序数组的中位数

> [原题链接](https://leetcode-cn.com/problems/median-of-two-sorted-arrays/)

这道题目一开始想的太简单了，主要看到这玩意，一下就想到了归并，直接暴力了。但是这样处理不好，因为要把所有数据复制一遍，实在太耗时了，然后修改了代码，只需要找到中位数就可以。结果自己写的代码和题解里的第二种方法一样，但是时间复杂度其实没变，只是代码没那么啰嗦了。所以看了一下解析里面的分析，发现二分的思想处理这道题目非常的好，虽然还有一个切割处理的，但是个人感觉这样的处理方式不适用大部分场景，所以还是选择使用二分的方法ac了这道题目。这里就不解析这道题目了，直接看题解会比较好。

```js
var getKth = function(nums1, s1, e1, nums2, s2, e2, k){
    var n = e1 - s1 + 1;
    var m = e2 - s2 + 1;
    if(n > m){
        return getKth(nums2, s2, e2, nums1, s1, e1, k)
    }
    if(n == 0){
        return nums2[s2 + k - 1];
    }

    if(k == 1){
        return Math.min(nums1[s1], nums2[s2])
    }
    //这里就是取出nums1与nums2中k折半之后的数据下标，同时判断当前k / 2的大小是否大于了数组的长度，如果大于数组长度，直接去数组的最后一位进行比较
    let i = s1 + Math.min(n, Math.floor(k / 2)) - 1;
    let j = s2 + Math.min(m, Math.floor(k / 2)) - 1;
    if(nums1[i] > nums2[j]){
        return getKth(nums1, s1, e1, nums2, j + 1, e2, Math.floor(k  - (j - s2 + 1)));
    }else{
        return getKth(nums1, i + 1, e1, nums2, s2, e2, Math.floor(k - (i - s1 + 1)));
    }
}

var findMedianSortedArrays = function (nums1, nums2) {
    let n = nums1.length;
    let m = nums2.length;
    let len = n + m;
    let left = (len + 1) / 2;
    let right = (len + 2) / 2;
    return (getKth(nums1, 0, n - 1, nums2, 0, m - 1, Math.floor(left)) + getKth(nums1, 0, n - 1, nums2, 0, m - 1, Math.floor(right))) * 0.5;
};
```

