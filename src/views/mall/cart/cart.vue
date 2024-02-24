<template>
  <div class="cart">
    <van-nav-bar
        title="购物车"
        :fixed=true
        :right-text="selectedCnt > 0 ? '删除' : '' "
        @click-right="onClickDeleteCartGoods"
        left-arrow
        @click-left="onClickLeft"
    >
    </van-nav-bar>
    <van-checkbox-group class="cart-goods"
                        v-model="checkedGoods"
                        ref="checkboxGroup">
      <van-checkbox
          class="cart-goods__item"
          v-for="(goods,index) in shopCartList"
          :key="index"
          :name="goods.id"
          v-model="goods.checked"
          @click="handleSingleSelect(index)"
          label-disabled>

        <van-card :title="goods.productName"
                  :desc="goods.spDataStr"
                  :price="goods.price"
                  :thumb="goods.productPic">
          <template #num>
            <div class="stepper">
              <span @click.stop="handleReduceGoods(goods.id,goods.quantity)">-</span>
              <input type="number" disabled v-model="goods.quantity">
              <span @click.stop="handleAddGoods(goods.id,goods.quantity)">+</span>
            </div>
          </template>
        </van-card>
      </van-checkbox>
    </van-checkbox-group>
    <van-submit-bar
        :price="totalPrice"
        :disabled="!selectedCnt"
        :button-text="submitBarText"
        @submit="onSubmit">
      <van-checkbox v-model="isCheckedAll">全选</van-checkbox>
    </van-submit-bar>
  </div>


</template>

<script setup lang="ts">
import {Toast, Dialog, showConfirmDialog, showToast} from 'vant';
import {mapState, mapGetters, mapMutations, useStore} from 'vuex'
import {fetchCartList, updateQuantity, deleteCartItem} from "@/api/cart";

const router = useRouter()
const store = useStore();
const hasLoginValue = computed(() => store.state.hasLogin);
// 总价格
const totalPrice = ref(0);
// 全选状态  true|false
const allChecked = ref(false);
// 空白页现实  true|false
const empty = ref(false);
const shopCartList = ref([]);
const selectedCnt = computed(() => selectedCount());
const submitBarText = computed(() => {
  const count = selectedCount();
  return '结算' + (count ? `(${count})` : '')
});
// 选中条数
const selectedCount = () => {
  let selectedCount = 0
  Object.values(shopCartList.value).forEach((goods, index) => {
    if (goods.checked) {
      selectedCount++
    }
  })
  return selectedCount
};
const checkedGoods = computed({
  get() {
    let checkedGoods = [];
    Object.values(shopCartList.value).forEach(goods => {
      if (goods.checked) {
        checkedGoods.push(goods.id);
        selectedCount.value = selectedCount.value + 1;
      }
    })
    return checkedGoods;
  },
  set(value) {

  }
});

const isCheckedAll = computed({
  get() {
    let flag = true;
    Object.values(shopCartList.value).forEach(goods => {
      if (!goods.checked) {
        flag = false;
      }
    });
    return flag;
  }
  ,
  set(value) {
    let isCheckedAll = !value;
    Object.values(shopCartList.value).forEach(goods => {
      goods.checked = isCheckedAll;
    });
    calcTotal();
  }
});
onMounted(() => {
  loadData();
});
const loadData = () => {
  if (!hasLoginValue) {
    return;
  }
  fetchCartList().then(response => {
    let list = response.data;
    shopCartList.value = list.map(item => {
      item.checked = true;
      item.loaded = "loaded";
      let spDataArr = JSON.parse(item.productAttr);
      let spDataStr = '';
      for (let attr of spDataArr) {
        spDataArr += attr.key;
        spDataStr += ":";
        spDataStr += attr.value;
        spDataStr += ";";
      }
      item.spDataStr = spDataStr;
      return item;
    });
    // 计算总价
    calcTotal();
  });
};
// 计算总价
const calcTotal = () => {
  let list = shopCartList.value;
  if (list.length === 0) {
    empty.value = true;
    return;
  }
  let total = 0;
  let checked = true;
  list.forEach(item => {
    if (item.checked === true) {
      total += item.price * item.quantity;
    } else if (checked) {
      checked = false;
    }
  });
  allChecked.value = checked;
  total = total * 100;
  totalPrice.value = Number(total.toFixed(2));
};

