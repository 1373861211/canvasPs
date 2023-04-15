<script setup lang="ts">
import psTitle from './components/title.vue'
import psBody from './components/ps-body.vue'
import toolbar from './components/toolbar.vue'
import operate from './components/operate.vue'

import { ref } from "vue";
const activeIndex = ref(3)
const psUrl = ref("")
const psBodyRef = ref(null)
const setPsUrl = (url: string) => {
    psUrl.value = url
}
const save = () => {
    psBodyRef.value?.save(psUrl.value)
}
</script>

<template>
    <div class="container">
        <div class="body">
            <ps-body :activeIndex="activeIndex" :psUrl="psUrl" ref="psBodyRef" />
        </div>
        <toolbar v-model:activeIndex="activeIndex" />
        <operate @setPsUrl="setPsUrl" @save="save" />
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.body {
    flex: 1;
    overflow: hidden;
}
</style>
