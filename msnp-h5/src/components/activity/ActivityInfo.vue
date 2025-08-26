<template>
  <div class="activity-info">
    <!-- 活动基本信息表单 -->
    <ActivityBasicForm ref="activityBasicFormRef" v-model:formData="formData" :editable="editable" :show-header="true" :show-extended-fields="true" :location-config="locationConfig" @branch-selected="handleBranchSelected" @branch-changed="handleBranchChanged" @branch-cleared="handleBranchCleared" />

    <!-- 讲师信息 -->
    <div v-if="shouldShowExpertInfo" class="expert-info-section">
      <div class="section-header">
        <span class="section-title">讲师信息</span>
        <div class="header-divider"></div>
      </div>

      <div v-for="(expert, index) in formData.experts" :key="index" class="expert-section">
        <ExpertForm :expert="expert" :index="index" @update="updateExpert" @remove="removeExpert" :show-remove="editable && formData.experts && formData.experts.length > 1" />
      </div>

      <div v-if="editable" class="add-expert-wrapper">
        <span class="add-expert-text" @click="addExpert">+ 继续添加讲师</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons" v-if="editable">
      <button class="btn btn-cancel" @click="handleCancel">
        取消
      </button>
      <button class="btn btn-save" @click="handleSave">
        保存
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import ActivityBasicForm from '@/components/activity/ActivityBasicForm.vue'
import ExpertForm from '@/components/activity/ExpertForm.vue'

// 定义 props
const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

// 定义 emits
const emit = defineEmits(['cancel', 'save'])

// 响应式数据
const activityBasicFormRef = ref(null)
const formData = ref({ ...props.activity })
const locationConfig = ref({
  type: 'select',
  placeholder: '请选择',
  disabled: false
})

// 计算属性
const shouldShowExpertInfo = computed(() => {
  // 根据活动内容判断是否需要显示讲师信息
  const content = formData.value.content
  return content === '健康讲座' || content === '义诊'
})

// 监听器
watch(() => props.activity, (newVal) => {
  formData.value = { ...newVal }
  // 确保 experts 数组存在
  if (shouldShowExpertInfo.value && (!formData.value.experts || formData.value.experts.length === 0)) {
    initializeExperts()
  }
}, { deep: true })

watch(() => props.editable, (newVal) => {
  if (newVal) {
    formData.value = { ...props.activity }
    // 确保 experts 数组存在
    if (shouldShowExpertInfo.value && (!formData.value.experts || formData.value.experts.length === 0)) {
      initializeExperts()
    }
  }
})

// 生命周期
onMounted(() => {
  // 初始化时确保 experts 数组存在
  if (shouldShowExpertInfo.value && (!formData.value.experts || formData.value.experts.length === 0)) {
    initializeExperts()
  }
})

// 方法
const handleFormChange = (newFormData) => {
  formData.value = { ...formData.value, ...newFormData }
  // 如果活动内容变化，需要检查是否需要初始化讲师信息
  if (shouldShowExpertInfo.value && (!formData.value.experts || formData.value.experts.length === 0)) {
    initializeExperts()
  }
}

// 分公司选择事件处理
const handleBranchSelected = (branchData) => {
  console.log('分公司已选择:', branchData)
  showSuccessToast(`已选择分公司: ${branchData.text}`)

  // 清空中支数据，因为分公司变了
  formData.value.department = ''

  // 可以触发加载该分公司下的中支数据
  loadDepartmentsByBranch(branchData.value)
}

// 分公司变更事件处理
const handleBranchChanged = (branchCode) => {
  console.log('分公司已变更，代码:', branchCode)
  // 这里可以处理分公司变更后的逻辑
  // 比如重新加载相关数据
}

// 分公司清空事件处理
const handleBranchCleared = () => {
  console.log('分公司已清空')
  // 清空中支数据
  formData.value.department = ''
}

// 根据分公司加载中支数据
const loadDepartmentsByBranch = async (branchCode) => {
  try {
    // 这里可以调用API加载该分公司下的中支数据
    console.log(`正在加载分公司 ${branchCode} 下的中支数据...`)

    // 模拟API调用
    // const response = await api.getDepartmentsByBranch(branchCode)
    // 更新中支数据

  } catch (error) {
    console.error('加载中支数据失败:', error)
    showFailToast('加载中支数据失败')
  }
}

// 初始化讲师信息
const initializeExperts = () => {
  if (!formData.value.experts) {
    formData.value.experts = []
  }
  if (formData.value.experts.length === 0) {
    formData.value.experts.push({
      id: 1,
      photo: '',
      name: '',
      title: '',
      hospital: '',
      department: '',
      introduction: ''
    })
  }
}

// 讲师管理
const addExpert = () => {
  if (!formData.value.experts) {
    formData.value.experts = []
  }
  const newExpert = {
    id: Date.now(),
    photo: '',
    name: '',
    title: '',
    hospital: '',
    department: '',
    introduction: ''
  }
  formData.value.experts.push(newExpert)
}

const updateExpert = (index, expertData) => {
  if (formData.value.experts && formData.value.experts[index]) {
    formData.value.experts[index] = { ...formData.value.experts[index], ...expertData }
  }
}

const removeExpert = (index) => {
  if (formData.value.experts && formData.value.experts.length > 1) {
    formData.value.experts.splice(index, 1)
  }
}

const handleCancel = () => {
  formData.value = { ...props.activity }
  emit('cancel')
}

const handleSave = async () => {
  try {
    await activityBasicFormRef.value?.validate?.()
  } catch (e) {
    const first = Array.isArray(e) ? e[0] : null
    if (first && first.message) showFailToast(first.message)
    return
  }
  emit('save', formData.value)
}
</script>

<style scoped>
.activity-info {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  padding: 16px 15px 8px 15px;
}

.section-body {
  padding: 0 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.header-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin-top: 8px;
}

.form-section {
  padding: 0;
}

.map-placeholder {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
}

.map-image {
  width: 100px;
  height: 100px;
  opacity: 0.3;
}

.action-buttons {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-family: 'PingFang SC', sans-serif;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666666;
}

.btn-save {
  background-color: #ff811a;
  color: #ffffff;
}

.btn:active {
  opacity: 0.8;
}

/* 讲师信息相关样式 */
.expert-info-section {
  background-color: #ffffff;
  border-radius: 8px;
  margin-top: 12px;
  overflow: hidden;
}

.expert-section {
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 16px;
}

.expert-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.add-expert-wrapper {
  border-radius: 4px;
  border: 1px solid #ff811a;
  margin: 0 15px;
  padding: 8px 0;
  text-align: center;
}

.add-expert-text {
  color: #ff811a;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  line-height: 20px;
  cursor: pointer;
}
</style>
