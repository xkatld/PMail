<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 text-left">{{ lang.plugin || '插件管理' }}</h2>
      <p class="text-gray-600 text-sm text-left">扩展邮件服务器功能，安装和管理插件</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <div class="flex gap-1">
        <button
          @click="activeTab = 'installed'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition duration-200',
            activeTab === 'installed' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="inline-flex items-center gap-2">
            <span class="iconify" data-icon="mdi:puzzle"></span>
            {{ lang.installed_plugins || '已安装' }}
            <span v-if="installedPlugins.length > 0" class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
              {{ installedPlugins.length }}
            </span>
          </span>
        </button>
        <button
          @click="activeTab = 'available'"
          :class="[
            'px-6 py-3 font-medium text-sm border-b-2 transition duration-200',
            activeTab === 'available' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="inline-flex items-center gap-2">
            <span class="iconify" data-icon="mdi:puzzle-plus"></span>
            {{ lang.available_plugins || '可用插件' }}
            <span v-if="availablePlugins.length > 0" class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
              {{ availablePlugins.length }}
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Installed Plugins Tab -->
    <div v-if="activeTab === 'installed'" class="space-y-4">
      <div v-if="installedPlugins.length === 0" class="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <span class="iconify text-gray-300 text-6xl mb-4" data-icon="mdi:puzzle-off"></span>
        <p class="text-gray-500 mt-4">{{ lang.no_installed_plugins || '暂无已安装的插件' }}</p>
        <button 
          @click="activeTab = 'available'"
          class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center"
        >
          <span class="iconify mr-2" data-icon="mdi:puzzle-plus"></span>
          {{ lang.browse_plugins || '浏览可用插件' }}
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="plugin in installedPlugins" 
          :key="plugin.id"
          class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-200"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="iconify text-white text-2xl" data-icon="mdi:puzzle"></span>
              </div>
              <div class="text-left">
                <h3 class="font-bold text-gray-900">{{ plugin.name }}</h3>
                <p class="text-xs text-gray-500">v{{ plugin.version }}</p>
              </div>
            </div>
            <span 
              :class="[
                'px-2.5 py-1 text-xs font-semibold rounded-full',
                plugin.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ plugin.enabled ? (lang.enabled || '启用') : (lang.disabled || '禁用') }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mb-4 text-left">{{ plugin.description }}</p>

          <div class="flex items-center gap-2">
            <button 
              @click="togglePlugin(plugin)"
              :class="[
                'flex-1 px-4 py-2 rounded-lg font-medium text-sm transition duration-200',
                plugin.enabled 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              ]"
            >
              <span class="iconify mr-1.5" :data-icon="plugin.enabled ? 'mdi:pause' : 'mdi:play'"></span>
              {{ plugin.enabled ? (lang.disable || '禁用') : (lang.enable || '启用') }}
            </button>
            <button 
              @click="configurePlugin(plugin)"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium text-sm transition duration-200"
              :title="lang.configure || '配置'"
            >
              <span class="iconify" data-icon="mdi:cog"></span>
            </button>
            <button 
              @click="uninstallPlugin(plugin)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition duration-200"
              :title="lang.uninstall || '卸载'"
            >
              <span class="iconify" data-icon="mdi:delete"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Plugins Tab -->
    <div v-if="activeTab === 'available'" class="space-y-4">
      <div v-if="availablePlugins.length === 0" class="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <span class="iconify text-gray-300 text-6xl mb-4" data-icon="mdi:puzzle-check"></span>
        <p class="text-gray-500 mt-4">{{ lang.no_available_plugins || '暂无可用插件' }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="plugin in availablePlugins" 
          :key="plugin.id"
          class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition duration-200"
        >
          <div class="flex items-start gap-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="iconify text-white text-2xl" data-icon="mdi:puzzle-plus"></span>
            </div>
            <div class="text-left flex-1">
              <h3 class="font-bold text-gray-900">{{ plugin.name }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500">v{{ plugin.version }}</span>
                <span class="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">
                  <span class="iconify mr-1" data-icon="mdi:download"></span>
                  {{ plugin.downloads || 0 }}
                </span>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-4 text-left">{{ plugin.description }}</p>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3 text-xs text-gray-600">
              <span class="inline-flex items-center gap-1">
                <span class="iconify" data-icon="mdi:account"></span>
                {{ plugin.author }}
              </span>
              <span class="inline-flex items-center gap-1">
                <span class="iconify" data-icon="mdi:star"></span>
                {{ plugin.rating || 'N/A' }}
              </span>
            </div>
          </div>

          <button 
            @click="installPlugin(plugin)"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center justify-center"
          >
            <span class="iconify mr-2" data-icon="mdi:download"></span>
            {{ lang.install || '安装' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Configure Dialog -->
    <div v-if="showConfigDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showConfigDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-gray-900 mb-5 text-left">
          {{ lang.configure_plugin || '配置插件' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.plugin_name || '插件名称' }}
            </label>
            <input 
              :value="currentPlugin?.name"
              disabled
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.api_key || 'API Key' }}
            </label>
            <input 
              v-model="pluginConfig.apiKey"
              :placeholder="lang.api_key_placeholder || '请输入 API Key（可选）'"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.webhook_url || 'Webhook URL' }}
            </label>
            <input 
              v-model="pluginConfig.webhookUrl"
              :placeholder="lang.webhook_url_placeholder || '请输入 Webhook URL（可选）'"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t mt-6">
          <button 
            @click="showConfigDialog = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.cancel || '取消' }}
          </button>
          <button 
            @click="savePluginConfig"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.save || '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showConfirmDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <span class="iconify text-yellow-600 text-2xl" data-icon="mdi:alert"></span>
          </div>
          <h3 class="text-xl font-bold text-gray-900">{{ confirmTitle }}</h3>
        </div>
        
        <p class="text-gray-600 mb-6 text-left">{{ confirmMessage }}</p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showConfirmDialog = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.cancel || '取消' }}
          </button>
          <button 
            @click="confirmAction" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.confirm || '确认' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Message -->
    <div v-if="toastMessage" class="fixed top-6 right-6 z-50 animate-fade-in">
      <div :class="[
        'px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3',
        toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]">
        <span class="iconify text-xl" :data-icon="toastType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'"></span>
        <span class="font-medium">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";

