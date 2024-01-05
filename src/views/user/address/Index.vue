<template>
  <div class="address">
    <van-nav-bar
        title="收货地址"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"/>
    <!-- 地址列表 -->
    <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
        add-button-text="新增地址"/>

    <!-- 路由出口 -->
    <transition name="router-slider"
                mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script setup>
let route = useRoute()
let router = useRouter()
let chosenAddressId = route.query.chosenAddressId
let tp = route.query.type
const addressList = ref([
  {
    id: 1,
    name: '河南周口',
    tel: "1888888888",
    address: '河南省周口市区一栋',
  },
  {
    id: 2,
    name: '深圳南山',
    tel: "1888888888",
    address: '深圳南山龙岗中心城市',
  }
])
const onClickLeft = () => {
  router.back()
}

const onAdd = () => {
  router.push({path: "/user/address/add"})
}

const onEdit = (item, index) => {
   router.push({path: "/user/address/edit",params: {addressId: item.id}})
}

const onSelect = (item, index) => {
  console.info(tp)
  if (tp === '1') {
    chosenAddressId = item.id
    router.back()
  }
}

</script>

<style lang="less" scoped>
.address {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 2000;
  padding-top: 3rem;

  /*转场动画*/

  .router-slider-enter-active,
  .router-slider-leave-active {
    transition: all 0.3s;
  }

  .router-slider-enter,
  .router-slider-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
}

</style>