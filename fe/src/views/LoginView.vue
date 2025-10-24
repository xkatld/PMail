<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <!-- 装饰性背景 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative w-full max-w-md">
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 transform hover:scale-[1.02] transition-all duration-300">
        <!-- Logo 和标题 -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4">
            <Icon icon="mdi:email-fast" class="text-white text-4xl" />
          </div>
          <h1 class="text-3xl font-bold text-gray-800">欢迎回来</h1>
          <p class="text-gray-500">登录到 PMail 邮箱系统</p>
        </div>

        <!-- 登录表单 -->
        <el-form :model="form" @keyup.enter="onSubmit" class="space-y-5">
          <el-form-item>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Icon icon="solar:user-bold-duotone" class="text-primary-500" />
                <span>{{ lang.account }}</span>
              </label>
              <div class="relative group">
                <Icon icon="solar:user-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary-500 transition-colors duration-200" />
                <el-input 
                  v-model="form.account" 
                  placeholder="请输入用户名"
                  class="modern-input"
                  size="large"
                >
                  <template #prefix>
                    <span class="w-6"></span>
                  </template>
                </el-input>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Icon icon="solar:lock-password-bold-duotone" class="text-primary-500" />
                <span>{{ lang.password }}</span>
              </label>
              <div class="relative group">
                <Icon icon="solar:lock-password-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary-500 transition-colors duration-200 z-10" />
                <el-input 
                  v-model="form.password" 
                  placeholder="请输入密码" 
                  type="password"
                  class="modern-input"
                  size="large"
                  show-password
                >
                  <template #prefix>
                    <span class="w-6"></span>
                  </template>
                </el-input>
              </div>
            </div>
          </el-form-item>

          <el-form-item class="mb-0">
            <button
              @click="onSubmit"
              type="button"
              class="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>{{ lang.login }}</span>
              <Icon icon="solar:login-3-bold" class="text-xl" />
            </button>
          </el-form-item>
        </el-form>

        <!-- 底部信息 -->
        <div class="pt-4 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-500">
            <Icon icon="solar:shield-check-bold-duotone" class="inline text-primary-500" />
            安全登录到您的邮箱
          </p>
        </div>
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
/* 动画效果 */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Element Plus 输入框样式覆盖 */
.modern-input :deep(.el-input__wrapper) {
  border-radius: 0.75rem;
  padding: 0.625rem 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.modern-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.modern-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  border-color: #0ea5e9;
}

.modern-input :deep(.el-input__inner) {
  padding-left: 2rem;
}
</style>