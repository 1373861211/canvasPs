<template>
    <div class="canvas-box">
        <canvas id="demo"
            @touchmove="touchmove"
            @touchstart="touchstart"
            @touchcancel="touchEvent"
            @touchend="touchEvent"
        ></canvas>
        <canvas id="erasure" class="src"></canvas>
        <!-- <img :src="src" class="src"> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import src from '@/assets/thin.webp'
import {zoomIng, zoomStart, zoomEvent, paintIng, paintStart} from '../utils'
const props = defineProps({
    activeIndex: Number
})
let canvasErasure: HTMLCanvasElement
let ctxErasure: CanvasRenderingContext2D

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
onMounted(() => {
    let canvasBox = document.querySelector('.canvas-box') as HTMLDivElement
    canvas = document.getElementById('demo') as HTMLCanvasElement
    ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
    canvasErasure = document.getElementById('erasure') as HTMLCanvasElement
    ctxErasure = canvasErasure.getContext('2d',  { willReadFrequently: true }) as CanvasRenderingContext2D
    let image = new Image()
    image.src = src
    image.onload = function () {
        canvas.width = image.width * canvasBox.offsetHeight / image.height;
        canvas.height = canvasBox.offsetHeight;
        canvasErasure.width = canvas.width;
        canvasErasure.height = canvas.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctxErasure.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
})
const touchstart = (e: TouchEvent)=> {
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
const touchmove = (e: TouchEvent)=> {
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
const touchEvent = (e: TouchEvent)=> {
    switch (props.activeIndex) {
        case -1:
            // 拖动、缩放
            zoomEvent(e)
            break;
        case 3:
            // 画笔
            // paintIng(e, canvas, ctx)
            break;
        default:
            break;
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
    font-size: 0;
}
#demo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 5;
}
.src {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    pointer-events: none;
}
</style>