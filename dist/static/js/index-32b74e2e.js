import{A as p,m as C,r as h,ai as i,I as u,J as d,Z as B,U as t,O as l,P as _,v as s,V,N as m,W as k,a9 as b,K as A,Q as P,R as S,a5 as w,bV as x}from"./index-51f9d840.js";const N={class:"card-header"},U=p({name:"PermissionPage"}),H=p({...U,setup(z){var n;let o=C(()=>({width:"85vw",justifyContent:"start"})),e=h((n=i())==null?void 0:n.username);const f=[{value:"admin",label:"\u7BA1\u7406\u5458\u89D2\u8272"},{value:"common",label:"\u666E\u901A\u89D2\u8272"}];function F(){i().loginByUsername({username:e.value}).then(r=>{r.success&&(w().clearAllCachePage(),x())})}return(r,c)=>{const v=u("el-tag"),D=u("el-option"),g=u("el-select"),y=u("el-card"),E=u("el-space");return d(),B(E,{direction:"vertical",size:"large"},{default:t(()=>[l(v,{style:_(s(o)),size:"large",effect:"dark"},{default:t(()=>[V(" \u6A21\u62DF\u540E\u53F0\u6839\u636E\u4E0D\u540C\u89D2\u8272\u8FD4\u56DE\u5BF9\u5E94\u8DEF\u7531\uFF08\u5177\u4F53\u53C2\u8003\u5B8C\u6574\u7248pure-admin\u4EE3\u7801\uFF09 ")]),_:1},8,["style"]),l(y,{shadow:"never",style:_(s(o))},{header:t(()=>[m("div",N,[m("span",null,"\u5F53\u524D\u89D2\u8272\uFF1A"+k(s(e)),1)])]),default:t(()=>[l(g,{modelValue:s(e),"onUpdate:modelValue":c[0]||(c[0]=a=>b(e)?e.value=a:e=a),onChange:F},{default:t(()=>[(d(),A(P,null,S(f,a=>l(D,{key:a.value,label:a.label,value:a.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1},8,["style"])]),_:1})}}});export{H as default};
