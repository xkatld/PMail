<template>
  <header class="h-16 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 shadow-lg">
    <div class="h-full flex items-center justify-between px-6">
      <!-- Logo 区域 -->
      <router-link to="/" class="flex items-center space-x-3 group no-underline">
        <div class="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-all duration-300">
          <Icon icon="mdi:email-fast" class="text-white text-3xl" />
        </div>
        <h1 class="text-2xl font-bold text-white tracking-wide group-hover:scale-105 transition-transform duration-300">
          PMail
        </h1>
      </router-link>

      <!-- 右侧操作区 -->
      <div class="flex items-center space-x-4" v-if="isLogin">
        <button 
          @click="settings" 
          class="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
        >
          <Icon icon="solar:settings-bold-duotone" class="text-white text-xl group-hover:rotate-90 transition-transform duration-500" />
          <span class="text-white font-medium hidden md:inline">设置</span>
        </button>
      </div>
    </div>

    <!-- 设置抽屉 -->
    <el-drawer v-model="openSettings" size="80%" :title="lang.settings" class="modern-drawer">
      <el-tabs tab-position="left" class="h-full">
        <el-tab-pane :label="lang.security">
          <SecuritySettings/>
        </el-tab-pane>

        <el-tab-pane :label="lang.group_settings">
          <GroupSettings/>
        </el-tab-pane>

        <el-tab-pane :label="lang.rule_setting">
          <RuleSettings/>
        </el-tab-pane>

        <el-tab-pane v-if="userInfos.is_admin" :label="lang.user_management">
          <UserManagement/>
        </el-tab-pane>

        <el-tab-pane :label="lang.plugin_settings">
          <PluginSettings/>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue';
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
.modern-drawer :deep(.el-drawer__header) {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.modern-drawer :deep(.el-tabs__item) {
  transition: all 0.3s ease;
}

.modern-drawer :deep(.el-tabs__item:hover) {
  background-color: #f3f4f6;
}
</style>