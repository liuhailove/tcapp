import{u as U,r as V,a as L,o as N,c as P,g as e,f as i,w as a,R as T,ag as R,a3 as F,i as t,B as p,an as m,ac as G,ap as $,a4 as q,aq as D,U as E,a2 as J,J as j,L as z}from"./index-5jfpaivH.js";/* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              *//* empty css              */import{_ as A}from"./_plugin-vue_export-helper-x3n3nnut.js";const k=u=>(j("data-v-8e71a552"),u=u(),z(),u),H={class:"login"},K={class:"login-box"},M={style:{margin:"16px"}},O={style:{margin:"16px"}},W={class:"login-third-login"},X=k(()=>i("span",{class:"title"},"微信登录",-1)),Y=k(()=>i("span",{class:"title"},"QQ登录",-1)),Z={__name:"Index",setup(u){let _=U();const s=V({username:void 0,password:void 0}),l=V({username:void 0,password:void 0,confirmPassword:void 0}),x=()=>{_.go(-1)},y=(d,o)=>{d==="login"?s.value={username:void 0,password:void 0}:d==="register"&&(l.value={username:void 0,password:void 0,confirmPassword:void 0})},c=d=>{d===0?m({message:"微信登录",duration:800}):m({message:"QQ登录",duration:800})},C=d=>{if(!s.username){m({message:"请填写用户名",duration:800});return}if(!s.password){m({message:"请填写密码",duration:800});return}_.back()},h=()=>{};return(d,o)=>{const I=G,r=$,f=q,g=D,v=E,S=T,B=R,b=L("svg-icon"),w=J,Q=F;return N(),P("div",H,[e(I,{title:"用户登录",fixed:!0,"left-arrow":"",onClickLeft:x}),i("div",K,[e(S,{type:"card",onClick:y},{default:a(()=>[e(v,{name:"login",title:"登录"},{default:a(()=>[e(g,{onSubmit:C},{default:a(()=>[e(r,{modelValue:t(s).username,"onUpdate:modelValue":o[0]||(o[0]=n=>t(s).username=n),name:"用户名",label:"用户名",placeholder:"用户名"},null,8,["modelValue"]),e(r,{modelValue:t(s).password,"onUpdate:modelValue":o[1]||(o[1]=n=>t(s).password=n),type:"password",name:"密码",label:"密码",placeholder:"密码"},null,8,["modelValue"]),i("div",M,[e(f,{block:"",type:"info",color:"linear-gradient(to right, #4bb0ff, #6149f6)","native-type":"submit"},{default:a(()=>[p(" 登录 ")]),_:1})])]),_:1})]),_:1}),e(v,{name:"register",title:"注册"},{default:a(()=>[e(g,{onSubmit:h},{default:a(()=>[e(r,{modelValue:t(l).username,"onUpdate:modelValue":o[2]||(o[2]=n=>t(l).username=n),name:"用户名",label:"用户名",placeholder:"用户名"},null,8,["modelValue"]),e(r,{modelValue:t(l).password,"onUpdate:modelValue":o[3]||(o[3]=n=>t(l).password=n),type:"password",name:"密码",label:"密码",placeholder:"密码"},null,8,["modelValue"]),e(r,{modelValue:t(l).confirmPassword,"onUpdate:modelValue":o[4]||(o[4]=n=>t(l).confirmPassword=n),type:"password",name:"确认密码",label:"确认密码",placeholder:"确认密码"},null,8,["modelValue"]),i("div",O,[e(f,{block:"",type:"info",color:"linear-gradient(to right, #4bb0ff, #6149f6)","native-type":"submit"},{default:a(()=>[p(" 注册 ")]),_:1})])]),_:1})]),_:1})]),_:1})]),i("div",W,[e(B,null,{default:a(()=>[p(" 其他登录方式 ")]),_:1}),e(Q,{"column-num":2,border:!1},{default:a(()=>[e(w,{onClick:o[5]||(o[5]=n=>c(0))},{default:a(()=>[e(b,{iconClass:"wechat"}),X]),_:1}),e(w,{onClick:o[6]||(o[6]=n=>c(1))},{default:a(()=>[e(b,{iconClass:"QQ"}),Y]),_:1})]),_:1})])])}}},ue=A(Z,[["__scopeId","data-v-8e71a552"]]);export{ue as default};
