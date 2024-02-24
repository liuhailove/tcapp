<template>
  <div class="product-detail">
    <van-nav-bar
        title="商品详情页"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"
    />
    <!--  商品图片轮播 -->
    <van-swipe class="product-detail-swipe" :autoplay="3000">
      <van-swipe-item v-for="(item,index) in imgList">
        <van-image width="100%" height="280" :src="item.src"/>
      </van-swipe-item>
    </van-swipe>

    <van-row class="product-detail-base">
      <van-col span="20">
        <div class="product-detail-base-name">{{ goodsProduct.name }}</div>
        <div class="product-detail-base-title">{{ goodsProduct.subTitle }}</div>
      </van-col>
      <van-col class="product-detail-base-share" span="4">
        <van-icon class="iconfont" class-prefix="icon" name="fenxiang"/>
      </van-col>
    </van-row>
    <van-row class="product-detail-sales" v-show="seckill!==true">
      <van-col span="16" class="product-detail-sales-price">
         <span class="product-detail-sales-price-promotion">
            {{ goodsProduct.price }}
        </span>
        <span class="product-detail-sales-price-origin">
          {{ goodsProduct.originalPrice }}
        </span>
      </van-col>
      <van-col span="2" class="product-detail-base-title" align="right">
        销量: {{ goodsProduct.sale }}
      </van-col>
      <van-col span="2" class="product-detail-base-title" align="right">
        库存: {{ goodsProduct.stock }}
      </van-col>
      <van-col span="2" class="product-detail-base-title" align="right">
        浏览量: 768
      </van-col>
    </van-row>
    <!--  分享 -->
    <view class="share-section" @click="share">
      <view class="share-icon">
        <text class="yticon icon-xingxing"></text>
        返
      </view>
      <text class="tit">该商品分享可领49减10红包</text>
      <text class="yticon icon-bangzhu1"></text>
      <view class="share-btn">
        立即分享
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <van-cell title="规格" class="product-detail-sku" is-link @click="showSkuClicked"/>

    <van-row class="product-detail-attribute">
      <van-cell-group title="商品参数">
        <van-cell
            v-for="attribute in attrList"
            :title="attribute.name"
            :value="attribute.value"
        />
      </van-cell-group>
    </van-row>
    <!-- 优惠券单元格 -->
    <van-coupon-cell
        :coupons="couponList"
        :chosen-coupon="chosenCoupon"
        @click="showCouponList = true"
    />
    <!-- 优惠券列表 -->
    <van-popup
        v-model:show="showCouponList"
        round
        position="bottom"
        style="height: 90%; padding-top: 4px;"
    >
      <van-coupon-list
          :coupons="couponList"
          :chosen-coupon="chosenCoupon"
          :disabled-coupons="disabledCoupons"
          @change="onCouponChange"
          @exchange="onCouponExchange"
      />
    </van-popup>

    <!-- 评价 -->
    <view class="eva-section">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>(86)</text>
        <text class="tip">好评率 100%</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="eva-box">
        <image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg"
               mode="aspectFill"></image>
        <view class="right">
          <text class="name">Leo yo</text>
          <text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
          <view class="bot">
            <text class="attr">购买类型：XL 红色</text>
            <text class="time">2019-04-01 19:21</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 品牌信息 -->
    <van-row class="product-detail-brand">
      <van-divider>品牌信息</van-divider>
      <van-col class="brand-box" @click="navToBrandDetail()">
        <van-cell class="image-wrapper">
          <van-image :src="brand.logo" class="loaded" mode="aspectFit"></van-image>
        </van-cell>
        <van-cell class="title">
          <text>{{ brand.name }}</text>
          <text>品牌首字母：{{ brand.firstLetter }}</text>
        </van-cell>
      </van-col>
    </van-row>

    <van-row class="product-detail-detail">
      <div v-html="goodsProduct.detailMobileHtml" style="width: 100%;height:auto;display:block"></div>
    </van-row>

    <van-row class="product-detail-faq">
      <van-divider>常见问题</van-divider>
    </van-row>

    <van-action-bar style="z-index: 3000">
      <van-action-bar-icon icon="chat-o" text="客服" dot/>
      <van-action-bar-icon icon="cart-o" text="购物车" badge="5" @click="onClickCart"/>
      <van-action-bar-icon icon="shop-o" text="店铺" badge="12"/>
      <van-action-bar-button type="warning" text="加入购物车" @click="onAddCartClicked"/>
      <van-action-bar-button type="danger" text="立即购买"/>
    </van-action-bar>

    <!-- 商品SKU -->
    <van-action-sheet v-model="showSku" title="标题">
      <!--      <van-sku-->
      <!--          v-model="showSku"-->
      <!--          :sku="product.sku"-->
      <!--          :product="product"-->
      <!--          :product-id="productId"-->
      <!--          :quota="quota"-->
      <!--          ref="sku">-->
      <!--        <template #sku-actions="props">-->
      <!--          <div class="van-sku-actions">-->
      <!--            &lt;!&ndash; 空槽是为了移除sku的按钮 &ndash;&gt;-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </van-sku>-->
    </van-action-sheet>

  </div>
