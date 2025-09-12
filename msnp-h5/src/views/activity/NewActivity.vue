<template>
  <div class="page flex-col">
    <!-- 导航栏 -->
    <!-- <div class="navigation-header flex-col">
      <div class="nav-bar flex-row justify-between">
        <img
          class="back-icon"
          referrerpolicy="no-referrer"
          src="https://cds.taikang.com/mos/prod/11/wfile/SketchPngc63b350d0da0ec17cb082e7f3a6b7489befd9b4233606ede2948c2113e9e3d3f"
          @click="handleBack"
        />
        <span class="nav-title">新建活动</span>
      </div>
    </div> -->
    <NavigationBar title="新建活动" @back="handleBack" />

    <!-- 表单内容 -->
    <div class="form-content">
      <!-- 活动基本信息 -->
      <div class="form-section">
        <ActivityBasicForm ref="activityBasicFormRef" v-model:formData="formData" :editable="true" :show-header="true" :show-extended-fields="true" @form-change="handleFormChange" @branch-selected="handleBranchSelected" @branch-changed="handleBranchChanged" @branch-cleared="handleBranchCleared" />
      </div>

      <!-- 讲师信息 -->
      <div v-if="shouldShowExpertInfo" :key="formData.activeType" class="expert-form-section">
        <div class="section-header">
          <span class="section-title">讲师信息</span>
          <div class="header-divider"></div>
        </div>

        <!-- 每位讲师使用独立的 van-form，避免字段 name 重复导致的校验冲突 -->
        <div v-for="(expert, index) in formData.experts" :key="expert.id" class="expert-section">
          <van-form
            :key="formData.activeType + '-' + expert.id"
            :ref="el => setExpertFormRef(el, index)"
            :show-error="true"
            :show-error-message="true"
            :scroll-to-error="true"
          >
            <component
              :is="isFreeClinic ? FreeClinicExpertForm : ExpertForm"
              :expert="expert"
              :key="formData.activeType + '-' + expert.id"
              :index="index"
              :show-remove="formData.experts.length > 1 && index > 0"
              @update="updateExpert"
              @remove="removeExpert"
            />
          </van-form>
        </div>

        <div class="add-expert-wrapper" :class="{ disabled: !canAddMoreExperts }" @click="addExpert">
          <span class="add-expert-text">+ 继续添加讲师</span>
          <span v-if="!canAddMoreExperts" class="add-expert-tip">（已达上限20人）</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons flex-row justify-between">
      <div class="btn-wrapper btn-save-wrapper">
        <span class="btn-text btn-save-text" @click="handleSave">保存</span>
      </div>
      <div class="btn-wrapper btn-submit-wrapper">
        <span class="btn-text btn-submit-text" @click="handleSubmit">提交</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import NavigationBar from '@/components/base/NavigationBar.vue'
import ActivityBasicForm from '@/components/activity/ActivityBasicForm.vue'
import ExpertForm from '@/components/activity/ExpertForm.vue'
import FreeClinicExpertForm from '@/components/activity/FreeClinicExpertForm.vue'

const router = useRouter()

// 响应式数据
const activityBasicFormRef = ref(null)
const expertFormRefs = ref([])
const setExpertFormRef = (el, index) => {
  if (el) {
    expertFormRefs.value[index] = el
  }
}
const formData = ref({
  branchCode: '',
  subbracnCode: '',
  strategy: '',
  name: '',
  channel: '',
  startTime: '',
  endTime: '',
  category: '',
  healthRelate: '',
  activeVenue: '',
  activeLocation: '',
  hospitalName: '',
  hospitalLevel: '',
  feHospitalId: '',
  location: '',
  detailAddress: '',
  activeType: '',
  heldType: '',
  generateQRCode: '',
  description: '',
  liveLink: '',
  publicRelease: '',
  traditionalMedicine: '',
  experts: []
})

// 计算属性
const shouldShowExpertInfo = computed(() => {
  // 根据活动内容判断是否需要显示讲师信息
  const activeType = formData.value.activeType
  return activeType === 'HEALTH_LECTURE' || activeType === 'FREE_CLINIC'
})

// 讲师上限控制
const MAX_EXPERTS = 20
const canAddMoreExperts = computed(() => (formData.value.experts?.length || 0) < MAX_EXPERTS)

// 是否为义诊，用于切换到 FreeClinicExpertForm（姓名为输入框）
const isFreeClinic = computed(() => formData.value.activeType === 'FREE_CLINIC')

// 判断是否为需要讲师信息的活动类型
const isExpertType = (t) => t === 'HEALTH_LECTURE' || t === 'FREE_CLINIC'

// 生命周期
onMounted(() => {
  // 初始化时如果需要显示讲师信息，则初始化 experts 数组
  if (shouldShowExpertInfo.value && formData.value.experts.length === 0) {
    initializeExperts()
  }
})

