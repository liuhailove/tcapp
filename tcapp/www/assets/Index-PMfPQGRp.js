import{p as M,l as O,m as Q,n as U,t as b,q as F,d as H,g as s,s as R,v as j,P as G,H as J,I as T,x as W,r as h,y as $,o as m,b as P,h as _,i as y,z as x,w as X,F as L,f as c,A as V,c as w,e as Y,B as Z,j as ee,C as te,D as oe,E as ne,G as ae,J as z,L as E,a as A,M as v,N as se,O as le}from"./index-24JTbN02.js";import{_ as B}from"./_plugin-vue_export-helper-x3n3nnut.js";import{T as ce}from"./TopBar-VRzct96h.js";/* empty css              */const ie=e=>e==null?void 0:e.includes("/"),re=[...M,"round","closeOnPopstate","safeAreaInsetBottom"],he={qq:"qq",link:"link-o",weibo:"weibo",qrcode:"qr",poster:"photo-o",wechat:"wechat","weapp-qrcode":"miniprogram-o","wechat-moments":"wechat-moments"},[de,d,pe]=O("share-sheet"),ue=Q({},U,{title:String,round:b,options:F(),cancelText:String,description:String,closeOnPopstate:b,safeAreaInsetBottom:b});var me=H({name:de,props:ue,emits:["cancel","select","update:show"],setup(e,{emit:t,slots:n}){const i=a=>t("update:show",a),S=()=>{i(!1),t("cancel")},p=(a,r)=>t("select",a,r),l=()=>{const a=n.title?n.title():e.title,r=n.description?n.description():e.description;if(a||r)return s("div",{class:d("header")},[a&&s("h2",{class:d("title")},[a]),r&&s("span",{class:d("description")},[r])])},u=a=>ie(a)?s("img",{src:a,class:d("image-icon")},null):s("div",{class:d("icon",[a])},[s(T,{name:he[a]||a},null)]),f=(a,r)=>{const{name:k,icon:D,className:K,description:q}=a;return s("div",{role:"button",tabindex:0,class:[d("option"),K,J],onClick:()=>p(a,r)},[u(D),k&&s("span",{class:d("name")},[k]),q&&s("span",{class:d("option-description")},[q])])},o=(a,r)=>s("div",{class:d("options",{border:r})},[a.map(f)]),I=()=>{const{options:a}=e;return Array.isArray(a[0])?a.map((r,k)=>o(r,k!==0)):o(a)},g=()=>{var a;const r=(a=e.cancelText)!=null?a:pe("cancel");if(n.cancel||r)return s("button",{type:"button",class:d("cancel"),onClick:S},[n.cancel?n.cancel():r])};return()=>s(G,R({class:d(),position:"bottom","onUpdate:show":i},j(e,re)),{default:()=>[l(),I(),g()]})}});const Se=W(me),fe={__name:"Share",props:{shareSheetShow:{type:Boolean,default:!1}},setup(e){const t=e,n=h(t.shareSheetShow);console.info("innerShareShow:"+t.shareSheetShow);const i=[[{name:"微信",icon:"wechat"},{name:"QQ",icon:"qq"},{name:"复制链接",icon:"link"}]],S=p=>{if(p.name==="复制链接"){let l="https://snowcyans.github.io/QQShortVideo/#/";navigator.clipboard.writeText(l),x("复制成功"),n.value=!1}else x("暂未开放")};return $(()=>{console.info("watchEffect shareShow:"+t.shareSheetShow),n.value=t.shareSheetShow}),(p,l)=>{const u=Se;return m(),P(u,{onSelect:S,show:_(n),"onUpdate:show":l[0]||(l[0]=f=>y(n)?n.value=f:null),overlay:!0,title:"立即分享",options:i},null,8,["show"])}}},N=e=>(z("data-v-4a651709"),e=e(),E(),e),we=["src"],ve={key:0},_e={key:1,style:{color:"gray"}},ke={key:2},Ce=N(()=>c("div",{class:"chatSplit"},null,-1)),Ie={class:"chatValue"},ge=N(()=>c("p",null,"发送",-1)),be=[ge],ye={__name:"Chat",props:{chatIsShow:{type:Boolean,default:!1}},setup(e){const t=e,n=h(t.chatIsShow);h(0);let i=h("");h(!1);let S=[{chatImg:"",name:"chat1",flag:!0,chatLikeShow:!0,chatText:"你好"},{chatImg:"",name:"chat2",flag:!0,chatLikeShow:!0,chatText:"你好2"},{chatImg:"",name:"chat3",flag:!0,chatLikeShow:!1,chatText:"你好3"}];return $(()=>{console.info("watchEffect chatIsShow:"+t.chatIsShow),n.value=t.chatIsShow}),(p,l)=>{const u=T,f=ae;return m(),P(f,{show:_(n),"onUpdate:show":l[4]||(l[4]=o=>y(n)?n.value=o:null),overlay:!1,title:"评论"},{default:X(()=>[(m(!0),w(L,null,ee(_(S),(o,I)=>(m(),w("div",{class:"chatContent",key:I},[c("img",{src:o.chatImg,alt:""},null,8,we),c("div",null,[c("i",null,V(o.name)+"}",1),o.flag?(m(),w("span",ve,"作者")):Y("",!0),o.chatTextShow?(m(),w("p",_e,"！[该评论已被隐藏]")):(m(),w("p",ke,V(o.chatText),1))]),c("div",null,[s(u,{onClick:g=>p.handleChatLike(o),name:o.chatLikeShow?"like":"like-o",size:"16",color:o.chatLikeShow?"#f9476f":""},null,8,["onClick","name","color"]),Z("    "),s(u,{onClick:g=>o.chatTextShow=!o.chatTextShow,name:o.chatTextShow?"eye":"closed-eye",size:"16"},null,8,["onClick","name"])])]))),128)),Ce,c("div",Ie,[c("div",null,[s(u,{name:"photo-o",onClick:l[0]||(l[0]=o=>_(x)("暂未开放"))}),ne(c("input",{type:"text",onKeyup:l[1]||(l[1]=te(o=>p.publish(),["enter"])),"onUpdate:modelValue":l[2]||(l[2]=o=>y(i)?i.value=o:i=o),placeholder:"善语结善缘，恶言伤人心"},null,544),[[oe,_(i),void 0,{trim:!0}]]),c("div",{onClick:l[3]||(l[3]=o=>p.publish())},be)])])]),_:1},8,["show"])}}},xe=B(ye,[["__scopeId","data-v-4a651709"]]),Te={props:{sidebarVisible:{type:Boolean,required:!0}},components:{ShareSheet:fe,Chat:xe},setup(e){const t=h(!1);let n=h(!1);const i=h(e.sidebarVisible);return $(()=>{console.info("watchEffect:"+e.sidebarVisible),i.value=e.sidebarVisible}),{leftSidebarVisible:i,shareShow:t,chatShow:n,handleShare:()=>{console.info("handleShare:"+t.value),t.value=!t.value},handleChat:()=>{n.value=!n.value}}}},C=e=>(z("data-v-2cc6dd57"),e=e(),E(),e),$e={class:"right-info"},Be=C(()=>c("p",null,"100",-1)),qe=C(()=>c("p",null,"200",-1)),Ve=C(()=>c("p",null,"300",-1)),Ae=C(()=>c("p",null,"66",-1));function Pe(e,t,n,i,S,p){const l=T,u=A("ShareSheet"),f=A("Chat");return m(),w(L,null,[c("div",$e,[c("img",{onClick:t[0]||(t[0]=v(o=>e.jump(),["stop"])),alt:""}),c("div",{onClick:t[1]||(t[1]=o=>e.handleAddCol()),class:"addCol"},[s(l,{name:"plus",size:"14",color:"#1989fa"})]),c("div",null,[s(l,{onClick:t[2]||(t[2]=v(o=>e.handleLike(e.i),["stop"])),name:"like",size:"30",color:"#f9476f"}),Be]),c("div",null,[s(l,{onClick:t[3]||(t[3]=v(o=>i.handleChat(),["stop"])),name:"chat",size:"30",color:"#B3C0D1"}),qe]),c("div",null,[s(l,{onClick:t[4]||(t[4]=v(o=>e.handlecollection(e.i),["stop"])),name:"star",size:"30",color:"#ffb701"}),Ve]),c("div",null,[s(l,{onClick:t[5]||(t[5]=v(o=>i.handleShare(),["stop"])),name:"share",size:"30",color:"#1989fa"}),Ae])]),s(u,{shareSheetShow:i.shareShow},null,8,["shareSheetShow"]),s(f,{chatIsShow:i.chatShow},null,8,["chatIsShow"])],64)}const Le=B(Te,[["render",Pe],["__scopeId","data-v-2cc6dd57"]]),ze={id:"home-container"},Ee={__name:"Index",setup(e){const t=h([]);h(0),h(2),se(()=>{le(()=>{n()})});const n=()=>{t.value=[{name:"hot",title:"热点",icon:"",to:"/hot",id:1},{name:"live",title:"直播",icon:"",to:"/live",id:2},{name:"mall",title:"电商",icon:"",to:"/mall",id:3},{name:"recommend",title:"推荐",icon:"",to:"/recommand",id:4},{name:"search",title:"搜索",icon:"search",to:"/search",id:5}]};return h(!1),(i,S)=>(m(),w("div",ze,[s(ce),s(Le)]))}},Oe=B(Ee,[["__scopeId","data-v-610534e3"]]);export{Oe as default};
