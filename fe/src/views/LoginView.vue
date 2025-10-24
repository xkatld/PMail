<template>
  <div class="w-full h-full bg-gradient-to-br from-blue-50 to-gray-100 flex justify-center items-center p-4">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <span class="iconify text-white text-3xl" data-icon="mdi:email"></span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">PMail</h2>
        <p class="text-gray-600 mt-2">{{ lang.login }}</p>
      </div>
      
      <form @submit.prevent="onSubmit" @keyup.enter="onSubmit">
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
            {{ lang.account }}
          </label>
          <input 
            v-model="form.account" 
            type="text" 
            placeholder="User Name"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
            {{ lang.password }}
          </label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Password"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        
        <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <div class="flex items-center">
            <span class="iconify mr-2" data-icon="mdi:alert-circle"></span>
            <span>{{ errorMsg }}</span>
          </div>
        </div>
        
        <button 
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <span class="iconify mr-2 text-xl" data-icon="mdi:login"></span>
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
