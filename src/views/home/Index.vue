<template>
  <div id="home-container">
    <div id="top-bar">
      <van-sticky>
        <van-tabs v-model:active="active" lazy-render @change="handleTabClick" sticky>
          <van-tab v-for="(item,idx) in tobBar" :name="item.id">
            <template #title>
              <van-icon :name="item.icon"/>
              {{ item.title }}
            </template>
          </van-tab>
        </van-tabs>
      </van-sticky>
      <router-view></router-view>
    </div>
    <!-- 内容页 -->
    <div class="content">
      <component :is="activeTabComponent"></component>
    </div>

    <!--常用功能-->
    <div class="commonFeatures">
      <!-- 底部弹出 -->
      <van-popup
          v-model:show="showCommonFeatures"
          round
          closeable
          close-icon="close"
          position="left"
          :style="{ width: '90%', height: '100%' }">
        <div class="popup-dialog">
          <div class="popup-header">
            <span class="popup-title">常用功能</span>
          </div>
          <div class="popup-content">
            <div class="spike">
              <div class="spike-header">
                <span class="spike-header-title">最近使用</span>
              </div>
              <div class="spike-content">
                <!-- 最近使用 -->
                <!-- 弹出框导航项内容 -->
                <div v-for="(item, index) in navItems" :key="index">
                  <van-grid :column-num="item.gridItems.length" :border="false" :square="false">
                    <van-grid-item v-for="(gridItem,idx) in item.gridItems"
                                   :key="idx"
                                   :icon="gridItem.icon"
                                   :text="gridItem.text"
                                   :badge="gridItem.badge"
                                   @click="handleGridClick(gridItem.to)"
                    />
                  </van-grid>
                  <van-divider/>
                </div>
              </div>
            </div>


            <!--常用功能-->
            <div class="spike">
              <div class="spike-header">
                <span class="spike-header-title">常用功能</span>
              </div>
              <div class="spike-content">
                <!-- 最近使用 -->
                <!-- 弹出框导航项内容 -->
                <div v-for="(item, index) in navItems" :key="index">
                  <van-grid :column-num="item.gridItems.length" :border="false" :square="false">
                    <van-grid-item v-for="(gridItem,idx) in item.gridItems"
                                   :key="idx"
                                   :icon="gridItem.icon"
                                   :text="gridItem.text"
                                   :badge="gridItem.badge"
                                   @click="handleGridClick(gridItem.to)"
                                   :style="{fontSize: '10px'}"
                    />
                  </van-grid>
                  <van-divider/>
                </div>
              </div>
            </div>


            <!--生活动态-->
            <div class="spike">
              <div class="spike-header">
                <span class="spike-header-title">生活动态</span>
              </div>
              <div class="spike-content">
                <!-- 生活动态 -->
                <!-- 弹出框导航项内容 -->
                <div v-for="(item, index) in navItems" :key="index">
                  <van-grid :column-num="item.gridItems.length" :border="false" :square="false"
                            class="spike-grid-content">
                    <van-grid-item v-for="(gridItem,idx) in item.gridItems"
                                   :key="idx"
                                   :icon="gridItem.icon"
                                   :text="gridItem.text"
                                   :badge="gridItem.badge"
                                   @click="handleGridClick(gridItem.to)"
                    />
                  </van-grid>
                  <van-divider/>
                </div>
              </div>
            </div>
          </div>
        </div>

      </van-popup>
    </div>

    <!-- 回到顶部按钮 -->
    <!--    <v-top/>-->
  </div>
</template>
<script setup>


// 电商组件
import MallContent from '@/views/mall/Index.vue';
// 直播组件
import LiveContent from '@/views/live/Index.vue';
// 默认活跃的tab
const active = ref(3)
// 常用功能
const showCommonFeatures = ref(false)

let lastActive = active.value
// 活跃组件
const activeTabComponent = ref(LiveContent)
const handleTabClick = (id) => {
  console.info("handleTabClickInHome:" + id)
  if (id !== 1) {
    lastActive = id;
  }
  if (id === 3) {
    activeTabComponent.value = LiveContent
    showCommonFeatures.value = false
  } else if (id === 1) {
    showCommonFeatures.value = true
    active.value = lastActive
  } else {
    activeTabComponent.value = MallContent
    showCommonFeatures.value = false
  }
}
// 初始化顶部菜单
const tobBar = ref([
  {
    name: "app",
    title: "",
    icon: "apps-o",
    to: "/commonFeatures",
    id: 1,
  },
  {
    name: "hot",
    title: "热点",
    icon: "",
    to: "/hot",
    id: 2,
  },
  {
    name: "live",
    title: "直播",
    icon: "",
    to: "/live",
    id: 3,
  },
  {
    name: "mall",
    title: "电商",
    icon: "",
    to: "/mall",
    id: 4,
  },
  {
    name: "recommend",
    title: "推荐",
    icon: "",
    to: "/recommand",
    id: 5,
  },
  {
    name: "search",
    title: "",
    icon: "search",
    to: "/search",
    id: 6,
  },
  {
    name: "setting",
    title: "",
    icon: "setting-o",
    to: "/setting",
    id: 7,
  },
]);
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
        to: "/user/coupon",
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

<style lang="less" scoped>
.home-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 2000;
  padding-top: 44px;
  overflow: auto;
}


.spike {
  position: relative;
  background: #ffffff;
  margin-top: 20px;

  &-header {
    padding: 0 10px;
    display: inline-block;
    &-title {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      float: left;
      font-weight: bold;
    }

    &-countdown {
      float: left;

      &-lt {
        margin-top: 1px;
        margin-left: 10px;
        font-size: 12px;
        border: 1px solid #FB0017;
        border-right: none;
        border-bottom-left-radius: 22px;
        border-top-left-radius: 22px;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
        color: #ffffff;
        background: #FB0017;
        float: left;
      }

      &-rt {
        margin-top: 1px;
        font-size: 12px;
        float: left;
        border: 1px solid #FB0017;
        border-bottom-right-radius: 22px;
        border-top-right-radius: 22px;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
      }
    }

    &-more {
      float: right;

      &-text {
        height: 20px;
        line-height: 15px;
        font-size: 10px;
      }

      .van-icon {
        margin-left: 2px;
        height: 10px;
        line-height: 10px;
        float: right;
      }
    }
  }

  &-content {
    height: auto;
    .van-card-full {
      background-color: #f1f1f1;
    }
  }
}

.popup {
  &-dialog {
    width: 100%;
    background-color: #f8f9fa;
    box-sizing: border-box;
  }

  &-content {

  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background-color: #f5f5f5;
  }

  &-title {
    font-size: 16px;
    font-weight: bold;
  }
}

</style>