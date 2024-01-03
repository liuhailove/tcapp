<template>
  <div class="goods-detail">
    <van-nav-bar
        title="商品详情页"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"
    />
    <!--  商品图片轮播 -->
    <van-swipe class="goods-detail-swipe" :autoplay="3000">
      <van-swipe-item v-for="(pic_url,index) in goods.pic_urls">
        <van-image width="100%" height="280" :src="pic_url"/>
      </van-swipe-item>
    </van-swipe>

    <van-row class="goods-detail-base">
      <van-col span="20">
        <div class="goods-detail-base-name">{{ goods.name }}</div>
        <div class="goods-detail-base-title">{{ goods.subtitle }}</div>
      </van-col>
      <van-col class="goods-detail-base-share" span="4">
        <van-icon class="iconfont" class-prefix="icon" name="fenxiang"/>
      </van-col>
    </van-row>
    <van-row class="goods-detail-sales" v-show="seckill!==true">
      <van-col span="16" class="goods-detail-sales-price">
                 <span class="goods-detail-sales-price-promotion">
                    {{ goods.retail_price }}
                </span>
        <span class="goods-detail-sales-price-origin">
                    {{ goods.counter_price }}
                </span>

      </van-col>
      <van-col span="8" class="goods-detail-sales-volume" align="right">
        销量: {{ goods.sales_volume }} 件
      </van-col>
    </van-row>

    <van-cell title="规格" class="goods-detail-sku" is-link @click="showSkuClicked"/>

    <van-row class="goods-detail-attribute">
      <van-cell-group title="商品参数">
        <van-cell
            v-for="attribute in goods.attribute_list"
            :title="attribute.name"
            :value="attribute.value"
        />
      </van-cell-group>
    </van-row>

    <van-row class="goods-detail-detail">
      <div v-html="goods.detail" style="width: 100%"></div>
    </van-row>

    <van-row class="goods-detail-faq">
      <van-divider>常见问题</van-divider>
    </van-row>

    <van-action-bar style="z-index: 3000">
      <van-action-bar-icon icon="chat-o" text="客服" dot />
      <van-action-bar-icon icon="cart-o" text="购物车" badge="5" />
      <van-action-bar-icon icon="shop-o" text="店铺" badge="12" />
      <van-action-bar-button type="warning" text="加入购物车" />
      <van-action-bar-button type="danger" text="立即购买" />
    </van-action-bar>

    <!-- 商品SKU -->
    <van-action-sheet v-model="showSku" title="标题">
<!--      <van-sku-->
<!--          v-model="showSku"-->
<!--          :sku="goods.sku"-->
<!--          :goods="goods"-->
<!--          :goods-id="goodsId"-->
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

<script setup>
const shopCart = ref(1)
// computed({
//   goodsNum() {
//     let num = 0;
//     Object.values(shopCart).forEach((goods, index) => {
//       num += goods.num;
//     });
//     if (num > 0) {
//       return num;
//     }
//   },
// })
const router = useRouter()

// const goodsNum = ref(10)
const showSku = ref(true)
const quota = ref(1)
const seckill = ref(false)
const goods = ref({
  pic_urls: ["https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg","https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg","https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg"],
  name: '苹果电脑',
  subtitle: '新品苹果电脑，2024年发布',
  retail_price: 10000,
  counter_price: 8000,
  sales_volume: 500,
  attribute_list: [
    {
      name: "尺寸",
      value: 24,
    },
    {
      name: "CPU",
      value: 3,
    },
    {
      name: "内存",
      value: 8,
    },
  ],
  detail: "新款发布，欢迎选购",
  sku: "sku",
  goodsId: 1,
  quota: 10,
})

const onClickLeft = () => {
  router.go(-1)
}

const showSkuClicked = () => {
  showSku.value = true
}

const onBuyClicked = () => {

}

const onAddCartClicked = () => {

}

const goodsNum = () => {
  return 10
}

const userToken=()=>{

}

</script>

<style lang="less">
.goods-detail {
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

</style>
