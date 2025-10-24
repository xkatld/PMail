<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- 顶部操作栏 -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="px-6 py-4 flex items-center justify-between">
        <RouterLink 
          to="/editer" 
          class="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 no-underline"
        >
          <Icon icon="solar:add-circle-bold" class="text-xl" />
          <span>{{ lang.compose }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- 标题区 -->
    <div class="px-6 py-5 bg-white border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center space-x-3">
        <Icon icon="solar:inbox-line-bold-duotone" class="text-primary-500 text-3xl" />
        <span>{{ groupStore.name }}</span>
      </h2>
    </div>

    <!-- 批量操作栏 -->
    <div class="px-6 py-3 bg-white border-b border-gray-200 flex items-center space-x-3">
      <button 
        @click="del" 
        class="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 font-medium"
      >
        <Icon icon="solar:trash-bin-trash-bold" class="text-lg" />
        <span>{{ lang.del_btn }}</span>
      </button>

      <button 
        @click="markRead" 
        class="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-green-50 text-green-600 border border-green-200 hover:border-green-300 rounded-lg transition-all duration-200 font-medium"
      >
        <Icon icon="solar:check-read-bold" class="text-lg" />
        <span>{{ lang.read_btn }}</span>
      </button>

      <el-dropdown>
        <button class="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 font-medium">
          <Icon icon="solar:folder-with-files-bold" class="text-lg" />
          <span>{{ lang.move_btn }}</span>
          <Icon icon="solar:alt-arrow-down-linear" class="text-sm" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="move(group.id,group.name)" v-for="group in groupList" :key="group.id">
              <div class="flex items-center space-x-2">
                <Icon icon="solar:folder-bold-duotone" class="text-primary-500" />
                <span>{{ group.name }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 邮件列表 -->
    <div class="flex-1 overflow-auto px-6 py-4">
      <el-table 
        ref="taskTableDataRef" 
        :data="data" 
        :show-header="true" 
        :border="false" 
        @row-click="rowClick"
        :row-style="rowStyle"
        class="modern-table w-full"
        style="width: 100%"
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="is_read" label="" width="80">
          <template #default="scope">
            <div class="flex items-center space-x-2">
              <span v-if="!scope.row.is_read" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                {{ lang.new }}
              </span>
              <el-tooltip v-if="scope.row.dangerous" effect="dark" :content="lang.dangerous" placement="top">
                <Icon icon="solar:danger-triangle-bold" class="text-red-500 text-xl" />
              </el-tooltip>
              <el-tooltip v-if="scope.row.error !== ''" effect="dark" :content="scope.row.error" placement="top">
                <Icon icon="solar:danger-circle-bold" class="text-red-500 text-xl" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" :label="lang.sender" width="200">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.sender.EmailAddress" placement="top">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ (scope.row.sender.Name || scope.row.sender.EmailAddress)[0].toUpperCase() }}
                </div>
                <span class="font-medium text-gray-700 truncate">
                  {{ scope.row.sender.Name !== '' ? scope.row.sender.Name : scope.row.sender.EmailAddress }}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="title" :label="lang.to" width="200">
          <template #default="scope">
            <div class="flex flex-wrap gap-1">
              <el-tooltip v-for="toInfo in scope.row.to" :key="toInfo" class="box-item" effect="dark"
                          :content="toInfo.EmailAddress" placement="top">
                <span class="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {{ toInfo.Name !== '' ? toInfo.Name : toInfo.EmailAddress }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="desc" :label="lang.title" min-width="300">
          <template #default="scope">
            <div class="space-y-1">
              <div :class="['text-sm', scope.row.is_read ? 'text-gray-700' : 'text-gray-900 font-semibold']">
                {{ scope.row.title }}
              </div>
              <div class="text-xs text-gray-500 truncate">{{ scope.row.desc }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="datetime" :label="lang.date" width="180">
          <template #default="scope">
            <div class="flex items-center space-x-2 text-gray-600">
              <Icon icon="solar:calendar-mark-linear" class="text-gray-400" />
              <span :class="scope.row.is_read ? 'font-normal' : 'font-semibold'">
                {{ scope.row.datetime }}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="px-6 py-4 bg-white border-t border-gray-200 flex justify-center">
      <el-pagination 
        background 
        layout="prev, pager, next" 
        :page-count="totalPage" 
        @current-change="pageChange"
        class="modern-pagination"
      />
    </div>
  </div>
</template>


<script setup>
import { Icon } from '@iconify/vue';
import {RouterLink, useRouter} from 'vue-router'
import {ref, watch} from 'vue'
import useGroupStore from '../stores/group'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";
import {ElMessage, ElMessageBox} from "element-plus";


const router = useRouter();
const groupStore = useGroupStore()
const groupList = ref([])
const taskTableDataRef = ref(null)
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
  http.post("/api/email/list", {tag: tag, page_size: 10}).then(res => {
    data.value = res.data.list
    totalPage.value = res.data.total_page
  })
})


