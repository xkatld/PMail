<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 text-left">{{ lang.security || '安全设置' }}</h2>
      <p class="text-gray-600 text-sm text-left">管理您的账户安全和密码设置</p>
    </div>

    <!-- Change Password Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span class="iconify text-blue-600 text-xl" data-icon="mdi:lock-reset"></span>
        </div>
        <div class="text-left">
          <h3 class="font-semibold text-gray-900">{{ lang.change_password || '修改密码' }}</h3>
          <p class="text-sm text-gray-600">定期修改密码以保护账户安全</p>
        </div>
      </div>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
            {{ lang.old_password || '当前密码' }} <span class="text-red-600">*</span>
          </label>
          <input 
            v-model="passwordForm.oldPassword"
            type="password"
            :placeholder="lang.old_password_placeholder || '请输入当前密码'"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
            {{ lang.new_password || '新密码' }} <span class="text-red-600">*</span>
          </label>
          <input 
            v-model="passwordForm.newPassword"
            type="password"
            :placeholder="lang.new_password_placeholder || '请输入新密码（至少 8 个字符）'"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
            {{ lang.confirm_password || '确认新密码' }} <span class="text-red-600">*</span>
          </label>
          <input 
            v-model="passwordForm.confirmPassword"
            type="password"
            :placeholder="lang.confirm_password_placeholder || '再次输入新密码'"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="pt-2">
          <button 
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center"
          >
            <span class="iconify mr-2" data-icon="mdi:check"></span>
            {{ lang.save || '保存修改' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Account Info Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <span class="iconify text-green-600 text-xl" data-icon="mdi:account-circle"></span>
        </div>
        <div class="text-left">
          <h3 class="font-semibold text-gray-900">{{ lang.account_info || '账户信息' }}</h3>
          <p class="text-sm text-gray-600">查看和管理您的账户详情</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b">
          <span class="text-sm font-semibold text-gray-700">{{ lang.username || '用户名' }}</span>
          <span class="text-sm text-gray-900 font-medium">{{ accountInfo.username }}</span>
        </div>
        <div class="flex items-center justify-between py-3 border-b">
          <span class="text-sm font-semibold text-gray-700">{{ lang.email || '邮箱' }}</span>
          <span class="text-sm text-gray-900 font-medium">{{ accountInfo.email }}</span>
        </div>
        <div class="flex items-center justify-between py-3 border-b">
          <span class="text-sm font-semibold text-gray-700">{{ lang.role || '角色' }}</span>
          <span 
            :class="[
              'text-sm font-semibold px-3 py-1 rounded-full',
              accountInfo.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
            ]"
          >
            {{ accountInfo.isAdmin ? (lang.admin || '管理员') : (lang.user || '用户') }}
          </span>
        </div>
        <div class="flex items-center justify-between py-3">
          <span class="text-sm font-semibold text-gray-700">{{ lang.created_at || '创建时间' }}</span>
          <span class="text-sm text-gray-900 font-medium">{{ accountInfo.createdAt }}</span>
        </div>
      </div>
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
</template>

<script setup>
import {reactive, ref} from 'vue'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";
import {useGlobalStatusStore} from "@/stores/useGlobalStatusStore";

const globalStatus = useGlobalStatusStore();

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const accountInfo = reactive({
  username: globalStatus.userInfos.account || '',
  email: globalStatus.userInfos.account + '@' + (globalStatus.userInfos.domains?.[0] || ''),
  isAdmin: globalStatus.userInfos.is_admin || false,
  createdAt: new Date().toLocaleDateString()
})

const toastMessage = ref('')
const toastType = ref('success')

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast('两次输入的密码不一致', 'error')
    return
  }

  if (passwordForm.newPassword.length < 8) {
    showToast('密码长度至少为 8 个字符', 'error')
    return
  }

  http.post("/api/user/change-password", {
    old_password: passwordForm.oldPassword,
    new_password: passwordForm.newPassword
  }).then(res => {
    if (res.errorNo === 0) {
      showToast('密码修改成功', 'success')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      showToast(res.errorMsg || '密码修改失败', 'error')
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
