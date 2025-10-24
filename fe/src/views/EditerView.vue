<template>
  <div class="bg-white min-h-full p-8">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6 text-left">{{ lang.compose || '撰写邮件' }}</h1>
      
      <form @submit.prevent="send" class="space-y-5">
        <!-- Sender Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.sender }}</label>
          <div class="relative">
            <div 
              @click="showSenderPopover = !showSenderPopover"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 flex items-center bg-white"
            >
              <span class="iconify mr-2 text-gray-500" data-icon="mdi:account-circle"></span>
              <span class="font-semibold text-gray-900">{{ ruleForm.nickName }}</span>
              <span class="text-gray-600 ml-2">&lt;{{ ruleForm.sender }}@{{ ruleForm.pickDomain }}&gt;</span>
              <span class="iconify ml-auto text-gray-400" data-icon="mdi:chevron-down"></span>
            </div>
            
            <!-- Sender Popover -->
            <div v-if="showSenderPopover" class="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-2xl p-5">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.sender }}</label>
                  <div class="flex items-center gap-2">
                    <input 
                      v-model="ruleForm.sender" 
                      :disabled="!(globalStatus.userInfos.is_admin)"
                      :placeholder="lang.sender_desc"
                      class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <span class="text-gray-600 font-semibold">@</span>
                    <select 
                      v-model="ruleForm.pickDomain"
                      class="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option v-for="item in ruleForm.domains" :key="item" :value="item">{{ item }}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.nick_name }}</label>
                  <input 
                    v-model="ruleForm.nickName"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <button 
                @click="showSenderPopover = false"
                type="button"
                class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-200"
              >
                {{ lang.confirm || '确定' }}
              </button>
            </div>
          </div>
          <span v-if="errors.sender" class="text-red-600 text-sm mt-1 block text-left">{{ errors.sender }}</span>
        </div>

        <!-- To Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.to }}</label>
          <div class="border border-gray-300 rounded-lg p-3 min-h-[50px] flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <span 
              v-for="(receiver, index) in ruleForm.receivers" 
              :key="index"
              class="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              <span class="iconify mr-1.5" data-icon="mdi:email"></span>
              {{ receiver }}
              <button @click="removeReceiver(index)" type="button" class="ml-2 hover:text-blue-600">
                <span class="iconify" data-icon="mdi:close"></span>
              </button>
            </span>
            <input 
              v-model="receiverInput"
              @keydown.enter.prevent="addReceiver"
              @keydown.comma.prevent="addReceiver"
              :placeholder="lang.to_desc"
              class="flex-1 min-w-[200px] outline-none px-2 py-1.5"
            />
          </div>
          <span v-if="errors.receivers" class="text-red-600 text-sm mt-1 block text-left">{{ errors.receivers }}</span>
        </div>

        <!-- CC Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.cc }}</label>
          <div class="border border-gray-300 rounded-lg p-3 min-h-[50px] flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <span 
              v-for="(cc, index) in ruleForm.cc" 
              :key="index"
              class="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {{ cc }}
              <button @click="removeCC(index)" type="button" class="ml-2 hover:text-gray-900">
                <span class="iconify" data-icon="mdi:close"></span>
              </button>
            </span>
            <input 
              v-model="ccInput"
              @keydown.enter.prevent="addCC"
              @keydown.comma.prevent="addCC"
              :placeholder="lang.cc_desc"
              class="flex-1 min-w-[200px] outline-none px-2 py-1.5"
            />
          </div>
          <span v-if="errors.cc" class="text-red-600 text-sm mt-1 block text-left">{{ errors.cc }}</span>
        </div>

        <!-- BCC Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.bcc }}</label>
          <div class="border border-gray-300 rounded-lg p-3 min-h-[50px] flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
            <span 
              v-for="(bcc, index) in ruleForm.bcc" 
              :key="index"
              class="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {{ bcc }}
              <button @click="removeBCC(index)" type="button" class="ml-2 hover:text-gray-900">
                <span class="iconify" data-icon="mdi:close"></span>
              </button>
            </span>
            <input 
              v-model="bccInput"
              @keydown.enter.prevent="addBCC"
              @keydown.comma.prevent="addBCC"
              :placeholder="lang.bcc_desc"
              class="flex-1 min-w-[200px] outline-none px-2 py-1.5"
            />
          </div>
          <span v-if="errors.bcc" class="text-red-600 text-sm mt-1 block text-left">{{ errors.bcc }}</span>
        </div>

        <!-- Subject Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.title }}</label>
          <input 
            v-model="ruleForm.subject"
            :placeholder="lang.title"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span v-if="errors.subject" class="text-red-600 text-sm mt-1 block text-left">{{ errors.subject }}</span>
        </div>

        <!-- Editor -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">{{ lang.content || '邮件内容' }}</label>
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <Toolbar class="border-b border-gray-200" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"/>
            <Editor style="height: 400px;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated"/>
          </div>
        </div>

        <!-- File List -->
        <div v-if="fileList.length > 0" class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center mb-3">
            <span class="iconify mr-2 text-gray-700" data-icon="mdi:paperclip"></span>
            <span class="font-semibold text-gray-900">附件 ({{ fileList.length }})</span>
          </div>
          <div class="space-y-2">
            <div 
              v-for="(item, index) in fileList" 
              :key="index"
              class="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="iconify text-blue-600" data-icon="mdi:file-document"></span>
                </div>
                <span class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</span>
              </div>
              <button 
                @click="delFile(index)" 
                type="button" 
                class="flex-shrink-0 text-red-600 hover:text-red-700 ml-3"
              >
                <span class="iconify text-xl" data-icon="mdi:close-circle"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4 border-t">
          <button 
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 inline-flex items-center shadow-md hover:shadow-lg"
          >
            <span class="iconify mr-2 text-xl" data-icon="mdi:send"></span>
            {{ lang.send }}
          </button>
          
          <button 
            @click="upload" 
            type="button"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition duration-200 inline-flex items-center"
          >
            <span class="iconify mr-2 text-xl" data-icon="mdi:attachment"></span>
            {{ lang.add_att }}
          </button>
          <input v-show="false" ref="fileRef" type="file" @change="fileChange">
        </div>
      </form>

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
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import {onBeforeUnmount, reactive, ref, shallowRef} from 'vue'
import lang from '../i18n/i18n';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {i18nChangeLanguage} from '@wangeditor/editor'
import {useRouter} from 'vue-router';
import {http} from "@/utils/axios";
import useGroupStore from '../stores/group'
import {useGlobalStatusStore} from "@/stores/useGlobalStatusStore";

