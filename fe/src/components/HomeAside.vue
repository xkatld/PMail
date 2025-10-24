<template>
  <aside class="w-64 bg-gradient-to-b from-gray-50 to-gray-100 h-full shadow-inner">
    <!-- 搜索框 -->
    <div class="p-4 bg-white/50 backdrop-blur-sm">
      <div class="relative group">
        <Icon icon="solar:magnifer-linear" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary-500 transition-colors duration-200" />
        <input 
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          :placeholder="lang.search" 
        />
      </div>
    </div>

    <!-- 树形菜单 -->
    <div class="px-3 py-2">
      <el-tree
        :data="data"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        class="modern-tree bg-transparent"
      >
        <template #default="{ node, data }">
          <div class="flex items-center space-x-2 py-1 w-full group">
            <Icon 
              :icon="getTreeIcon(data)" 
              class="text-lg transition-colors duration-200"
              :class="data.tag ? 'text-primary-500 group-hover:text-primary-600' : 'text-gray-400'"
            />
            <span class="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors duration-200">
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
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modern-tree :deep(.el-tree-node__content:hover) {
  background-color: rgba(14, 165, 233, 0.1) !important;
  transform: translateX(4px);
}

.modern-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(14, 165, 233, 0.15) !important;
  font-weight: 600;
  border-left: 3px solid #0ea5e9;
}

.modern-tree :deep(.el-tree-node__expand-icon) {
  color: #64748b;
  transition: all 0.3s ease;
}

.modern-tree :deep(.el-tree-node__expand-icon:hover) {
  color: #0ea5e9;
}
</style>