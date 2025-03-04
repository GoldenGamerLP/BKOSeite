<template>
  <div class="flex justify-center">
    <div class="relative">
      <canvas
        ref="canvas"
        width="500"
        height="350"
        class="border-border border-2 cursor-w-resize"
        @pointerdown="startDrawing"
        @pointermove="draw"
        @pointerup="stopDrawing"
        @pointerleave="stopDrawing"
      ></canvas>
      <div class="flex space-x-2 mt-2">
        <Button
          variant="link"
          v-if="isSupported"
          @click="
            open({
              types: [{ accept: { 'image/*': ['.png', '.jpg', '.jpeg'] } }],
            })
          "
        >
          <Cloud class="size-4" />
          Dokument hochladen
        </Button>
        <Separator orientation="vertical" />
        <Button variant="link" @click="clear">
          <Trash class="size-4" />
          Löschen
        </Button>
        <Separator orientation="vertical" />
        <Button variant="link" @click="saveImage">
          <Download class="size-4" />
          Download
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Trash, Cloud, Download } from "lucide-vue-next";
import { useFileSystemAccess } from "@vueuse/core";
import { ref, onMounted, watch } from "vue";

const { isSupported, data, file, fileName, fileMIME, open, save } =
  useFileSystemAccess({
    dataType: "ArrayBuffer",
  });

const canvas = ref<HTMLCanvasElement | null>(null);
let isDrawing = false;
let last = { x: 0, y: 0 };
const hasSignature = ref(false);

const saveImage = () => {
  if (canvas.value) {
    const dataURL = canvas.value.toDataURL("image/png");
    
    downloadImage(dataURL, "unterschrift.jpeg");
  }
};

function downloadImage(data: string, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}
// Function to get signature as image/canvas
const getSignature = () => {
  if (!hasSignature.value) return null;

  if (canvas.value) {
    // Return as data URL
    return canvas.value.toDataURL("image/png");

    // Alternatively, return the canvas element
    // return canvas.value;
  }
  return null;
};

// Expose the getSignature method
defineExpose({ getSignature });

const clear = () => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
      ctx.fillStyle = "rgba(0, 0, 200, 0.25)";
      ctx.font = "20px Arial";
      ctx.fillText("Unterschrift", 10, 50);
      hasSignature.value = false;
    }
  }
};

const startDrawing = (e) => {
  isDrawing = true;
  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  last = { x, y };

  // Clear the instructional text when starting to draw
  if (!hasSignature.value && canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    }
  }
};

const draw = (e) => {
  if (!isDrawing || !canvas.value) return;

  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(0, 0, 200, 0.6)";

  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.lineTo(x, y);
  ctx.stroke();

  last = { x, y };
  hasSignature.value = true;
};

const stopDrawing = () => {
  isDrawing = false;
};

// Watch for file uploads
watch(data, async (newData) => {
  if (newData && canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

      // Create an image from the uploaded file
      const img = new Image();
      img.onload = () => {
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.value.width / img.width,
          canvas.value.height / img.height
        );

        const x = (canvas.value.width - img.width * scale) / 2;
        const y = (canvas.value.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        hasSignature.value = true;
      };

      // Create a blob URL from the array buffer
      const blob = new Blob([newData]);
      img.src = URL.createObjectURL(blob);
    }
  }
});

onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(0, 0, 200, 0.25)";
      ctx.font = "20px Arial";
      ctx.fillText("Unterschrift", 10, 50);
    }
  }
});
</script>
