<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- 邮件头部卡片 -->
    <div class="max-w-5xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <!-- 标题 -->
        <div class="p-8 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-200">
          <h1 class="text-3xl font-bold text-gray-800 flex items-start space-x-3">
            <Icon icon="solar:letter-opened-bold-duotone" class="text-primary-500 text-4xl flex-shrink-0 mt-1" />
            <span>{{ detailData.subject }}</span>
          </h1>
        </div>

        <!-- 邮件元信息 -->
        <div class="p-6 space-y-4 bg-white">
          <!-- 发件人 -->
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {{ (detailData.from_name || detailData.from_address)[0]?.toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">{{ lang.sender }}</span>
              </div>
              <el-tooltip class="box-item" effect="dark" :content="detailData.from_address" placement="top">
                <div class="font-semibold text-gray-800">
                  {{ detailData.from_name !== '' ? detailData.from_name : detailData.from_address }}
                </div>
              </el-tooltip>
            </div>
            <div class="flex items-center space-x-2 text-gray-500">
              <Icon icon="solar:calendar-mark-bold-duotone" class="text-primary-500" />
              <span class="text-sm">{{ detailData.send_date }}</span>
            </div>
          </div>

          <el-divider class="my-4" />

          <!-- 收件人 -->
          <div class="flex items-start space-x-3">
            <Icon icon="solar:user-bold-duotone" class="text-gray-400 text-xl mt-1 flex-shrink-0" />
            <div class="flex-1">
              <span class="text-sm text-gray-500">{{ lang.to }}:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                <el-tooltip v-for="to in tos" :key="to" class="box-item" effect="dark" :content="to.EmailAddress" placement="top">
                  <span class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {{ to.Name !== '' ? to.Name : to.EmailAddress }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>

          <!-- 抄送 -->
          <div v-if="showCC" class="flex items-start space-x-3">
            <Icon icon="solar:copy-bold-duotone" class="text-gray-400 text-xl mt-1 flex-shrink-0" />
            <div class="flex-1">
              <span class="text-sm text-gray-500">{{ lang.cc }}:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                <el-tooltip v-for="item in ccs" :key="item" class="box-item" effect="dark" :content="item.EmailAddress" placement="top">
                  <span class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {{ item.Name !== '' ? item.Name : item.EmailAddress }}
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 邮件内容卡片 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div class="prose max-w-none">
          <div v-if="detailData.html === ''" class="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ detailData.text }}
          </div>
          <div v-else class="email-content" v-html="detailData.html"></div>
        </div>
      </div>

      <!-- 附件卡片 -->
      <div v-if="detailData.attachments.length > 0" class="bg-white rounded-2xl shadow-lg p-6">
        <div class="flex items-center space-x-2 mb-4">
          <Icon icon="solar:paperclip-bold-duotone" class="text-primary-500 text-2xl" />
          <h3 class="text-lg font-semibold text-gray-800">{{ lang.attachment }}</h3>
          <span class="text-sm text-gray-500">({{ detailData.attachments.length }})</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a 
            v-for="item in detailData.attachments" 
            :key="item"
            :href="'/attachments/download/' + detailData.id + '/' + item.Index"
            class="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl transition-all duration-200 group no-underline"
          >
            <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:document-text-bold" class="text-white text-2xl" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-800 truncate group-hover:text-primary-600 transition-colors">
                {{ item.Filename }}
              </div>
              <div class="text-xs text-gray-500">点击下载</div>
            </div>
            <Icon icon="solar:download-bold" class="text-gray-400 group-hover:text-primary-600 text-xl transition-colors" />
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
  margin-bottom: 1rem;
  line-height: 1.75;
}

.email-content :deep(a) {
  color: #0ea5e9;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.email-content :deep(a:hover) {
  color: #0284c7;
}

.email-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.email-content :deep(blockquote) {
  border-left: 4px solid #0ea5e9;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #64748b;
  font-style: italic;
}

.email-content :deep(pre) {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
}

.email-content :deep(code) {
  background-color: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* Prose 样式优化 */
.prose {
  color: #374151;
}

.prose :deep(h1), 
.prose :deep(h2), 
.prose :deep(h3) {
  color: #1f2937;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>