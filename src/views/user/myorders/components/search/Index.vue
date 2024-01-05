<template>
  <div class="searchContainer">
    <van-search
        v-model="searchValue"
        input-align="center"
        show-action
        placeholder="搜索订单"
    >
      <template #left-icon>
        <van-icon name="search" class="search-icon"/>
      </template>
      <template #action>
        <van-icon name="ellipsis" @click="handleMoreFeatures"/>
      </template>
    </van-search>
  </div>
  <div class="moreFeatures">
    <!-- 底部弹出 -->
    <van-popup
        v-model:show="showBottom"
        round
        closeable
        close-icon="close"
        position="bottom"
        :style="{ height: '40%' }"
    >
      <div class="popup-header">
        <span class="popup-title">更多功能</span>
        <!--        <van-icon name="cross" class="popup-close" @click="hideMoreFeatures" />-->
      </div>
      <div class="popup-content">
        <!-- 弹出框导航项内容 -->
        <div v-for="(item, index) in navItems" :key="index">
          <van-grid :column-num="item.gridItems.length" :border="false" :square="false">
            <van-grid-item v-for="(gridItem,idx) in item.gridItems"
                           :key="idx"
                           :icon="gridItem.icon"
                           :text="gridItem.text"
                           :badge="gridItem.badge"
                           @click="handleGridClick(gridItem.to)"
                           :style="{height: '10%'}"
            />
          </van-grid>
          <van-divider/>
        </div>
      </div>
      <router-view/>
    </van-popup>
  </div>
</template>
<script setup>
const searchValue = ref('');
const showBottom = ref(false)
const router = useRouter()

const handleMoreFeatures = () => {
  showBottom.value = true
}

const handleGridClick = (toUrl) => {
  router.push({path: toUrl})
}

const navItems = ref([
  {
    gridItems: [
      {
        icon: "setting-o",
        text: "授权设置",
        to: "/user/config",
        badge: ""
      },
      {
        icon: "location-o",
        text: "我的地址",
        to: "/user/address",
        badge: ""
      },
      {
        icon: "cart-o",
        text: "购物车",
        to: "/",
        badge: "10"
      },
      {
        icon: "chat-o",
        text: "客服消息",
        to: "/",
        badge: "99"
      },
      {
        icon: "shop-collect-o",
        text: "同辰商城",
        to: "/",
        badge: ""
      },
    ]
  },
  {
    gridItems: [
      {
        icon: "coupon-o",
        text: "卡券红包",
        to: "/",
        badge: ""
      },
      {
        icon: "comment-o",
        text: "评价中心",
        to: "/",
        badge: ""
      },
      {
        icon: "cash-back-record-o",
        text: "同辰月付",
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

</script>
<style lang="less">
.searchContainer {
  margin-bottom: auto;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #f5f5f5;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
}

.popup-close {
  font-size: 20px;
  color: #999;
}

.nav-container {
  height: 20px
}

</style>