import{r,o as f,J as l,Z as h,U as g,N as e,v as o,K as i,L as y,bZ as b,P as k,X as c,W as w,aW as x,bT as C,by as B}from"./index-51f9d840.js";const D={class:"wrapper"},L={class:"content"},N=e("div",{class:"top-bar"},[e("div",{class:"top-bar-left"}),e("div",{class:"top-bar-title"}),e("div",{class:"top-bar-eight"})],-1),P={key:0,class:"form fade"},S={key:0,class:"spinner"},T=e("div",{class:"double-bounce1"},null,-1),U=[T],V={key:1},W={key:1,class:"form fade"},E={class:"avatar"},M=["src"],Z={class:"user-panel"},z=e("div",null,null,-1),J={__name:"login",emits:["ready","onChange"],setup(A,{emit:v}){var s={idle:0,loading:1,success:2,error:3};const a=r(s.idle),t=r({name:"",avatar:""});function d(){a.value==s.idle&&(a.value=s.loading,setTimeout(async()=>{let n=await C("/userinfo",{body:{name:t.value.name}});n.data.length==0?await B("/userinfo",{name:t.value.name,avatar:"https://avatars.githubusercontent.com/u/22533472?v=4"}):t.value=n.data[0],a.value=s.success},1e3))}function _(){a.value==s.success&&(a.value=s.idle)}const m=v;return f(()=>{m("ready"),window.onkeyup=()=>{let n=window.event.key;n=="ArrowDown"||n=="Enter"&&d()}}),(n,u)=>(l(),h(o(x),{id:"login-panel"},{default:g(()=>[e("div",D,[e("div",L,[N,a.value!=o(s).success?(l(),i("div",P,[y(e("input",{type:"text","onUpdate:modelValue":u[0]||(u[0]=p=>t.value.name=p),placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u540D",class:"input"},null,512),[[b,t.value.name]]),e("div",{onClick:d,style:k({maxWidth:a.value==o(s).loading?"40px":"80px",borderRadius:a.value==o(s).loading?"20px":"5px"}),class:"confirm-button"},[a.value==o(s).loading?(l(),i("div",S,U)):c("",!0),a.value==o(s).idle?(l(),i("div",V,"\u767B\u9646")):c("",!0)],4)])):c("",!0),a.value==o(s).success?(l(),i("div",W,[e("div",E,[e("img",{src:t.value.avatarUrl,alt:""},null,8,M)]),e("div",Z,"\u597D\uFF01\u4E00\u770B\u5C31\u77E5\u9053\u300A"+w(t.value.name)+"\u300B\u5F88\u6709\u7CBE\u795E\uFF01",1),e("div",{onClick:_,class:"confirm-button red"},"\u6CE8\u9500")])):c("",!0),z])])]),_:1}))}};export{J as default};
