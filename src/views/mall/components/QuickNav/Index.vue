<template>
  <div id="quickNav" class="quickNavContainer">
    <van-swipe @change="handleSwipeChange">
      <van-swipe-item v-for="(item, index) in navItems" :key="index">
        <!-- 导航项内容 -->
        <van-grid :column-num="item.gridItems.length" :border="false" :square="true">
          <van-grid-item v-for="(gridItem,idx) in item.gridItems"
                         :key="idx"
                         :icon="gridItem.icon"
                         :text="gridItem.text"
                         @click="handleGridClick(gridItem.to)"
          />
        </van-grid>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup>
const activeIndex = ref(0)
const show = ref(true)
const router = useRouter()

const navItems = ref([
  {
    gridItems: [
      {
        icon: "orders-o",
        text: "我的订单",
        to: "/user/order",
        badge: ""
      },
      {
        icon: "gold-coin-o",
        text: "手机充值",
        to: "/mobile/recharge",
        badge: ""
      },
      {
        icon: "shop-o",
        text: "同辰超市",
        to: "/",
        badge: "券"
      },
      {
        icon: "chat-o",
        text: "客服消息",
        to: "/",
        badge: "99"
      },
      {
        icon: "logistics",
        text: "商品物流",
        to: "/",
        badge: ""
      },
    ]
  },
  {
    gridItems: [
      {
        icon: "cash-back-record-o",
        text: "退货售后",
        to: "/",
        badge: ""
      },
      {
        icon: "shop-collect-o",
        text: "关注店铺",
        to: "/",
        badge: ""
      },
      {
        icon: "new-arrival-o",
        text: "试用领取",
        to: "/",
        badge: ""
      },
      {
        icon: "hot-sale-o",
        text: "热卖",
        to: "/",
        badge: ""
      },
      {
        icon: "start-o",
        text: "收藏",
        to: "/",
        badge: ""
      },
    ]
  }
])

const handleGridClick = (toUrl) => {
  // 处理导航项点击事件
  console.log('点击了导航项', toUrl);
  router.push({ path: toUrl });
}

const handleSwipeChange = (index) => {
  console.info("handleSwipeChange:" + index)
  // 根据滑动方向切换内容
  if (index > activeIndex) {
    // 向左滑动
    activeIndex.value = index;
  } else {
    // 向右滑动
    activeIndex.value = index;
  }
}
</script>
<style lang="less" scoped>
//.quickNavContainer {
//  width: 100%; /* 设置容器宽度为 100% */
//}
</style>

