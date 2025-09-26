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
    <NavigationBar v-if="!props.hideNav" title="新建活动" @back="handleBack" />

    <!-- 表单内容 -->
    <div class="form-content">
      <!-- 活动基本信息 -->
      <div class="form-section">
        <ActivityBasicForm :key="'basic-' + basicFormRenderKey" ref="activityBasicFormRef" v-model:formData="basicFormModel" :editable="formEditable" :show-header="true" :show-extended-fields="true" @form-change="handleFormChange" @branch-selected="handleBranchSelected" @branch-changed="handleBranchChanged" @branch-cleared="handleBranchCleared" />
      </div>

      <!-- 讲师信息 -->
      <div v-if="shouldShowExpertInfo && renderExperts" :key="formData.activeType + '-' + expertRenderKey" class="expert-form-section">
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
              :show-remove="formEditable && formData.experts.length > 1 && index > 0"
              :editable="formEditable"
              :ref="el => setExpertComponentRef(el, index)"
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
    <!-- 非详情（新建/编辑）模式：显示 保存 / 提交 -->
    <div v-if="!isDetailMode" class="action-buttons flex-row justify-between">
      <div class="btn-wrapper btn-save-wrapper">
        <span class="btn-text btn-save-text" @click="handleSave">保存</span>
      </div>
      <div class="btn-wrapper btn-submit-wrapper">
        <span class="btn-text btn-submit-text" @click="handleSubmit">提交</span>
      </div>
    </div>

    <!-- 详情模式：默认不可编辑，展示“编辑”；点击后进入编辑态，仅展示“保存” -->
    <div v-else class="action-buttons flex-row justify-between">
      <div class="btn-wrapper btn-save-wrapper" v-if="!inPageEditing">
        <span class="btn-text btn-save-text" @click="() => (inPageEditing = true)">编辑</span>
      </div>
      <div class="btn-wrapper btn-save-wrapper" v-else>
        <span class="btn-text btn-save-text" @click="handleDetailSave">保存</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits, defineExpose, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import NavigationBar from '@/components/base/NavigationBar.vue'
import ActivityBasicForm from '@/components/activity/ActivityBasicForm.vue'
import ExpertForm from '@/components/activity/ExpertForm.vue'
import FreeClinicExpertForm from '@/components/activity/FreeClinicExpertForm.vue'

// 作为独立页面或被 ActivityDetail 嵌入时，用于控制是否显示自身导航栏；并根据入口场景决定初始可编辑性
const props = defineProps({
  hideNav: { type: Boolean, default: false },
  // 入口模式：create（新建）、edit（编辑草稿/更新活动）、detail（详情查看）
  entryMode: { type: String, default: 'create' }
})

const emit = defineEmits(['loaded'])

const router = useRouter()
const route = useRoute()
const loading = ref(false)
// 详情模式由入口控制，而不是通过是否有 id
const isDetailMode = computed(() => props.entryMode === 'detail')
// 初始可编辑：create/edit 进入即为可编辑；detail 进入为只读，点击“编辑”后可编辑
const inPageEditing = ref(props.entryMode === 'create' || props.entryMode === 'edit')
const formEditable = computed(() => inPageEditing.value)

// 响应式数据
const activityBasicFormRef = ref(null)
const expertFormRefs = ref([])
const setExpertFormRef = (el, index) => {
  if (el) {
    expertFormRefs.value[index] = el
  }
}
// 捕获子组件实例（用于读取如 hospitalInfoArr 等运行时数据）
const expertComponentRefs = ref([])
const setExpertComponentRef = (el, index) => {
  if (el) {
    expertComponentRefs.value[index] = el
  }
}
// 控制讲师区域重新挂载
const expertRenderKey = ref(0)
const renderExperts = ref(true)
const basicFormRenderKey = ref(0)
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

