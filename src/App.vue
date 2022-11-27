<script setup lang="ts">
import psTitle from './components/title.vue'
import psBody from './components/ps-body.vue'
import toolbar from './components/toolbar.vue'
import operate from './components/operate.vue'

import { ref } from "vue";
const activeIndex = ref(-1)
</script>

<template>
  <div class="container">
    <div class="body">
      <ps-body :activeIndex="activeIndex"/>
    </div>
    <toolbar v-model:activeIndex="activeIndex" />
    <operate />
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
