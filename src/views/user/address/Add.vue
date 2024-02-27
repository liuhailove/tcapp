<template>
  <div class="add-address">
    <van-nav-bar
        title="选择地址"
        :fixed=true
        left-arrow
        @click-left="onClickLeft"
    />
    <!-- 添加地址 -->
    <van-address-edit
        :area-list="areaList"
        show-postal
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @change-detail="onChangeDetail"
        save-button-text="保存"
    />
  </div>
</template>
<script setup>
import {showDialog, Toast} from "vant";
import areaList from '@/utils/area';
import {addAddress} from "@/api/address";

const searchResult = ref([{
  name: '黄龙万科中心',
  address: '杭州市西湖区'
}]);


let router = useRouter();
const onClickLeft = () => {
  router.back()
}

const onSave = (addressInfo) => {
  let addressData = {
    name: addressInfo.name,
    phoneNumber: addressInfo.tel,
    postCode: addressInfo.areaCode,
    detailAddress: addressInfo.addressDetail,
    default: addressInfo.isDefault,
    province: addressInfo.province,
    city: addressInfo.city,
    region: addressInfo.county,
    prefixAddress: addressInfo.province + addressInfo.city + addressInfo.county,
  };
  if (!addressData.name) {
    showDialog({
      title: '提示',
      message: '请填写收货人姓名',
      theme: 'round-button',
    }).then(() => {
      return;
    });
  }
  if (!addressData.name) {
    showDialog({
      title: '提示',
      message: '请填写收货人姓名',
      theme: 'round-button',
    }).then(() => {
      return;
    });
  }
  if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(addressData.phoneNumber)) {
    showDialog({
      title: '提示',
      message: '请输入正确的手机号码',
      theme: 'round-button',
    }).then(() => {
      return;
    });
  }
  if (!addressData.prefixAddress) {
    showDialog({
      title: '提示',
      message: '请输入区域',
      theme: 'round-button',
    }).then(() => {
      return;
    });
  }
  if (!addressData.province) {
    showDialog({
      title: '提示',
      message: '请输入正确的省份',
      theme: 'round-button',
    }).then(() => {
      return;
    });
  }
  if (!addressData.detailAddress) {
    showDialog({
      title: '提示',
      message: '请填写详细地址信息',
      theme: 'round-button',
    }).then(() => {
      return;
    });
  }
  addAddress(addressData).then(response => {
    Toast("地址添加成功!");
  });
  router.push({path: "/user/address"});
}

const onChangeDetail = (val) => {
  Toast("onChangeDetail")
}
</script>


<style lang="less" scoped>
.add-address {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 2001;
  padding-top: 1rem;
}
</style>