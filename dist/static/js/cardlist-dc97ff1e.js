import{A as S,aW as V,b1 as D,a_ as b,a2 as E,I as u,ar as K,L as I,J as t,K as n,N as O,Q as h,R as k,Z as a,U as i,O as $,P as g,a6 as C,V as f,W as w,X as r,S as P}from"./index-51f9d840.js";const U=S({name:"cardList",components:{cardBg:V},props:["template","loading","dataList","baseData","load","cardFunc","height","canSelect"],data:()=>({loading:!1,showType:D,loadingMap:{}}),methods:{async btnClick(e,p,c={}){if(this.loadingMap[e.label+e.showAbleKey+c]=!0,e.type==b.OpenDrawer)this.$modules.getModuleApi().userManage_openDrawerForm(this,e.drawerProps);else if(e.type==b.Function&&e.function){let y=this;await e.function(y,p)}else e.type==b.Url&&window.open(e.url);this.loadingMap[e.label+e.showAbleKey+c]=!1},cellDblclick(e){let p=[];this.template.map(c=>{c.table.type==D.btnList&&c.table.btnList&&c.table.btnList.map(y=>{p.push(y)})}),this.$modules.getModuleApi().userManage_openDrawerForm(this,{title:"\u8BE6\u60C5",queryItemTemplate:this.template,btnList:p,data:e,noEdit:!0})}}});const W={class:"cardBox"},q=["height"],J={key:0,class:"cardBoxList"},Q={key:0,class:"title"},R={key:1},X={key:1,class:"cardBoxList"};function Z(e,p,c,y,j,G){const m=u("el-popover"),v=u("el-button"),M=u("el-form-item"),A=u("el-form"),z=u("cardBg"),N=K("loading");return I((t(),n("div",W,[O("div",{class:"scroll",height:e.height+"px"},[e.cardFunc?e.cardFunc?(t(),n("div",X,[(t(!0),n(h,null,k(e.dataList,o=>(t(),a(C(e.cardFunc(o)),{onBtnClick:B=>e.btnClick(B,o)},null,40,["onBtnClick"]))),256))])):r("",!0):(t(),n("div",J,[(t(!0),n(h,null,k(e.dataList,(o,B)=>(t(),a(z,{class:P("card"),"cus-style":{}},{default:i(()=>[$(A,{size:"small"},{default:i(()=>[(t(!0),n(h,null,k(e.template,(l,L)=>{var F;return t(),n("span",null,[L==0?(t(),n("div",Q,[l.table.type!=e.showType.btnList?(t(),n("div",{key:0,class:"flexBox",style:g((F=l.table)==null?void 0:F.style)},[l.table.type==e.showType.funcComponent?(t(),a(C(l.table.showFunc(o,l.key)),{key:0,onBtnClick:e.btnClick,onClick:d=>e.btnClick(d,o)},null,40,["onBtnClick","onClick"])):l.table.type==e.showType.func?(t(),a(m,{key:1,placement:"top-start",trigger:"hover","show-after":500,content:l.table.showFunc(o,l.key,!0)+""},{reference:i(()=>[f(w(l.table.showFunc(o,l.key)),1)]),_:2},1032,["content"])):r("",!0)],4)):r("",!0)])):r("",!0),L!=0?(t(),n("span",R,[$(M,{label:l.label,width:"120px"},{default:i(()=>{var d,T;return[l.table.type!=e.showType.btnList?(t(),n("div",{key:0,class:"flexBox",style:g((d=l.table)==null?void 0:d.style)},[l.table.type==e.showType.funcComponent?(t(),a(C(l.table.showFunc(o,l.key)),{key:0,onBtnClick:e.btnClick,onClick:s=>e.btnClick(s,o)},null,40,["onBtnClick","onClick"])):l.table.type==e.showType.func?(t(),a(m,{key:1,placement:"top-start",trigger:"hover","show-after":500,content:l.table.showFunc(o,l.key,!0)+""},{reference:i(()=>[f(w(l.table.showFunc(o,l.key)),1)]),_:2},1032,["content"])):r("",!0)],4)):(t(),n("div",{key:1,class:"flexBox noOverflow",style:g((T=l.table)==null?void 0:T.style)},[l.table.noDetail?r("",!0):(t(),a(v,{key:0,size:"small",link:"",type:"primary",onClick:s=>e.cellDblclick(o)},{default:i(()=>[f(" \u8BE6\u60C5 ")]),_:2},1032,["onClick"])),(t(!0),n(h,null,k(l.table.btnList,(s,_)=>(t(),n("span",{key:_+"btn"},[s.isShow(o,s)?(t(),a(v,{key:0,loading:e.loadingMap[s.label+s.showAbleKey+_],style:{"margin-left":"3px",cursor:"pointer"},disabled:s.isDisable(o,l.key),size:"small",type:s.elType?typeof s.elType!="string"?s.elType(o):s.elType:"",onClick:H=>e.btnClick(s,o,_)},{default:i(()=>[f(w(s.label),1)]),_:2},1032,["loading","disabled","type","onClick"])):r("",!0)]))),128))],4))]}),_:2},1032,["label"])])):r("",!0)])}),256))]),_:2},1024)]),_:2},1024))),256))]))],8,q)])),[[N,e.loading]])}const x=E(U,[["render",Z],["__scopeId","data-v-f199544b"]]);export{x as default};
