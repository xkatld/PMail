<script setup>
import {RouterView, useRoute} from 'vue-router'
import HomeHeader from '@/components/HomeHeader.vue'
import HomeAside from '@/components/HomeAside.vue';
import {ref, watch} from 'vue'

const route = useRoute()
const pageName = ref(route.name)

watch(
    () => route.fullPath,
    () => {
      pageName.value = route.name
    }
)
</script>

<template>
  <div class="h-full flex flex-col">
    <HomeHeader/>
    <div class="flex flex-1 overflow-hidden">
      <div v-if="pageName !== 'login' && pageName !== 'setup'" class="bg-gray-50">
        <HomeAside/>
      </div>
      <div class="flex-1 overflow-auto">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
