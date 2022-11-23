<template>
    <div class="img-box" @touchmove="touchmove" @touchstart="touchstart" @touchcancel="touchEvent"
        @touchend="touchEvent">
        <img src="@/assets/thin.webp" alt="" class="img">
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
let img: HTMLImageElement;
onMounted(() => {
    img = document.getElementsByClassName('img')[0] as HTMLImageElement
})
let scaleRatio = 1;
// 从变量名就知道它的用途与用法
let preTouchesClientx1y1x2y2 = [] as number[];
// 记录前一次触摸点的位置
let preTouchPosition = {
    x: 0,
    y: 0
};
let originHaveSet = false
// 查询 DOM 对象的 CSS 值
const getStyle = (target, style: string) => {
    let styles = window.getComputedStyle(target, null);
    return styles.getPropertyValue(style);
};
const setStyle = (key: string, value: string) => { img.style[key] = value; };
const recordPreTouchPosition = (touch: any) => {
    preTouchPosition = {
        x: touch.clientX,
        y: touch.clientY
    };
};
// 获取并解析元素当前的位移量
const getTranslate = (target) => {
    let matrix = getStyle(target, 'transform');
    let nums = matrix.substring(7, matrix.length - 1).split(', ');
    let left = parseInt(nums[4]) || 0;
    let top = parseInt(nums[5]) || 0;
    return { left: left, top: top };
};
// 计算相对缩放前的偏移量，rect 为当前变换后元素的四周的位置
const relativeCoordinate = (x: number, y: number, rect) => {
    let cx = (x - rect.left) / scaleRatio;
    let cy = (y - rect.top) / scaleRatio;
    return {
        x: cx,
        y: cy
    };
};
const distance = (x1: number, y1: number, x2: number, y2: number) => {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
};
// 记录变换基点
let scaleOrigin = {
    x: 0,
    y: 0
};
let translateX = 0;
let translateY = 0;
const touchmove = (e: TouchEvent) => {
    let touches = e.touches;
    if (touches.length === 1) {
        let oneTouch = touches['0'];
        let translated = getTranslate(oneTouch.target);
        translateX = oneTouch.clientX - preTouchPosition.x + translated.left;
        translateY = oneTouch.clientY - preTouchPosition.y + translated.top;
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix);
        recordPreTouchPosition(oneTouch);
    } else {
        let one = touches['0'];
        let two = touches['1'];
        scaleRatio = distance(one.clientX, one.clientY, two.clientX, two.clientY) / distance(...preTouchesClientx1y1x2y2) * scaleRatio || 1;
        if (!originHaveSet) {
            originHaveSet = true;
            // 移动视线中心
            let origin = relativeCoordinate((one.clientX + two.clientX) / 2, (one.clientY + two.clientY) / 2, img.getBoundingClientRect());
            // 修正视野变化带来的平移量
            translateX = (scaleRatio - 1) * (origin.x - scaleOrigin.x) + translateX;
            translateY = (scaleRatio - 1) * (origin.y - scaleOrigin.y) + translateY;
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`);
            scaleOrigin = origin;
        }
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix);
        preTouchesClientx1y1x2y2 = [one.clientX, one.clientY, two.clientX, two.clientY];
    }
    e.preventDefault();
}
const touchstart = (e: TouchEvent) => {
    let touches = e.touches;
    // 双指同时落下也是有先后顺序的，当发现多指触摸时进行记录
    if (touches.length > 1) {
        let one = touches['0'];
        let two = touches['1'];
        preTouchesClientx1y1x2y2 = [one.clientX, one.clientY, two.clientX, two.clientY];
        // ... 开始缩放事件时，将标志置为 false
        originHaveSet = false;

    }
    recordPreTouchPosition(touches['0']);
};
const touchEvent = (e: TouchEvent) => {
    let touches = e.touches;
    if (touches.length === 1) {
        recordPreTouchPosition(touches['0']);
    }
}
</script>

<style scoped lang="less">
.img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    img {
        flex: 1;
        max-width: 100%;
        max-height: 100%;
    }
}
</style>