import{ak as v,u as h,r as k,a as I,o as w,c as A,g as a,i,j as b,w as C,al as L,am as V,ac as y}from"./index-5jfpaivH.js";/* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              */import{_ as B}from"./_plugin-vue_export-helper-x3n3nnut.js";const E={class:"address"},R={__name:"Index",setup(g){let d=v(),t=h(),e=d.query.chosenAddressId,r=d.query.type;const l=k([{id:1,name:"河南周口",tel:"1888888888",address:"河南省周口市区一栋"},{id:2,name:"深圳南山",tel:"1888888888",address:"深圳南山龙岗中心城市"}]),c=()=>{t.back()},u=()=>{t.push({path:"/user/address/add"})},p=(s,o)=>{t.push({path:"/user/address/edit",params:{addressId:s.id}})},m=(s,o)=>{console.info(r),r==="1"&&(e=s.id,t.back())};return(s,o)=>{const _=y,f=V,x=I("router-view");return w(),A("div",E,[a(_,{title:"收货地址",fixed:!0,"left-arrow":"",onClickLeft:c}),a(f,{modelValue:i(e),"onUpdate:modelValue":o[0]||(o[0]=n=>b(e)?e.value=n:e=n),list:i(l),"default-tag-text":"默认",onAdd:u,onEdit:p,onSelect:m,"add-button-text":"新增地址"},null,8,["modelValue","list"]),a(L,{name:"router-slider",mode:"out-in"},{default:C(()=>[a(x)]),_:1})])}}},D=B(R,[["__scopeId","data-v-6e343c11"]]);export{D as default};
