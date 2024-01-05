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
import areaList from '@/utils/area'
import {Toast} from 'vant'

let router = useRouter()
const addressInfo = ref({
  areaCode: "0026",
  postalCode: "0034",
  addressDetail: "河南周口",
  isDefault: true,
})

const searchResult = ref([{
  name: '黄龙万科中心',
  address: '杭州市西湖区'
}])
const onClickLeft = () => {
  router.back()
}

const onSave = (content) => {
  Toast('修改成功')
  router.back()
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
  padding-top: 3rem;
}
</style>