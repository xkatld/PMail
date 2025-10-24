<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto p-6">
      <!-- 邮件头部 -->
      <div class="bg-white border border-gray-200 rounded-lg mb-4">
        <!-- 标题 -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-xl font-semibold text-gray-900">{{ detailData.subject }}</h1>
        </div>

        <!-- 邮件元信息 -->
        <div class="px-6 py-4 space-y-3">
          <!-- 发件人和日期 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                {{ (detailData.from_name || detailData.from_address)[0]?.toUpperCase() }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ detailData.from_name !== '' ? detailData.from_name : detailData.from_address }}
                </div>
                <el-tooltip class="box-item" effect="dark" :content="detailData.from_address" placement="top">
                  <div class="text-xs text-gray-500">{{ detailData.from_address }}</div>
                </el-tooltip>
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ detailData.send_date }}</span>
          </div>

          <!-- 收件人 -->
          <div class="flex items-start space-x-2 text-sm">
            <span class="text-gray-500 min-w-fit">{{ lang.to }}:</span>
            <div class="flex flex-wrap gap-1.5">
              <el-tooltip v-for="to in tos" :key="to" class="box-item" effect="dark" :content="to.EmailAddress" placement="top">
                <span class="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {{ to.Name !== '' ? to.Name : to.EmailAddress }}
                </span>
              </el-tooltip>
            </div>
          </div>

          <!-- 抄送 -->
          <div v-if="showCC" class="flex items-start space-x-2 text-sm">
            <span class="text-gray-500 min-w-fit">{{ lang.cc }}:</span>
            <div class="flex flex-wrap gap-1.5">
              <el-tooltip v-for="item in ccs" :key="item" class="box-item" effect="dark" :content="item.EmailAddress" placement="top">
                <span class="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {{ item.Name !== '' ? item.Name : item.EmailAddress }}
                </span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <!-- 邮件内容 -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div class="prose max-w-none">
          <div v-if="detailData.html === ''" class="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {{ detailData.text }}
          </div>
          <div v-else class="email-content text-sm" v-html="detailData.html"></div>
        </div>
      </div>

      <!-- 附件 -->
      <div v-if="detailData.attachments.length > 0" class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex items-center space-x-2 mb-4">
          <Icon icon="solar:paperclip-linear" class="text-gray-500 text-lg" />
          <span class="text-sm font-medium text-gray-700">{{ lang.attachment }} ({{ detailData.attachments.length }})</span>
        </div>
        <div class="space-y-2">
          <a 
            v-for="item in detailData.attachments" 
            :key="item"
            :href="'/attachments/download/' + detailData.id + '/' + item.Index"
            class="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors duration-200 no-underline"
          >
            <Icon icon="solar:document-text-linear" class="text-primary-500 text-xl flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="text-sm text-gray-700 truncate">{{ item.Filename }}</div>
            </div>
            <Icon icon="solar:download-linear" class="text-gray-400 text-lg flex-shrink-0" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import lang from '../i18n/i18n';
import {http} from "@/utils/axios";

const route = useRoute()
const detailData = ref({
  attachments: []
})

const tos = ref()
const ccs = ref()
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
/* 邮件内容样式 */
.email-content :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.email-content :deep(a) {
  color: #4a9eff;
  text-decoration: underline;
}

.email-content :deep(a:hover) {
  color: #2b7de9;
}

.email-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 0.75rem 0;
}

.email-content :deep(blockquote) {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #6b7280;
}

.email-content :deep(pre) {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.email-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose {
  color: #374151;
}

.prose :deep(h1), 
.prose :deep(h2), 
.prose :deep(h3) {
  color: #1f2937;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
</style>