const router = useRouter();
const groupStore = useGroupStore()
const globalStatus = useGlobalStatusStore();

if (lang.lang === "zhCn") {
  i18nChangeLanguage('zh-CN')
} else {
  i18nChangeLanguage('en')
}

const valueHtml = ref('<p>hello</p>')
const toolbarConfig = {}
const editorConfig = {
  MENU_CONF: {},
  placeholder: ''
}

editorConfig.MENU_CONF['uploadImage'] = {
  base64LimitSize: 100 * 1024 * 1024 * 1024,
}

const mode = ref()
const fileRef = ref();
const showSenderPopover = ref(false)
const receiverInput = ref('')
const ccInput = ref('')
const bccInput = ref('')
const errors = reactive({
  sender: '',
  receivers: '',
  cc: '',
  bcc: '',
  subject: ''
})
const toastMessage = ref('')
const toastType = ref('success')

const ruleForm = reactive({
  nickName: '',
  sender: '',
  receivers: [],
  cc: [],
  bcc: [],
  subject: '',
  domains: [],
  pickDomain: ""
})

const fileList = reactive([]);

const init = function () {
  if (Object.keys(globalStatus.userInfos) == 0 || globalStatus.userInfos === null || globalStatus.userInfos == undefined) {
    globalStatus.init(() => {
      ruleForm.sender = globalStatus.userInfos.account
      ruleForm.domains = globalStatus.userInfos.domains
      ruleForm.pickDomain = globalStatus.userInfos.domains[0]
      ruleForm.nickName = globalStatus.userInfos.name
    })
  } else {
    ruleForm.sender = globalStatus.userInfos.account
    ruleForm.domains = globalStatus.userInfos.domains
    ruleForm.pickDomain = globalStatus.userInfos.domains[0]
    ruleForm.nickName = globalStatus.userInfos.name
  }
}
init()

