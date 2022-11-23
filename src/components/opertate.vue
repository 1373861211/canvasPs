<template>
    <div class="operate-contanier">
        <div class="operate-box" v-for="(item, i) in OPERATES" :key="i">
            {{item.text}}
        </div>
    </div>
</template>

<script setup lang="ts">
import {OPERATES} from '../dict.js'
</script>

<style lang="less" scoped>
.operate-contanier {
    display: flex;
    padding: 10px 0;
    height: 24px
}
.operate-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
}
.operate-icon {
    width: 16px;
    height: 16px;
}
.operate-text {
    font-size: 12px;
}
</style>