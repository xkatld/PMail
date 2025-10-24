<template>
  <div class="flex flex-col bg-white min-h-full">
    <!-- 邮件主题 -->
    <div class="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-white">
      <h1 class="text-3xl font-bold text-gray-900 text-left">{{ detailData.subject }}</h1>
    </div>

    <!-- 邮件元信息 -->
    <div class="px-8 py-6 space-y-4 bg-gray-50 border-b">
      <div class="flex items-start">
        <span class="font-semibold text-sm text-gray-700 mr-3 min-w-[80px] text-left">{{ lang.to }}：</span>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="to in tos" 
            :key="to.EmailAddress"
            :title="to.EmailAddress"
            class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-lg font-medium"
          >
            <span class="iconify mr-1.5" data-icon="mdi:account"></span>
            {{ to.Name !== '' ? to.Name : to.EmailAddress }}
          </span>
        </div>
      </div>

      <div v-if="showCC" class="flex items-start">
        <span class="font-semibold text-sm text-gray-700 mr-3 min-w-[80px] text-left">{{ lang.cc }}：</span>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="item in ccs" 
            :key="item.EmailAddress"
            :title="item.EmailAddress"
            class="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium"
          >
            <span class="iconify mr-1.5" data-icon="mdi:account"></span>
            {{ item.Name !== '' ? item.Name : item.EmailAddress }}
          </span>
        </div>
      </div>

      <div class="flex items-start">
        <span class="font-semibold text-sm text-gray-700 mr-3 min-w-[80px] text-left">{{ lang.sender }}：</span>
        <span 
          :title="detailData.from_address"
          class="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-lg font-medium"
        >
          <span class="iconify mr-1.5" data-icon="mdi:email"></span>
          {{ detailData.from_name !== '' ? detailData.from_name : detailData.from_address }}
        </span>
      </div>

      <div class="flex items-start">
        <span class="font-semibold text-sm text-gray-700 mr-3 min-w-[80px] text-left">{{ lang.date }}：</span>
        <span class="inline-flex items-center text-sm text-gray-600">
          <span class="iconify mr-1.5" data-icon="mdi:clock-outline"></span>
          {{ detailData.send_date }}
        </span>
      </div>
    </div>

    <!-- 邮件内容 -->
    <div class="flex-1 px-8 py-6">
      <div class="bg-white rounded-lg">
        <div v-if="detailData.html === ''" class="text-base leading-relaxed text-gray-700">
          <pre class="whitespace-pre-wrap font-sans">{{ detailData.text }}</pre>
        </div>
        <div v-else class="prose max-w-none" v-html="detailData.html"></div>
      </div>
    </div>

    <!-- 附件区域 -->
    <div v-if="detailData.attachments && detailData.attachments.length > 0" class="px-8 py-6 border-t bg-gray-50">
      <div class="flex items-center mb-4">
        <span class="iconify text-xl text-gray-700 mr-2" data-icon="mdi:paperclip"></span>
        <span class="font-semibold text-gray-900">{{ lang.attachment }} ({{ detailData.attachments.length }})</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <a 
          v-for="item in detailData.attachments" 
          :key="item.Index"
          :href="'/attachments/download/' + detailData.id + '/' + item.Index"
          class="flex items-center gap-3 px-4 py-3 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-200 no-underline group"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
            <span class="iconify text-blue-600 text-xl" data-icon="mdi:file-document"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">{{ item.Filename }}</div>
            <div class="text-xs text-gray-500">点击下载</div>
          </div>
          <span class="iconify text-gray-400 group-hover:text-blue-600 transition" data-icon="mdi:download"></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";

const route = useRoute()
const detailData = ref({
  attachments: []
})

const tos = ref([])
const ccs = ref([])
const showCC = ref(false)

http.post("/api/email/detail", {id: parseInt(route.params.id)}).then(res => {
  detailData.value = res.data
  if (res.data.to !== "" && res.data.to != null) {
    tos.value = JSON.parse(res.data.to)
  }
  if (res.data.cc !== "" && res.data.cc != null) {
    ccs.value = JSON.parse(res.data.cc)
  }

  if (ccs.value != null) {
    showCC.value = ccs.value.length > 0
  } else {
    showCC.value = false
  }
})
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}

.prose {
  color: #374151;
}

.prose :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: #1d4ed8;
}
</style>
