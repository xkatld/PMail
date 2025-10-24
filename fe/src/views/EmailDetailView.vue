<template>
  <div class="flex flex-col px-5 py-4 text-left">
    <div class="text-4xl font-bold mb-4">{{ detailData.subject }}</div>
    
    <div class="border-t border-gray-300 my-4"></div>

    <div class="space-y-3 mb-4">
      <div class="flex items-center">
        <span class="font-semibold mr-2">{{ lang.to }}：</span>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="to in tos" 
            :key="to.EmailAddress"
            :title="to.EmailAddress"
            class="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
          >
            {{ to.Name !== '' ? to.Name : to.EmailAddress }}
          </span>
        </div>
      </div>

      <div v-if="showCC" class="flex items-center">
        <span class="font-semibold mr-2">{{ lang.cc }}：</span>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="item in ccs" 
            :key="item.EmailAddress"
            :title="item.EmailAddress"
            class="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
          >
            {{ item.Name !== '' ? item.Name : item.EmailAddress }}
          </span>
        </div>
      </div>

      <div class="flex items-center">
        <span class="font-semibold mr-2">{{ lang.sender }}：</span>
        <span 
          :title="detailData.from_address"
          class="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
        >
          {{ detailData.from_name !== '' ? detailData.from_name : detailData.from_address }}
        </span>
      </div>

      <div>
        <span class="font-semibold mr-2">{{ lang.date }}：</span>
        <span>{{ detailData.send_date }}</span>
      </div>
    </div>

    <div class="border-t border-gray-300 my-4"></div>

    <div class="content text-base leading-relaxed" v-if="detailData.html === ''">
      <pre class="whitespace-pre-wrap font-sans">{{ detailData.text }}</pre>
    </div>

    <div class="content" v-else v-html="detailData.html"></div>

    <div v-if="detailData.attachments && detailData.attachments.length > 0" class="mt-6">
      <div class="border-t border-gray-300 my-4"></div>
      <div class="font-semibold mb-3">{{ lang.attachment }}：</div>
      <div class="space-y-2">
        <a 
          v-for="item in detailData.attachments" 
          :key="item.Index"
          :href="'/attachments/download/' + detailData.id + '/' + item.Index"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition no-underline text-gray-800"
        >
          <span class="iconify text-xl" data-icon="mdi:file-document"></span>
          <span>{{ item.Filename }}</span>
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
a, a:link, a:visited, a:hover, a:active {
  text-decoration: none;
  color: inherit;
}
</style>
