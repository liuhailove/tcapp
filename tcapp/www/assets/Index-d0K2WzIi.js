import{r as f,u as L,o,c as l,f as r,g as a,w as t,i as _,j as x,F as P,b as c,h as U,I as $,a4 as O,R,U as F,V as G,P as A,d as M,A as T,B as m,e as v,ae as q,a1 as E,a2 as Q,a3 as H,a9 as V,a8 as J,aj as K,a as W,N as X,Q as Y,O as Z,ac as oo}from"./index-TQUec3l9.js";/* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              */import{_ as B}from"./_plugin-vue_export-helper-x3n3nnut.js";const eo={class:"searchContainer"},so={class:"moreFeatures"},to=r("div",{class:"popup-header"},[r("span",{class:"popup-title"},"更多功能")],-1),ao={class:"popup-content"},no={__name:"Index",setup(S){const n=f(""),g=f(!1),h=L(),N=()=>{g.value=!0},j=d=>{h.push({path:d})},s=f([{gridItems:[{icon:"setting-o",text:"授权设置",to:"/user/config",badge:""},{icon:"location-o",text:"我的地址",to:"/user/address",badge:""},{icon:"cart-o",text:"购物车",to:"/",badge:"10"},{icon:"chat-o",text:"客服消息",to:"/",badge:"99"},{icon:"shop-collect-o",text:"同辰商城",to:"/",badge:""}]},{gridItems:[{icon:"coupon-o",text:"卡券红包",to:"/user/coupon",badge:""},{icon:"comment-o",text:"评价中心",to:"/",badge:""},{icon:"cash-back-record-o",text:"同辰月付",to:"/",badge:""},{icon:"hot-sale-o",text:"热卖",to:"/",badge:""},{icon:"start-o",text:"收藏",to:"/",badge:""}]}]);return(d,p)=>{const y=$,C=O,i=R,I=F,e=G,u=A;return o(),l(P,null,[r("div",eo,[a(C,{modelValue:_(n),"onUpdate:modelValue":p[0]||(p[0]=k=>x(n)?n.value=k:null),"input-align":"center","show-action":"",placeholder:"搜索订单"},{"left-icon":t(()=>[a(y,{name:"search",class:"search-icon"})]),action:t(()=>[a(y,{name:"ellipsis",onClick:N})]),_:1},8,["modelValue"])]),r("div",so,[a(u,{show:_(g),"onUpdate:show":p[1]||(p[1]=k=>x(g)?g.value=k:null),round:"",closeable:"","close-icon":"close",position:"bottom",style:{height:"40%"}},{default:t(()=>[to,r("div",ao,[(o(!0),l(P,null,U(_(s),(k,D)=>(o(),l("div",{key:D},[a(I,{"column-num":k.gridItems.length,border:!1,square:!1},{default:t(()=>[(o(!0),l(P,null,U(k.gridItems,(b,z)=>(o(),c(i,{key:z,icon:b.icon,text:b.text,badge:b.badge,onClick:Uo=>j(b.to),style:{height:"10%"}},null,8,["icon","text","badge","onClick"]))),128))]),_:2},1032,["column-num"]),a(e)]))),128))])]),_:1},8,["show"])])],64)}}},ro={id:"orderList",class:"orderList"},go={key:0},po={class:"order"},lo={class:"order-header"},io={class:"custom-title",style:{width:"100px"}},co={class:"order-goods"},mo={class:"order-footer"},uo=M({__name:"Index",setup(S){L();const n=f([{id:"1",orderNo:"orderNo1",status:1,totalPrice:1e3,retail_price:"100",counter_price:"500",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",name:"goods1",description:"goods1",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"2",orderNo:"orderNo2",status:2,totalPrice:1e3,retail_price:"200",counter_price:"1000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",name:"goods2",description:"goods2",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"3",orderNo:"orderNo3",status:3,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg",name:"goods3",description:"goods3",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"4",orderNo:"orderNo4",retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg",name:"goods4",description:"goods4",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"5",orderNo:"orderNo5",status:4,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg",name:"goods5",description:"goods5",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"6",orderNo:"orderNo6",status:5,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg",name:"goods6",description:"goods6",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"7",orderNo:"orderNo7",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg",name:"goods7",description:"goods7",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"8",orderNo:"orderNo8",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg",name:"goods7",description:"goods7",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"9",orderNo:"orderNo9",status:6,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",name:"goods9",description:"goods9",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"10",orderNo:"orderNo10",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods10",description:"goods10",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"11",orderNo:"orderNo11",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods11",description:"goods11",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"12",orderNo:"orderNo12",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods12",description:"goods12",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"13",orderNo:"orderNo13",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods13",description:"goods13",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"14",orderNo:"orderNo14",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods14",description:"goods14",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"15",orderNo:"orderNo15",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods15",description:"goods15",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"16",orderNo:"orderNo16",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://www.w3school.com.cn/i/movie.ogg",name:"goods16",description:"goods16",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"17",orderNo:"orderNo17",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods17",description:"goods17",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]},{id:"18",orderNo:"orderNo18",status:1,totalPrice:1e3,retail_price:"300",counter_price:"3000",pic_url:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",name:"goods18",description:"goods18",goodsList:[{goodsName:"goodsName1",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg"},{goodsName:"goodsName2",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"},{goodsName:"goodsName3",goodsCount:10,goodsPrice:100,goodsSku:"长100，宽10",goodsImageUrl:"https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg"}]}]),g=s=>{let d;return s===1?d="等待付款":s===2?d="等待发货":s===3?d="等待收货":s===4?d="交易完成":s===5?d="交易关闭":s===6&&(d="待使用"),d},h=()=>{},N=s=>"订单号："+s,j=(s,d)=>{let p="已付金额";return s===1&&(p="实付金额"),p+"：¥"+d};return(s,d)=>{const p=q,y=E,C=Q,i=H,I=V;return o(),l("div",ro,[_(n).length>0?(o(),l("div",go,[(o(!0),l(P,null,U(_(n),e=>(o(),l("div",po,[r("div",lo,[a(p,{value:g(e.status)},{title:t(()=>[r("span",io,T(N(e.orderNo)),1)]),_:2},1032,["value"])]),r("div",co,[(o(!0),l(P,null,U(e.goodsList,u=>(o(),c(C,{title:u.goodsName,num:u.goodsCount,price:u.goodsPrice,desc:u.goodsSku,thumb:u.goodsImageUrl},{tags:t(()=>[a(y,{plain:"",type:"danger"},{default:t(()=>[m("七天无理由退货")]),_:1})]),_:2},1032,["title","num","price","desc","thumb"]))),256))]),r("div",mo,[a(p,{title:j(e.status,e.totalPrice)},{default:t(()=>[e.status===1?(o(),c(i,{key:0,plain:"",type:"default",size:"mini"},{default:t(()=>[m(" 取消订单 ")]),_:1})):v("",!0),e.status===1?(o(),c(i,{key:1,type:"danger",size:"mini",onClick:h},{default:t(()=>[m(" 立即付款 ")]),_:1})):v("",!0),e.status===2?(o(),c(i,{key:2,plain:"",type:"default",size:"mini"},{default:t(()=>[m(" 提醒发货 ")]),_:1})):v("",!0),e.status===3?(o(),c(i,{key:3,plain:"",type:"default",size:"mini"},{default:t(()=>[m(" 延长收回 ")]),_:1})):v("",!0),e.status===3?(o(),c(i,{key:4,plain:"",type:"default",size:"mini"},{default:t(()=>[m(" 查看物流 ")]),_:1})):v("",!0),e.status===3?(o(),c(i,{key:5,type:"danger",size:"mini"},{default:t(()=>[m(" 确认收货 ")]),_:1})):v("",!0),e.status===4?(o(),c(i,{key:6,plain:"",type:"default",size:"small"},{default:t(()=>[m(" 再次购买 ")]),_:1})):v("",!0)]),_:2},1032,["title"])])]))),256))])):v("",!0),a(I)])}}}),w=B(uo,[["__scopeId","data-v-7c49b96a"]]),vo={};function _o(S,n){return" ToBeDelivered "}const No=B(vo,[["render",_o]]),jo={id:"order-container"},fo={id:"top-bar"},ho={class:"content"},yo={__name:"Index",setup(S){const n=f(0),g=f(w),h=s=>{console.info("handleTabClick:"+s),s==="/all"?g.value=w:g.value=No};J(()=>{K(()=>{j()})});const N=f([]),j=()=>{N.value=[{name:"all",title:"全部",icon:"",to:"/all",id:1},{name:"toBePaid",title:"待支付",icon:"",to:"/toBePaid",id:2,badge:"10+"},{name:"toBeDelivered",title:"待发货",icon:"",to:"/toBeDelivered",id:3},{name:"toBeReceiptUse",title:"待收货/使用",icon:"",to:"/toBeReceiptUse",id:4},{name:"evaluate",title:"评价",icon:"",to:"/evaluate",id:5},{name:"sales",title:"售后",icon:"",to:"/sales",id:7}]};return(s,d)=>{const p=$,y=Y,C=Z,i=W("router-view"),I=V;return o(),l("div",jo,[r("div",fo,[a(C,{active:_(n),"onUpdate:active":d[0]||(d[0]=e=>x(n)?n.value=e:null),onChange:h,sticky:""},{default:t(()=>[(o(!0),l(P,null,U(_(N),(e,u)=>(o(),c(y,{name:e.to,badge:e.badge},{title:t(()=>[a(p,{name:e.icon},null,8,["name"]),m(" "+T(e.title),1)]),_:2},1032,["name","badge"]))),256))]),_:1},8,["active"]),a(i)]),r("div",ho,[(o(),c(X(_(g))))]),a(I)])}}},ko=B(yo,[["__scopeId","data-v-cde0f784"]]),Po={class:"myorders"},Co={class:"myorders-header"},Io={class:"myorders-conetnt"},Fo={__name:"Index",setup(S){const n=L(),g=()=>{n.go(-1)};return(h,N)=>{const j=oo;return o(),l("div",Po,[r("div",Co,[a(j,{title:"我的订单",fixed:!0,"left-arrow":"",onClickLeft:g})]),r("div",Io,[a(no),a(ko)])])}}};export{Fo as default};
