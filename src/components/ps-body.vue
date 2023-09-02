<template>
    <div class="canvas-box">
        <canvas id="contentCanvas" @touchmove="touchmove" @touchstart="touchstart" @touchcancel="touchcancel"
            @touchend="touchEnd" class="canvas">
        </canvas>
        <canvas id="baseCanvas" class="src canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import src from "@/assets/thin.webp";
import throttle from 'lodash/throttle';
import {
    zoomIng,
    zoomStart,
    zoomEvent,
    paintIng,
    paintStart,
    reset,
    paintEnd,
    mergeCanvas,
} from "../utils";
const props = defineProps({
    activeIndex: Number,
    psUrl: String,
});

const save = () => {
    mergeCanvas(canvas, canvasErasure);
};
// 暴露方法父组件调用子组件方法或者属性
defineExpose({
    save,
});
let canvasErasure: HTMLCanvasElement;
let ctxErasure: CanvasRenderingContext2D;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let canvasBox: HTMLDivElement;
let containerSize: any;
let canPaint = false
onMounted(() => {
    canvasBox = document.querySelector(".canvas-box") as HTMLDivElement;
    canvas = document.getElementById("contentCanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d", {
        willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    canvasErasure = document.getElementById("baseCanvas") as HTMLCanvasElement;
    ctxErasure = canvasErasure.getContext("2d", {
        willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    const { width, height } = canvasBox.getBoundingClientRect();
    containerSize = { width, height };
    setSrc(src);
});

watch(
    () => props.psUrl,
    (newValue, oldValue) => {
        console.log("新值是" + newValue, "旧址是" + oldValue);
        setSrc(newValue as string);
    }
);
const touchstart = (e: TouchEvent) => {
    console.log('touchstart');

    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomStart(e);
            canPaint = false
            break;
        case 3:
            // 画笔
            if (e.touches.length > 1) {
                canPaint = false
                zoomStart(e);
                return
            }
            canPaint = true
            paintStart(e, canvas);
            break;
        default:
            break;
    }
};
const touchmove = throttle((e: TouchEvent) => {
    console.log('touchmove');

    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomIng(e, canvas, canvasErasure);
            break;
        case 1:
            // 橡皮
            paintIng(e, canvas, ctx, ctx);
            break;
        case 3:
            // 画笔
            if (e.touches.length > 1) {
                zoomIng(e, canvas, canvasErasure);
                canPaint = false
                return
            }
            if (canPaint) {

                paintIng(e, canvas, ctx);
            }
            break;
        default:
            break;
    }
})

const touchEnd = (e: TouchEvent) => {
    console.log('touchend', e.touches.length);

    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomEvent(e)
            break;
        case 3:
            // 画笔
            // paintIng(e, canvas, ctx)
            if (e.touches.length > 1) {
                zoomEvent(e)
                return
            }
            if (canPaint) {
                paintEnd(e);
            }
            break;
        default:
            break;
    }
};

const touchcancel = (e: TouchEvent) => {
    touchEnd(e)
    console.log('touchcancel');
}
const dpr = window.devicePixelRatio;
const setSrc = (src: string) => {
    let image = new Image();
    image.src = src;
    image.onload = function () {
        canvas.width = containerSize.width * dpr;
        canvas.height = ((image.height * containerSize.width) / image.width) * dpr;
        canvasErasure.width = canvas.width;
        canvasErasure.height = canvas.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctxErasure.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.scale(dpr, dpr);
        ctxErasure.scale(dpr, dpr); // 解决边缘锯齿
        reset(canvas, canvasErasure);
    };
};
</script>

<style scoped lang="less">
.canvas-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 0;
    overflow: auto;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 5;
}

.src {
    z-index: 1;
    pointer-events: none;
}
</style>
