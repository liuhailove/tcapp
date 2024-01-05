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
        save-button-text="保存并使用"
    />
  </div>
</template>
<script setup>
import {Toast} from "vant";
import areaList from '@/utils/area'

const searchResult = ref([{
  name: '黄龙万科中心',
  address: '杭州市西湖区'
}])

let router = useRouter();
const onClickLeft = () => {
  router.back()
}

const onSave = (content) => {
  console.info(content)
  Toast("添加成功")
  router.back()
}

const onChangeDetail = (val) => {
  console.info(val)
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
  padding-top: 3rem;
}
</style>