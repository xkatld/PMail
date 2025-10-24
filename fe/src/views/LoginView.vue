<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-white via-primary-50 to-primary-100 flex items-center justify-center p-4">
    <!-- 登录卡片 -->
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-medium p-8">
        <!-- Logo 和标题 -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-md mb-3">
            <Icon icon="mdi:email-fast" class="text-white text-2xl" />
          </div>
          <h1 class="text-2xl font-semibold text-gray-800 mb-1">欢迎回来</h1>
          <p class="text-sm text-gray-500">登录到 PMail 邮箱系统</p>
        </div>

        <!-- 登录表单 -->
        <el-form :model="form" @keyup.enter="onSubmit" class="space-y-4">
          <el-form-item class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ lang.account }}</label>
            <el-input 
              v-model="form.account" 
              placeholder="请输入用户名"
              size="large"
            />
          </el-form-item>

          <el-form-item class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ lang.password }}</label>
            <el-input 
              v-model="form.password" 
              placeholder="请输入密码" 
              type="password"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item class="mb-0">
            <button
              @click="onSubmit"
              type="button"
              class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-md transition-colors duration-200"
            >
              {{ lang.login }}
            </button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import {reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {router} from "@/router";
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";
import {useGlobalStatusStore} from "@/stores/useGlobalStatusStore";

const globalStatus = useGlobalStatusStore();

const form = reactive({
  account: '',
  password: '',
})

const onSubmit = () => {
  if (!form.account || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  
  http.post("/api/login", form).then(res => {
    if (res.errorNo !== 0) {
      ElMessage.error(res.errorMsg)
    } else {
      Object.assign(globalStatus.userInfos , res.data) 
      ElMessage.success('登录成功！')
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