// 用于 BasicForm 的 v-model，避免覆盖 experts
const basicFormModel = computed({
  get: () => formData.value,
  set: (v) => {
    formData.value = { ...formData.value, ...v, experts: formData.value.experts }
  }
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
onMounted(async () => {
  if (route.params?.id) {
    await loadActivityDetail(route.params.id)
  } else {
    // 初始化时如果需要显示讲师信息，则初始化 experts 数组
    if (shouldShowExpertInfo.value && formData.value.experts.length === 0) {
      initializeExperts()
    }
  }
})

// 监听活动类型切换，清空/初始化讲师信息，兼容通过 DevTools 直接修改数据的场景
watch(
  () => formData.value.activeType,
  async (nextType, prevType) => {
    if (isExpertType(prevType) && nextType !== prevType) {
      // 先卸载讲师区域，避免组件复用
      renderExperts.value = false
      await nextTick()
      // 清空讲师与表单 refs
      formData.value.experts = []
      expertFormRefs.value = []
      expertComponentRefs.value = []
      // 重新初始化（仅当新类型也需要讲师）
      if (isExpertType(nextType)) {
        initializeExperts()
      }
      // 重新挂载讲师区域
      expertRenderKey.value++
      renderExperts.value = true
      return
    }
    // 从非讲师类型切换到需要讲师类型时
    if (!isExpertType(prevType) && isExpertType(nextType)) {
      renderExperts.value = false
      await nextTick()
      if (formData.value.experts.length === 0) {
        initializeExperts()
      }
      expertRenderKey.value++
      renderExperts.value = true
    }
  }
)

// 方法
const scrollToFirstError = async () => {
  await nextTick()
  // 常见的 Vant 错误样式选择器
  const selectors = [
    '.van-field--error',
    '.van-field__error-message',
    '.van-form-item--error',
    '.van-cell--error'
  ]
  let el = null
  for (const sel of selectors) {
    el = document.querySelector(sel)
    if (el) break
  }
  if (el && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
const normalizeExperts = (rawExperts = [], activeType) => {
  return (rawExperts || []).map((e) => ({
    id: e.id || e.expertId || e.doctorId || Date.now() + Math.random(),
    photo: e.photo || e.photoKey,
    photoKey: e.photoKey || e.photo,
    name: e.name || e.doctorName,
    title: e.title || e.titleType,
    titleType: e.titleType || e.title, 
    hospital: e.hospital || e.hospitalName,
    hospitalName: e.hospitalName || e.hospital,
    department: e.department,
    introduction: e.introduction || e.introduce,
    expertId: e.expertId || e.doctorId,
    doctorId: e.doctorId || e.expertId,
    feHospitalId: e.feHospitalId,
    maxNumber: activeType === 'FREE_CLINIC' ? e.maxNumber : undefined
  }))
}

const normalizeActivityToFormData = (raw) => {
  if (!raw) return {}
  // 兼容后端包装结构：activeBaseDetail + activeLecturerList
  const base = raw.activeBaseDetail || raw.base || raw
  const expertsSrc = raw.activeLecturerList || raw.experts || raw.lecturers || raw.expertList || []
  const activeType = base.activeType || base.type
  const experts = normalizeExperts(expertsSrc, activeType)
  return {
    // 基本信息（尽可能覆盖旧/新字段）
    branchCode: base.branchCode || base.branch_code,
    subbracnCode: base.subbranchCode || base.subBranchCode || base.subbracnCode,
    subbranchCode: base.subbranchCode || base.subBranchCode, // 兼容校验名
    strategy: base.strategy,
    name: base.name || base.activeName,
    activeName: base.activeName || base.name, // 兼容校验名
    channel: base.channel || base.activeChannel,
    activeChannel: base.activeChannel || base.channel, // 兼容校验名
    startTime: base.startTime,
    endTime: base.endTime,
    category: base.category || base.activeCategory,
    activeCategory: base.activeCategory || base.category, // 兼容校验名
    healthRelate: base.healthRelate,
    activeVenue: base.activeVenue,
    activeLocation: base.activeLocation,
    hospitalName: base.hospitalName,
    hospitalLevel: base.hospitalLevel,
    feHospitalId: base.feHospitalId,
    centerName: base.centerName,
    activeVenueDetail: base.activeVenueDetail,
    communityName: base.communityName,
    // 位置始终使用编码值（优先区/县，其次市，再其次省；最后兜底后端提供的 location）
    location: base.locationArea || base.locationCity || base.locationProvince || base.location || '',
    detailAddress: base.detailAddress || base.address || base.fullAddress,
    activeType,
    heldType: base.heldType,
    generateQRCode: base.generateQRCode,
    signQrcode: base.signQrcode, // 兼容校验名
    description: base.description || base.activeRemark,
    activeRemark: base.activeRemark || base.description, // 兼容校验名
    liveLink: base.liveLink || base.liveUrl,
    liveUrl: base.liveUrl || base.liveLink, // 兼容校验名
    publicRelease: base.publicRelease || base.isPublish,
    isPublish: base.isPublish || base.publicRelease, // 兼容校验名
    traditionalMedicine: base.traditionalMedicine || base.hasSpecialServer,
    hasSpecialServer: base.hasSpecialServer || base.traditionalMedicine, // 兼容校验名

    // 讲师
    experts
  }
}

// 清空讲师表单的校验提示（逐个调用 resetValidation；不支持则重挂载讲师区域）
const resetExpertFormsValidation = async () => {
  await nextTick()
  const forms = Array.isArray(expertFormRefs.value) ? expertFormRefs.value : []
  let didReset = false
  for (const f of forms) {
    if (f && typeof f.resetValidation === 'function') {
      try { f.resetValidation(); didReset = true } catch (e) {}
    }
  }
  if (!didReset) {
    // 兜底：强制重新挂载讲师区域
    renderExperts.value = false
    await nextTick()
    expertRenderKey.value++
    renderExperts.value = true
  }
}

const loadActivityDetail = async (id) => {
  loading.value = true
  try {
    // TODO: 用真实 API 替换示例 fetch
    const res = await fetch(`/api/activities/${id}`)
    if (!res.ok) throw new Error('Network error')
    const envelope = await res.json()
    const payload = envelope?.data || envelope
    const normalized = normalizeActivityToFormData(payload)
    // 一次性合并，避免触发 watch 时 experts 被初始化为空
    formData.value = { ...formData.value, ...normalized }
    // 通知父级已加载原始详情数据（用于父级决定导航右侧按钮显示等）
    emit('loaded', payload)
    // 数据灌入完成后，清空一次页面上的校验提示，后续仍按正常校验
    await nextTick()
    await resetFieldsValidation()
    // 同步清理所有讲师子表单的校验提示
    await resetExpertFormsValidation()
  } catch (e) {
    console.error('加载活动详情失败:', e)
    showFailToast('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const resetFieldsValidation = async (names = []) => {
  await nextTick()
  const f = activityBasicFormRef.value
  if (!f) {
    // 无法拿到表单实例，直接通过重挂载清理
    basicFormRenderKey.value++
    return
  }
  if (typeof f.resetValidation === 'function') {
    try {
      names.length ? f.resetValidation(names) : f.resetValidation()
      return
    } catch (e) {
      // 调用失败则退回重挂载
    }
  }
  // 未暴露 resetValidation 或调用失败，使用重挂载清理错误展示
  basicFormRenderKey.value++
}

const handleFormChange = () => {
  // 依赖 v-model:formData 的 basicFormModel 同步，这里不再合并，
  // 仅做兜底初始化讲师信息
  const experts = formData.value && Array.isArray(formData.value.experts) ? formData.value.experts : []
  if (shouldShowExpertInfo.value && experts.length === 0) {
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
const generateExpertId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`
const initializeExperts = () => {
  if (formData.value.experts.length === 0) {
    // 直接替换数组，确保触发渲染
    formData.value.experts = [
      {
        id: generateExpertId(),
        photo: '',
        name: '',
        title: '',
        titleType: '',
        hospital: '',
        department: '',
        introduction: ''
      }
    ]
  }
}

// 讲师管理
const addExpert = () => {
  if (!formEditable.value) {
    showToast('请先点击编辑再进行修改')
    return
  }
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

// 构建用于保存的讲师列表（仿照旧项目 saveBtnCheckLectureList，并做了通用优化）
const buildExpertsForSave = () => {
  const result = []
  const type = formData.value.activeType
  const isLecture = type === 'HEALTH_LECTURE'
  const isFreeClinicType = type === 'FREE_CLINIC'
  const experts = Array.isArray(formData.value.experts) ? formData.value.experts : []

  // 判断是否有内容的字段集合（兼容新老字段）
  const baseCheckKeys = ['name', 'title', 'titleType', 'department', 'hospital', 'hospitalName', 'introduction', 'introduce', 'photo', 'photoKey', 'expertId', 'doctorId', 'feHospitalId']
  const freeClinicExtraKeys = ['maxNumber']
  const checkKeys = isFreeClinicType ? baseCheckKeys.concat(freeClinicExtraKeys) : baseCheckKeys

  const isNonEmpty = (v) => {
    if (v === undefined || v === null) return false
    if (typeof v === 'string') return v.trim() !== ''
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.keys(v).length > 0
    return true
  }
  const hasAnyInput = (item) => checkKeys.some(k => isNonEmpty(item?.[k]))

  const stripPhotoKey = (val) => {
    if (!val) return val
    // 保留最后一个路径段作为 key
    try {
      const s = String(val)
      if (s.includes('://')) {
        const parts = s.split('/')
        return parts[parts.length - 1] || s
      }
      return s
    } catch (e) {
      return val
    }
  }

  experts.forEach((raw, index) => {
    const item = { ...raw }
    if (!hasAnyInput(item)) return

    // 处理医院映射：当不存在专家/医生 id 时，根据选择的医院 id 补齐显示名与 feHospitalId
    const comp = expertComponentRefs.value?.[index]
    const hospitalInfoArr = (comp && (comp.hospitalInfoArr || comp.hospitalOptions)) || []
    const currentHospitalKey = item.hospital || item.hospitalName || item.feHospitalId
    const findHospitalInfo = hospitalInfoArr.find(h => h?.hospitalLicId === currentHospitalKey)
    if (!item.expertId && !item.doctorId && findHospitalInfo) {
      item.feHospitalId = findHospitalInfo.hospitalLicId
      item.hospitalName = findHospitalInfo.hospitalName
    }

    // 处理图片 key：尽量输出 photoKey（后端多用 key），并去掉 CDN 前缀
    if (item.photoKey) {
      item.photoKey = stripPhotoKey(item.photoKey)
    } else if (item.photo) {
      item.photoKey = stripPhotoKey(item.photo)
    }

    result.push(item)
  })

  return result
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
  // 调试信息：打印需要校验的字段名和校验器数量
  console.log('需要校验的字段名:', namesToValidate)
  console.log('校验器数量:', validators.length)

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
    await scrollToFirstError()
    return
  }

  // 构建讲师保存列表：仅保留“有值”的讲师并清洗字段
  const expertsForSave = shouldShowExpertInfo.value ? buildExpertsForSave() : []

  // 生成保存载荷，不改动界面上的原始表单状态
  const payload = { ...formData.value, experts: expertsForSave }

  // 校验通过：停留当前页，生成草稿
  console.log('Save activity payload:', payload)
  showSuccessToast('保存成功')
}

// 详情模式保存：与草稿保存相同校验/清洗逻辑，成功后退出编辑态
const handleDetailSave = async () => {
  const errorMsgs = []

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

  const validators = []
  if (activityBasicFormRef.value && typeof activityBasicFormRef.value.validate === 'function') {
    if (namesToValidate.length) {
      validators.push(...namesToValidate.map(n => activityBasicFormRef.value.validate(n)))
    }
  }

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
    await scrollToFirstError()
    return
  }

  const expertsForSave = shouldShowExpertInfo.value ? buildExpertsForSave() : []
  const payload = { ...formData.value, experts: expertsForSave }

  console.log('Detail save payload:', payload)
  showSuccessToast('保存成功')
  inPageEditing.value = false
}

const handleSubmit = async (silent = false) => {
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
    await scrollToFirstError()
    return false
  }

  console.log('Submit activity:', formData.value)
  if (!silent) showSuccessToast('提交成功')
  return true
}
defineExpose({
  submit: handleSubmit,
  save: handleDetailSave,
  setEditing: (v) => (inPageEditing.value = !!v),
  get isEditing() { return inPageEditing.value }
})
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
