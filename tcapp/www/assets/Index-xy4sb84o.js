import{d as h,r as s,u as C,a as V,o as a,c as d,b as r,e as i,K as w,f as x,g as l,w as I,F as B,h as N,i as m,j as T,T as A,k as $}from"./index-urJLDUXD.js";/* empty css              */import{_ as y}from"./_plugin-vue_export-helper-x3n3nnut.js";const F={id:"dashboard"},K={id:"tabbar"},R=h({__name:"Index",setup(j){const u=s(10),_=[{name:"home",title:"首页",icon:"wap-home"},{name:"friends",title:"朋友",icon:"friends-o",badge:"13"},{name:"add",title:"添加",icon:"plus"},{name:"message",title:"消息",icon:"chat-o",badge:"9"},{name:"user",title:"我的",icon:"manager"}],p=s(0),t=s(0),b=C(),f=(n,o)=>{p.value=n,b.push(o)};return(n,o)=>{const c=V("router-view"),v=$,g=A;return a(),d("div",F,[(a(),r(w,null,[n.$route.meta.keepAlive?(a(),r(c,{key:0})):i("",!0)],1024)),n.$route.meta.keepAlive?i("",!0):(a(),r(c,{key:0})),x("div",K,[l(g,{modelValue:m(t),"onUpdate:modelValue":o[0]||(o[0]=e=>T(t)?t.value=e:null)},{default:I(()=>[(a(),d(B,null,N(_,(e,k)=>l(v,{id:e.name==="cart"?"shop-cart":"",info:e.name==="cart"?m(u):"",icon:e.icon,badge:e.name==="friends"||e.name==="message"?e.badge:"",onClick:E=>f(k,e.name)},null,8,["id","info","icon","badge","onClick"])),64))]),_:1},8,["modelValue"])])])}}}),z=y(R,[["__scopeId","data-v-faeadbc4"]]);export{z as default};
