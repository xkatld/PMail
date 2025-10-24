<template>
  <div class="h-full flex flex-col bg-white">
    <!-- 操作栏 -->
    <div class="h-14 bg-gradient-to-r from-blue-50 to-white border-b flex items-center px-6">
      <RouterLink 
        to="/editer" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center shadow-sm hover:shadow-md no-underline"
      >
        <span class="iconify mr-2 text-lg" data-icon="mdi:plus"></span>
        {{ lang.compose }}
      </RouterLink>
    </div>

    <!-- 标题 -->
    <div class="px-6 py-4 border-b bg-white">
      <h1 class="text-2xl font-bold text-gray-900 text-left">{{ groupStore.name }}</h1>
    </div>

    <!-- 操作按钮组 -->
    <div class="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b">
      <button 
        @click="del" 
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 inline-flex items-center"
      >
        <span class="iconify mr-1.5" data-icon="mdi:delete"></span>
        {{ lang.del_btn }}
      </button>
      
      <button 
        @click="markRead" 
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 inline-flex items-center"
      >
        <span class="iconify mr-1.5" data-icon="mdi:email-open"></span>
        {{ lang.read_btn }}
      </button>
      
      <!-- Move Dropdown -->
      <div class="relative">
        <button 
          @click="showMoveDropdown = !showMoveDropdown" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 inline-flex items-center"
        >
          <span class="iconify mr-1.5" data-icon="mdi:folder-move"></span>
          {{ lang.move_btn }}
          <span class="iconify ml-1" data-icon="mdi:chevron-down"></span>
        </button>
        <div v-if="showMoveDropdown" class="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px]">
          <button 
            v-for="group in groupList" 
            :key="group.id"
            @click="move(group.id, group.name); showMoveDropdown = false"
            class="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg"
          >
            {{ group.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 邮件列表 -->
    <div class="flex-1 overflow-auto">
      <table class="w-full border-collapse">
        <thead class="sticky top-0 bg-gray-100 z-10">
          <tr>
            <th class="border-b border-gray-200 p-3 text-left w-10">
              <input 
                type="checkbox" 
                @change="toggleSelectAll"
                :checked="allSelected"
                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th class="border-b border-gray-200 p-3 text-left w-12"></th>
            <th class="border-b border-gray-200 p-3 text-left w-48 font-semibold text-sm text-gray-700">{{ lang.sender }}</th>
            <th class="border-b border-gray-200 p-3 text-left w-48 font-semibold text-sm text-gray-700">{{ lang.to }}</th>
            <th class="border-b border-gray-200 p-3 text-left font-semibold text-sm text-gray-700">{{ lang.title }}</th>
            <th class="border-b border-gray-200 p-3 text-left w-44 font-semibold text-sm text-gray-700">{{ lang.date }}</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in data" 
            :key="row.id"
            @click="rowClick(row)"
            class="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition duration-150"
          >
            <td class="p-3">
              <input 
                type="checkbox" 
                v-model="row.selected"
                @click.stop
                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </td>
            <td class="p-3">
              <div class="flex items-center gap-1.5">
                <span v-if="!row.is_read" class="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">{{ lang.new }}</span>
                <span v-if="row.dangerous" class="text-red-600 font-bold text-lg" :title="lang.dangerous">!</span>
                <span v-if="row.error !== ''" class="text-red-600 font-bold text-lg" :title="row.error">!</span>
              </div>
            </td>
            <td class="p-3">
              <span 
                :title="row.sender.EmailAddress"
                class="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
              >
                {{ row.sender.Name !== '' ? row.sender.Name : row.sender.EmailAddress }}
              </span>
            </td>
            <td class="p-3">
              <span 
                v-for="toInfo in row.to" 
                :key="toInfo.EmailAddress"
                :title="toInfo.EmailAddress"
                class="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium mr-1"
              >
                {{ toInfo.Name !== '' ? toInfo.Name : toInfo.EmailAddress }}
              </span>
            </td>
            <td class="p-3">
              <div :class="['text-sm', row.is_read ? 'text-gray-700' : 'font-semibold text-gray-900']">{{ row.title }}</div>
              <div class="text-xs text-gray-500 h-5 overflow-hidden mt-0.5">{{ row.desc }}</div>
            </td>
            <td class="p-3">
              <span :class="['text-sm', row.is_read ? 'text-gray-600' : 'font-semibold text-gray-900']">{{ row.datetime }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-center items-center gap-2 py-4 bg-white border-t">
      <button 
        @click="pageChange(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 inline-flex items-center"
      >
        <span class="iconify" data-icon="mdi:chevron-left"></span>
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="pageChange(page)"
        :class="[
          'px-4 py-2 rounded-lg font-medium text-sm transition duration-200',
          page === currentPage ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        ]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="pageChange(currentPage + 1)" 
        :disabled="currentPage === totalPage"
        class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 inline-flex items-center"
      >
        <span class="iconify" data-icon="mdi:chevron-right"></span>
      </button>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showConfirm = false"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ confirmTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ confirmMessage }}</p>
        <div class="flex justify-end gap-3">
          <button 
            @click="showConfirm = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            Cancel
          </button>
          <button 
            @click="confirmAction" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Dialog -->
    <div v-if="alertMessage" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="alertMessage = ''"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Notice</h3>
        <p class="text-gray-600 mb-6">{{ alertMessage }}</p>
        <div class="flex justify-end">
          <button 
            @click="alertMessage = ''" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            OK
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
import {RouterLink, useRouter} from 'vue-router'
import {ref, watch, computed} from 'vue'
import useGroupStore from '../stores/group'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";

const router = useRouter();
const groupStore = useGroupStore()
const groupList = ref([])
const showMoveDropdown = ref(false)
let tag = groupStore.tag;

if (tag === "") {
  tag = '{"type":0,"status":-1}'
}

watch(groupStore, async (newV) => {
  tag = newV.tag;
  if (tag === "") {
    tag = '{"type":0,"status":-1}'
  }
  data.value = []
  currentPage.value = 1
  updateList()
})

const data = ref([])
const totalPage = ref(0)
const currentPage = ref(1)
const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmCallback = ref(null)
const alertMessage = ref('')
const toastMessage = ref('')
const toastType = ref('success')

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPage.value, start + 4)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const allSelected = computed(() => {
  return data.value.length > 0 && data.value.every(row => row.selected)
})

const toggleSelectAll = () => {
  const newValue = !allSelected.value
  data.value.forEach(row => {
    row.selected = newValue
  })
}

const getSelectedRows = () => {
  return data.value.filter(row => row.selected)
}

const updateList = function () {
  http.post("/api/email/list", {tag: tag, page_size: 10, current_page: currentPage.value}).then(res => {
    data.value = res.data.list.map(item => ({...item, selected: false}))
    totalPage.value = res.data.total_page
  })
}

const updateGroupList = function () {
  http.post("/api/group/list").then(res => {
    groupList.value = res.data
  })
}

updateList()
updateGroupList()

const rowClick = function (row) {
  router.push("/detail/" + row.id)
}

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const showAlert = (message) => {
  alertMessage.value = message
}

const showConfirmDialog = (title, message, callback) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmCallback.value = callback
  showConfirm.value = true
}

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  showConfirm.value = false
}