const onSubmit = () => {
  if (selectedCnt.value > 0) {
    // 跳转到订单界面
    router.push({name: "createOrder", params: {cartIds: checkedGoods.value.join()}});
  } else {
    showToast({
      message: '请选择需要结算的商品',
      duration: 1500
    });
  }
};

const onClickDeleteCartGoods = () => {
  if (selectedCount.value > 0) {
    showConfirmDialog({
      title: '提示',
      message: '确认从购物车删除选中的商品？'
    }).then(() => {
      // 删除商品
      let list = shopCartList.value;
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.checked === true) {
          deleteCartItem({ids: item.id}).then(response => {
            list.splice(i, 1);
            i--;
          });
        }
      }
      shopCartList.value = list;
      calcTotal();
    }).catch(() => {
      // 取消事件
    })
  }
};

const handleReduceGoods = (productId, quantityNum) => {
  if (quantityNum <= 1) {
    showConfirmDialog({
      title: '温馨提示',
      message: '确实删除该商品吗？'
    }).then(() => {
      // 删除商品
      let list = shopCartList.value;
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.id === productId) {
          deleteCartItem({ids: item.id}).then(response => {
            list.splice(i, 1);
            i--;
          });
        }
      }
      shopCartList.value = list;
      reduceGoods(productId, quantityNum);
    }).catch(() => {
      // 取消事件
    });
  } else {
    reduceGoods(productId, quantityNum);
  }
};

const reduceGoods = (productId, quantityNum) => {
  let change2Quantity = quantityNum - 1;
  let cartItem;
  for (let item of shopCartList.value) {
    if (item.id === productId) {
      cartItem = item;
    }
  }
  updateQuantity({id: cartItem.id, quantity: change2Quantity})
      .then(response => {
        cartItem.quantity = change2Quantity;
        calcTotal();
      });
};

const handleAddGoods = (productId, quantityNum) => {
  let change2Quantity = quantityNum + 1;
  let cartItem;
  for (let item of shopCartList.value) {
    if (item.id === productId) {
      cartItem = item;
    }
  }
  updateQuantity({id: cartItem.id, quantity: change2Quantity})
      .then(response => {
        cartItem.quantity = change2Quantity;
        calcTotal();
      });
};

const onClickLeft = () => {
  router.go(-1)
};

const handleSingleSelect = (index) => {
  shopCartList.value[index].checked = !shopCartList.value[index].checked;
  calcTotal();
};
</script>

<style lang="less">
.cart {
  padding-top: 36px;

  &-goods {
    padding: 10px 0;
    background-color: #fff;

    &__item {
      position: relative;
      background-color: #fafafa;

      .van-checkbox__label {
        width: 100%;
        height: auto; // temp
        padding: 0 10px 0 15px;
        box-sizing: border-box;
      }

      .van-checkbox__icon {
        top: 50%;
        left: 10px;
        z-index: 1;
        position: absolute;
        margin-top: -10px;
      }

      .van-card__price {
        color: #f44;
      }

      .van-card__title {
        margin-top: 10px;
        font-size: 14px;
      }

      .stepper span {
        display: inline-block;
        width: 1rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        float: left;
        font-size: 18px;
      }

      .stepper input {
        float: left;
        width: 2rem;
        height: 1.2rem;
        text-align: center;
        margin: 0 0.2rem;
        font-size: 0.8rem;
        background-color: #f5f5f5;
        border: 0;
      }
    }
  }

  .van-submit-bar {
    bottom: 50px;
  }
}
</style>
