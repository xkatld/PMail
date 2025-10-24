<template>
  <div class="w-full h-full bg-gray-100 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg p-8 w-96">
      <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold text-gray-800">PMail</h2>
        <p class="text-gray-600 mt-2">{{ lang.login }}</p>
      </div>
      
      <form @submit.prevent="onSubmit" @keyup.enter="onSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            {{ lang.account }}
          </label>
          <input 
            v-model="form.account" 
            type="text" 
            placeholder="User Name"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            {{ lang.password }}
          </label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ errorMsg }}
        </div>
        
        <button 
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <span class="iconify mr-2" data-icon="mdi:login"></span>
          {{ lang.login }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>

import {reactive, ref} from 'vue'
import {router} from "@/router";
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";
import {useGlobalStatusStore} from "@/stores/useGlobalStatusStore";

const globalStatus = useGlobalStatusStore();
const errorMsg = ref('');

const form = reactive({
  account: '',
  password: '',
})

const onSubmit = () => {
  errorMsg.value = '';
  http.post("/api/login", form).then(res => {
    if (res.errorNo !== 0) {
      errorMsg.value = res.errorMsg;
    } else {
      Object.assign(globalStatus.userInfos , res.data) 
      router.replace({
        path: '/',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
  })
}
</script>

<style scoped>
</style>