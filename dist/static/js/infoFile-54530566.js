import{A as d,a2 as f,I as a,J as s,K as i,W as n,O as t,U as r,N as l}from"./index-51f9d840.js";const u=d({name:"infoFile",nameCn:"\u5C55\u793A\u4E00\u4E2A\u6587\u4EF6\u7684\u8BE6\u60C5",data:()=>({fileDetail:null}),watch:{file:{handler(){}},size:{handler(){}}},props:["file","size","baseData","sizeUnit"]});const p={class:"flex"},m={key:0,class:"icon"},h={key:1,class:"icon"},v={class:"fileName"},D={class:"fileInfo"};function C(e,F,b,y,E,k){var o;const c=a("Files"),_=a("el-icon");return s(),i("div",p,[e.fileDetail.icon?(s(),i("div",m,n(e.fileDetail.icon),1)):(s(),i("div",h,[t(_,null,{default:r(()=>[t(c)]),_:1})])),l("div",v,n(e.fileDetail.name),1),l("div",D,n((o=e.fileDetail)==null?void 0:o.sizeInfo),1)])}const B=f(u,[["render",C],["__scopeId","data-v-27b642b9"]]);export{B as default};
