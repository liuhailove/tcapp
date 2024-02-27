<template>
  <div class="edit-address">
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
        show-delete
        show-set-default
        show-search-result
        :addressInfo="addressInfo"
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"/>
  </div>
</template>

<script setup>
import {showDialog, Toast} from "vant";
import areaList from '@/utils/area';
import {fetchAddressDetail, updateAddress} from "@/api/address";

const router = useRouter();
const route = useRoute();
const addressInfo = ref()

const searchResult = ref([{
  name: '黄龙万科中心',
  address: '杭州市西湖区'
}]);

const onClickLeft = () => {
  router.back()
}

const onSave = (addressInfo) => {
  let addressData = {
    id: route.params.addressId,
    name: addressInfo.name,
    phoneNumber: addressInfo.tel,
    postCode: addressInfo.areaCode,
    detailAddress: addressInfo.addressDetail,
    province: addressInfo.province,
    city: addressInfo.city,
    region: addressInfo.county,
    prefixAddress: addressInfo.province + addressInfo.city + addressInfo.county,
    defaultStatus: addressInfo.isDefault === true ? 1 : 0,
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
  updateAddress(addressData).then(response => {
    Toast("地址修改成功!");
  });
  router.push({path: "/user/address"});
}

const onDelete = (content) => {
  Toast('删除成功')
  router.back()
}

const onChangeDetail = (val) => {
  if (val) {
    this.searchResult = [{
      name: '黄龙万科中心',
      address: '杭州市西湖区'
    }];
  } else {
    this.searchResult = [];
  }
}

onMounted(() => {
  fetchAddressDetail(route.params.addressId).then(response => {
    let isDefault = false;
    if (response.data.defaultStatus === 1) {
      isDefault = true;
    }
    addressInfo.value = {
      id: response.data.id,
      name: response.data.name,
      tel: response.data.phoneNumber,
      addressDetail: response.data.detailAddress,
      province: response.data.province,
      city: response.data.city,
      county: response.data.region,
      areaCode: response.data.postCode,
      isDefault: isDefault,
    };
  });
});

</script>

<style lang="less" scoped>
.edit-address {
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