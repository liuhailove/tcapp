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
import {fetchAddressList} from "@/api/address";

let route = useRoute();
let router = useRouter();
let chosenAddressId = route.query.chosenAddressId
let tp = route.query.type
const addressList = ref([]);
onMounted(() => {
  fetchAddressList().then(response => {
    for (let i = 0; i < response.data.length; i++) {
      let isDefault = false;
      if (response.data[i].defaultStatus === 1) {
        isDefault = true;
      }
      addressList.value.push({
        id: response.data[i].id,
        name: response.data[i].name,
        tel: response.data[i].phoneNumber,
        address: response.data[i].province + " " + response.data[i].city + response.data[i].region + response.data[i].detailAddress,
        isDefault: isDefault,
      })
    }
  });
});
const onClickLeft = () => {
  router.back()
}

const onAdd = () => {
  router.push({path: "/user/address/add"})
}

const onEdit = (item, index) => {
  router.push({name: 'editAddress', params: {addressId: item.id}});
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
  padding-top: 1rem;

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