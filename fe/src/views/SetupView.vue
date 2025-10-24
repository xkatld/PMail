<template>
  <div class="h-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6 overflow-auto">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8">
      <!-- Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mb-4 shadow-lg">
          <span class="iconify text-white text-4xl" data-icon="mdi:email-fast"></span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">{{ lang.setup_wizard }}</h1>
        <p class="text-gray-600 mt-2">{{ lang.setup_desc || '配置您的邮件服务器' }}</p>
      </div>

      <!-- Steps -->
      <div class="mb-10">
        <div class="flex items-center justify-between relative">
          <div v-for="(step, index) in 3" :key="index" class="flex-1 flex flex-col items-center relative z-10">
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md',
              index < active ? 'bg-green-600 text-white' : 
              index === active ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 
              'bg-gray-200 text-gray-500'
            ]">
              <span v-if="index < active" class="iconify text-2xl" data-icon="mdi:check"></span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span :class="['mt-3 text-sm font-medium', index <= active ? 'text-gray-900' : 'text-gray-500']">
              {{ ['基本信息', '域名配置', '完成设置'][index] }}
            </span>
          </div>
          <!-- Progress Line -->
          <div class="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-0">
            <div 
              class="h-full bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-500"
              :style="{ width: `${(active / 2) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step 0: Domain Setup -->
      <div v-if="active === 0" class="space-y-6">
        <div class="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
          <div class="flex items-start">
            <span class="iconify text-blue-600 text-2xl mr-3 flex-shrink-0" data-icon="mdi:information"></span>
            <div class="text-left">
              <h3 class="font-semibold text-blue-900 mb-2">{{ lang.domain_info || '域名配置信息' }}</h3>
              <p class="text-blue-800 text-sm leading-relaxed">{{ lang.domain_desc || '请先配置您的域名 DNS 记录，然后填写下方表单。' }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="nextStep" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.domain || '域名' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="setupForm.domain"
              :placeholder="lang.domain_placeholder || '例如：example.com'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.smtp_server || 'SMTP 服务器地址' }}
            </label>
            <input 
              v-model="setupForm.smtpHost"
              :placeholder="lang.smtp_placeholder || '例如：mail.example.com'"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex justify-end pt-4">
            <button 
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 inline-flex items-center shadow-md hover:shadow-lg"
            >
              {{ lang.next || '下一步' }}
              <span class="iconify ml-2 text-xl" data-icon="mdi:arrow-right"></span>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 1: Admin Account -->
      <div v-if="active === 1" class="space-y-6">
        <div class="bg-green-50 border-l-4 border-green-600 p-5 rounded-lg">
          <div class="flex items-start">
            <span class="iconify text-green-600 text-2xl mr-3 flex-shrink-0" data-icon="mdi:account-key"></span>
            <div class="text-left">
              <h3 class="font-semibold text-green-900 mb-2">{{ lang.admin_account || '管理员账号' }}</h3>
              <p class="text-green-800 text-sm leading-relaxed">{{ lang.admin_desc || '创建管理员账号以管理邮件系统。' }}</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="nextStep" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.username || '用户名' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="setupForm.username"
              :placeholder="lang.username_placeholder || '例如：admin'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.password || '密码' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="setupForm.password"
              type="password"
              :placeholder="lang.password_placeholder || '至少 8 个字符'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.confirm_password || '确认密码' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="setupForm.confirmPassword"
              type="password"
              :placeholder="lang.confirm_password_placeholder || '再次输入密码'"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex justify-between pt-4">
            <button 
              @click="active--"
              type="button"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition duration-200 inline-flex items-center"
            >
              <span class="iconify mr-2" data-icon="mdi:arrow-left"></span>
              {{ lang.previous || '上一步' }}
            </button>
            <button 
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 inline-flex items-center shadow-md hover:shadow-lg"
            >
              {{ lang.next || '下一步' }}
              <span class="iconify ml-2 text-xl" data-icon="mdi:arrow-right"></span>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Completion -->
      <div v-if="active === 2" class="text-center py-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <span class="iconify text-green-600 text-6xl" data-icon="mdi:check-circle"></span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ lang.setup_complete || '设置完成！' }}</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          {{ lang.setup_complete_desc || '您的邮件服务器已经配置完成，现在可以开始使用了。' }}
        </p>
        <button 
          @click="finish"
          class="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-semibold transition duration-200 inline-flex items-center shadow-lg hover:shadow-xl"
        >
          <span class="iconify mr-2 text-xl" data-icon="mdi:rocket-launch"></span>
          {{ lang.start_using || '开始使用' }}
        </button>
      </div>

      <!-- Toast Message -->
      <div v-if="toastMessage" class="fixed top-6 right-6 z-50 animate-fade-in">
        <div :class="[
          'px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3',
          toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]">
          <span class="iconify text-xl" :data-icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'"></span>
          <span class="font-medium">{{ toastMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router';
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";

const router = useRouter();
const active = ref(0)
const toastMessage = ref('')
const toastType = ref('success')

const setupForm = reactive({
  domain: '',
  smtpHost: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const nextStep = () => {
  if (active.value === 0) {
    if (!setupForm.domain) {
      showToast('请填写域名', 'error')
      return
    }
  } else if (active.value === 1) {
    if (!setupForm.username || !setupForm.password || !setupForm.confirmPassword) {
      showToast('请填写所有必填项', 'error')
      return
    }
    if (setupForm.password !== setupForm.confirmPassword) {
      showToast('两次输入的密码不一致', 'error')
      return
    }
    if (setupForm.password.length < 8) {
      showToast('密码长度至少为 8 个字符', 'error')
      return
    }
  }
  
  active.value++
}

const finish = () => {
  // Submit setup data to server
  http.post("/api/setup/complete", setupForm).then(res => {
    if (res.errorNo === 0) {
      showToast('设置成功', 'success')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      showToast(res.errorMsg || '设置失败', 'error')
    }
  })
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
