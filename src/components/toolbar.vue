<template>
    <div class="tool-container">
        <div @click="setActiveTool(i)" class="tool-box" :class="{'tool-box--active': activeIndex === i}" v-for="(item, i) in TOOLS" :key="i">
            <i class="iconfont tool-icon" :class="[`icon-${item.icon}`]"></i>
            <span class="tool-text">{{item.text}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {TOOLS} from '../dict.js'
const props = defineProps({
    activeIndex: Number
})

const emit = defineEmits(['update:activeIndex'])
const setActiveTool =(i :number)=>{
    emit('update:activeIndex', i === props.activeIndex ? -1 : i)
}
</script>

<style lang="less" scoped>
.tool-container {
    display: flex;
    padding-top: 10px;
    height: 45px;
}
.tool-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    gap: 5px;
}
.tool-box--active {
    color: #132424;
    border-radius: 10px;
    background-color: #05f7a6;


}
.tool-icon {
    width: 16px;
    height: 16px;
}
.tool-text {
    font-size: 12px;
}
</style>