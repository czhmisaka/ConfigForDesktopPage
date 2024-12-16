<template>
  <div class="basic_container">
    <div class="tool">
      <el-button @click="handlePenClick">钢笔</el-button>
    </div>
    <div class="dialog_wrap">
      <div class="image_wrap">
        <cropper-canvas ref="croppercanvas" background>
          <cropper-image
            :src="fileObj.fileShow"
            alt="Picture"
            ref="cropperimage"
            rotatable
            scalable
            skewable
            translatable
          ></cropper-image>
          <canvas
            v-if="isDrawing"
            ref="drawingcanvas"
            class="drawing_canvas"
            width="400"
            height="300"
            @click="startDrawing"
            @mousemove="draw"
          ></canvas>
        </cropper-canvas>
      </div>
      <div class="info_wrap" >
        <div class="cropper_preview" style="opacity: 0">
          <div>实际效果：img/canvas</div>
          <canvas ref="resultCanvas"></canvas>
        </div>
        <div>
          <img :src="realShow" style="width: 200px" />
        </div>
        <div class="btn_wrap">
          <input type="file" ref="input_form" @change="handleUploadSuccess" />
          <button type="primary" @click="handleConfirm">确认裁剪</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "cropperjs";
import { computed, nextTick, ref, onMounted } from "vue";

const fileObj = ref({});

const croppercanvas = ref();
const cropperimage = ref();

/**
 * 钢笔
 */
const isDrawing = ref(false);
let points = [];
const drawingcanvas = ref();
// 是否正在使用钢笔绘画线条
let isPanDrawingLine = false;
async function handlePenClick() {
  isDrawing.value = true;
  points = [];
  isPanDrawingLine = true;
  // 清除之前的动态线条
  // await nextTick();
  // const ctx = drawingcanvas.value.getContext('2d');
  // drawStaticElements(ctx, drawingcanvas.value, true);
  // ctx.clearRect(0, 0, drawingcanvas.value.width, drawingcanvas.value.height);
}
function startDrawing(e) {
  if (!isDrawing.value || !isPanDrawingLine) return;
  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const ctx = canvas.getContext("2d");

  // 判断是否和已有点重合
  const pointIndex = isMouseOnPoint(x, y);
  if (pointIndex !== -1) {
    // 鼠标点击在已有点上
    if (pointIndex === 0 && points.length > 2) {
      // 闭合区域
      isPanDrawingLine = false;
      drawStaticElements(ctx, canvas, true);
    }
  } else {
    // 绘制圆点
    ctx.fillStyle = "#409EFF";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // 如果有之前的点，则绘制一条固定的线条连接上一个点和当前点
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      ctx.strokeStyle = "#409EFF";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    isPanDrawingLine = true;
    points.push({ x, y });
  }
}

function draw(e) {
  if (!isDrawing.value || !isPanDrawingLine || points.length === 0) return;

  const canvas = e.target;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const ctx = canvas.getContext("2d");

  // 检测是否有鼠标悬停的点
  const pointIndex = isMouseOnPoint(x, y);

  drawStaticElements(ctx, canvas, false, pointIndex);

  // 绘制动态线条从最后一个点到鼠标当前位置
  const lastPoint = points[points.length - 1];
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(x, y);
  ctx.stroke();
}
// 绘制静态的线条和点，并且判断是否闭合，绘制闭合区域
function drawStaticElements(ctx, canvas, isClosed = false, hoverIndex = -1) {
  // 清除之前的动态线条
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#409EFF";
  ctx.strokeStyle = "#409EFF";
  ctx.lineWidth = 3;

  // 填充闭合区域
  if (isClosed && points.length > 2) {
    ctx.fillStyle = "rgba(255, 255, 255, .6)";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // 重绘所有点和固定的线条
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const radius = i === hoverIndex ? 8 : 5;
    // 重新绘制点
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 重新绘制固定的线条
    if (i > 0) {
      const prevPoint = points[i - 1];
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }

  // 如果闭合了，绘制最后的线条连接第一个点和最后一个点
  if (isClosed && points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(points[0].x, points[0].y);
    ctx.stroke();
  }
}

// 判断是否鼠标和点重合
function isMouseOnPoint(x, y) {
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const dx = point.x - x;
    const dy = point.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= 5) {
      return i; // 返回点的索引
    }
  }
  return -1;
}

