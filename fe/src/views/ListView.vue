<template>
  <div class="h-full flex flex-col bg-white">
    <!-- 顶部操作栏 -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-6 py-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Icon icon="solar:inbox-line-linear" class="text-primary-500 text-xl" />
          <span>{{ groupStore.name }}</span>
        </h2>
        <RouterLink 
          to="/editer" 
          class="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors duration-200 no-underline"
        >
          <Icon icon="solar:add-circle-linear" class="text-base" />
          <span>{{ lang.compose }}</span>
        </RouterLink>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div class="px-6 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center space-x-2">
      <button 
        @click="del" 
        class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors duration-200"
      >
        <Icon icon="solar:trash-bin-trash-linear" class="text-base" />
        <span>{{ lang.del_btn }}</span>
      </button>

      <button 
        @click="markRead" 
        class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors duration-200"
      >
        <Icon icon="solar:check-read-linear" class="text-base" />
        <span>{{ lang.read_btn }}</span>
      </button>

      <el-dropdown>
        <button class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors duration-200">
          <Icon icon="solar:folder-linear" class="text-base" />
          <span>{{ lang.move_btn }}</span>
          <Icon icon="solar:alt-arrow-down-linear" class="text-xs" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="move(group.id,group.name)" v-for="group in groupList" :key="group.id">
              <div class="flex items-center space-x-2">
                <Icon icon="solar:folder-linear" class="text-primary-500" />
                <span>{{ group.name }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 邮件列表 -->
    <div class="flex-1 overflow-auto">
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
        <el-table-column type="selection" width="45"/>
        <el-table-column prop="is_read" label="" width="70" align="center">
          <template #default="scope">
            <div class="flex items-center justify-center space-x-1">
              <span v-if="!scope.row.is_read" class="w-2 h-2 bg-primary-500 rounded-full"></span>
              <el-tooltip v-if="scope.row.dangerous" effect="dark" :content="lang.dangerous" placement="top">
                <Icon icon="solar:danger-triangle-linear" class="text-red-500 text-base" />
              </el-tooltip>
              <el-tooltip v-if="scope.row.error !== ''" effect="dark" :content="scope.row.error" placement="top">
                <Icon icon="solar:danger-circle-linear" class="text-red-500 text-base" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" :label="lang.sender" width="180">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.sender.EmailAddress" placement="top">
              <div class="flex items-center space-x-2">
                <div class="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {{ (scope.row.sender.Name || scope.row.sender.EmailAddress)[0].toUpperCase() }}
                </div>
                <span class="text-sm text-gray-700 truncate">
                  {{ scope.row.sender.Name !== '' ? scope.row.sender.Name : scope.row.sender.EmailAddress }}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="title" :label="lang.to" width="180">
          <template #default="scope">
            <div class="flex flex-wrap gap-1">
              <el-tooltip v-for="toInfo in scope.row.to" :key="toInfo" class="box-item" effect="dark"
                          :content="toInfo.EmailAddress" placement="top">
                <span class="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {{ toInfo.Name !== '' ? toInfo.Name : toInfo.EmailAddress }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="desc" :label="lang.title" min-width="300">
          <template #default="scope">
            <div>
              <div :class="['text-sm', scope.row.is_read ? 'text-gray-600' : 'text-gray-900 font-medium']">
                {{ scope.row.title }}
              </div>
              <div class="text-xs text-gray-400 truncate mt-0.5">{{ scope.row.desc }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="datetime" :label="lang.date" width="150" align="right">
          <template #default="scope">
            <span class="text-sm text-gray-500">{{ scope.row.datetime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="px-6 py-3 bg-white border-t border-gray-200 flex justify-center">
      <el-pagination 
        background 
        layout="prev, pager, next" 
        :page-count="totalPage" 
        @current-change="pageChange"
        :small="true"
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
/* 表格样式 */
.modern-table :deep(.el-table__header th) {
  background-color: #f9fafb !important;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 12px 8px;
}

.modern-table :deep(.el-table__row) {
  transition: background-color 0.15s ease;
}

.modern-table :deep(.el-table__row:hover) {
  background-color: #f9fafb !important;
}

.modern-table :deep(.el-table__body td) {
  border-bottom: 1px solid #f3f4f6;
  padding: 12px 8px;
}

.modern-table :deep(.el-table::before) {
  display: none;
}
</style>