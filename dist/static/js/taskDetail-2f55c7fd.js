import{A as k,a$ as b,bT as D,a2 as h,I as d,J as u,K as a,N as t,Q as l,R as c,W as n,O as f,U as v,Z as B,aj as C,ak as I}from"./index-51f9d840.js";const A=k({componentInfo:{labelNameCN:"\u76D1\u63A7\u4EFB\u52A1\u8BE6\u60C5\u9875\u9762",key:"taskDetail",description:"",gridInfo:{middle:b(9,8)}},propsDetail:{},baseProps:{},name:"taskDetail",data(){return{columns:[{title:"\u76D8\u7B26\u8DEF\u5F84",props:"dirName"},{title:"\u6587\u4EF6\u7CFB\u7EDF",props:"sysTypeName"},{title:"\u76D8\u7B26\u7C7B\u578B",props:"typeName"},{title:"\u603B\u5927\u5C0F(byte)",props:"total"},{title:"\u53EF\u7528\u5927\u5C0F(byte)",props:"free"},{title:"\u5DF2\u7528\u5927\u5C0F(byte)",props:"used"},{title:"\u5DF2\u7528\u767E\u5206\u6BD4",props:"usage"}],sys:{},mem:{},cpu:{},basicList:[{title:"\u670D\u52A1\u5668\u4FE1\u606F",obj:"sys",basicInfoList:[{name:"\u670D\u52A1\u5668\u540D\u79F0\uFF1A",key:"computerName"},{name:"\u670D\u52A1\u5668IP\uFF1A",key:"computerIp"},{name:"\u64CD\u4F5C\u7CFB\u7EDF\uFF1A",key:"osName"},{name:"\u7CFB\u7EDF\u67B6\u6784\uFF1A",key:"osArch"}]},{title:"\u5185\u5B58",obj:"mem",basicInfoList:[{name:"\u603B\u5185\u5B58(byte)\uFF1A",key:"total"},{name:"\u5DF2\u7528\u5185\u5B58(byte)\uFF1A",key:"used"},{name:"\u5269\u4F59\u5185\u5B58(byte)\uFF1A",key:"free"},{name:"\u4F7F\u7528\u7387\uFF1A",key:"usage"}]},{title:"CPU",obj:"cpu",basicInfoList:[{name:"\u6838\u5FC3\u6570\uFF1A",key:"cpuNum"},{name:"\u7528\u6237\u4F7F\u7528\u7387\uFF1A",key:"used"},{name:"\u7CFB\u7EDF\u4F7F\u7528\u7387\uFF1A",key:"sys"},{name:"\u5F53\u524D\u7A7A\u95F2\u7387\uFF1A",key:"free"}]}],tableData:[],JVMList:[{title:"Java\u540D\u79F0",key:"name"},{title:"Java\u7248\u672C",key:"version"},{title:"\u542F\u52A8\u65F6\u95F4",key:"startTime"},{title:"\u8FD0\u884C\u65F6\u957F",key:"runTime"},{title:"\u603B\u5185\u5B58(byte)",key:"total"},{title:"\u5DF2\u7528\u5185\u5B58(byte)",key:"used"},{title:"\u5B89\u88C5\u8DEF\u5F84",key:""},{title:"\u9879\u76EE\u8DEF\u5F84",key:"home"},{title:"\u8FD0\u884C\u53C2\u6570",key:"inputArgs"},{title:" ",key:" "}],JVMInfo:{}}},methods:{async getBasicInfo(){const e=await D("/web/sys/monitor/server",{}),o=e.data.cpu;this.cpu={free:(o.free*100).toFixed(2)+"%",sys:(o.sys*100).toFixed(2)+"%",used:(o.used*100).toFixed(2)+"%",cpuNum:o.cpuNum},e.data.cpu,this.mem=e.data.mem,this.mem.usage=(this.mem.usage*100).toFixed(2)+"%",this.sys=e.data.sys,this.JVMInfo=e.data.jvm,this.JVMInfo.startTime=new Date(this.JVMInfo.startTime).toLocaleString(),this.tableData=e.data.sysFiles||[],this.tableData.forEach(r=>{r.usage=r.usage+"%"})}},async mounted(){await this.getBasicInfo(),this.$emit("ready")}});const m=e=>(C("data-v-7582a55b"),e=e(),I(),e),J={class:"taskDetail"},V={class:"serverBasicInfo"},E={class:"serverTitle"},g={class:"leftTitle"},M={class:"rightContent"},N={class:"JVMBasic"},L=m(()=>t("div",{class:"JVMTitle"},"JVM",-1)),T={class:"JVMContent"},j={class:"JVMLabel"},w={class:"JVMValue"},S={class:"JVMBasic"},$=m(()=>t("div",{class:"JVMTitle"},"\u78C1\u76D8\u4FE1\u606F",-1)),x={class:"tableList"};function P(e,o,r,U,z,K){const p=d("el-table-column"),y=d("el-table");return u(),a("div",J,[t("div",V,[(u(!0),a(l,null,c(e.basicList,(s,i)=>(u(),a("div",{class:"serverInfoCard",key:i+"item"},[t("div",E,n(s.title),1),(u(!0),a(l,null,c(s.basicInfoList,(F,_)=>(u(),a("div",{class:"serverInfo",key:_+"list"},[t("div",g,n(F.name),1),t("div",M,n(this[s.obj][F.key]),1)]))),128))]))),128))]),t("div",N,[L,t("div",T,[(u(!0),a(l,null,c(e.JVMList,(s,i)=>(u(),a("div",{class:"JVMItem",key:i+"jvm"},[t("div",j,n(s.title),1),t("div",w,n(e.JVMInfo[s.key]),1)]))),128))])]),t("div",S,[$,t("div",x,[f(y,{data:e.tableData,border:!0},{default:v(()=>[(u(!0),a(l,null,c(e.columns,(s,i)=>(u(),B(p,{key:i+"columns",prop:s.props,label:s.title},null,8,["prop","label"]))),128))]),_:1},8,["data"])])])])}const Q=h(A,[["render",P],["__scopeId","data-v-7582a55b"]]);export{Q as default};
