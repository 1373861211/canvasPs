<template>
    <div class="operate-container">
        <div class="operate-box" v-for="(item, i) in OPERATES" :key="i" @click="handleTool(item.value)">
            <input v-if="item.value === 'upload'" accept="image/*" type="file" class="upload-file" @input.self="uploadFile">
            {{item.text}}
        </div>
    </div>
</template>

<script setup lang="ts">
import {OPERATES} from '../dict.js'
import {getFileUrl} from '../utils'
const emit = defineEmits(['setPsUrl', 'save'])
const uploadFile = (e: InputEvent) => {
    const url = getFileUrl(e)
    if(url) {
        emit('setPsUrl', url)
    }
    
}
const handleTool = (value: string) => {
    switch(value) {
        case 'save':
            emit('save')
            break;
        default:
            break;
    }
}
</script>

<style lang="less" scoped>
.operate-container {
    display: flex;
    justify-content: space-evenly;
}
.operate-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    padding: 10px 0;
    height: 24px;
    font-size: 16px;
    .upload-file {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        z-index: 2;
    }
}
.operate-icon {
    width: 16px;
    height: 16px;
}
.operate-text {
    font-size: 12px;
}
</style>