</template>

<script setup lang="ts">

import {fetchProductDetail} from "@/api/product";
import {useRoute} from 'vue-router';
import {createReadHistory} from "@/api/memberReadHistory";
import {mapActions, useStore} from "vuex";
import {mapState} from 'vuex';
import {Dialog, showConfirmDialog, showToast, Toast} from "vant";
import {addCartItem} from "@/api/cart";

const defaultShareList = [{
  type: 1,
  icon: '/static/temp/share_wechat.png',
  text: '微信好友'
},
  {
    type: 2,
    icon: '/static/temp/share_moment.png',
    text: '朋友圈'
  },
  {
    type: 3,
    icon: '/static/temp/share_qq.png',
    text: 'QQ好友'
  },
  {
    type: 4,
    icon: '/static/temp/share_qqzone.png',
    text: 'QQ空间'
  }
];

const shareList = ref([]);
const imgList = ref([]);
const goodsProduct = ref({});
const brand = ref({});
const serviceList = ref([]);
const skuStockList = ref([]);
const attrList = ref([]);
const promotionTipList = ref([]);
const couponState = ref(0);
const couponList = ref([]);
const showCouponList = ref(false);
const chosenCoupon = ref(-1);
const specSelected = ref([]);
const route = useRoute();
const store = useStore();


onMounted(() => {
  shareList.value = defaultShareList;
  loadData(route.params.productId)
});

/**
 * 加载商品数据
 * @param id 主键ID
 */
const loadData = async (id) => {
  fetchProductDetail(id).then(response => {
    goodsProduct.value = response.data.product;
    skuStockList.value = response.data.skuStockList;
    brand.value = response.data.brand;
    initImgList();
    initAttrList(response.data);
    handleReadHistory();
  });
};

// 设置头图信息
const initImgList = () => {
  let tempPics = goodsProduct.value.albumPics.split(',');
  tempPics.unshift(goodsProduct.value.pic);
  for (let item of tempPics) {
    if (item != null && item !== '') {
      imgList.value.push({
        src: item,
      });
    }
  }
};

// 设置商品参数
const initAttrList = (data) => {
  for (let item of data.productAttributeList) {
    if (item.type === 1) {
      let valueList = data.productAttributeValueList;
      let filterValueList = valueList.filter(value => value.productAttributeId == item.id);
      if (filterValueList.length > 0) {
        let value = filterValueList[0].value;
        attrList.value.push({
          key: item.name,
          value: value,
        });
      }
    }
  }
};

// 处理创建浏览记录
const handleReadHistory = () => {
  let product = goodsProduct.value;
  let data = {
    productId: product.id,
    productName: product.name,
    productPic: product.pic,
    productPrice: product.price,
    productSubTitle: product.subTitle,
  };
  //createReadHistory(data);
};

const onCouponChange = (index) => {
  showCouponList.value = false;
  chosenCoupon.value = index;
};

const coupon = {
  available: 1,
  condition: '无门槛\n最多优惠12元',
  reason: '',
  value: 150,
  name: '优惠券名称',
  startAt: 1489104000,
  endAt: 1514592000,
  valueDesc: '1.5',
  unitDesc: '元',
};
const onCouponExchange = (code) => {
  couponList.value.push(coupon);
};