const activeTab = ref('installed')
const installedPlugins = ref([])
const availablePlugins = ref([])
const showConfigDialog = ref(false)
const showConfirmDialog = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const currentPlugin = ref(null)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmCallback = ref(null)

const pluginConfig = reactive({
  apiKey: '',
  webhookUrl: ''
})

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const loadInstalledPlugins = () => {
  http.post("/api/plugin/installed").then(res => {
    if (res.errorNo === 0) {
      installedPlugins.value = res.data
    }
  })
}

const loadAvailablePlugins = () => {
  http.post("/api/plugin/available").then(res => {
    if (res.errorNo === 0) {
      availablePlugins.value = res.data
    }
  })
}

const configurePlugin = (plugin) => {
  currentPlugin.value = plugin
  pluginConfig.apiKey = plugin.config?.apiKey || ''
  pluginConfig.webhookUrl = plugin.config?.webhookUrl || ''
  showConfigDialog.value = true
}

const savePluginConfig = () => {
  http.post("/api/plugin/config", {
    id: currentPlugin.value.id,
    config: pluginConfig
  }).then(res => {
    if (res.errorNo === 0) {
      showToast('配置保存成功', 'success')
      loadInstalledPlugins()
      showConfigDialog.value = false
    } else {
      showToast(res.errorMsg || '配置保存失败', 'error')
    }
  })
}

const togglePlugin = (plugin) => {
  http.post("/api/plugin/toggle", {
    id: plugin.id,
    enabled: !plugin.enabled
  }).then(res => {
    if (res.errorNo === 0) {
      showToast(`插件已${!plugin.enabled ? '启用' : '禁用'}`, 'success')
      loadInstalledPlugins()
    } else {
      showToast(res.errorMsg || '操作失败', 'error')
    }
  })
}

const uninstallPlugin = (plugin) => {
  confirmTitle.value = lang.confirm_uninstall || '确认卸载'
  confirmMessage.value = `确定要卸载插件 "${plugin.name}" 吗？`
  confirmCallback.value = () => {
    http.post("/api/plugin/uninstall", { id: plugin.id }).then(res => {
      if (res.errorNo === 0) {
        showToast('插件卸载成功', 'success')
        loadInstalledPlugins()
        loadAvailablePlugins()
      } else {
        showToast(res.errorMsg || '插件卸载失败', 'error')
      }
    })
    showConfirmDialog.value = false
  }
  showConfirmDialog.value = true
}

const installPlugin = (plugin) => {
  confirmTitle.value = lang.confirm_install || '确认安装'
  confirmMessage.value = `确定要安装插件 "${plugin.name}" 吗？`
  confirmCallback.value = () => {
    http.post("/api/plugin/install", { id: plugin.id }).then(res => {
      if (res.errorNo === 0) {
        showToast('插件安装成功', 'success')
        loadInstalledPlugins()
        loadAvailablePlugins()
        activeTab.value = 'installed'
      } else {
        showToast(res.errorMsg || '插件安装失败', 'error')
      }
    })
    showConfirmDialog.value = false
  }
  showConfirmDialog.value = true
}

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
}

loadInstalledPlugins()
loadAvailablePlugins()
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
