import{p as j,l as R,m as F,n as H,t as $,q as G,d as J,g as c,s as W,v as X,P as Y,H as Z,I as x,x as ee,r as m,y as V,o as d,b as g,i as S,j as y,z as B,w as I,F as L,f as i,A,c as f,e as te,B as D,h as N,C as oe,D as ne,E as ae,G as se,J as K,L as M,a as q,M as b,N as ce,O as le,Q as ie,S as re,R as he,U as de}from"./index-XYiMG1Fy.js";/* empty css              *//* empty css              */import{_ as pe}from"./Index.vue_vue_type_script_setup_true_lang-RgIFOqMz.js";/* empty css              */import{_ as P}from"./_plugin-vue_export-helper-x3n3nnut.js";/* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              */const ue=o=>o==null?void 0:o.includes("/"),me=[...j,"round","closeOnPopstate","safeAreaInsetBottom"],_e={qq:"qq",link:"link-o",weibo:"weibo",qrcode:"qr",poster:"photo-o",wechat:"wechat","weapp-qrcode":"miniprogram-o","wechat-moments":"wechat-moments"},[ve,u,fe]=R("share-sheet"),Se=F({},H,{title:String,round:$,options:G(),cancelText:String,description:String,closeOnPopstate:$,safeAreaInsetBottom:$});var we=J({name:ve,props:Se,emits:["cancel","select","update:show"],setup(o,{emit:e,slots:n}){const l=s=>e("update:show",s),_=()=>{l(!1),e("cancel")},p=(s,r)=>e("select",s,r),a=()=>{const s=n.title?n.title():o.title,r=n.description?n.description():o.description;if(s||r)return c("div",{class:u("header")},[s&&c("h2",{class:u("title")},[s]),r&&c("span",{class:u("description")},[r])])},h=s=>ue(s)?c("img",{src:s,class:u("image-icon")},null):c("div",{class:u("icon",[s])},[c(x,{name:_e[s]||s},null)]),v=(s,r)=>{const{name:C,icon:Q,className:U,description:z}=s;return c("div",{role:"button",tabindex:0,class:[u("option"),U,Z],onClick:()=>p(s,r)},[h(Q),C&&c("span",{class:u("name")},[C]),z&&c("span",{class:u("option-description")},[z])])},t=(s,r)=>c("div",{class:u("options",{border:r})},[s.map(v)]),w=()=>{const{options:s}=o;return Array.isArray(s[0])?s.map((r,C)=>t(r,C!==0)):t(s)},k=()=>{var s;const r=(s=o.cancelText)!=null?s:fe("cancel");if(n.cancel||r)return c("button",{type:"button",class:u("cancel"),onClick:_},[n.cancel?n.cancel():r])};return()=>c(Y,W({class:u(),position:"bottom","onUpdate:show":l},X(o,me)),{default:()=>[a(),w(),k()]})}});const ke=ee(we),Ce={__name:"Share",props:{shareSheetShow:{type:Boolean,default:!1}},setup(o){const e=o,n=m(e.shareSheetShow);console.info("innerShareShow:"+e.shareSheetShow);const l=[[{name:"微信",icon:"wechat"},{name:"QQ",icon:"qq"},{name:"复制链接",icon:"link"}]],_=p=>{if(p.name==="复制链接"){let a="https://snowcyans.github.io/QQShortVideo/#/";navigator.clipboard.writeText(a),B("复制成功"),n.value=!1}else B("暂未开放")};return V(()=>{console.info("watchEffect shareShow:"+e.shareSheetShow),n.value=e.shareSheetShow}),(p,a)=>{const h=ke;return d(),g(h,{onSelect:_,show:S(n),"onUpdate:show":a[0]||(a[0]=v=>y(n)?n.value=v:null),overlay:!0,title:"立即分享",options:l},null,8,["show"])}}},O=o=>(K("data-v-8f60a97c"),o=o(),M(),o),be=["src"],ge={key:0},Ie={key:1,style:{color:"gray"}},ye={key:2},xe=O(()=>i("div",{class:"chatSplit"},null,-1)),Te={class:"chatValue"},$e=O(()=>i("p",null,"发送",-1)),Be=[$e],Ae={__name:"Chat",props:{chatIsShow:{type:Boolean,default:!1}},setup(o){const e=o,n=m(e.chatIsShow);m(0);let l=m("");m(!1);let _=[{chatImg:"",name:"chat1",flag:!0,chatLikeShow:!0,chatText:"你好"},{chatImg:"",name:"chat2",flag:!0,chatLikeShow:!0,chatText:"你好2"},{chatImg:"",name:"chat3",flag:!0,chatLikeShow:!1,chatText:"你好3"}];return V(()=>{console.info("watchEffect chatIsShow:"+e.chatIsShow),n.value=e.chatIsShow}),(p,a)=>{const h=x,v=se;return d(),g(v,{show:S(n),"onUpdate:show":a[4]||(a[4]=t=>y(n)?n.value=t:null),overlay:!1,title:"评论"},{default:I(()=>[(d(!0),f(L,null,N(S(_),(t,w)=>(d(),f("div",{class:"chatContent",key:w},[i("img",{src:t.chatImg,alt:""},null,8,be),i("div",null,[i("i",null,A(t.name)+"}",1),t.flag?(d(),f("span",ge,"作者")):te("",!0),t.chatTextShow?(d(),f("p",Ie,"！[该评论已被隐藏]")):(d(),f("p",ye,A(t.chatText),1))]),i("div",null,[c(h,{onClick:k=>p.handleChatLike(t),name:t.chatLikeShow?"like":"like-o",size:"16",color:t.chatLikeShow?"#f9476f":""},null,8,["onClick","name","color"]),D("    "),c(h,{onClick:k=>t.chatTextShow=!t.chatTextShow,name:t.chatTextShow?"eye":"closed-eye",size:"16"},null,8,["onClick","name"])])]))),128)),xe,i("div",Te,[i("div",null,[c(h,{name:"photo-o",onClick:a[0]||(a[0]=t=>S(B)("暂未开放"))}),ae(i("input",{type:"text",onKeyup:a[1]||(a[1]=oe(t=>p.publish(),["enter"])),"onUpdate:modelValue":a[2]||(a[2]=t=>y(l)?l.value=t:l=t),placeholder:"善语结善缘，恶言伤人心"},null,544),[[ne,S(l),void 0,{trim:!0}]]),i("div",{onClick:a[3]||(a[3]=t=>p.publish())},Be)])])]),_:1},8,["show"])}}},qe=P(Ae,[["__scopeId","data-v-8f60a97c"]]),Ve={props:{sidebarVisible:{type:Boolean,required:!0}},components:{ShareSheet:Ce,Chat:qe},setup(o){const e=m(!1);let n=m(!1);const l=m(o.sidebarVisible);return V(()=>{console.info("watchEffect:"+o.sidebarVisible),l.value=o.sidebarVisible}),{leftSidebarVisible:l,shareShow:e,chatShow:n,handleAddCol:()=>{},handleShare:()=>{console.info("handleShare:"+e.value),e.value=!e.value},handleChat:()=>{n.value=!n.value},handleLike:w=>{},handlecollection:w=>{},jump:()=>{}}}},T=o=>(K("data-v-67ca8f90"),o=o(),M(),o),Le={class:"right-info"},Pe=T(()=>i("p",null,"100",-1)),ze=T(()=>i("p",null,"200",-1)),Ee=T(()=>i("p",null,"300",-1)),De=T(()=>i("p",null,"66",-1));function Ne(o,e,n,l,_,p){const a=x,h=q("ShareSheet"),v=q("Chat");return d(),f(L,null,[i("div",Le,[i("img",{onClick:e[0]||(e[0]=b(t=>l.jump(),["stop"])),alt:""}),i("div",{onClick:e[1]||(e[1]=t=>l.handleAddCol()),class:"addCol"},[c(a,{name:"plus",size:"14",color:"#1989fa"})]),i("div",null,[c(a,{onClick:e[2]||(e[2]=b(t=>l.handleLike(o.i),["stop"])),name:"like",size:"30",color:"#f9476f"}),Pe]),i("div",null,[c(a,{onClick:e[3]||(e[3]=b(t=>l.handleChat(),["stop"])),name:"chat",size:"30",color:"#B3C0D1"}),ze]),i("div",null,[c(a,{onClick:e[4]||(e[4]=b(t=>l.handlecollection(o.i),["stop"])),name:"star",size:"30",color:"#ffb701"}),Ee]),i("div",null,[c(a,{onClick:e[5]||(e[5]=b(t=>l.handleShare(),["stop"])),name:"share",size:"30",color:"#1989fa"}),De])]),c(h,{shareSheetShow:l.shareShow},null,8,["shareSheetShow"]),c(v,{chatIsShow:l.chatShow},null,8,["chatIsShow"])],64)}const Ke=P(Ve,[["render",Ne],["__scopeId","data-v-67ca8f90"]]),E={__name:"Index",setup(o){return(e,n)=>(d(),g(Ke))}},Me={id:"home-container"},Oe={id:"top-bar"},Qe={class:"content"},Ue={__name:"Index",setup(o){const e=m(0),n=m(E),l=a=>{console.info("handleTabClick:"+a),a==="/live"?n.value=E:n.value=pe};ce(()=>{le(()=>{p()})});const _=m([]),p=()=>{_.value=[{name:"app",title:"",icon:"apps-o",to:"/app",id:1},{name:"hot",title:"热点",icon:"",to:"/hot",id:2},{name:"live",title:"直播",icon:"",to:"/live",id:3},{name:"mall",title:"电商",icon:"",to:"/mall",id:4},{name:"recommend",title:"推荐",icon:"",to:"/recommand",id:5},{name:"search",title:"",icon:"search",to:"/search",id:6},{name:"setting",title:"",icon:"setting-o",to:"/setting",id:7}]};return(a,h)=>{const v=x,t=de,w=he,k=re,s=q("router-view");return d(),f("div",Me,[i("div",Oe,[c(k,null,{default:I(()=>[c(w,{active:S(e),"onUpdate:active":h[0]||(h[0]=r=>y(e)?e.value=r:null),onChange:l,sticky:""},{default:I(()=>[(d(!0),f(L,null,N(S(_),(r,C)=>(d(),g(t,{name:r.to},{title:I(()=>[c(v,{name:r.icon},null,8,["name"]),D(" "+A(r.title),1)]),_:2},1032,["name"]))),256))]),_:1},8,["active"])]),_:1}),c(s)]),i("div",Qe,[(d(),g(ie(S(n))))])])}}},ot=P(Ue,[["__scopeId","data-v-eb1c03a3"]]);export{ot as default};
