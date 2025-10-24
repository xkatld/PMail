<template>
  <aside class="w-60 bg-white border-r border-gray-200 h-full">
    <!-- 搜索框 -->
    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <Icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        <input 
          class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          :placeholder="lang.search" 
        />
      </div>
    </div>

    <!-- 树形菜单 -->
    <div class="p-2">
      <el-tree
        :data="data"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        class="modern-tree bg-transparent"
      >
        <template #default="{ node, data }">
          <div class="flex items-center space-x-2 w-full">
            <Icon 
              :icon="getTreeIcon(data)" 
              class="text-base"
              :class="data.tag ? 'text-primary-500' : 'text-gray-400'"
            />
            <span class="text-sm text-gray-700">
              {{ node.label }}
            </span>
          </div>
        </template>
      </el-tree>
    </div>
  </aside>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useRouter } from "vue-router";
import { ref } from "vue";
import useGroupStore from "../stores/group";
import lang from "../i18n/i18n";
import { http } from "@/utils/axios";

const groupStore = useGroupStore();
const router = useRouter();
const data = ref([]);

http.get("/api/group").then((res) => {
  if (res.data) data.value = res.data;
});

const handleNodeClick = function (data) {
  if (data.tag != null) {
    groupStore.name = data.label;
    groupStore.tag = data.tag;
    router.push({
      name: "list",
    });
  }
};

// 根据节点类型返回不同图标
const getTreeIcon = function(data) {
  if (!data.tag) return 'solar:folder-bold-duotone';
  
  const tag = typeof data.tag === 'string' ? JSON.parse(data.tag) : data.tag;
  
  if (tag.type === 0) {
    if (tag.status === 0) return 'solar:inbox-line-bold-duotone';
    if (tag.status === 1) return 'solar:outbox-bold-duotone';
    if (tag.status === 2) return 'solar:bill-list-bold-duotone';
    if (tag.status === 3) return 'solar:trash-bin-trash-bold-duotone';
  }
  
  return 'solar:folder-with-files-bold-duotone';
}
</script>

<style scoped>
.modern-tree :deep(.el-tree-node__content) {
  padding: 6px 8px;
  margin: 1px 0;
  border-radius: 0.375rem;
  transition: background-color 0.15s ease;
}

.modern-tree :deep(.el-tree-node__content:hover) {
  background-color: #f3f4f6 !important;
}

.modern-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #e8f4ff !important;
  color: #2b7de9;
  font-weight: 500;
}

.modern-tree :deep(.el-tree-node__expand-icon) {
  color: #9ca3af;
}
</style>