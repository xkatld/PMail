<template>
  <div class="w-64 h-full bg-white border-r flex flex-col">
    <!-- Search Bar -->
    <div class="p-4 border-b bg-gray-50">
      <div class="relative">
        <span class="iconify absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-icon="mdi:magnify"></span>
        <input 
          v-model="filterText"
          :placeholder="lang.search || '搜索...'"
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
    </div>

    <!-- Tree View -->
    <div class="flex-1 overflow-auto p-3">
      <div class="space-y-1">
        <div 
          v-for="node in filteredTree" 
          :key="node.id"
          class="select-none"
        >
          <!-- Parent Node -->
          <div 
            @click="toggleNode(node)"
            :class="[
              'flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition duration-150',
              activeNodeId === node.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <span 
              v-if="node.children && node.children.length > 0"
              class="iconify transition-transform duration-200" 
              :data-icon="node.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'"
              :class="[node.expanded ? 'rotate-0' : '']"
            ></span>
            <span v-else class="w-5"></span>
            
            <span class="iconify text-lg" :data-icon="getNodeIcon(node)"></span>
            <span class="flex-1 font-medium text-sm">{{ node.label }}</span>
            
            <span 
              v-if="node.count > 0"
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                activeNodeId === node.id ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
              ]"
            >
              {{ node.count }}
            </span>
          </div>

          <!-- Child Nodes -->
          <div v-if="node.expanded && node.children" class="ml-4 mt-1 space-y-1">
            <div 
              v-for="child in node.children" 
              :key="child.id"
              @click="selectNode(child)"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition duration-150',
                activeNodeId === child.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <span class="iconify text-lg" :data-icon="getNodeIcon(child)"></span>
              <span class="flex-1 text-sm">{{ child.label }}</span>
              
              <span 
                v-if="child.count > 0"
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  activeNodeId === child.id ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ child.count }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue'
import {useRouter} from 'vue-router'
import lang from '../i18n/i18n';
import useGroupStore from '../stores/group'
import {http} from "@/utils/axios";

const router = useRouter()
const groupStore = useGroupStore()

const filterText = ref('')
const treeData = ref([])
const activeNodeId = ref(null)

const filteredTree = computed(() => {
  if (!filterText.value) {
    return treeData.value
  }
  
  const filter = filterText.value.toLowerCase()
  return treeData.value.map(node => {
    const matchedChildren = node.children?.filter(child => 
      child.label.toLowerCase().includes(filter)
    ) || []
    
    if (node.label.toLowerCase().includes(filter) || matchedChildren.length > 0) {
      return {
        ...node,
        children: matchedChildren,
        expanded: matchedChildren.length > 0
      }
    }
    return null
  }).filter(Boolean)
})

const getNodeIcon = (node) => {
  if (!node.tag) return 'mdi:folder'
  
  const tagObj = JSON.parse(node.tag)
  if (tagObj.type === 0) {
    // Inbox type
    if (tagObj.status === -1) return 'mdi:inbox'
    if (tagObj.status === 0) return 'mdi:email'
    if (tagObj.status === 1) return 'mdi:email-open'
  } else if (tagObj.type === 1) {
    // Sent type
    return 'mdi:send'
  } else if (tagObj.type === 2) {
    // Draft
    return 'mdi:file-document-edit'
  } else if (tagObj.type === 3) {
    // Trash
    return 'mdi:delete'
  }
  
  return 'mdi:folder'
}

const toggleNode = (node) => {
  if (node.children && node.children.length > 0) {
    node.expanded = !node.expanded
  } else {
    selectNode(node)
  }
}

const selectNode = (node) => {
  activeNodeId.value = node.id
  groupStore.name = node.label
  groupStore.tag = node.tag
  router.push('/')
}

const loadTree = () => {
  http.post("/api/group/tree").then(res => {
    if (res.errorNo === 0) {
      const processNode = (node) => {
        node.expanded = false
        if (node.children) {
          node.children.forEach(processNode)
        }
        return node
      }
      treeData.value = res.data.map(processNode)
      
      // Auto-expand first node
      if (treeData.value.length > 0) {
        treeData.value[0].expanded = true
      }
    }
  })
}

loadTree()

// Refresh tree every 30 seconds
setInterval(loadTree, 30000)
</script>

<style scoped>
</style>
