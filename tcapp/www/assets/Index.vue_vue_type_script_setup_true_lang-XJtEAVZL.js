import{_ as x}from"./_plugin-vue_export-helper-x3n3nnut.js";import{a as R,o as c,c as m,f as s,a9 as Y,g as e,F as b,d as N,u as V,r as u,b as f,w as n,i as h,B as v,h as C,a4 as B,a5 as T,a0 as $,a1 as L,j as G,Q as q,U as A,R as F,I as z,a6 as H,$ as Q,aa as E,ab as J,ac as P,J as U,L as K,N as O,e as W,a7 as X}from"./index-z5JeZRKT.js";/* empty css              *//* empty css              *//* empty css              *//* empty css              */const Z={data(){return{positionY:0,timer:null}},mounted(){this.timer=setInterval(()=>{this.positionY++},600)},beforeDestroy(){clearInterval(this.timer)}},ee={class:"loading_container"};function se(r,a,p,l,o,i){const t=R("svg-icon");return c(),m(b,null,[s("div",ee,[s("div",{class:"load_img",style:Y({backgroundPositionY:-(o.positionY%7)*2.5+"rem"})},null,4)]),e(t,{iconClass:"loading",style:{width:"1.5rem",height:"1.5rem"}})],64)}const te=x(Z,[["render",se],["__scopeId","data-v-bf4b7afd"]]),ne=N({__name:"Index",setup(r){let a=V();const p=u([{id:"1",retail_price:"100",counter_price:"500",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",name:"goods1",description:"goods1"},{id:"2",retail_price:"200",counter_price:"1000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",name:"goods2",description:"goods2"},{id:"3",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg",name:"goods3",description:"goods3"},{id:"4",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg",name:"goods4",description:"goods4"},{id:"5",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg",name:"goods5",description:"goods5"},{id:"6",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg",name:"goods6",description:"goods6"},{id:"7",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg",name:"goods7",description:"goods7"},{id:"8",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg",name:"goods7",description:"goods7"},{id:"9",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",name:"goods9",description:"goods9"},{id:"10",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10"},{id:"11",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods11",description:"goods11"},{id:"12",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods12",description:"goods12"},{id:"13",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods13",description:"goods13"},{id:"14",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods14",description:"goods14"},{id:"15",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods15",description:"goods15"},{id:"16",retail_price:"300",counter_price:"3000",pic_url:"https://www.w3school.com.cn/i/movie.ogg",name:"goods16",description:"goods16"},{id:"17",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods17",description:"goods17"},{id:"18",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods18",description:"goods18"},{id:"13",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10"},{id:"14",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10"},{id:"13",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10"},{id:"14",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10"}]),l=o=>{a.push({name:"goods",params:{goodsId:o}})};return(o,i)=>{const t=B,d=T,_=$,y=L;return c(),f(y,{"column-num":2},{default:n(()=>[(c(!0),m(b,null,C(h(p),(g,j)=>(c(),f(_,null,{default:n(()=>[e(d,{class:"hot-goods-item",price:g.retail_price,desc:g.description,title:g.name,tag:j<3?"hot":"",thumb:g.pic_url,onClick:k=>l(g.id)},{tags:n(()=>[e(t,{plain:"",type:"danger"},{default:n(()=>[v("多色可选")]),_:1})]),_:2},1032,["price","desc","title","tag","thumb","onClick"])]),_:2},1024))),256))]),_:1})}}}),S=x(ne,[["__scopeId","data-v-e3e52799"]]),ae={};function oe(r,a){return" fruit "}const ce=x(ae,[["render",oe]]),ie={class:"category"},re={class:"content"},le={__name:"Index",props:{categoryList:{type:Array}},setup(r){const a=u(0),p=u(S),l=o=>{console.info("category handleTabClick:"+o),o==="/recommend"?p.value=S:p.value=ce};return(o,i)=>{const t=A,d=F;return c(),m("div",null,[s("div",ie,[e(d,{active:h(a),"onUpdate:active":i[0]||(i[0]=_=>G(a)?a.value=_:null),sticky:"",swipeable:"",onChange:l},{default:n(()=>[(c(!0),m(b,null,C(r.categoryList,(_,y)=>(c(),f(t,{title:_.name,name:_.to},null,8,["title","name"]))),256))]),_:1},8,["active"]),s("div",re,[(c(),f(q(h(p))))])])])}}},pe={class:"searchContainer"},de={__name:"Index",setup(r){const a=u("手机号码充值");return(p,l)=>{const o=z,i=H,t=Q;return c(),m("div",pe,[e(t,{modelValue:h(a),"onUpdate:modelValue":l[0]||(l[0]=d=>G(a)?a.value=d:null),"input-align":"center","show-action":"",label:"商品",placeholder:"请输入搜索商品关键词"},{"left-icon":n(()=>[e(o,{name:"search",class:"search-icon"})]),"right-icon":n(()=>[e(i,{size:"small",icon:"scan",color:"#7232dd",plain:""}),e(i,{size:"small",hairline:"",icon:"cart-o",color:"#7232dd"})]),action:n(()=>[e(i,{size:"small",color:"linear-gradient(to right, #ff6034, #ee0a24)",style:{width:"50px"}},{default:n(()=>[v("搜索 ")]),_:1})]),_:1},8,["modelValue"])])}}},_e={id:"quickNav",class:"quickNavContainer"},me={__name:"Index",setup(r){const a=u(0);u(!0);const p=V(),l=u([{gridItems:[{icon:"orders-o",text:"我的订单",to:"/user/myorders",badge:""},{icon:"gold-coin-o",text:"手机充值",to:"/mobile/recharge",badge:""},{icon:"shop-o",text:"同辰超市",to:"/",badge:"券"},{icon:"chat-o",text:"客服消息",to:"/",badge:"99"},{icon:"logistics",text:"商品物流",to:"/",badge:""}]},{gridItems:[{icon:"cash-back-record-o",text:"退货售后",to:"/",badge:""},{icon:"shop-collect-o",text:"关注店铺",to:"/",badge:""},{icon:"new-arrival-o",text:"试用领取",to:"/",badge:""},{icon:"hot-sale-o",text:"热卖",to:"/",badge:""},{icon:"start-o",text:"收藏",to:"/",badge:""}]}]),o=t=>{console.log("点击了导航项",t),p.push(t)},i=t=>{console.info("handleSwipeChange:"+t),t>a,a.value=t};return(t,d)=>{const _=$,y=L,g=E,j=J;return c(),m("div",_e,[e(j,{onChange:i},{default:n(()=>[(c(!0),m(b,null,C(h(l),(k,D)=>(c(),f(g,{key:D},{default:n(()=>[e(y,{"column-num":k.gridItems.length,border:!1,square:!0},{default:n(()=>[(c(!0),m(b,null,C(k.gridItems,(I,M)=>(c(),f(_,{key:M,icon:I.icon,text:I.text,onClick:De=>o(I.to)},null,8,["icon","text","onClick"]))),128))]),_:2},1032,["column-num"])]),_:2},1024))),128))]),_:1})])}}},ue=x(me,[["__scopeId","data-v-1a5ebb23"]]),ge={props:{seckillGoodsList:Array},watch:{spikeInfo:function(r,a){this.seckillGoodsList=r}},data(){return{seckillInfoData:{},time:30*60*1e3*100,goodsList:[{id:1,pic_url:"",retail_price:100,counter_price:200},{id:2,pic_url:"",retail_price:100,counter_price:200},{id:3,pic_url:"",retail_price:100,counter_price:200}]}},methods:{handleMoreClick(){}}},w=r=>(U("data-v-ee142a05"),r=r(),K(),r),ve={class:"spike"},he=w(()=>s("div",{class:"spike-header"},[s("span",{class:"spike-header-title"},"直播精选"),s("div",{class:"spike-header-countdown"},[s("div",{class:"spike-header-countdown-lt"}," 直播优选 ")])],-1)),fe={class:"spike-content"},ye={class:"goods-wrapper"},je={class:"spike"},ke={class:"spike-header"},be=w(()=>s("span",{class:"spike-header-title"},"低价秒杀",-1)),xe={class:"spike-header-countdown"},we=w(()=>s("div",{class:"spike-header-countdown-lt"}," '10点场' ",-1)),Ce={class:"spike-header-countdown-rt"},Ie=w(()=>s("span",{class:"spike-header-more-text"},"查看全部",-1)),$e={class:"spike-content"},Le={class:"goods-wrapper"},Se={class:"spike"},Ne=w(()=>s("div",{class:"spike-header"},[s("span",{class:"spike-header-title"},"品牌馆")],-1)),Ve={class:"spike-content"},Be={class:"goods-wrapper"};function Te(r,a,p,l,o,i){const t=B,d=T,_=$,y=P,g=z,j=L;return c(),f(j,{border:!1,"column-num":3,gutter:1,center:!1,"row-height":150},{default:n(()=>[e(_,{icon:"home-o",text:"直播精选",badge:"推"},{default:n(()=>[s("div",ve,[he,s("div",fe,[s("div",ye,[e(d,{price:"2.00",desc:"描述信息",title:"商品标题",thumb:"https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",class:"van-card-full"},{tags:n(()=>[e(t,{plain:"",type:"primary"},{default:n(()=>[v("标签")]),_:1}),e(t,{plain:"",type:"primary"},{default:n(()=>[v("标签")]),_:1})]),_:1})])])])]),_:1}),e(_,{text:"低价秒杀"},{default:n(()=>[s("div",je,[s("div",ke,[be,s("div",xe,[we,s("div",Ce,[e(y,{time:o.time,format:"HH:mm:ss"},null,8,["time"])])]),s("div",{class:"spike-header-more",onClick:a[0]||(a[0]=(...k)=>i.handleMoreClick&&i.handleMoreClick(...k))},[Ie,e(g,{name:"play",size:"14"})])]),s("div",$e,[s("div",Le,[e(d,{price:"2.00",desc:"描述信息",title:"商品标题",thumb:"https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",class:"van-card-full"},{tags:n(()=>[e(t,{plain:"",type:"primary"},{default:n(()=>[v("标签")]),_:1}),e(t,{plain:"",type:"primary"},{default:n(()=>[v("标签")]),_:1})]),_:1})])])])]),_:1}),e(_,{text:"品牌馆"},{default:n(()=>[s("div",Se,[Ne,s("div",Ve,[s("div",Be,[e(d,{price:"2.00",desc:"描述信息",title:"商品标题",thumb:"https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",class:"van-card-full"},{tags:n(()=>[e(t,{plain:"",type:"primary"},{default:n(()=>[v("标签")]),_:1}),e(t,{plain:"",type:"primary"},{default:n(()=>[v("标签")]),_:1})]),_:1})])])])]),_:1})]),_:1})}const Ge=x(ge,[["render",Te],["__scopeId","data-v-ee142a05"]]),ze={key:0},He=N({__name:"Index",setup(r){const a=u(!0),p=u([]),l=u([]);return O(()=>{var o=[{pic_url:"src/assets/images/ali_pay.png",name:"ali_pay"},{pic_url:"src/assets/images/order_no_data.png",name:"order_no_data"},{pic_url:"src/assets/images/payment_success.png",name:"payment_success"}];p.value=o;var i=[{icon_url:"src/assets/images/order_no_data.png",name:"推荐",to:"/recommend"},{icon_url:"src/assets/images/payment_success.png",name:"母婴",to:"/motherAndBaby"},{icon_url:"src/assets/images/payment_success.png",name:"百货",to:"/departmentStore"},{icon_url:"src/assets/images/payment_success.png",name:"收集",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"医药",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"水果",to:"/fruit"},{icon_url:"src/assets/images/payment_success.png",name:"女装",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"电器",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"男装",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"鞋包",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"车品",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"电脑",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"家装",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"运动",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"美妆",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"家具",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"内衣",to:"/collect"}];l.value=i,a.value=!1}),(o,i)=>{const t=X,d=te;return c(),m("div",null,[h(a)?W("",!0):(c(),m("div",ze,[e(de),e(ue),e(Ge),e(le,{categoryList:h(l)},null,8,["categoryList"]),e(t)])),e(d,{show:h(a)},null,8,["show"])])}}});export{He as _};
