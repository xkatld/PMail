<template>
  <div class="h-12 bg-black flex items-center px-4">
    <div class="flex-grow">
      <router-link to="/" class="no-underline">
        <h1 class="text-2xl font-bold text-white">PMail</h1>
      </router-link>
    </div>
    <div v-if="isLogin" @click="settings" class="cursor-pointer">
      <span class="iconify text-white text-2xl" data-icon="mdi:cog"></span>
    </div>
  </div>

  <!-- Settings Drawer -->
  <div v-if="openSettings" class="fixed inset-0 z-50 overflow-hidden">
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="openSettings = false"></div>
    <div class="absolute right-0 top-0 h-full w-4/5 bg-white shadow-xl flex">
      <!-- Tabs Sidebar -->
      <div class="w-48 bg-gray-100 border-r">
        <div class="p-4 border-b">
          <h2 class="text-lg font-bold">{{ lang.settings }}</h2>
        </div>
        <nav class="flex flex-col">
          <button 
            @click="activeTab = 'security'"
            :class="['text-left px-4 py-3 hover:bg-gray-200 transition', activeTab === 'security' ? 'bg-white border-l-4 border-blue-500' : '']"
          >
            {{ lang.security }}
          </button>
          <button 
            @click="activeTab = 'group'"
            :class="['text-left px-4 py-3 hover:bg-gray-200 transition', activeTab === 'group' ? 'bg-white border-l-4 border-blue-500' : '']"
          >
            {{ lang.group_settings }}
          </button>
          <button 
            @click="activeTab = 'rule'"
            :class="['text-left px-4 py-3 hover:bg-gray-200 transition', activeTab === 'rule' ? 'bg-white border-l-4 border-blue-500' : '']"
          >
            {{ lang.rule_setting }}
          </button>
          <button 
            v-if="userInfos.is_admin"
            @click="activeTab = 'user'"
            :class="['text-left px-4 py-3 hover:bg-gray-200 transition', activeTab === 'user' ? 'bg-white border-l-4 border-blue-500' : '']"
          >
            {{ lang.user_management }}
          </button>
          <button 
            @click="activeTab = 'plugin'"
            :class="['text-left px-4 py-3 hover:bg-gray-200 transition', activeTab === 'plugin' ? 'bg-white border-l-4 border-blue-500' : '']"
          >
            {{ lang.plugin_settings }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <button @click="openSettings = false" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <span class="iconify text-2xl" data-icon="mdi:close"></span>
        </button>
        
        <SecuritySettings v-if="activeTab === 'security'" />
        <GroupSettings v-if="activeTab === 'group'" />
        <RuleSettings v-if="activeTab === 'rule'" />
        <UserManagement v-if="activeTab === 'user'" />
        <PluginSettings v-if="activeTab === 'plugin'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import SecuritySettings from '@/components/SecuritySettings.vue'
import lang from '../i18n/i18n';
import GroupSettings from './GroupSettings.vue';
import RuleSettings from './RuleSettings.vue';
import UserManagement from './UserManagement.vue';
import PluginSettings from './PluginSettings.vue';
import {useGlobalStatusStore} from "@/stores/useGlobalStatusStore";

const globalStatus = useGlobalStatusStore();
const isLogin = globalStatus.isLogin;
const userInfos = globalStatus.userInfos;

const openSettings = ref(false)
const activeTab = ref('security')

const settings = function () {
  if (Object.keys(userInfos).length === 0) {
    globalStatus.init(()=>{
      Object.assign(userInfos,globalStatus.userInfos)
      openSettings.value = true;
    })
  } else {
    openSettings.value = true;
  }
}
</script>

<style scoped>
</style>
