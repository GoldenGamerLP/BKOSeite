<template>
    <div class="flex justify-center">
        <div class="relative">
            <canvas ref="canvas" width="500" height="350" class="border-border border-2 cursor-w-resize"></canvas>
            <Button class="absolute bottom-4 right-4 z-10" @click="clear">
                <Trash class="size-4" />
                <span class="sr-only">Clear</span>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Trash } from 'lucide-vue-next';
const canvas = ref<HTMLCanvasElement | null>(null);
let isDrawing = false;
let last = { x: 0, y: 0 };

const clear = () => {
    if (canvas.value) {
        const ctx = canvas.value.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        }
    }
};

onMounted(() => {
    if (canvas.value) {
        const ctx = canvas.value.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';
            ctx.font = '20px Arial';
            ctx.fillText('Unterschrift', 10, 50);
        }

        //Mouse move and pointer
        canvas.value.addEventListener('mousedown', function (e) {
            isDrawing = true;
            const rect = canvas.value.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            last = { x, y };
        });

        canvas.value.addEventListener('mousemove', function (e) {
            if (isDrawing) {
                const rect = canvas.value.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                ctx.fillStyle = 'rgba(0, 0, 200, 0.25)';

                ctx.beginPath();
                ctx.moveTo(last.x, last.y);
                ctx.lineTo(x, y);
                ctx.stroke();

                last = { x, y };
            }
        });

        canvas.value.addEventListener('mouseup', function () {
            isDrawing = false;
        });
    }
});
</script>