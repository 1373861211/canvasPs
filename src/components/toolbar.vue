<template>
    <div class="tool-contanier">
        <div class="tool-box" v-for="(item, i) in TOOLS" :key="i">
            <i class="iconfont tool-icon" :class="[`icon-${item.icon}`]"></i>
            <span class="tool-text">{{item.text}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {TOOLS} from '../dict.js'
</script>

<style lang="less" scoped>
.tool-contanier {
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
.tool-icon {
    width: 16px;
    height: 16px;
}
.tool-text {
    font-size: 12px;
}
</style>