<template>
  <!-- 分享组件 -->
  <van-share-sheet @select="select" v-model:show="innerShareShow" :overlay="true" title="立即分享" :options="options"/>
</template>

<script setup>
import {showToast} from 'vant'
import {watchEffect} from "vue";

// const props = defineProps(['shareShow']);

const props = defineProps({
  shareSheetShow: {
    type: Boolean,
    default: false
  }
})


const innerShareShow = ref(props.shareSheetShow);   //显示或隐藏分享面板
console.info("innerShareShow:" + props.shareSheetShow)
const options = [             //分享面板数据
  [
    {name: '微信', icon: 'wechat'},
    {name: 'QQ', icon: 'qq'},
    {name: '复制链接', icon: 'link'},
  ],
];

// 复制链接
const select = (e) => {
  if (e.name === '复制链接') {
    let qwe = 'https://snowcyans.github.io/QQShortVideo/#/'
    navigator.clipboard.writeText(qwe)
    showToast('复制成功')
    innerShareShow.value = false
  } else {
    showToast('暂未开放')
  }
}

watchEffect(() => {
  console.info("watchEffect shareShow:" + props.shareSheetShow)
  innerShareShow.value = props.shareSheetShow;
});
</script>