import{A as i,a$ as r,b0 as a,a2 as s}from"./index-51f9d840.js";import{eventTriggerType as t}from"./eventCenter-e5ddf247.js";const o=i({componentInfo:{labelNameCN:"\u4E8B\u4EF6\u89E6\u53D1\u5668",key:"eventCenters",description:"\u4E00\u4E2A\u7528\u4E8E\u89E6\u53D1\u4E8B\u4EF6\u7684\u5DE5\u5177",gridInfo:{middle:r(0,0)}},propsDetail:{event:{label:"\u4E8B\u4EF6",type:a.functionEditor},triggerType:{label:"\u89E6\u53D1\u7C7B\u578B",type:a.text},stop:{label:"\u505C\u6B62\u6807\u8BC6",type:a.boolean}},props:["baseData","gridList","event","triggerType","stop"],watch:{baseData:{handler(e){this.triggerType==t.onBaseDataChange}}},data:()=>({}),async mounted(){const e=this;e.triggerType===t.onMounted&&e.event&&!this.stop&&await e.event(e,e.baseData),e.triggerType===t.windowResize&&window.addEventListener("resize",async n=>{await e.event(e,e.baseData)}),this.$emit("ready")},async unmounted(){const e=this;e.triggerType===t.windowResize&&window.addEventListener("resize",async n=>{await e.event(e,e.baseData)})}});function u(e,n,p,d,c,g){return null}const l=s(o,[["render",u]]);export{l as default};
