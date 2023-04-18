<template>
    <div class="canvas-box">
        <canvas id="demo" @touchmove="touchmove" @touchstart="touchstart" @touchcancel="touchEvent"
            @touchend="touchEvent" class="canvas"></canvas>
        <canvas id="erasure" class="src canvas"></canvas>
        <!-- <img :src="src" class="src"> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import src from '@/assets/thin.webp'
import { zoomIng, zoomStart, zoomEvent, paintIng, paintStart, downloadImg,reset,paintEnd } from '../utils'
const props = defineProps({
    activeIndex: Number,
    psUrl: String
})

const save = (dataUrl: string, name: string, ext: string) => {
    console.log(dataUrl,'dataUrl')
    downloadImg(dataUrl)
}
// 暴露方法父组件调用子组件方法或者属性
defineExpose({
    save,
});
let canvasErasure: HTMLCanvasElement
let ctxErasure: CanvasRenderingContext2D

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

let canvasBox: HTMLDivElement
let containerSize :any
let url: string
onMounted(() => {
    canvasBox = document.querySelector('.canvas-box') as HTMLDivElement
    canvas = document.getElementById('demo') as HTMLCanvasElement
    ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    canvasErasure = document.getElementById('erasure') as HTMLCanvasElement
    ctxErasure = canvasErasure.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    const {width, height} = canvasBox.getBoundingClientRect()
    containerSize = {width, height}
    console.log(containerSize,'containerSize')
    setSrc(src)
})

watch(() => props.psUrl, (newValue, oldValue) => {
    console.log("新值是" + newValue, "旧址是" + oldValue);
    setSrc(newValue as string)
})
const touchstart = (e: TouchEvent) => {
    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomStart(e)
            break;
        case 3:
            // 画笔
            paintStart(e, canvas)
            break;
        default:
            break;
    }
}
const touchmove = (e: TouchEvent) => {
    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomIng(e, canvas, canvasErasure)
            break;
        case 1:
            // 橡皮
            paintIng(e, canvas, ctx, ctx)
            break;
        case 3:
            // 画笔
            paintIng(e, canvas, ctx)
            break;
        default:
            break;
    }
}
const touchEvent = (e: TouchEvent) => {
    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomEvent(e)
            break;
        case 3:
            // 画笔
            // paintIng(e, canvas, ctx)
            paintEnd(e)
            break;
        default:
            break;
    }
}
const dpr = window.devicePixelRatio
const setSrc = (src: string) => {
    let image = new Image()
    image.src = src
    url = src
    image.onload = function () {
        console.log(image,'image2222')
        canvas.width = containerSize.width * dpr;
        canvas.height = image.height * containerSize.width / image.width * dpr;
        canvasErasure.width = canvas.width;
        canvasErasure.height = canvas.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctxErasure.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.scale(dpr,dpr)
        ctxErasure.scale(dpr,dpr) // 解决边缘锯齿
        reset(canvas, canvasErasure)
    }
}
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