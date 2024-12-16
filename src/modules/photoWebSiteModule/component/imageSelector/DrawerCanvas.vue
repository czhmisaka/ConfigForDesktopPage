<template>
  <div>
    <img id="image" :src="image.src" alt="Picture" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cropper from "cropperjs";


export default defineComponent({
  components: {},
  data() {
    return {
      image: {
        src: "/api/public/uploads/20241130/bd9b56d0-aec1-11ef-a487-4d174e400b7b.png",
      },

      cropper: null,
    };
  },

  mounted() {
    this.cropper = new Cropper("#image");
  },
});
</script>

<style scoped>
</style>