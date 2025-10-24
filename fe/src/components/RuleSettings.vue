<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2 text-left">{{ lang.rule || '规则管理' }}</h2>
      <p class="text-gray-600 text-sm text-left">创建自动化规则，让邮件管理更高效</p>
    </div>

    <!-- Add Rule Button -->
    <div class="flex justify-start">
      <button 
        @click="showAddDialog = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 inline-flex items-center shadow-sm hover:shadow-md"
      >
        <span class="iconify mr-2 text-xl" data-icon="mdi:plus"></span>
        {{ lang.add_rule || '添加规则' }}
      </button>
    </div>

    <!-- Rules Table -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.rule_name || '规则名称' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.condition || '条件' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.action || '动作' }}</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">{{ lang.status || '状态' }}</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">{{ lang.actions || '操作' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rules.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <span class="iconify text-gray-300 text-6xl mb-4" data-icon="mdi:filter-off"></span>
              <p class="text-gray-500 mt-4">{{ lang.no_rules || '暂无规则' }}</p>
            </td>
          </tr>
          <tr 
            v-else
            v-for="rule in rules" 
            :key="rule.id"
            class="border-t hover:bg-gray-50 transition duration-150"
          >
            <td class="px-6 py-4">
              <div class="font-semibold text-gray-900">{{ rule.name }}</div>
              <div class="text-sm text-gray-600">{{ rule.description }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium">
                <span class="iconify mr-1.5" data-icon="mdi:filter"></span>
                {{ rule.condition }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-xs rounded-lg font-medium">
                <span class="iconify mr-1.5" data-icon="mdi:play"></span>
                {{ rule.action }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button 
                @click="toggleRuleStatus(rule)"
                :class="[
                  'inline-flex items-center px-3 py-1.5 text-xs rounded-lg font-semibold transition duration-200',
                  rule.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <span class="iconify mr-1.5" :data-icon="rule.enabled ? 'mdi:check-circle' : 'mdi:circle-outline'"></span>
                {{ rule.enabled ? (lang.enabled || '启用') : (lang.disabled || '禁用') }}
              </button>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button 
                  @click="editRule(rule)"
                  class="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-200"
                  :title="lang.edit || '编辑'"
                >
                  <span class="iconify" data-icon="mdi:pencil"></span>
                </button>
                <button 
                  @click="deleteRule(rule)"
                  class="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition duration-200"
                  :title="lang.delete || '删除'"
                >
                  <span class="iconify" data-icon="mdi:delete"></span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        </div>

    <!-- Add/Edit Dialog -->
    <div v-if="showAddDialog || showEditDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeDialog"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <h3 class="text-xl font-bold text-gray-900 mb-5 text-left">
          {{ showAddDialog ? (lang.add_rule || '添加规则') : (lang.edit_rule || '编辑规则') }}
        </h3>
        
        <form @submit.prevent="saveRule" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.rule_name || '规则名称' }} <span class="text-red-600">*</span>
            </label>
            <input 
              v-model="ruleForm.name"
              :placeholder="lang.rule_name_placeholder || '请输入规则名称'"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

  <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
              {{ lang.description || '描述' }}
            </label>
            <input 
              v-model="ruleForm.description"
              :placeholder="lang.description_placeholder || '请输入规则描述（可选）'"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
  </div>

          <div class="border-t pt-5">
            <h4 class="font-semibold text-gray-900 mb-4 text-left flex items-center gap-2">
              <span class="iconify text-blue-600" data-icon="mdi:filter"></span>
              {{ lang.condition || '触发条件' }}
            </h4>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
                  {{ lang.condition_type || '条件类型' }} <span class="text-red-600">*</span>
                </label>
                <select 
                  v-model="ruleForm.conditionType"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sender">{{ lang.sender || '发件人包含' }}</option>
                  <option value="subject">{{ lang.subject_contains || '主题包含' }}</option>
                  <option value="body">{{ lang.body_contains || '正文包含' }}</option>
                  <option value="attachment">{{ lang.has_attachment || '含有附件' }}</option>
                </select>
              </div>

              <div v-if="ruleForm.conditionType !== 'attachment'">
                <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
                  {{ lang.condition_value || '匹配内容' }} <span class="text-red-600">*</span>
                </label>
                <input 
                  v-model="ruleForm.conditionValue"
                  :placeholder="lang.condition_value_placeholder || '请输入匹配内容'"
                  :required="ruleForm.conditionType !== 'attachment'"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div class="border-t pt-5">
            <h4 class="font-semibold text-gray-900 mb-4 text-left flex items-center gap-2">
              <span class="iconify text-green-600" data-icon="mdi:play"></span>
              {{ lang.action || '执行动作' }}
            </h4>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
                  {{ lang.action_type || '动作类型' }} <span class="text-red-600">*</span>
                </label>
                <select 
                  v-model="ruleForm.actionType"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="move">{{ lang.move_to_folder || '移动到文件夹' }}</option>
                  <option value="mark_read">{{ lang.mark_as_read || '标记为已读' }}</option>
                  <option value="delete">{{ lang.delete || '删除' }}</option>
                  <option value="forward">{{ lang.forward || '转发' }}</option>
                </select>
              </div>

              <div v-if="ruleForm.actionType === 'move' || ruleForm.actionType === 'forward'">
                <label class="block text-sm font-semibold text-gray-700 mb-2 text-left">
                  {{ ruleForm.actionType === 'move' ? (lang.target_folder || '目标文件夹') : (lang.forward_address || '转发地址') }} <span class="text-red-600">*</span>
                </label>
                <input 
                  v-model="ruleForm.actionValue"
                  :placeholder="ruleForm.actionType === 'move' ? (lang.target_folder_placeholder || '请输入文件夹名称') : (lang.forward_address_placeholder || '请输入转发邮箱地址')"
                  :required="ruleForm.actionType === 'move' || ruleForm.actionType === 'forward'"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <input 
              v-model="ruleForm.enabled"
              type="checkbox"
              id="rule-enabled"
              class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label for="rule-enabled" class="text-sm font-medium text-gray-700 cursor-pointer">
              {{ lang.enable_rule || '启用此规则' }}
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button 
              @click="closeDialog" 
              type="button"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
            >
              {{ lang.cancel || '取消' }}
            </button>
            <button 
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
            >
              {{ lang.save || '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showDeleteDialog = false"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span class="iconify text-red-600 text-2xl" data-icon="mdi:alert-circle"></span>
          </div>
          <h3 class="text-xl font-bold text-gray-900">{{ lang.confirm_delete || '确认删除' }}</h3>
        </div>
        
        <p class="text-gray-600 mb-6 text-left">
          {{ lang.delete_rule_confirm || '确定要删除该规则吗？此操作无法撤销。' }}
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteDialog = false" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.cancel || '取消' }}
          </button>
          <button 
            @click="confirmDelete" 
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            {{ lang.delete || '删除' }}
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

const rules = ref([])
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const currentRule = ref(null)

const ruleForm = reactive({
  name: '',
  description: '',
  conditionType: 'sender',
  conditionValue: '',
  actionType: 'move',
  actionValue: '',
  enabled: true
})

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const loadRules = () => {
  http.post("/api/rule/list").then(res => {
    if (res.errorNo === 0) {
      rules.value = res.data
    }
  })
}

const closeDialog = () => {
  showAddDialog.value = false
  showEditDialog.value = false
  Object.assign(ruleForm, {
    name: '',
    description: '',
    conditionType: 'sender',
    conditionValue: '',
    actionType: 'move',
    actionValue: '',
    enabled: true
  })
  currentRule.value = null
}

const editRule = (rule) => {
  currentRule.value = rule
  Object.assign(ruleForm, {
    name: rule.name,
    description: rule.description || '',
    conditionType: rule.conditionType,
    conditionValue: rule.conditionValue || '',
    actionType: rule.actionType,
    actionValue: rule.actionValue || '',
    enabled: rule.enabled
  })
  showEditDialog.value = true
}

const deleteRule = (rule) => {
  currentRule.value = rule
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  http.post("/api/rule/delete", { id: currentRule.value.id }).then(res => {
    if (res.errorNo === 0) {
      showToast('规则删除成功', 'success')
      loadRules()
    } else {
      showToast(res.errorMsg || '规则删除失败', 'error')
    }
  })
  showDeleteDialog.value = false
  currentRule.value = null
}

const toggleRuleStatus = (rule) => {
  http.post("/api/rule/toggle", { id: rule.id, enabled: !rule.enabled }).then(res => {
    if (res.errorNo === 0) {
      showToast(`规则已${!rule.enabled ? '启用' : '禁用'}`, 'success')
      loadRules()
    } else {
      showToast(res.errorMsg || '操作失败', 'error')
    }
  })
}

const saveRule = () => {
  const endpoint = showAddDialog.value ? "/api/rule/add" : "/api/rule/update"
  const data = showEditDialog.value 
    ? { id: currentRule.value.id, ...ruleForm }
    : ruleForm

  http.post(endpoint, data).then(res => {
    if (res.errorNo === 0) {
      showToast(
        showAddDialog.value ? '规则添加成功' : '规则更新成功',
        'success'
      )
      loadRules()
      closeDialog()
    } else {
      showToast(res.errorMsg || '操作失败', 'error')
    }
  })
}

loadRules()
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
