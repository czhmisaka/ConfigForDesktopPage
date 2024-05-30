<!--
 * @Date: 2023-03-20 14:36:17
 * @LastEditors: CZH
 * @LastEditTime: 2024-05-26 23:21:09
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/grid/module/baseToolComponents/editor.vue
-->
<script setup lang="ts"> 
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// import { useRenderIcon } from "@/components/ReIcon/src/hooks";
// import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
// import { onBeforeUnmount, ref, shallowRef, onMounted, defineEmits } from "vue";
// import Edit from "@iconify-icons/ep/edit";
// defineOptions({
//   name: "Editor",
// });
// const mode = "default";
// // 编辑器实例，必须用 shallowRef
// const editorRef = shallowRef();
// // 内容 HTML
// const valueHtml = ref("");
// const toolbarConfig: any = { excludeKeys: "fullScreen" };
// const editorConfig = { placeholder: "请输入内容..." };
// const props = defineProps({
//   modelValue: {
//     type: String,
//     default: "",
//   },
// });
// // 组件销毁时，也及时销毁编辑器
// onBeforeUnmount(() => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.destroy();
// });

// onMounted(() => {
//   setTimeout(() => {
//     const editor = editorRef.value;
//     editor.setHtml(props.modelValue);
//   }, 1000);
// });
// const handleCreated = (editor) => {
//   editorRef.value = editor; // 记录 editor 实例，重要！
// };

// const emit = defineEmits(["update:modelValue"]);
// const handleChange = (editor) => {
//   console.log("change:", editor.getHtml());
//   emit("update:modelValue", editor.getHtml());
// }; 
</script>

<template>
  <!-- <cardBg>
    <div class="wangeditor">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
  </cardBg> -->
</template>
