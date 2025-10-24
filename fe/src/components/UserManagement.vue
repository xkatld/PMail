<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 text-left">{{ lang.user || '用户管理' }}</h2>
      <p class="text-gray-600 text-sm text-left">管理系统用户和权限设置</p>
    </div>

    <!-- Add User Button -->
    <div class="flex justify-start">
      <button 
        @click="showAddDialog = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center shadow-sm hover:shadow-md"
      >
        <span class="iconify mr-2 text-xl" data-icon="mdi:account-plus"></span>
        {{ lang.add_user || '添加用户' }}
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.username || '用户名' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.email || '邮箱' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.role || '角色' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.status || '状态' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.created_at || '创建时间' }}</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">{{ lang.actions || '操作' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <span class="iconify text-gray-300 text-6xl mb-4" data-icon="mdi:account-off"></span>
              <p class="text-gray-500 mt-4">{{ lang.no_users || '暂无用户' }}</p>
            </td>
          </tr>
          <tr 
            v-else
            v-for="user in paginatedUsers" 
            :key="user.id"
            class="border-t hover:bg-gray-50 transition duration-150"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="iconify text-blue-600 text-xl" data-icon="mdi:account-circle"></span>
                </div>
                <div class="font-semibold text-gray-900">{{ user.username }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-700">{{ user.email }}</span>
            </td>
            <td class="px-6 py-4">
              <span 
                :class="[
                  'inline-flex items-center px-3 py-1.5 text-xs rounded-lg font-semibold',
                  user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                ]"
              >
                <span class="iconify mr-1.5" :data-icon="user.isAdmin ? 'mdi:shield-crown' : 'mdi:account'"></span>
                {{ user.isAdmin ? (lang.admin || '管理员') : (lang.user || '用户') }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button 
                @click="toggleUserStatus(user)"
                :class="[
                  'inline-flex items-center px-3 py-1.5 text-xs rounded-lg font-semibold transition duration-200',
                  user.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                ]"
              >
                <span class="iconify mr-1.5" :data-icon="user.active ? 'mdi:check-circle' : 'mdi:close-circle'"></span>
                {{ user.active ? (lang.active || '活跃') : (lang.inactive || '禁用') }}
              </button>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-600">{{ user.createdAt }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button 
                  @click="editUser(user)"
                  class="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-200"
                  :title="lang.edit || '编辑'"
                >
                  <span class="iconify" data-icon="mdi:pencil"></span>
                </button>
                <button 
                  @click="deleteUser(user)"
                  class="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition duration-200"
                  :title="lang.delete || '删除'"
                >
                  <span class="iconify" data-icon="mdi:delete"></span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="users.length > pageSize" class="flex justify-center items-center gap-2">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 inline-flex items-center"
      >
        <span class="iconify" data-icon="mdi:chevron-left"></span>
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="currentPage = page"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition duration-200',
          page === currentPage ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        ]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 inline-flex items-center"
      >
        <span class="iconify" data-icon="mdi:chevron-right"></span>
      </button>
    </div>

    <!-- Add/Edit Dialog -->
    <div v-if="showAddDialog || showEditDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeDialog"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-5 text-left">
          {{ showAddDialog ? (lang.add_user || '添加用户') : (lang.edit_user || '编辑用户') }}
        </h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.username || '用户名' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="userForm.username"
              :placeholder="lang.username_placeholder || '请输入用户名'"
              required
              :disabled="showEditDialog"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.email || '邮箱' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="userForm.email"
              type="email"
              :placeholder="lang.email_placeholder || '请输入邮箱地址'"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div v-if="showAddDialog">
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.password || '密码' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="userForm.password"
              type="password"
              :placeholder="lang.password_placeholder || '请输入密码（至少 8 个字符）'"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <input 
              v-model="userForm.isAdmin"
              type="checkbox"
              id="user-admin"
              class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label for="user-admin" class="text-sm font-medium text-gray-700 cursor-pointer">
              {{ lang.set_as_admin || '设置为管理员' }}
            </label>
          </div>

          <div class="flex items-center gap-3">
            <input 
              v-model="userForm.active"
              type="checkbox"
              id="user-active"
              class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label for="user-active" class="text-sm font-medium text-gray-700 cursor-pointer">
              {{ lang.activate_user || '激活用户' }}
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button 
              @click="closeDialog" 
              type="button"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
            >
              {{ lang.cancel || '取消' }}
            </button>
            <button 
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
            >
              {{ lang.save || '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showDeleteDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span class="iconify text-red-600 text-2xl" data-icon="mdi:alert-circle"></span>
          </div>
          <h3 class="text-xl font-bold text-gray-900">{{ lang.confirm_delete || '确认删除' }}</h3>
        </div>
        
        <p class="text-gray-600 mb-6 text-left">
          {{ lang.delete_user_confirm || '确定要删除该用户吗？此操作无法撤销。' }}
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteDialog = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.cancel || '取消' }}
          </button>
          <button 
            @click="confirmDelete" 
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.delete || '删除' }}
          </button>
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
import {reactive, ref, computed} from 'vue'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";

const users = ref([])
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const currentUser = ref(null)
const currentPage = ref(1)
const pageSize = 10

const userForm = reactive({
  username: '',
  email: '',
  password: '',
  isAdmin: false,
  active: true
})

const totalPages = computed(() => Math.ceil(users.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return users.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const loadUsers = () => {
  http.post("/api/user/list").then(res => {
    if (res.errorNo === 0) {
      users.value = res.data
    }
  })
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  Object.assign(userForm, {
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    active: true
  })
  currentUser.value = null
}

const editUser = (user) => {
  currentUser.value = user
  Object.assign(userForm, {
    username: user.username,
    email: user.email,
    password: '',
    isAdmin: user.isAdmin,
    active: user.active
  })
  showEditDialog.value = true
}

const deleteUser = (user) => {
  currentUser.value = user
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  http.post("/api/user/delete", { id: currentUser.value.id }).then(res => {
    if (res.errorNo === 0) {
      showToast('用户删除成功', 'success')
      loadUsers()
    } else {
      showToast(res.errorMsg || '用户删除失败', 'error')
    }
  })
  showDeleteDialog.value = false
  currentUser.value = null
}

const toggleUserStatus = (user) => {
  http.post("/api/user/toggle", { id: user.id, active: !user.active }).then(res => {
    if (res.errorNo === 0) {
      showToast(`用户已${!user.active ? '激活' : '禁用'}`, 'success')
      loadUsers()
    } else {
      showToast(res.errorMsg || '操作失败', 'error')
    }
  })
}

const saveUser = () => {
  if (showAddDialog.value && userForm.password.length < 8) {
    showToast('密码长度至少为 8 个字符', 'error')
    return
  }

  const endpoint = showAddDialog.value ? "/api/user/add" : "/api/user/update"
  const data = showEditDialog.value 
    ? { id: currentUser.value.id, ...userForm }
    : userForm

  http.post(endpoint, data).then(res => {
    if (res.errorNo === 0) {
      showToast(
        showAddDialog.value ? '用户添加成功' : '用户更新成功',
        'success'
      )
      loadUsers()
      closeDialog()
    } else {
      showToast(res.errorMsg || '操作失败', 'error')
    }
  })
}

loadUsers()
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
