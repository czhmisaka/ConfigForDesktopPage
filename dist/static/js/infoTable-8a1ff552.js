import{A as M,bJ as I,bK as O,bL as F,b1 as B,ab as P,a_ as v,ac as R,a2 as V,I as f,ar as j,L as $,J as o,K as d,Z as c,U as u,X as b,Q as E,R as A,bM as z,N as H,W as S,P as w,a6 as N,V as L,aj as W,ak as J}from"./index-51f9d840.js";import U from"./noData-3195cd4b.js";const q=M({components:{ElTable:I,ElTableV2:O,ElTableColumn:F},props:["template","loading","dataList","baseData","load","defalutSelectedList","canSelect","rowHeightKey"],data(){return{showType:B,fuckKey:Math.random()*1e5,selectedList:[],loadingMap:{},cardStyle:P()}},computed:{tableHeader(){return{backgroundColor:"#f8f9fb",fontWeight:900,color:"#333"}},tableHeaderDark(){return{backgroundColor:"rgba(0,0,0,0.3)",fontWeight:900,color:"#ddd"}}},watch:{defalutSelectedList:{handler(e){this.initSelected()},immediate:!0,deep:!0}},async mounted(){this.initSelected()},methods:{async initSelected(){let e=await new Promise((t,h)=>{let m=setInterval(()=>{const y=this.$refs.tableController;y&&(clearInterval(m),t(y))},100)}),n=[],s=[];const r=e.getSelectionRows().map(t=>t.value);let g=this.dataList||[];const k=g.map(t=>t.value),p=this.defalutSelectedList||[];p.map(t=>{k.indexOf(t.value)>-1&&r.indexOf(t.value)==-1&&n.push(t.value)}),k.map(t=>{r.indexOf(t)!=-1&&p.map(h=>h.value).indexOf(t)==-1&&s.push(t)}),(n.length>0||s.length>0)&&(e.clearSelection(),g.map(t=>{n.indexOf(t.value)!=-1&&e.toggleRowSelection(t,!0),s.indexOf(t.value)!=-1&&e.toggleRowSelection(t,!1)}))},judgeSelect(e,n){return!e.unshow},cellDblclick(e){let n=[];this.template.map(s=>{s.table.type==B.btnList&&s.table.btnList&&s.table.btnList.map(r=>{n.push(r)})}),this.$modules.getModuleApi().userManage_openDrawerForm(this,{title:"\u8BE6\u60C5",queryItemTemplate:this.template,btnList:n,data:e,noEdit:!0})},close(){this.$emit("search")},selectPosition(e){this.selectedList=e,this.$emit("selectedChange",this.selectedList)},tableHeight(){return this.$refs.tableBox?this.$refs.tableBox.offsetHeight:null},async btnClick(e,n,s={}){if(this.loadingMap[e.label+e.showAbleKey+s.$index]=!0,e.type==v.OpenDrawer)this.$modules.getModuleApi().userManage_openDrawerForm(this,e.drawerProps);else if(e.type==v.Function&&e.function){let r=this;await e.function(r,n)}else e.type==v.Url&&window.open(e.url);this.loadingMap[e.label+e.showAbleKey+s.$index]=!1},sortBy(e,n,s){return e[s]}},setup(){const{isDark:e}=R();return{isDark:e}}});const Q=e=>(W("data-v-0a04000d"),e=e(),J(),e),X={class:"ColumnHeader"},Z={key:1,class:"centerImg"},G=Q(()=>H("img",{src:U},null,-1)),Y=[G];function x(e,n,s,r,g,k){const p=f("ElTableColumn"),t=f("el-popover"),h=f("el-button"),m=f("ElTable"),y=j("loading");return $((o(),d("div",{ref:"tableBox",class:"tableBox",style:w({boxShadow:e.cardStyle.get("shadow"),borderRadius:e.cardStyle.get("borderRadius")+"px"})},[e.dataList&&e.dataList.length>0?$((o(),c(m,{ref:"tableController",key:e.fuckKey,data:e.dataList,height:"100%","row-style":{"min-height":"60px","min-width":"100px",height:e.rowHeightKey+"px"},"header-cell-style":e.isDark?e.tableHeaderDark:e.tableHeader,fit:!0,border:!1,"row-key":"id",onSelectAll:e.selectPosition,onSelect:e.selectPosition,style:{cursor:"default"},lazy:"",load:e.load,"tree-props":{children:"children",hasChildren:"hasChildren"}},{default:u(()=>[e.canSelect?(o(),c(p,{key:0,selectable:e.judgeSelect,type:"selection",align:"center",fixed:"left","sort-by":(l,C)=>e.sortBy(l,C,e.item.key)},null,8,["selectable","sort-by"])):b("",!0),(o(!0),d(E,null,A(e.template.filter(l=>l.showAble),(l,C)=>{var D;return o(),c(p,{key:C+"tablecolumn",label:l.label,width:((D=l.table)==null?void 0:D.width)||"auto",prop:l.key,fixed:l.table.fixed},z({header:u(()=>[H("div",X,S(l.label),1)]),_:2},[l.table.type!=e.showType.dataKey?{name:"default",fn:u(i=>{var _,T;return[l.table.type!=e.showType.btnList?(o(),d("div",{key:0,class:"flexBox",style:w((_=l.table)==null?void 0:_.style)},[l.table.type==e.showType.funcComponent?(o(),c(N(l.table.showFunc(i.row,l.key)),{key:0,onBtnClick:e.btnClick,onClick:a=>e.btnClick(a,i.row)},null,40,["onBtnClick","onClick"])):l.table.type==e.showType.func?(o(),c(t,{key:1,placement:"top-start",trigger:"hover","show-after":500,content:l.table.showFunc(i.row,l.key,!0)+""},{reference:u(()=>[L(S(l.table.showFunc(i.row,l.key)),1)]),_:2},1032,["content"])):b("",!0)],4)):(o(),d("div",{key:1,class:"flexBox noOverflow",style:w((T=l.table)==null?void 0:T.style)},[l.table.noDetail?b("",!0):(o(),c(h,{key:0,size:"small",link:"",type:"primary",onClick:a=>e.cellDblclick(i.row)},{default:u(()=>[L(" \u8BE6\u60C5 ")]),_:2},1032,["onClick"])),(o(!0),d(E,null,A(l.table.btnList,(a,K)=>(o(),d("span",{key:K+"btn"},[a.isShow(i.row,a)?(o(),c(h,{key:0,loading:e.loadingMap[a.label+a.showAbleKey+i.$index],disabled:a.isDisable(i.row,l.key),size:"small",link:"",type:a.elType?a.elType:a.isDisable(i.row,l.key)?"info":"primary",onClick:ee=>e.btnClick(a,i.row,i),style:w(a.isDisable(i.row,l.key)?"color:rgba(39, 58, 91, 0.6)":a.btnColor?"color:"+a.btnColor:"")},{default:u(()=>[L(S(a.label),1)]),_:2},1032,["loading","disabled","type","onClick","style"])):b("",!0)]))),128))],4))]}),key:"0"}:void 0]),1032,["label","width","prop","fixed"])}),128))]),_:1},8,["data","row-style","header-cell-style","onSelectAll","onSelect","load"])),[[y,e.loading]]):(o(),d("div",Z,Y))],4)),[[y,e.loading]])}const ae=V(q,[["render",x],["__scopeId","data-v-0a04000d"]]);export{ae as default};
