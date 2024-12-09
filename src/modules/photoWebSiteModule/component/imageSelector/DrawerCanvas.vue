<!--
 * @Author: czhmisaka
 * @Date: 2024-12-08 04:29:11
 * @FilePath: \github\config-for-desktop-page\src\modules\photoWebSiteModule\component\imageSelector\DrawerCanvas.vue
-->
<template>
  <div><canvas ref="canvas"></canvas><input type="file" /></div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      image: null, // 存储上传的图片
      isDrawing: false, // 表示是否正在绘制
      lastX: 0, // 记录上一个点的X坐标
      lastY: 0, // 记录上一个点的Y坐标
      brushSize: 10, // 笔刷大小
    };
  },
  mounted(){
  },
  methods: {
    handleFileUpload(e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.image = new Image();
        this.image.onload = () => {
          this.draw();
        };
        this.image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    draw() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      context.drawImage(this.image, 0, 0);
    },
    startDrawing(e) {
      this.isDrawing = true;
      this.lastX = e.clientX - this.$refs.canvas.offsetLeft;
      this.lastY = e.clientY - this.$refs.canvas.offsetTop;
    },
    drawing(e) {
      if (!this.isDrawing) return;

      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      context.strokeStyle = "#000";
      context.lineJoin = "round";
      context.lineWidth = this.brushSize;

      context.beginPath();
      context.moveTo(this.lastX, this.lastY);
      context.lineTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
      context.closePath();
      context.stroke();

      this.lastX = e.clientX - canvas.offsetLeft;
      this.lastY = e.clientY - canvas.offsetTop;
    },
    stopDrawing() {
      this.isDrawing = false;
    },
  },
});
</script>