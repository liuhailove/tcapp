import{p as F,l as G,m as H,n as j,t as I,q as J,d as z,g as l,s as W,v as X,P as Y,H as Z,I as x,x as ee,r as d,y as B,o as p,b as T,h as f,i as y,z as $,w as E,F as V,f as i,A as P,c as v,e as te,B as oe,j as D,C as ne,D as ae,E as se,G as le,J as N,L as K,a as L,M as k,u as ie,N as M,O,Q as ce,R as re}from"./index-P0GqNzvx.js";import{_ as q}from"./_plugin-vue_export-helper-x3n3nnut.js";/* empty css              */const he=t=>t==null?void 0:t.includes("/"),de=[...F,"round","closeOnPopstate","safeAreaInsetBottom"],pe={qq:"qq",link:"link-o",weibo:"weibo",qrcode:"qr",poster:"photo-o",wechat:"wechat","weapp-qrcode":"miniprogram-o","wechat-moments":"wechat-moments"},[ue,m,me]=G("share-sheet"),Se=H({},j,{title:String,round:I,options:J(),cancelText:String,description:String,closeOnPopstate:I,safeAreaInsetBottom:I});var _e=z({name:ue,props:Se,emits:["cancel","select","update:show"],setup(t,{emit:e,slots:n}){const c=s=>e("update:show",s),S=()=>{c(!1),e("cancel")},h=(s,r)=>e("select",s,r),a=()=>{const s=n.title?n.title():t.title,r=n.description?n.description():t.description;if(s||r)return l("div",{class:m("header")},[s&&l("h2",{class:m("title")},[s]),r&&l("span",{class:m("description")},[r])])},u=s=>he(s)?l("img",{src:s,class:m("image-icon")},null):l("div",{class:m("icon",[s])},[l(x,{name:pe[s]||s},null)]),_=(s,r)=>{const{name:g,icon:R,className:U,description:A}=s;return l("div",{role:"button",tabindex:0,class:[m("option"),U,Z],onClick:()=>h(s,r)},[u(R),g&&l("span",{class:m("name")},[g]),A&&l("span",{class:m("option-description")},[A])])},o=(s,r)=>l("div",{class:m("options",{border:r})},[s.map(_)]),w=()=>{const{options:s}=t;return Array.isArray(s[0])?s.map((r,g)=>o(r,g!==0)):o(s)},C=()=>{var s;const r=(s=t.cancelText)!=null?s:me("cancel");if(n.cancel||r)return l("button",{type:"button",class:m("cancel"),onClick:S},[n.cancel?n.cancel():r])};return()=>l(Y,W({class:m(),position:"bottom","onUpdate:show":c},X(t,de)),{default:()=>[a(),w(),C()]})}});const ve=ee(_e),fe={__name:"Share",props:{shareSheetShow:{type:Boolean,default:!1}},setup(t){const e=t,n=d(e.shareSheetShow);console.info("innerShareShow:"+e.shareSheetShow);const c=[[{name:"微信",icon:"wechat"},{name:"QQ",icon:"qq"},{name:"复制链接",icon:"link"}]],S=h=>{if(h.name==="复制链接"){let a="https://snowcyans.github.io/QQShortVideo/#/";navigator.clipboard.writeText(a),$("复制成功"),n.value=!1}else $("暂未开放")};return B(()=>{console.info("watchEffect shareShow:"+e.shareSheetShow),n.value=e.shareSheetShow}),(h,a)=>{const u=ve;return p(),T(u,{onSelect:S,show:f(n),"onUpdate:show":a[0]||(a[0]=_=>y(n)?n.value=_:null),overlay:!0,title:"立即分享",options:c},null,8,["show"])}}},Q=t=>(N("data-v-4a651709"),t=t(),K(),t),we=["src"],ke={key:0},Ce={key:1,style:{color:"gray"}},ge={key:2},be=Q(()=>i("div",{class:"chatSplit"},null,-1)),Ie={class:"chatValue"},ye=Q(()=>i("p",null,"发送",-1)),$e=[ye],xe={__name:"Chat",props:{chatIsShow:{type:Boolean,default:!1}},setup(t){const e=t,n=d(e.chatIsShow);d(0);let c=d("");d(!1);let S=[{chatImg:"",name:"chat1",flag:!0,chatLikeShow:!0,chatText:"你好"},{chatImg:"",name:"chat2",flag:!0,chatLikeShow:!0,chatText:"你好2"},{chatImg:"",name:"chat3",flag:!0,chatLikeShow:!1,chatText:"你好3"}];return B(()=>{console.info("watchEffect chatIsShow:"+e.chatIsShow),n.value=e.chatIsShow}),(h,a)=>{const u=x,_=le;return p(),T(_,{show:f(n),"onUpdate:show":a[4]||(a[4]=o=>y(n)?n.value=o:null),overlay:!1,title:"评论"},{default:E(()=>[(p(!0),v(V,null,D(f(S),(o,w)=>(p(),v("div",{class:"chatContent",key:w},[i("img",{src:o.chatImg,alt:""},null,8,we),i("div",null,[i("i",null,P(o.name)+"}",1),o.flag?(p(),v("span",ke,"作者")):te("",!0),o.chatTextShow?(p(),v("p",Ce,"！[该评论已被隐藏]")):(p(),v("p",ge,P(o.chatText),1))]),i("div",null,[l(u,{onClick:C=>h.handleChatLike(o),name:o.chatLikeShow?"like":"like-o",size:"16",color:o.chatLikeShow?"#f9476f":""},null,8,["onClick","name","color"]),oe("    "),l(u,{onClick:C=>o.chatTextShow=!o.chatTextShow,name:o.chatTextShow?"eye":"closed-eye",size:"16"},null,8,["onClick","name"])])]))),128)),be,i("div",Ie,[i("div",null,[l(u,{name:"photo-o",onClick:a[0]||(a[0]=o=>f($)("暂未开放"))}),se(i("input",{type:"text",onKeyup:a[1]||(a[1]=ne(o=>h.publish(),["enter"])),"onUpdate:modelValue":a[2]||(a[2]=o=>y(c)?c.value=o:c=o),placeholder:"善语结善缘，恶言伤人心"},null,544),[[ae,f(c),void 0,{trim:!0}]]),i("div",{onClick:a[3]||(a[3]=o=>h.publish())},$e)])])]),_:1},8,["show"])}}},Be=q(xe,[["__scopeId","data-v-4a651709"]]),Te={props:{sidebarVisible:{type:Boolean,required:!0}},components:{ShareSheet:fe,Chat:Be},setup(t){const e=d(!1);let n=d(!1);const c=d(t.sidebarVisible);return B(()=>{console.info("watchEffect:"+t.sidebarVisible),c.value=t.sidebarVisible}),{leftSidebarVisible:c,shareShow:e,chatShow:n,handleShare:()=>{console.info("handleShare:"+e.value),e.value=!e.value},handleChat:()=>{n.value=!n.value}}}},b=t=>(N("data-v-2cc6dd57"),t=t(),K(),t),Ve={class:"right-info"},qe=b(()=>i("p",null,"100",-1)),Ae=b(()=>i("p",null,"200",-1)),Pe=b(()=>i("p",null,"300",-1)),Le=b(()=>i("p",null,"66",-1));function ze(t,e,n,c,S,h){const a=x,u=L("ShareSheet"),_=L("Chat");return p(),v(V,null,[i("div",Ve,[i("img",{onClick:e[0]||(e[0]=k(o=>t.jump(),["stop"])),alt:""}),i("div",{onClick:e[1]||(e[1]=o=>t.handleAddCol()),class:"addCol"},[l(a,{name:"plus",size:"14",color:"#1989fa"})]),i("div",null,[l(a,{onClick:e[2]||(e[2]=k(o=>t.handleLike(t.i),["stop"])),name:"like",size:"30",color:"#f9476f"}),qe]),i("div",null,[l(a,{onClick:e[3]||(e[3]=k(o=>c.handleChat(),["stop"])),name:"chat",size:"30",color:"#B3C0D1"}),Ae]),i("div",null,[l(a,{onClick:e[4]||(e[4]=k(o=>t.handlecollection(t.i),["stop"])),name:"star",size:"30",color:"#ffb701"}),Pe]),i("div",null,[l(a,{onClick:e[5]||(e[5]=k(o=>c.handleShare(),["stop"])),name:"share",size:"30",color:"#1989fa"}),Le])]),l(u,{shareSheetShow:c.shareShow},null,8,["shareSheetShow"]),l(_,{chatIsShow:c.chatShow},null,8,["chatIsShow"])],64)}const Ee=q(Te,[["render",ze],["__scopeId","data-v-2cc6dd57"]]),De={id:"top-bar",class:"topBarContainer"},Ne=z({__name:"TopBar",setup(t){const e=ie(),n=d([]);M(()=>{O(()=>{c()})});const c=()=>{n.value=[{name:"app",title:"",icon:"apps-o",to:"/app",id:1},{name:"hot",title:"热点",icon:"",to:"/hot",id:2},{name:"live",title:"直播",icon:"",to:"/live",id:3},{name:"mall",title:"电商",icon:"",to:"/mall",id:4},{name:"recommend",title:"推荐",icon:"",to:"/recommand",id:5},{name:"search",title:"",icon:"search",to:"/search",id:6},{name:"setting",title:"",icon:"setting-o",to:"/setting",id:7}]},S=(h,a)=>{console.info("sidebarVisible.value"+h+","+a),e.push(a)};return(h,a)=>{const u=re,_=ce;return p(),v("div",De,[l(_,{"column-num":f(n).length,border:!1},{default:E(()=>[(p(!0),v(V,null,D(f(n),(o,w)=>(p(),T(u,{key:w,icon:o.icon,text:o.title,onClick:C=>S(w,o.name)},null,8,["icon","text","onClick"]))),128))]),_:1},8,["column-num"])])}}}),Ke={id:"home-container"},Me={__name:"Index",setup(t){const e=d([]);d(0),d(2),M(()=>{O(()=>{n()})});const n=()=>{e.value=[{name:"hot",title:"热点",icon:"",to:"/hot",id:1},{name:"live",title:"直播",icon:"",to:"/live",id:2},{name:"mall",title:"电商",icon:"",to:"/mall",id:3},{name:"recommend",title:"推荐",icon:"",to:"/recommand",id:4},{name:"search",title:"搜索",icon:"search",to:"/search",id:5}]};return d(!1),(c,S)=>(p(),v("div",Ke,[l(Ne),l(Ee)]))}},Ue=q(Me,[["__scopeId","data-v-92b19598"]]);export{Ue as default};