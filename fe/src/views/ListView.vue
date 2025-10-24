<template>
  <div class="h-full flex flex-col">
    <!-- Operation Bar -->
    <div class="h-10 bg-blue-50 flex items-center px-4">
      <RouterLink to="/editer" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-decoration-none">
        <span class="iconify mr-1" data-icon="mdi:plus"></span>{{ lang.compose }}
      </RouterLink>
    </div>

    <!-- Title -->
    <div class="text-2xl font-bold text-left px-5 py-3">{{ groupStore.name }}</div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-3 px-5 pb-3">
      <button @click="del" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm transition">
        <span class="iconify mr-1" data-icon="mdi:delete"></span>{{ lang.del_btn }}
      </button>
      <button @click="markRead" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm transition">
        <span class="iconify mr-1" data-icon="mdi:email-open"></span>{{ lang.read_btn }}
      </button>
      
      <!-- Move Dropdown -->
      <div class="relative">
        <button 
          @click="showMoveDropdown = !showMoveDropdown" 
          class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm transition flex items-center"
        >
          {{ lang.move_btn }}
          <span class="iconify ml-1" data-icon="mdi:chevron-down"></span>
        </button>
        <div v-if="showMoveDropdown" class="absolute left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[150px]">
          <button 
            v-for="group in groupList" 
            :key="group.id"
            @click="move(group.id, group.name); showMoveDropdown = false"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
          >
            {{ group.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Email Table -->
    <div class="flex-1 overflow-auto px-5">
      <table class="w-full border-collapse">
        <thead class="bg-gray-50 sticky top-0">
          <tr class="border-b">
            <th class="w-8 p-2">
              <input 
                type="checkbox" 
                @change="toggleSelectAll"
                :checked="allSelected"
                class="cursor-pointer"
              />
            </th>
            <th class="w-12 p-2"></th>
            <th class="w-36 p-2 text-left">{{ lang.sender }}</th>
            <th class="w-36 p-2 text-left">{{ lang.to }}</th>
            <th class="p-2 text-left">{{ lang.title }}</th>
            <th class="w-44 p-2 text-left">{{ lang.date }}</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in data" 
            :key="row.id"
            @click="rowClick(row)"
            class="border-b hover:bg-gray-50 cursor-pointer transition"
          >
            <td class="p-2">
              <input 
                type="checkbox" 
                v-model="row.selected"
                @click.stop
                class="cursor-pointer"
              />
            </td>
            <td class="p-2">
              <div class="flex items-center gap-1">
                <span v-if="!row.is_read" class="text-blue-500 font-bold text-xs">{{ lang.new }}</span>
                <span v-if="row.dangerous" class="text-red-600 font-bold" :title="lang.dangerous">!</span>
                <span v-if="row.error !== ''" class="text-red-600 font-bold" :title="row.error">!</span>
              </div>
            </td>
            <td class="p-2">
              <span 
                :title="row.sender.EmailAddress"
                class="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
              >
                {{ row.sender.Name !== '' ? row.sender.Name : row.sender.EmailAddress }}
              </span>
            </td>
            <td class="p-2">
              <span 
                v-for="toInfo in row.to" 
                :key="toInfo.EmailAddress"
                :title="toInfo.EmailAddress"
                class="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded mr-1"
              >
                {{ toInfo.Name !== '' ? toInfo.Name : toInfo.EmailAddress }}
              </span>
            </td>
            <td class="p-2">
              <div :class="row.is_read ? '' : 'font-bold'">{{ row.title }}</div>
              <div class="text-xs text-gray-500 h-6 overflow-hidden">{{ row.desc }}</div>
            </td>
            <td class="p-2">
              <span :class="row.is_read ? '' : 'font-bold'">{{ row.datetime }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-2 py-4">
      <button 
        @click="pageChange(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="iconify" data-icon="mdi:chevron-left"></span>
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page"
        @click="pageChange(page)"
        :class="[
          'px-3 py-1 rounded',
          page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        ]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="pageChange(currentPage + 1)" 
        :disabled="currentPage === totalPage"
        class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="iconify" data-icon="mdi:chevron-right"></span>
      </button>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showConfirm = false"></div>
      <div class="relative bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">{{ confirmTitle }}</h3>
        <p class="mb-6">{{ confirmMessage }}</p>
        <div class="flex justify-end gap-3">
          <button @click="showConfirm = false" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            Cancel
          </button>
          <button @click="confirmAction" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Dialog -->
    <div v-if="alertMessage" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="alertMessage = ''"></div>
      <div class="relative bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-bold mb-4">Notice</h3>
        <p class="mb-6">{{ alertMessage }}</p>
        <div class="flex justify-end">
          <button @click="alertMessage = ''" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Message -->
    <div v-if="toastMessage" class="fixed top-4 right-4 z-50">
      <div :class="[
        'px-6 py-3 rounded shadow-lg',
        toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
        {{ toastMessage }}
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
</style>
