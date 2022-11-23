<script setup lang="ts">
import pstitle from './components/title.vue'
import psBody from './components/ps-body.vue'
import toolbar from './components/toolbar.vue'
import opertate from './components/opertate.vue'
</script>

<template>
  <div class="contanier">
    <pstitle />
    <div class="body">
      <ps-body />
    </div>
    <toolbar />
    <opertate />
  </div>
</template>

<style scoped>
.contanier {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.body {
  height: calc(100% - 149px);
  overflow: hidden;
}
</style>