const disabledCoupons = ref([coupon]);


const shopCart = ref(1)
const router = useRouter()

// const productNum = ref(10)
const showSku = ref(true);
const quota = ref(1);
const seckill = ref(false);


const onClickLeft = () => {
  router.go(-1)
}

const showSkuClicked = () => {
  showSku.value = true
}

const onBuyClicked = () => {

}

const onClickCart = () => {
  router.push({path: '/mall/cart'});
}

// 将商品加入到购物车
const onAddCartClicked = () => {
  // 1.首先判断是否已经登入
  if (!checkForLogin()) {
    return;
  }
  let productSkuStock = getSKuStock();
  let cartItem = {
    price: goodsProduct.value.price,
    productAttr: productSkuStock.spData,
    productBrand: goodsProduct.value.brandName,
    productCategoryId: goodsProduct.value.productCategoryId,
    productId: goodsProduct.value.id,
    productName: goodsProduct.value.name,
    productPic: goodsProduct.value.pic,
    productSkuCode: productSkuStock.skuCode,
    productSkuId: productSkuStock.id,
    productSn: goodsProduct.value.productSn,
    productSubTitle: goodsProduct.value.subTitle,
    quantity: 1,
  };
  addCartItem(cartItem).then(response => {
    showToast({
      message: response.message,
      duration: 3000,
    });
  });
}

// 获取当前选中商品的SKU
const getSKuStock = () => {
  let skuStockListVal = skuStockList.value;
  for (let i = 0; i < skuStockListVal.length; i++) {
    let spDataArr = JSON.parse(skuStockListVal[i].spData);
    let availAbleSpecSet = new Map();
    for (let j = 0; j < spDataArr.length; j++) {
      availAbleSpecSet.set(spDataArr[j].key, spDataArr[j].value);
    }
    let correctCount = 0;
    let specSelectedVal = specSelected.value;
    for (let item of specSelectedVal) {
      let value = availAbleSpecSet.get(item.pname);
      if (value != null && value === item.name) {
        correctCount++;
      }
    }
    if (correctCount === specSelectedVal.length) {
      return skuStockListVal[i];
    }
  }
  return null;
};

const hasLoginValue = computed(() => store.state.hasLogin);
// 检查登录状态并弹出登录框
const checkForLogin = () => {
  // 使用 mapState 获取hshLogin属性
  // 是否登入
  if (!hasLoginValue.value) {
    showConfirmDialog({
      title: '提示',
      message:
          '你还没登录，是否要登录？',
    }).then(() => {
      // on confirm
      router.push({path: '/login'});
    }).catch(() => {
      // on cancel
    });
    return false;
  }
  return true;
}

const productNum = () => {
  return 10
}

const userToken = () => {

}


</script>

<style lang="less">

