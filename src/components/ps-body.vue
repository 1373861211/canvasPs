<template>
    <div class="canvas-box">
        <canvas id="demo"
            @touchmove="touchmove"
            @touchstart="touchstart"
            @touchcancel="touchEvent"
            @touchend="touchEvent"
        ></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import src from '@/assets/thin.webp'
import {zoomIng, zoomStart, zoomEvent} from '../utils/zoom'
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
onMounted(() => {
    canvas = document.getElementById('demo') as HTMLCanvasElement

    ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    let image = new Image()
    image.src = src
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        let com = 1
        ctx.drawImage(image, 0, 0, image.width * com, image.height * com);
    }
})
const touchstart = (e: TouchEvent)=> {
    zoomStart(e)
}
const touchmove = (e: TouchEvent)=> {
    zoomIng(e, canvas)
}
const touchEvent = (e: TouchEvent)=> {
    zoomEvent(e)
}
</script>

<style scoped lang="less">
.canvas-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    canvas {
        flex: 1;
        max-width: 100%;
        max-height: 100%;
    }
}
</style>