const markRead = function () {
  let rows = getSelectedRows()
  let ids = []
  rows.forEach(element => {
    ids.push(element.id)
  });
  if (ids.length == 0) {
    showAlert('Unselected content')
  } else {
    http.post("/api/email/read", {"ids": ids}).then(res => {
      if (res.errorNo === 0) {
        updateList()
        showToast('Marked as read', 'success')
      } else {
        showToast(res.errorMsg, 'error')
      }
    })
  }
}

const move = function (group_id, group_name) {
  let rows = getSelectedRows()
  let ids = []
  rows.forEach(element => {
    ids.push(element.id)
  });

  if (ids.length == 0) {
    showAlert('Unselected content')
  } else {
    showConfirmDialog('Warning', lang.move_email_confirm, () => {
      http.post("/api/email/move", {"group_id": group_id, "group_name": group_name, "ids": ids}).then(res => {
        if (res.errorNo === 0) {
          updateList()
          showToast('Move completed', 'success')
        } else {
          showToast(res.errorMsg, 'error')
        }
      })
    })
  }
}

const del = function () {
  let rows = getSelectedRows()
  let ids = []
  rows.forEach(element => {
    ids.push(element.id)
  });

  let groupTag = JSON.parse(tag)
  if (ids.length == 0) {
    showAlert('Unselected content')
  } else {
    showConfirmDialog('Warning', lang.del_email_confirm, () => {
      http.post("/api/email/del", {"ids": ids, "forcedDel": groupTag.status === 3}).then(res => {
        if (res.errorNo === 0) {
          updateList()
          showToast('Delete completed', 'success')
        } else {
          showToast(res.errorMsg, 'error')
        }
      })
    })
  }
}

const pageChange = function (p) {
  if (p < 1 || p > totalPage.value) return
  currentPage.value = p
  http.post("/api/email/list", {tag: tag, page_size: 10, current_page: p}).then(res => {
    data.value = res.data.list.map(item => ({...item, selected: false}))
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
