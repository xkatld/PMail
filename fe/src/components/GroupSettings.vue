<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 text-left">{{ lang.group || '分组管理' }}</h2>
      <p class="text-gray-600 text-sm text-left">创建和管理邮件分组，更好地组织您的邮件</p>
    </div>

    <!-- Add Group Button -->
    <div class="flex justify-start">
      <button 
        @click="showAddDialog = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center shadow-sm hover:shadow-md"
      >
        <span class="iconify mr-2 text-xl" data-icon="mdi:plus"></span>
        {{ lang.add_group || '添加分组' }}
      </button>
    </div>

    <!-- Groups Tree -->
    <div class="bg-white border border-gray-200 rounded-lg">
      <div class="p-4 border-b bg-gray-50">
        <div class="relative">
          <span class="iconify absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-icon="mdi:magnify"></span>
          <input 
            v-model="filterText"
            :placeholder="lang.search_group || '搜索分组...'"
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div class="p-4">
        <div v-if="filteredGroups.length === 0" class="text-center py-12">
          <span class="iconify text-gray-300 text-6xl mb-4" data-icon="mdi:folder-off"></span>
          <p class="text-gray-500">{{ lang.no_groups || '暂无分组' }}</p>
        </div>

        <div v-else class="space-y-2">
          <div 
            v-for="group in filteredGroups" 
            :key="group.id"
            class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-150 group"
          >
            <div class="flex items-center gap-3 flex-1">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="iconify text-blue-600 text-xl" data-icon="mdi:folder"></span>
              </div>
              <div class="text-left">
                <div class="font-semibold text-gray-900">{{ group.name }}</div>
                <div class="text-sm text-gray-600">{{ group.description || lang.no_description || '无描述' }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click="editGroup(group)"
                class="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-200"
                :title="lang.edit || '编辑'"
              >
                <span class="iconify" data-icon="mdi:pencil"></span>
              </button>
              <button 
                @click="deleteGroup(group)"
                class="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition duration-200"
                :title="lang.delete || '删除'"
              >
                <span class="iconify" data-icon="mdi:delete"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <div v-if="showAddDialog || showEditDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeDialog"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-5 text-left">
          {{ showAddDialog ? (lang.add_group || '添加分组') : (lang.edit_group || '编辑分组') }}
        </h3>
        
        <form @submit.prevent="saveGroup" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.group_name || '分组名称' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="groupForm.name"
              :placeholder="lang.group_name_placeholder || '请输入分组名称'"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.description || '描述' }}
            </label>
            <textarea 
              v-model="groupForm.description"
              :placeholder="lang.description_placeholder || '请输入分组描述（可选）'"
              rows="3"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-2">
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
          {{ lang.delete_group_confirm || '确定要删除该分组吗？此操作无法撤销。' }}
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

const filterText = ref('')
const groups = ref([])
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const currentGroup = ref(null)

const groupForm = reactive({
  name: '',
  description: ''
})

const filteredGroups = computed(() => {
  if (!filterText.value) {
    return groups.value
  }
  return groups.value.filter(group => 
    group.name.toLowerCase().includes(filterText.value.toLowerCase())
  )
})

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const loadGroups = () => {
  http.post("/api/group/list").then(res => {
    if (res.errorNo === 0) {
      groups.value = res.data
    }
  })
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  groupForm.name = ''
  groupForm.description = ''
  currentGroup.value = null
}

const editGroup = (group) => {
  currentGroup.value = group
  groupForm.name = group.name
  groupForm.description = group.description || ''
  showEditDialog.value = true
}

const deleteGroup = (group) => {
  currentGroup.value = group
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  http.post("/api/group/delete", { id: currentGroup.value.id }).then(res => {
    if (res.errorNo === 0) {
      showToast('分组删除成功', 'success')
      loadGroups()
    } else {
      showToast(res.errorMsg || '分组删除失败', 'error')
    }
  })
  showDeleteDialog.value = false
  currentGroup.value = null
}

const saveGroup = () => {
  const endpoint = showAddDialog.value ? "/api/group/add" : "/api/group/update"
  const data = showEditDialog.value 
    ? { id: currentGroup.value.id, ...groupForm }
    : groupForm

  http.post(endpoint, data).then(res => {
    if (res.errorNo === 0) {
      showToast(
        showAddDialog.value ? '分组添加成功' : '分组更新成功',
        'success'
      )
      loadGroups()
      closeDialog()
    } else {
      showToast(res.errorMsg || '操作失败', 'error')
    }
  })
}

loadGroups()
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
