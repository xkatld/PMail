<template>
  <header class="h-14 bg-white border-b border-gray-200 shadow-sm">
    <div class="h-full flex items-center justify-between px-6">
      <!-- Logo 区域 -->
      <router-link to="/" class="flex items-center space-x-2 group no-underline">
        <Icon icon="mdi:email-fast" class="text-primary-500 text-2xl" />
        <h1 class="text-xl font-semibold text-gray-800">
          PMail
        </h1>
      </router-link>

      <!-- 右侧操作区 -->
      <div class="flex items-center" v-if="isLogin">
        <button 
          @click="settings" 
          class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors duration-200"
        >
          <Icon icon="solar:settings-linear" class="text-xl" />
          <span class="text-sm font-medium hidden md:inline">设置</span>
        </button>
      </div>
    </div>

    <!-- 设置抽屉 -->
    <el-drawer v-model="openSettings" size="80%" :title="lang.settings">
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
</style>