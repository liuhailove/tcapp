import{_ as x}from"./_plugin-vue_export-helper-x3n3nnut.js";import{a as D,o as i,c as m,f as s,$ as M,g as e,F as b,d as N,u as R,r as u,b as f,w as t,i as h,B as v,h as C,a0 as V,a1 as B,a2 as I,a3 as $,j as G,Q as Y,U as q,R as A,I as T,a4 as F,a5 as H,a6 as Q,a7 as U,a8 as E,J,L as P,N as K,e as O}from"./index-9c5PUPST.js";/* empty css              *//* empty css              *//* empty css              */const W={data(){return{positionY:0,timer:null}},mounted(){this.timer=setInterval(()=>{this.positionY++},600)},beforeDestroy(){clearInterval(this.timer)}},X={class:"loading_container"};function Z(r,n,p,l,o,a){const c=D("svg-icon");return i(),m(b,null,[s("div",X,[s("div",{class:"load_img",style:M({backgroundPositionY:-(o.positionY%7)*2.5+"rem"})},null,4)]),e(c,{iconClass:"loading",style:{width:"1.5rem",height:"1.5rem"}})],64)}const ee=x(W,[["render",Z],["__scopeId","data-v-bf4b7afd"]]),se=N({__name:"Index",setup(r){let n=R();const p=u([{id:"1",retail_price:"100",counter_price:"500",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",name:"goods1",description:"goods1"},{id:"2",retail_price:"200",counter_price:"1000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",name:"goods2",description:"goods2"},{id:"3",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg",name:"goods3",description:"goods3"},{id:"4",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg",name:"goods4",description:"goods4"},{id:"5",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg",name:"goods5",description:"goods5"},{id:"6",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg",name:"goods6",description:"goods6"},{id:"7",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg",name:"goods7",description:"goods7"},{id:"8",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg",name:"goods7",description:"goods7"},{id:"9",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",name:"goods9",description:"goods9"},{id:"10",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10"}]),l=o=>{n.push({name:"goods",params:{goodsId:o}})};return(o,a)=>{const c=V,d=B,_=I,y=$;return i(),f(y,{"column-num":2},{default:t(()=>[(i(!0),m(b,null,C(h(p),(g,k)=>(i(),f(_,null,{default:t(()=>[e(d,{class:"hot-goods-item",price:g.retail_price,desc:g.description,title:g.name,tag:k<3?"hot":"",thumb:g.pic_url,onClick:j=>l(g.id)},{tags:t(()=>[e(c,{plain:"",type:"danger"},{default:t(()=>[v("多色可选")]),_:1})]),_:2},1032,["price","desc","title","tag","thumb","onClick"])]),_:2},1024))),256))]),_:1})}}}),S=x(se,[["__scopeId","data-v-68e13b9e"]]),te={};function ne(r,n){return" fruit "}const ae=x(te,[["render",ne]]),oe={class:"category"},ce={class:"content"},ie={__name:"Index",props:{categoryList:{type:Array}},setup(r){const n=u(0),p=u(S),l=o=>{console.info("category handleTabClick:"+o),o==="/recommend"?p.value=S:p.value=ae};return(o,a)=>{const c=q,d=A;return i(),m("div",null,[s("div",oe,[e(d,{active:h(n),"onUpdate:active":a[0]||(a[0]=_=>G(n)?n.value=_:null),sticky:"",swipeable:"",onChange:l},{default:t(()=>[(i(!0),m(b,null,C(r.categoryList,(_,y)=>(i(),f(c,{title:_.name,name:_.to},null,8,["title","name"]))),256))]),_:1},8,["active"]),s("div",ce,[(i(),f(Y(h(p))))])])])}}},re={class:"searchContainer"},le={__name:"Index",setup(r){const n=u("手机号码充值");return(p,l)=>{const o=T,a=F,c=H;return i(),m("div",re,[e(c,{modelValue:h(n),"onUpdate:modelValue":l[0]||(l[0]=d=>G(n)?n.value=d:null),"input-align":"center","show-action":"",label:"商品",placeholder:"请输入搜索商品关键词"},{"left-icon":t(()=>[e(o,{name:"search",class:"search-icon"})]),"right-icon":t(()=>[e(a,{size:"small",icon:"scan",color:"#7232dd",plain:""}),e(a,{size:"small",hairline:"",icon:"cart-o",color:"#7232dd"})]),action:t(()=>[e(a,{size:"small",color:"linear-gradient(to right, #ff6034, #ee0a24)",style:{width:"50px"}},{default:t(()=>[v("搜索 ")]),_:1})]),_:1},8,["modelValue"])])}}},pe={id:"quickNav",class:"quickNavContainer"},_e={__name:"Index",setup(r){const n=u(0);u(!0);const p=u([{gridItems:[{icon:"orders-o",text:"我的订单",to:"/",badge:""},{icon:"gold-coin-o",text:"手机充值",to:"/",badge:""},{icon:"shop-o",text:"同辰超市",to:"/",badge:"券"},{icon:"chat-o",text:"客服消息",to:"/",badge:"99"},{icon:"logistics",text:"商品物流",to:"/",badge:""}]},{gridItems:[{icon:"cash-back-record-o",text:"退货售后",to:"/",badge:""},{icon:"shop-collect-o",text:"关注店铺",to:"/",badge:""},{icon:"new-arrival-o",text:"试用领取",to:"/",badge:""},{icon:"hot-sale-o",text:"热卖",to:"/",badge:""},{icon:"start-o",text:"收藏",to:"/",badge:""}]}]),l=a=>{console.log("点击了导航项",a)},o=a=>{console.info("handleSwipeChange:"+a),a>n,n.value=a};return(a,c)=>{const d=I,_=$,y=Q,g=U;return i(),m("div",pe,[e(g,{onChange:o},{default:t(()=>[(i(!0),m(b,null,C(h(p),(k,j)=>(i(),f(y,{key:j},{default:t(()=>[e(_,{"column-num":k.gridItems.length,border:!1,square:!0,onClick:l},{default:t(()=>[(i(!0),m(b,null,C(k.gridItems,(L,z)=>(i(),f(d,{key:z,icon:L.icon,text:L.text},null,8,["icon","text"]))),128))]),_:2},1032,["column-num"])]),_:2},1024))),128))]),_:1})])}}},de=x(_e,[["__scopeId","data-v-123c71fe"]]),me={props:{seckillGoodsList:Array},watch:{spikeInfo:function(r,n){this.seckillGoodsList=r}},data(){return{seckillInfoData:{},time:30*60*1e3*100,goodsList:[{id:1,pic_url:"",retail_price:100,counter_price:200},{id:2,pic_url:"",retail_price:100,counter_price:200},{id:3,pic_url:"",retail_price:100,counter_price:200}]}},methods:{handleMoreClick(){}}},w=r=>(J("data-v-ee142a05"),r=r(),P(),r),ue={class:"spike"},ge=w(()=>s("div",{class:"spike-header"},[s("span",{class:"spike-header-title"},"直播精选"),s("div",{class:"spike-header-countdown"},[s("div",{class:"spike-header-countdown-lt"}," 直播优选 ")])],-1)),ve={class:"spike-content"},he={class:"goods-wrapper"},fe={class:"spike"},ye={class:"spike-header"},ke=w(()=>s("span",{class:"spike-header-title"},"低价秒杀",-1)),be={class:"spike-header-countdown"},xe=w(()=>s("div",{class:"spike-header-countdown-lt"}," '10点场' ",-1)),we={class:"spike-header-countdown-rt"},je=w(()=>s("span",{class:"spike-header-more-text"},"查看全部",-1)),Ce={class:"spike-content"},Ie={class:"goods-wrapper"},$e={class:"spike"},Le=w(()=>s("div",{class:"spike-header"},[s("span",{class:"spike-header-title"},"品牌馆")],-1)),Se={class:"spike-content"},Ne={class:"goods-wrapper"};function Ve(r,n,p,l,o,a){const c=V,d=B,_=I,y=E,g=T,k=$;return i(),f(k,{border:!1,"column-num":3,gutter:1,center:!1,"row-height":150},{default:t(()=>[e(_,{icon:"home-o",text:"直播精选",badge:"推"},{default:t(()=>[s("div",ue,[ge,s("div",ve,[s("div",he,[e(d,{price:"2.00",desc:"描述信息",title:"商品标题",thumb:"https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",class:"van-card-full"},{tags:t(()=>[e(c,{plain:"",type:"primary"},{default:t(()=>[v("标签")]),_:1}),e(c,{plain:"",type:"primary"},{default:t(()=>[v("标签")]),_:1})]),_:1})])])])]),_:1}),e(_,{text:"低价秒杀"},{default:t(()=>[s("div",fe,[s("div",ye,[ke,s("div",be,[xe,s("div",we,[e(y,{time:o.time,format:"HH:mm:ss"},null,8,["time"])])]),s("div",{class:"spike-header-more",onClick:n[0]||(n[0]=(...j)=>a.handleMoreClick&&a.handleMoreClick(...j))},[je,e(g,{name:"play",size:"14"})])]),s("div",Ce,[s("div",Ie,[e(d,{price:"2.00",desc:"描述信息",title:"商品标题",thumb:"https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",class:"van-card-full"},{tags:t(()=>[e(c,{plain:"",type:"primary"},{default:t(()=>[v("标签")]),_:1}),e(c,{plain:"",type:"primary"},{default:t(()=>[v("标签")]),_:1})]),_:1})])])])]),_:1}),e(_,{text:"品牌馆"},{default:t(()=>[s("div",$e,[Le,s("div",Se,[s("div",Ne,[e(d,{price:"2.00",desc:"描述信息",title:"商品标题",thumb:"https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",class:"van-card-full"},{tags:t(()=>[e(c,{plain:"",type:"primary"},{default:t(()=>[v("标签")]),_:1}),e(c,{plain:"",type:"primary"},{default:t(()=>[v("标签")]),_:1})]),_:1})])])])]),_:1})]),_:1})}const Be=x(me,[["render",Ve],["__scopeId","data-v-ee142a05"]]),Ge={key:0},Ye=N({__name:"Index",setup(r){const n=u(!0),p=u([]),l=u([]);return K(()=>{var o=[{pic_url:"src/assets/images/ali_pay.png",name:"ali_pay"},{pic_url:"src/assets/images/order_no_data.png",name:"order_no_data"},{pic_url:"src/assets/images/payment_success.png",name:"payment_success"}];p.value=o;var a=[{icon_url:"src/assets/images/order_no_data.png",name:"推荐",to:"/recommend"},{icon_url:"src/assets/images/payment_success.png",name:"母婴",to:"/motherAndBaby"},{icon_url:"src/assets/images/payment_success.png",name:"百货",to:"/departmentStore"},{icon_url:"src/assets/images/payment_success.png",name:"收集",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"医药",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"水果",to:"/fruit"},{icon_url:"src/assets/images/payment_success.png",name:"女装",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"电器",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"男装",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"鞋包",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"车品",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"电脑",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"家装",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"运动",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"美妆",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"家具",to:"/collect"},{icon_url:"src/assets/images/payment_success.png",name:"内衣",to:"/collect"}];l.value=a,n.value=!1}),(o,a)=>{const c=ee;return i(),m("div",null,[h(n)?O("",!0):(i(),m("div",Ge,[e(le),e(de),e(Be),e(ie,{categoryList:h(l)},null,8,["categoryList"])])),e(c,{show:h(n)},null,8,["show"])])}}});export{Ye as _};
