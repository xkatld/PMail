<template>
  <div class="w-60 bg-gray-100 h-full">
    <input 
      id="search" 
      :placeholder="lang.search" 
      class="w-full h-10 px-3 bg-blue-100 border-none outline-none text-base"
    />
    
    <div class="overflow-y-auto">
      <div v-for="item in data" :key="item.id" class="mb-2">
        <!-- Parent Item -->
        <div 
          class="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center justify-between"
          @click="toggleExpand(item)"
        >
          <div class="flex items-center">
            <span v-if="item.children && item.children.length > 0" class="mr-2">
              <span class="iconify" :data-icon="item.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'"></span>
            </span>
            <span class="iconify mr-2" :data-icon="getIcon(item)"></span>
            <span>{{ item.label }}</span>
          </div>
        </div>
        
        <!-- Children Items -->
        <div v-if="item.expanded && item.children" class="ml-4">
          <div 
            v-for="child in item.children" 
            :key="child.id"
            class="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center"
            @click="handleNodeClick(child)"
          >
            <span class="iconify mr-2" :data-icon="getIcon(child)"></span>
            <span>{{ child.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import useGroupStore from "../stores/group";
import lang from "../i18n/i18n";
import { http } from "@/utils/axios";

const groupStore = useGroupStore();
const router = useRouter();
const data = ref([]);

http.get("/api/group").then((res) => {
  if (res.data) {
    data.value = res.data.map(item => ({
      ...item,
      expanded: true
    }));
  }
});

const toggleExpand = (item) => {
  if (item.children && item.children.length > 0) {
    item.expanded = !item.expanded;
  } else if (item.tag != null) {
    handleNodeClick(item);
  }
};

const handleNodeClick = function (data) {
  if (data.tag != null) {
    groupStore.name = data.label;
    groupStore.tag = data.tag;
    router.push({
      name: "list",
    });
  }
};

const getIcon = (item) => {
  if (item.tag === 'inbox') return 'mdi:inbox';
  if (item.tag === 'sent') return 'mdi:send';
  if (item.tag === 'trash') return 'mdi:delete';
  if (item.tag === 'spam') return 'mdi:alert-octagon';
  return 'mdi:folder';
};
</script>

<style scoped>
</style>
