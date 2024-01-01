<!--商品分类导航-->
<template>
  <div>
    <div class="category">
      <van-tabs v-model:active="active">
        <van-tab v-for="(item,index) in categoryList" :title="item.name">
          内容 {{ item.name }} {{ item.id }}
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categoryList: Array
  },
  methods: {
    gotoCategoryList(id) {
      this.$router.push({name: 'category', params: {id: id}})
    }
  },
  setup() {
    const active = ref(0);
    return {active};
  },
}
</script>
<style lang="less" scoped>
//.category{
//  margin-top: 50px;
//}
</style>