/**
 * 确认裁剪
 */
const emit = defineEmits(["success"]);
const realShow = ref();
const resultCanvas = ref();
async function handleConfirm() {
  const pointRect = getBoundingBox(points);
  const res = await getCanvasFromPoints(pointRect);

  resultCanvas.value.width = res.width;
  resultCanvas.value.height = res.height;
  const ctx = resultCanvas.value.getContext("2d");

  // 由于此时生成的canvas是已我们的点位开始的，所以这里调整一下点位的x和y，变成新canvas的点位
  const points1 = points.map((v) => {
    return {
      x: v.x - pointRect.x,
      y: v.y - pointRect.y,
    };
  });
  ctx.fillStyle = "transparent";
  ctx.beginPath();

  ctx.moveTo(points1[0].x, points1[0].y);
  for (let i = 1; i < points1.length; i++) {
    ctx.lineTo(points1[i].x, points1[i].y);
  }
  ctx.closePath();
  ctx.save();
  ctx.clip(); // 剪切区域
  ctx.drawImage(res, 0, 0, res.width, res.height);

  // 导出圆形图片数据
  const dataImage = resultCanvas.value.toDataURL("image/png");
  realShow.value = dataImage;
  const file = dataURLtoFile(dataImage, fileObj.value.name);
  emit("success", {
    ...fileObj.value,
    file: file,
    fileShow: dataImage,
  });
}
// 根据点位，获取闭合空间的宽高
function getBoundingBox(points) {
  if (points.length === 0) {
    return { width: 0, height: 0, x: 0, y: 0 };
  }

  // 初始化最小值和最大值为第一个点的坐标
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  // 遍历所有点，更新最小值和最大值
  for (let point of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  // 计算宽度和高度
  const width = maxX - minX;
  const height = maxY - minY;

  return { width, height, x: minX, y: minY };
}
// 先将点位形成的矩形，转成一个新的canvas，类似与 $toCanvas()
function getCanvasFromPoints(pointRect) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = pointRect.width;
    canvas.height = pointRect.height;

    cropperimage.value.$ready().then((image) => {
      const context = canvas.getContext("2d");
      const [a, b, c, d, e, f] = cropperimage.value.$getTransform();

      const offsetX = -pointRect.x;
      const offsetY = -pointRect.y;
      const translateX = (offsetX * d - c * offsetY) / (a * d - c * b);
      const translateY = (offsetY * a - b * offsetX) / (a * d - c * b);
      let newE = a * translateX + c * translateY + e;
      let newF = b * translateX + d * translateY + f;
      let destWidth = image.naturalWidth;
      let destHeight = image.naturalHeight;

      const centerX = destWidth / 2;
      const centerY = destHeight / 2;

      context.fillStyle = "transparent";
      context.fillRect(0, 0, pointRect.width, pointRect.height);
      context.save();
      context.translate(centerX, centerY);
      context.transform(a, b, c, d, newE, newF);

      // Move the transform origin to the top-left of the image.
      context.translate(-centerX, -centerY);
      context.drawImage(image, 0, 0, destWidth, destHeight);
      context.restore();
      resolve(canvas);
    });
  });
}
// 将data:image转成新的file
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type: mime });
  const file = new File([blob], filename, { type: mime });
  return file;
}

/**
 * 文件上传
 */
const input_form = ref();
async function handleUploadSuccess() {
  const files = input_form.value.files;

  if (files.length) {
    fileObj.value = {
      name: files[0].name,
      file: files[0],
      fileShow: URL.createObjectURL(files[0]),
    };
  }
}
</script>

<style scoped>
.drawing_canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.68);
}

.dialog_wrap {
  display: flex;
  .image_wrap {
    width: 400px;
    height: 300px;
    flex-shrink: 0;

    cropper-canvas {
      width: 100%;
      height: 100%;
    }
  }
  .info_wrap {
    margin-left: 20px;
  }
}
button {
  & + button {
    margin-left: 20px;
  }
}
</style>