.product-detail {
  &-swipe {
    padding-top: 46px;
    height: 280px;
  }

  &-seckill {
    background: #ffffff;

    &-price {
      background: #F75B52;
      color: #ffffff;

      .seckill-price {
        font-size: 20px;
        font-weight: 500;
        padding-left: 20px;
        height: 50px;
        line-height: 50px;
      }

      .price {
        font-size: 14px;
        text-decoration: line-through;
        margin: 10px 0 0 10px;
        width: 100px;

        .tag {
          font-size: 12px;
          display: inline-block;
          border: 1px solid #ffffff;
          text-align: center;

          .icon {
            display: inline-block;
            color: #F75B52;
            background: #ffffff;
            padding-top: 3px;
            width: 20px;
            height: 16px;
            float: left;
            vertical-align: middle;
          }

          .text {
            float: left;
            color: #ffffff;
            background: #F75B52;
            width: 55px;
            padding-top: 3px;
          }
        }
      }
    }

    &-time {
      padding: 5px 10px 0 0;

      .tip {
        font-size: 12px;
        color: #666666;
      }

      .item {
        display: inline-block;
        width: 20px;
        margin-right: 2px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        background-color: #ffffff;
        color: #F75B52;
        border: 1px solid #f3f3f3;
      }

      .split {
        color: #F75B52;
        margin-right: 2px;
      }
    }
  }

  &-sales {
    background: #FFFFFF;
    padding: 16px;

    &-price {
      &-promotion {
        font-size: 18px;
        color: #e25450;
      }

      &-origin {
        maigin-left: 5px;
        text-decoration: line-through;
        color: #999999;
      }
    }
  }


  &-base {
    background: #FFFFFF;
    padding: 16px;

    &-name {
      height: 26px;
      line-height: 26px;
      font-size: 18px;
    }

    &-title {
      color: #999999;
      font-size: 14px;
      height: 26px;
      line-height: 26px;

    }

    &-share {
      height: 52px;
      border-left: 1px solid #cccccc;
      padding-top: 8px;

      .iconfont {
        font-size: 36px;
        color: #999999;
        margin-left: 16px;
      }
    }
  }


  &-sku {
    border-top: 1px solid #f5f5f5;
  }

  &-attribute {
    margin-top: 10px;

    .van-cell-group__title {
      background: #FFFFFF;
      color: #000;
      font-size: 16px;
    }

    .van-cell-group {
      padding: 8px;
    }

    .van-cell {
      margin-bottom: 6px;
      background: #f5f5f5;
      padding: 6px 16px;
    }
  }

  &-brand {
    margin-top: 16px;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;

    .brand-box {
      display: flex;
      align-items: center;
      padding: 30px 50px;

      .image-wrapper {
        width: 210px;
        height: 70px;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        flex: 1;
        display: flex;
        //flex-direction: column;
        font-size: 20px;
        margin-left: 30px;
        color: #303133;

        text:last-child {
          font-size: 14px;
          color: #909399;
          margin-top: 8px;

          //&.Skeleton {
          //  width: 220px;
          //}
        }
      }
    }

    .d-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
      font-size: 16px;
      color: #fff;
      position: relative;

      text {
        padding: 0 20px;
        background: #fff;
        position: relative;
        z-index: 1;
      }

      &:after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 0;
        content: '';
        border-bottom: 1px solid #ccc;
      }
    }
  }

  &-detail {
    background: #FFFFFF;
    margin-top: 10px;
    padding: 10px;

    img {
      width: 100%;
    }
  }

  &-faq {
    background: #FFFFFF;
    padding: 10px;

    .van-divider::after, .van-divider::before {
      border-width: 2px 0 0;
    }
  }

  .van-popup--bottom.van-popup--round {
    border-radius: 0
  }
}

/* 分享 */
.share-section {
  display: flex;
  align-items: center;
  color: #303133;
  background: linear-gradient(left, #fdf5f6, #fbebf6);
  padding: 2px 2px;

  .share-icon {
    display: flex;
    align-items: center;
    width: 70px;
    height: 30px;
    line-height: 1;
    border: 1px solid #fa436a;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    font-size: 22px;
    color: #fa436a;

    &:after {
      content: '';
      width: 50px;
      height: 50px;
      border-radius: 50%;
      left: -20px;
      top: -12px;
      position: absolute;
      background: #fa436a;
    }
  }

  .icon-xingxing {
    position: relative;
    z-index: 1;
    font-size: 14px;
    margin-left: 24px;
    margin-right: 10px;
    color: #fff;
    //line-height: 1;
  }

  .tit {
    font-size: 14px;
    margin-left: 10px;
  }

  .icon-bangzhu1 {
    padding: 10px;
    font-size: 14px;
    line-height: 1;
  }

  .share-btn {
    flex: 1;
    text-align: right;
    font-size: 14px;
    color: #fa436a;
  }

  .icon-you {
    font-size: 14px;
    margin-left: 4px;
    color: #fa436a;
  }
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  background: #fff;
  margin-top: 16px;

  .e-header {
    display: flex;
    align-items: center;
    height: 70px;
    font-size: 26px;
    color: #909399;

    .tit {
      font-size: 30px;
      color: #303133;
      margin-right: 4px;
    }

    .tip {
      flex: 1;
      text-align: right;
    }

    .icon-you {
      margin-left: 10px;
    }
  }
}

</style>
