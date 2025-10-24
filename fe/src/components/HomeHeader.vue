<template>
  <div class="h-16 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg flex items-center px-6 justify-between">
    <!-- Left: Logo and Title -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
        <span class="iconify text-blue-600 text-2xl" data-icon="mdi:email"></span>
      </div>
      <h1 class="text-2xl font-bold text-white">PMail</h1>
    </div>

    <!-- Right: User Menu -->
    <div v-if="showUser" class="flex items-center gap-4">
      <div class="flex items-center gap-2 text-white">
        <span class="iconify text-xl" data-icon="mdi:account-circle"></span>
        <span class="font-medium">{{ globalStatus.userInfos.account }}</span>
      </div>
      
      <div class="relative">
        <button 
          @click="showUserMenu = !showUserMenu"
          class="w-9 h-9 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition duration-200"
        >
          <span class="iconify text-white text-xl" data-icon="mdi:menu"></span>
        </button>
        
        <!-- Dropdown Menu -->
        <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-50">
          <button 
            @click="openSettings(); showUserMenu = false"
            class="w-full text-left px-4 py-3 hover:bg-gray-50 transition duration-150 flex items-center gap-3"
          >
            <span class="iconify text-gray-600 text-lg" data-icon="mdi:cog"></span>
            <span class="text-gray-800 font-medium">{{ lang.settings || '设置' }}</span>
          </button>
          <button 
            @click="logout(); showUserMenu = false"
            class="w-full text-left px-4 py-3 hover:bg-red-50 transition duration-150 flex items-center gap-3 border-t"
          >
            <span class="iconify text-red-600 text-lg" data-icon="mdi:logout"></span>
            <span class="text-red-600 font-medium">{{ lang.logout || '退出登录' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Drawer -->
    <div v-if="drawer" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" @click="drawer = false"></div>
      
      <!-- Drawer Content -->
      <div class="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300">
        <div class="h-full flex flex-col">
          <!-- Drawer Header -->
          <div class="h-16 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between px-6 shadow-md">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="iconify text-2xl" data-icon="mdi:cog"></span>
              {{ lang.settings || '设置' }}
            </h2>
            <button 
              @click="drawer = false"
              class="w-9 h-9 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition duration-200"
            >
              <span class="iconify text-white text-xl" data-icon="mdi:close"></span>
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Tabs Sidebar -->
            <div class="w-48 bg-gray-50 border-r">
              <button
                v-for="tab in tabs"
                :key="tab.name"
                @click="activeTab = tab.name"
                :class="[
                  'w-full text-left px-4 py-3 transition duration-150 flex items-center gap-3',
                  activeTab === tab.name 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                ]"
              >
                <span class="iconify text-lg" :data-icon="tab.icon"></span>
                <span class="font-medium">{{ tab.label }}</span>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="flex-1 overflow-auto p-6">
              <SecuritySettings v-if="activeTab === 'security'"/>
              <GroupSettings v-if="activeTab === 'group'"/>
              <RuleSettings v-if="activeTab === 'rule'"/>
              <UserManagement v-if="activeTab === 'user'"/>
              <PluginSettings v-if="activeTab === 'plugin'"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import SecuritySettings from './SecuritySettings.vue';
import GroupSettings from './GroupSettings.vue';
import RuleSettings from './RuleSettings.vue';
import UserManagement from './UserManagement.vue';
import PluginSettings from './PluginSettings.vue';
import lang from '../i18n/i18n';
import {useGlobalStatusStore} from "@/stores/useGlobalStatusStore";

const route = useRoute()
const router = useRouter()
const globalStatus = useGlobalStatusStore();

const drawer = ref(false)
const activeTab = ref('security')
const showUserMenu = ref(false)

const tabs = [
  { name: 'security', label: lang.security || '安全设置', icon: 'mdi:shield-account' },
  { name: 'group', label: lang.group || '分组管理', icon: 'mdi:folder-multiple' },
  { name: 'rule', label: lang.rule || '规则设置', icon: 'mdi:filter' },
  { name: 'user', label: lang.user || '用户管理', icon: 'mdi:account-multiple' },
  { name: 'plugin', label: lang.plugin || '插件管理', icon: 'mdi:puzzle' }
]

const showUser = computed(() => {
  return route.name !== 'login' && route.name !== 'setup'
})

watch(
    () => route.fullPath,
    () => {
      drawer.value = false
    }
)

const openSettings = function () {
  drawer.value = true
}

const logout = function () {
  localStorage.removeItem('token')
  globalStatus.$reset()
  router.push('/login')
}
</script>

<style scoped>
</style>