const checkEmail = function (str) {
  const re = /.+@.+\..+/;
  return re.test(str);
}

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const addReceiver = () => {
  if (receiverInput.value.trim()) {
    ruleForm.receivers.push(receiverInput.value.trim())
    receiverInput.value = ''
  }
}

const removeReceiver = (index) => {
  ruleForm.receivers.splice(index, 1)
}

const addCC = () => {
  if (ccInput.value.trim()) {
    ruleForm.cc.push(ccInput.value.trim())
    ccInput.value = ''
  }
}

const removeCC = (index) => {
  ruleForm.cc.splice(index, 1)
}

const addBCC = () => {
  if (bccInput.value.trim()) {
    ruleForm.bcc.push(bccInput.value.trim())
    bccInput.value = ''
  }
}

const removeBCC = (index) => {
  ruleForm.bcc.splice(index, 1)
}

const validate = () => {
  errors.sender = ''
  errors.receivers = ''
  errors.cc = ''
  errors.bcc = ''
  errors.subject = ''

  if (typeof ruleForm.sender === "undefined" || ruleForm.sender === null || ruleForm.sender.trim() === "") {
    errors.sender = lang.err_sender_must
    return false
  }
  if (ruleForm.sender.includes("@")) {
    errors.sender = lang.only_prefix
    return false
  }

  for (let element of ruleForm.receivers) {
    if (!checkEmail(element)) {
      errors.receivers = lang.err_email_format
      return false
    }
  }

  for (let element of ruleForm.cc) {
    if (!checkEmail(element)) {
      errors.cc = lang.err_email_format
      return false
    }
  }

  for (let element of ruleForm.bcc) {
    if (!checkEmail(element)) {
      errors.bcc = lang.err_email_format
      return false
    }
  }

  if (!ruleForm.subject || ruleForm.subject.trim() === '') {
    errors.subject = lang.err_title_must
    return false
  }

  return true
}

const editorRef = shallowRef()

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}

const send = function () {
  if (!validate()) {
    return
  }

  let objectTos = []
  for (let element of ruleForm.receivers) {
    objectTos.push({
      name: "",
      email: element
    })
  }

  let objectCcs = []
  for (let element of ruleForm.cc) {
    objectCcs.push({
      name: "",
      email: element
    })
  }

  let objectBccs = []
  for (let element of ruleForm.bcc) {
    objectBccs.push({
      name: "",
      email: element
    })
  }

  let text = editorRef.value.getText()

  http.post("/api/email/send", {
    from: {name: ruleForm.nickName, email: ruleForm.sender + "@" + ruleForm.pickDomain},
    to: objectTos,
    cc: objectCcs,
    bcc: objectBccs,
    subject: ruleForm.subject,
    text: text,
    html: valueHtml.value,
    attrs: fileList
  }).then(res => {
    if (res.errorNo === 0) {
      showToast(lang.succ_send, 'success')
      groupStore.name = lang.outbox
      groupStore.tag = '{"type":1,"status":-1}'
      router.replace({
        name: 'list',
      })
    } else {
      showToast(res.data, 'error')
    }
  })
}

const upload = function () {
  fileRef.value.dispatchEvent(new MouseEvent('click'))
}

const fileChange = function (e) {
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      fileList.push({
        name: files[i].name,
        data: this.result
      })
    };
    reader.readAsDataURL(files[i]);
  }
}

const delFile = function (index) {
  fileList.splice(index, 1);
}
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
