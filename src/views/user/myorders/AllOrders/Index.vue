<template>
  <div id="orderList" class="orderList">
    <div v-if="orderList.length>0">
      <div class="order" v-for="item in orderList">
        <div class="order-header">
          <van-cell :value="formatOrderStatus(item.status)">
            <template #title>
                <span class="custom-title" style="width: 100px">
                    {{ formatOrderNo(item.orderNo) }}
                </span>
            </template>
          </van-cell>
        </div>

        <div class="order-goods">
          <van-card v-for="goods in item.goodsList"
                    :title="goods.goodsName"
                    :num="goods.goodsCount"
                    :price="goods.goodsPrice"
                    :desc="goods.goodsSku"
                    :thumb="goods.goodsImageUrl">
            <template #tags>
              <van-tag plain type="danger">七天无理由退货</van-tag>
            </template>
          </van-card>
        </div>

        <div class="order-footer">
          <van-cell :title="formatOrderTotalPrice(item.status,item.totalPrice)">
            <template #default>
              <van-button plain type="default" v-if="item.status===1" size="mini">
                取消订单
              </van-button>
              <van-button  type="danger" v-if="item.status===1" size="mini" @click="onClickPayment">
                立即付款
              </van-button>
              <van-button plain type="default" v-if="item.status===2" size="mini">
                提醒发货
              </van-button>
              <van-button plain type="default" v-if="item.status===3" size="mini">
                延长收回
              </van-button>
              <van-button plain type="default" v-if="item.status===3" size="mini">
                查看物流
              </van-button>
              <van-button  type="danger" v-if="item.status===3" size="mini">
                确认收货
              </van-button>

              <van-button plain type="default" v-if="item.status===4" size="small">
                再次购买
              </van-button>
            </template>
          </van-cell>
        </div>
      </div>
    </div>
    <!-- 回到顶部按钮 -->
    <van-back-top />
  </div>
</template>


<script setup lang="ts">
import {useRouter} from 'vue-router'
// 路由
let router = useRouter()
const orderList = ref([
  {
    "id": "1",
    "orderNo": "orderNo1",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "100",
    "counter_price": "500",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
    "name": "goods1",
    "description": "goods1",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "2",
    "orderNo": "orderNo2",
    "status": 2,
    "totalPrice": 1000,
    "retail_price": "200",
    "counter_price": "1000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",
    "name": "goods2",
    "description": "goods2",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "3",
    "orderNo": "orderNo3",
    "status": 3,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg",
    "name": "goods3",
    "description": "goods3",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "4",
    "orderNo": "orderNo4",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg",
    "name": "goods4",
    "description": "goods4",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "5",
    "orderNo": "orderNo5",
    "status": 4,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg",
    "name": "goods5",
    "description": "goods5",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "6",
    "orderNo": "orderNo6",
    "status": 5,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg",
    "name": "goods6",
    "description": "goods6",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "7",
    "orderNo": "orderNo7",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg",
    "name": "goods7",
    "description": "goods7",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "8",
    "orderNo": "orderNo8",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg",
    "name": "goods7",
    "description": "goods7",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "9",
    "orderNo": "orderNo9",
    "status": 6,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
    "name": "goods9",
    "description": "goods9",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "10",
    "orderNo": "orderNo10",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods10",
    "description": "goods10",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "11",
    "orderNo": "orderNo11",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods11",
    "description": "goods11",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "12",
    "orderNo": "orderNo12",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods12",
    "description": "goods12",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "13",
    "orderNo": "orderNo13",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods13",
    "description": "goods13",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "14",
    "orderNo": "orderNo14",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods14",
    "description": "goods14",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "15",
    "orderNo": "orderNo15",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods15",
    "description": "goods15",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "16",
    "orderNo": "orderNo16",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://www.w3school.com.cn/i/movie.ogg",
    "name": "goods16",
    "description": "goods16",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "17",
    "orderNo": "orderNo17",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods17",
    "description": "goods17",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },
  {
    "id": "18",
    "orderNo": "orderNo18",
    "status": 1,
    "totalPrice": 1000,
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods18",
    "description": "goods18",
    "goodsList": [
      {
        goodsName: "goodsName1",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg"
      },
      {
        goodsName: "goodsName2",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      },
      {
        goodsName: "goodsName3",
        goodsCount: 10,
        goodsPrice: 100,
        goodsSku: "长100，宽10",
        goodsImageUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"
      }
    ]
  },

])

// 商品详情页
const gotoGoodsDetail = (goodsId) => {
  router.push({
    name: 'goods',
    params: {
      goodsId: goodsId
    }
  })
}

const formatOrderStatus = (status) => {
  let desc;
  if (status === 1) {
    desc = '等待付款'
  } else if (status === 2) {
    desc = '等待发货'
  } else if (status === 3) {
    desc = '等待收货'
  } else if (status === 4) {
    desc = '交易完成'
  } else if (status === 5) {
    desc = '交易关闭'
  }else if (status === 6) {
    desc = '待使用'
  }
  return desc
}
const onClickPayment = () => {
}
const formatOrderNo = (orderNo) => {
  return '订单号：' + orderNo
}
const formatOrderTotalPrice = (status, totalPrice) => {
  let prefix = '已付金额'
  if (status === 1) {
    prefix = '实付金额'
  }
  return prefix + '：¥' + totalPrice
}
</script>
<style lang="less" scoped>
//.order {
//
//  &-header {
//    vertical-align: middle;
//
//    &-title {
//      display: inline-block;
//      font-size: 14px;
//      height: 30px;
//      line-height: 30px;
//      font-weight: bold;
//    }
//
//    &-more {
//      .van-icon {
//        margin-left: 5px;
//        height: 30px;
//        line-height: 30px;
//        float: right;
//      }
//    }
//  }
//}
#orderList {
  .order:not(:first-child) {
    margin-top: 10px;
  }

  .order {
    &-header {
      .van-cell__title {
        -webkit-box-flex: 2;
        -webkit-flex: 2;
      }

      .van-cell__value {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        color: #ee0a24;
      }
    }

    &-goods {
      .van-card:not(:first-child) {
        margin-top: 0;
      }

      .van-card__title {
        font-weight: 700;
      }
    }

    &-footer {
      .van-button {
        margin-left: 2px;
      }
    }
  }

  .no-data {
    text-align: center;
    color: #666666;
    font-size: 16px;

    img {
      margin: 100px 0 10px;
    }
  }

}

</style>