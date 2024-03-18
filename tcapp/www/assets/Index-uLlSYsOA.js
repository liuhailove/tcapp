import{p as W,l as N,m as X,n as Y,t as I,q as Z,d as z,g as s,s as ee,v as te,P as ne,H as oe,I as b,x as D,y as ae,F as y,C as se,z as ie,r as p,A as V,o as f,b as M,h as _,i as x,B,_ as q,w as T,f as r,D as A,c as S,e as le,E as R,j as K,G as ce,J as re,L as he,M as de,N as O,O as Q,a as E,Q as g,u as ue,R as U,S as F}from"./index-xs-ApMsQ.js";const pe=e=>e==null?void 0:e.includes("/"),me=[...W,"round","closeOnPopstate","safeAreaInsetBottom"],fe={qq:"qq",link:"link-o",weibo:"weibo",qrcode:"qr",poster:"photo-o",wechat:"wechat","weapp-qrcode":"miniprogram-o","wechat-moments":"wechat-moments"},[ve,v,Se]=N("share-sheet"),_e=X({},Y,{title:String,round:I,options:Z(),cancelText:String,description:String,closeOnPopstate:I,safeAreaInsetBottom:I});var we=z({name:ve,props:_e,emits:["cancel","select","update:show"],setup(e,{emit:n,slots:t}){const i=c=>n("update:show",c),m=()=>{i(!1),n("cancel")},l=(c,u)=>n("select",c,u),o=()=>{const c=t.title?t.title():e.title,u=t.description?t.description():e.description;if(c||u)return s("div",{class:v("header")},[c&&s("h2",{class:v("title")},[c]),u&&s("span",{class:v("description")},[u])])},h=c=>pe(c)?s("img",{src:c,class:v("image-icon")},null):s("div",{class:v("icon",[c])},[s(b,{name:fe[c]||c},null)]),d=(c,u)=>{const{name:C,icon:G,className:J,description:P}=c;return s("div",{role:"button",tabindex:0,class:[v("option"),J,oe],onClick:()=>l(c,u)},[h(G),C&&s("span",{class:v("name")},[C]),P&&s("span",{class:v("option-description")},[P])])},a=(c,u)=>s("div",{class:v("options",{border:u})},[c.map(d)]),w=()=>{const{options:c}=e;return Array.isArray(c[0])?c.map((u,C)=>a(u,C!==0)):a(c)},k=()=>{var c;const u=(c=e.cancelText)!=null?c:Se("cancel");if(t.cancel||u)return s("button",{type:"button",class:v("cancel"),onClick:m},[t.cancel?t.cancel():u])};return()=>s(ne,ee({class:v(),position:"bottom","onUpdate:show":i},te(e,me)),{default:()=>[o(),w(),k()]})}});const ge=D(we),[L,ye]=N("space"),ke={align:String,direction:{type:String,default:"horizontal"},size:{type:[Number,String,Array],default:8},wrap:Boolean,fill:Boolean};function H(e=[]){const n=[];return e.forEach(t=>{Array.isArray(t)?n.push(...t):t.type===y?n.push(...H(t.children)):n.push(t)}),n.filter(t=>{var i;return!(t&&(t.type===se||t.type===y&&((i=t.children)==null?void 0:i.length)===0||t.type===ie&&t.children.trim()===""))})}var Ce=z({name:L,props:ke,setup(e,{slots:n}){const t=ae(()=>{var l;return(l=e.align)!=null?l:e.direction==="horizontal"?"center":""}),i=l=>typeof l=="number"?l+"px":l,m=l=>{const o={},h=`${i(Array.isArray(e.size)?e.size[0]:e.size)}`,d=`${i(Array.isArray(e.size)?e.size[1]:e.size)}`;return l?e.wrap?{marginBottom:d}:{}:(e.direction==="horizontal"&&(o.marginRight=h),(e.direction==="vertical"||e.wrap)&&(o.marginBottom=d),o)};return()=>{var l;const o=H((l=n.default)==null?void 0:l.call(n));return s("div",{class:[ye({[e.direction]:e.direction,[`align-${t.value}`]:t.value,wrap:e.wrap,fill:e.fill})]},[o.map((h,d)=>s("div",{key:`item-${d}`,class:`${L}-item`,style:m(d===o.length-1)},[h]))])}}});const be=D(Ce),$e={__name:"Share",props:{shareSheetShow:{type:Boolean,default:!1}},setup(e){const n=e,t=p(n.shareSheetShow);console.info("innerShareShow:"+n.shareSheetShow);const i=[[{name:"微信",icon:"wechat"},{name:"QQ",icon:"qq"},{name:"复制链接",icon:"link"}]],m=l=>{if(l.name==="复制链接"){let o="https://snowcyans.github.io/QQShortVideo/#/";navigator.clipboard.writeText(o),B("复制成功"),t.value=!1}else B("暂未开放")};return V(()=>{console.info("watchEffect shareShow:"+n.shareSheetShow),t.value=n.shareSheetShow}),(l,o)=>{const h=ge;return f(),M(h,{onSelect:m,show:_(t),"onUpdate:show":o[0]||(o[0]=d=>x(t)?t.value=d:null),overlay:!0,title:"立即分享",options:i},null,8,["show"])}}},j=e=>(O("data-v-4a651709"),e=e(),Q(),e),Ie=["src"],xe={key:0},Be={key:1,style:{color:"gray"}},Te={key:2},Ae=j(()=>r("div",{class:"chatSplit"},null,-1)),ze={class:"chatValue"},Ve=j(()=>r("p",null,"发送",-1)),qe=[Ve],Pe={__name:"Chat",props:{chatIsShow:{type:Boolean,default:!1}},setup(e){const n=e,t=p(n.chatIsShow);p(0);let i=p("");p(!1);let m=[{chatImg:"",name:"chat1",flag:!0,chatLikeShow:!0,chatText:"你好"},{chatImg:"",name:"chat2",flag:!0,chatLikeShow:!0,chatText:"你好2"},{chatImg:"",name:"chat3",flag:!0,chatLikeShow:!1,chatText:"你好3"}];return V(()=>{console.info("watchEffect chatIsShow:"+n.chatIsShow),t.value=n.chatIsShow}),(l,o)=>{const h=b,d=de;return f(),M(d,{show:_(t),"onUpdate:show":o[4]||(o[4]=a=>x(t)?t.value=a:null),overlay:!1,title:"评论"},{default:T(()=>[(f(!0),S(y,null,K(_(m),(a,w)=>(f(),S("div",{class:"chatContent",key:w},[r("img",{src:a.chatImg,alt:""},null,8,Ie),r("div",null,[r("i",null,A(a.name)+"}",1),a.flag?(f(),S("span",xe,"作者")):le("",!0),a.chatTextShow?(f(),S("p",Be,"！[该评论已被隐藏]")):(f(),S("p",Te,A(a.chatText),1))]),r("div",null,[s(h,{onClick:k=>l.handleChatLike(a),name:a.chatLikeShow?"like":"like-o",size:"16",color:a.chatLikeShow?"#f9476f":""},null,8,["onClick","name","color"]),R("    "),s(h,{onClick:k=>a.chatTextShow=!a.chatTextShow,name:a.chatTextShow?"eye":"closed-eye",size:"16"},null,8,["onClick","name"])])]))),128)),Ae,r("div",ze,[r("div",null,[s(h,{name:"photo-o",onClick:o[0]||(o[0]=a=>_(B)("暂未开放"))}),he(r("input",{type:"text",onKeyup:o[1]||(o[1]=ce(a=>l.publish(),["enter"])),"onUpdate:modelValue":o[2]||(o[2]=a=>x(i)?i.value=a:i=a),placeholder:"善语结善缘，恶言伤人心"},null,544),[[re,_(i),void 0,{trim:!0}]]),r("div",{onClick:o[3]||(o[3]=a=>l.publish())},qe)])])]),_:1},8,["show"])}}},Ee=q(Pe,[["__scopeId","data-v-4a651709"]]),Le={props:{sidebarVisible:{type:Boolean,required:!0}},components:{ShareSheet:$e,Chat:Ee},setup(e){const n=p(!1);let t=p(!1);const i=p(e.sidebarVisible);return V(()=>{console.info("watchEffect:"+e.sidebarVisible),i.value=e.sidebarVisible}),{leftSidebarVisible:i,shareShow:n,chatShow:t,handleShare:()=>{console.info("handleShare:"+n.value),n.value=!n.value},handleChat:()=>{t.value=!t.value}}}},$=e=>(O("data-v-2cc6dd57"),e=e(),Q(),e),Ne={class:"right-info"},De=$(()=>r("p",null,"100",-1)),Me=$(()=>r("p",null,"200",-1)),Re=$(()=>r("p",null,"300",-1)),Ke=$(()=>r("p",null,"66",-1));function Oe(e,n,t,i,m,l){const o=b,h=E("ShareSheet"),d=E("Chat");return f(),S(y,null,[r("div",Ne,[r("img",{onClick:n[0]||(n[0]=g(a=>e.jump(),["stop"])),alt:""}),r("div",{onClick:n[1]||(n[1]=a=>e.handleAddCol()),class:"addCol"},[s(o,{name:"plus",size:"14",color:"#1989fa"})]),r("div",null,[s(o,{onClick:n[2]||(n[2]=g(a=>e.handleLike(e.i),["stop"])),name:"like",size:"30",color:"#f9476f"}),De]),r("div",null,[s(o,{onClick:n[3]||(n[3]=g(a=>i.handleChat(),["stop"])),name:"chat",size:"30",color:"#B3C0D1"}),Me]),r("div",null,[s(o,{onClick:n[4]||(n[4]=g(a=>e.handlecollection(e.i),["stop"])),name:"star",size:"30",color:"#ffb701"}),Re]),r("div",null,[s(o,{onClick:n[5]||(n[5]=g(a=>i.handleShare(),["stop"])),name:"share",size:"30",color:"#1989fa"}),Ke])]),s(h,{shareSheetShow:i.shareShow},null,8,["shareSheetShow"]),s(d,{chatIsShow:i.chatShow},null,8,["chatIsShow"])],64)}const Qe=q(Le,[["render",Oe],["__scopeId","data-v-2cc6dd57"]]),Ue={id:"top-bar"},Fe={id:"topBar"},He=z({__name:"TopBar",setup(e){const n=ue(),t=p([]);U(()=>{F(()=>{i()})});const i=()=>{t.value=[{name:"app",title:"应用",icon:"apps-o",to:"/app",id:1},{name:"hot",title:"热点",icon:"",to:"/hot",id:2},{name:"live",title:"直播",icon:"",to:"/live",id:3},{name:"mall",title:"电商",icon:"",to:"/mall",id:4},{name:"recommend",title:"推荐",icon:"",to:"/recommand",id:5},{name:"search",title:"搜索",icon:"search",to:"/search",id:6},{name:"setting",title:"配置",icon:"setting-o",to:"/setting",id:7}]},m=(l,o)=>{console.info("sidebarVisible.value"+l+","+o),n.push(o)};return(l,o)=>{const h=b,d=be;return f(),S("div",Ue,[s(d,{size:40},{default:T(()=>[(f(!0),S(y,null,K(_(t),(a,w)=>(f(),S("div",Fe,[s(h,{size:"1vw",color:"#1989fa",onClick:k=>m(w,a.name),name:a.icon},{default:T(()=>[R(A(a.title),1)]),_:2},1032,["onClick","name"])]))),256))]),_:1})])}}}),je={id:"home-container"},Ge={__name:"Index",setup(e){const n=p([]);p(0),p(2),U(()=>{F(()=>{t()})});const t=()=>{n.value=[{name:"hot",title:"热点",icon:"",to:"/hot",id:1},{name:"live",title:"直播",icon:"",to:"/live",id:2},{name:"mall",title:"电商",icon:"",to:"/mall",id:3},{name:"recommend",title:"推荐",icon:"",to:"/recommand",id:4},{name:"search",title:"搜索",icon:"search",to:"/search",id:5}]};return p(!1),(i,m)=>(f(),S("div",je,[s(He),s(Qe)]))}},We=q(Ge,[["__scopeId","data-v-92b19598"]]);export{We as default};