// 监听活动类型切换，清空/初始化讲师信息，兼容通过 DevTools 直接修改数据的场景
watch(
  () => formData.value.activeType,
  (nextType, prevType) => {
    if (isExpertType(prevType) && nextType !== prevType) {
      formData.value.experts = []
      expertFormRefs.value = []
    }
    if (isExpertType(nextType) && formData.value.experts.length === 0) {
      initializeExperts()
    }
  }
)

// 方法
const handleBack = () => {
  router.back()
}

const handleFormChange = (newFormData) => {
  // 合并表单数据
  formData.value = { ...formData.value, ...newFormData }

  // 如当前需要展示讲师信息且为空，则初始化一个空专家项
  if (shouldShowExpertInfo.value && formData.value.experts.length === 0) {
    initializeExperts()
  }
}

// 分公司选择事件处理
const handleBranchSelected = (branchData) => {
  console.log('分公司已选择:', branchData)
  showSuccessToast(`已选择分公司: ${branchData.text}`)

  // 可以在这里处理分公司选择后的逻辑
  // 比如清空中支数据，因为分公司变了
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
  if (formData.value.experts.length === 0) {
    formData.value.experts.push({
      id: Date.now(),
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
  if (!canAddMoreExperts.value) {
    showToast('最多添加20位讲师')
    return
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
  formData.value.experts[index] = { ...formData.value.experts[index], ...expertData }
}

const removeExpert = (index) => {
  // 首位讲师不可删除
  if (index === 0) {
    showFailToast('首位讲师不可删除')
    return
  }
  if (formData.value.experts.length > 1) {
    formData.value.experts.splice(index, 1)
  }
}

// 表单提交
const handleSave = async () => {
  const errorMsgs = []

  // 保存草稿：仅校验必填字段 + 已录入的其他字段（不校验未填写的可选项）
  const requiredNames = ['branchCode', 'subbranchCode', 'activeName', 'startTime', 'endTime']
  const optionalMap = [
    { name: 'strategy', key: 'strategy' },
    { name: 'activeChannel', key: 'activeChannel' },
    { name: 'activeCategory', key: 'activeCategory' },
    { name: 'healthRelate', key: 'healthRelate' },
    { name: 'activeVenue', key: 'activeVenue' },
    { name: 'activeLocation', key: 'activeLocation' },
    { name: 'hospitalName', key: 'hospitalName' },
    { name: 'hospitalLevel', key: 'hospitalLevel' },
    { name: 'centerName', key: 'centerName' },
    { name: 'activeVenueDetail', key: 'activeVenueDetail' },
    { name: 'communityName', key: 'communityName' },
    { name: 'location', key: 'location' },
    { name: 'address', key: 'detailAddress' },
    { name: 'activeType', key: 'activeType' },
    { name: 'heldType', key: 'heldType' },
    { name: 'signQrcode', key: 'signQrcode' },
    { name: 'activeRemark', key: 'activeRemark' },
    { name: 'liveUrl', key: 'liveUrl' },
    { name: 'isPublish', key: 'isPublish' },
    { name: 'hasSpecialServer', key: 'hasSpecialServer' },
    { name: 'trialSubbranch', key: 'trialSubbranch' }
  ]

  const namesToValidate = [...requiredNames]
  optionalMap.forEach(({ name, key }) => {
    const v = formData.value?.[key]
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      namesToValidate.push(name)
    }
  })

  // 构建统一的校验 Promise 列表
  const validators = []
  if (activityBasicFormRef.value && typeof activityBasicFormRef.value.validate === 'function') {
    if (namesToValidate.length) {
      validators.push(...namesToValidate.map(n => activityBasicFormRef.value.validate(n)))
    }
  }

  // 讲师“已填写才校验”，一起并行校验
  if (shouldShowExpertInfo.value) {
    const isNonEmpty = (v) => {
      if (v === undefined || v === null) return false
      if (typeof v === 'string') return v.trim() !== ''
      if (Array.isArray(v)) return v.length > 0
      if (typeof v === 'object') return Object.keys(v).length > 0
      return true
    }
    const expertHasAnyInput = (expert) => {
      if (!expert) return false
      const keys = ['photo', 'name', 'title', 'hospital', 'department', 'introduction', 'expertId']
      return keys.some(k => isNonEmpty(expert[k]))
    }

    const experts = Array.isArray(formData.value.experts) ? formData.value.experts : []
    experts.forEach((ex, idx) => {
      if (expertHasAnyInput(ex)) {
        const f = expertFormRefs.value[idx]
        if (f && typeof f.validate === 'function') {
          validators.push(f.validate())
        }
      }
    })
  }

  // 一次性并行校验所有 Promise
  const results = await Promise.allSettled(validators)
  results.forEach(r => {
    if (r.status === 'rejected') {
      const reason = r.reason
      if (Array.isArray(reason)) {
        reason.forEach(err => err?.message && errorMsgs.push(err.message))
      } else if (reason && reason.message) {
        errorMsgs.push(reason.message)
      }
    }
  })

  if (errorMsgs.length) {
    showFailToast(errorMsgs[0])
    return
  }

  // 校验通过：停留当前页，生成草稿
  console.log('Save activity:', formData.value)
  showSuccessToast('保存成功')
}

const handleSubmit = async () => {
  const errorMsgs = []

  // 一次性并行校验：基本信息表单 + 讲师表单（如需）
  const validators = []
  if (activityBasicFormRef.value && typeof activityBasicFormRef.value.validate === 'function') {
    validators.push(activityBasicFormRef.value.validate())
  }
  if (shouldShowExpertInfo.value) {
    const forms = expertFormRefs.value.filter(f => f && typeof f.validate === 'function')
    validators.push(...forms.map(f => f.validate()))
  }

  const results = await Promise.allSettled(validators)
  results.forEach(r => {
    if (r.status === 'rejected') {
      const reason = r.reason
      if (Array.isArray(reason)) {
        reason.forEach(err => err?.message && errorMsgs.push(err.message))
      } else if (reason && reason.message) {
        errorMsgs.push(reason.message)
      }
    }
  })

  if (errorMsgs.length) {
    showFailToast(errorMsgs[0])
    return
  }

  console.log('Submit activity:', formData.value)
  showSuccessToast('提交成功')
}
</script>

<style scoped>
/* 公共样式 */
.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.justify-between {
  justify-content: space-between;
}

/* 页面主容器 */
.page {
  background-color: rgba(241, 243, 246, 1);
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  padding-bottom: 80px;
}

/* 导航栏样式 */
.navigation-header {
  background-color: rgba(255, 255, 255, 1);
  padding: 14px 14px 0 0;
}

.nav-bar {
  width: 224px;
  margin: 12px 137px 0 0;
}

.back-icon {
  width: 40px;
  height: 44px;
  cursor: pointer;
}

.nav-title {
  overflow-wrap: break-word;
  color: rgba(0, 0, 0, 0.9);
  font-size: 18px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  line-height: 18px;
  margin-top: 13px;
}

/* 表单内容 */
.form-content {
  padding: 10px 10px 0 10px;
}

.form-section,
.expert-form-section {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 8px;
  width: 100%;
  align-self: center;
  margin-bottom: 12px;
  overflow: hidden;
}

.expert-form-section {
  margin-top: 14px;
  padding-bottom: 20px;
}

.section-header {
  background: url(https://cds.taikang.com/mos/prod/11/wfile/SketchPnge4edf23d978dd525e4f6bc575b120e6159ead733da65916dbce7fcd01fd5140e)
    100% no-repeat;
  background-size: 100% 100%;
  padding: 18px 15px 0 15px;
}

.section-body {
  padding: 0 15px;
}

.section-title {
  overflow-wrap: break-word;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  line-height: 22px;
  margin-right: 229px;
}

.header-divider {
  background-color: rgba(242, 242, 242, 1);
  width: 100%;
  height: 1px;
  margin-top: 17px;
}

/* 专家相关样式 */
.expert-section {
  border-bottom: 1px solid rgba(242, 242, 242, 1);
  margin-bottom: 16px;
}

.expert-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.add-expert-wrapper {
  border-radius: 4px;
  border: 1px solid rgba(255, 129, 26, 1);
  align-self: center;
  /* width: 100%; */
  box-sizing: border-box;
  padding: 0 15px;
  text-align: center;
  padding: 8px 0;
  margin: 0 15px;
}
.add-expert-wrapper.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.add-expert-text {
  overflow-wrap: break-word;
  color: rgba(255, 129, 26, 1);
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  line-height: 20px;
  cursor: pointer;
}
.add-expert-tip {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

/* 操作按钮 */
.action-buttons {
  box-shadow: 0px -3px 4px 0px rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 1);
  width: 375px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 10px 15px 10px;
}

.btn-wrapper {
  flex: 1;
  margin: 0 5px;
}

.btn-save-wrapper {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  border: 1px solid rgba(255, 129, 26, 1);
  padding: 8px 71px 8px 69px;
}

.btn-submit-wrapper {
  background: url(https://cds.taikang.com/mos/prod/11/wfile/SketchPng62abdbc7045770a0d1f896d0e1c3326a0d10ad342ec89ebca3bfbef110754d32)
    100% no-repeat;
  background-size: 100% 100%;
  padding: 9px 71px 9px 71px;
}

.btn-text {
  overflow-wrap: break-word;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  line-height: 22px;
  cursor: pointer;
}

.btn-save-text {
  color: rgba(255, 129, 26, 1);
}

.btn-submit-text {
  color: rgba(255, 255, 255, 1);
}

.btn-wrapper:active {
  opacity: 0.8;
}
</style>