const data = ref([])
const totalPage = ref(0)

const updateList = function () {
  http.post("/api/email/list", {tag: tag, page_size: 10}).then(res => {
    data.value = res.data.list
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

const markRead = function () {
  let rows = taskTableDataRef.value?.getSelectionRows()
  let ids = []
  rows.forEach(element => {
    ids.push(element.id)
  });
  if (ids.length == 0) {
    ElMessageBox.alert('Unselected content', 'Notice', {
      confirmButtonText: 'OK',
    })
  } else {
    http.post("/api/email/read", {"ids": ids}).then(res => {
      if (res.errorNo === 0) {
        updateList()
      } else {
        ElMessage({
          type: 'error',
          message: res.errorMsg,
        })
      }
    })
  }
}


const move = function (group_id, group_name) {
  let rows = taskTableDataRef.value?.getSelectionRows()
  let ids = []
  rows.forEach(element => {
    ids.push(element.id)
  });


  if (ids.length == 0) {
    ElMessageBox.alert('Unselected content', 'Notice', {
      confirmButtonText: 'OK',
    })
  } else {
    ElMessageBox.confirm(
        lang.move_email_confirm,
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    )
        .then(() => {
          http.post("/api/email/move", {"group_id": group_id, "group_name": group_name, "ids": ids}).then(res => {
            if (res.errorNo === 0) {
              updateList()
              ElMessage({
                type: 'success',
                message: 'Move completed',
              })
            } else {
              ElMessage({
                type: 'error',
                message: res.errorMsg,
              })
            }
          })


        })
  }
}


const del = function () {
  let rows = taskTableDataRef.value?.getSelectionRows()
  let ids = []
  rows.forEach(element => {
    ids.push(element.id)
  });

  let groupTag = JSON.parse(tag)
  if (ids.length == 0) {
    ElMessageBox.alert('Unselected content', 'Notice', {
      confirmButtonText: 'OK',
    })
  } else {

    ElMessageBox.confirm(
        lang.del_email_confirm,
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    )
        .then(() => {
          http.post("/api/email/del", {"ids": ids, "forcedDel": groupTag.status === 3}).then(res => {
            if (res.errorNo === 0) {
              updateList()
              ElMessage({
                type: 'success',
                message: 'Delete completed',
              })
            } else {
              ElMessage({
                type: 'error',
                message: res.errorMsg,
              })
            }
          })


        })
  }
}


const rowStyle = function () {
  return {'cursor': 'pointer'}
}

const pageChange = function (p) {
  http.post("/api/email/list", {tag: tag, page_size: 10, current_page: p}).then(res => {
    data.value = res.data.list
  })
}

</script>


<style scoped>
/* 现代化表格样式 */
.modern-table :deep(.el-table__header-wrapper) {
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}

.modern-table :deep(.el-table__header th) {
  background-color: transparent !important;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modern-table :deep(.el-table__row) {
  transition: all 0.2s ease;
  background-color: white;
}

.modern-table :deep(.el-table__row:hover) {
  background-color: #f0f9ff !important;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.modern-table :deep(.el-table__body td) {
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 12px;
}

.modern-table :deep(.el-table::before) {
  display: none;
}

/* 分页样式 */
.modern-pagination :deep(.el-pager li) {
  transition: all 0.2s ease;
}

.modern-pagination :deep(.el-pager li.is-active) {
  background: linear-gradient(to right, #0ea5e9, #0284c7);
  color: white;
}

.modern-pagination :deep(.btn-prev),
.modern-pagination :deep(.btn-next) {
  transition: all 0.2s ease;
}

.modern-pagination :deep(.btn-prev:hover),
.modern-pagination :deep(.btn-next:hover) {
  color: #0ea5e9;
}
</style>