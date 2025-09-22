<template>
  <div class="expert-form">
    <!-- 照片上传（封装为组件，使用 Vant Uploader） -->
    <ExpertPhotoUploader
      v-model="localExpert.photo"
      :editable="editable"
      :preview-base-url="PREVIEW_BASE"
      @update:modelValue="handleUpdate"
      @upload-start="onPhotoUploadStart"
      @upload-success="onPhotoUploadDone"
      @upload-error="onPhotoUploadDone"
    />

    <!-- 模式切换：选择讲师 / 手动录入 -->

    <!-- 基本信息 -->
    <div class="info-section">
      <ExpertSearchPicker
        v-model:modelValue="localExpert.name"
        v-model:selectedExpertId="localExpert.id"
        :editable="editable && !isPhotoUploading"
        :allow-custom="isManual"
        :rules="expertRules.doctorName"
        @expert-selected="onExpertSelected"
        @search-cleared="onNameSearchCleared"
      />

      <FormField
        label="职称"
        :required="true"
        type="select"
        v-model="localExpert.title"
        placeholder="请选择"
        name="titleType"
        :rules="expertRules.titleType"
        :disabled="!editable || disableTitle"
        @select-click="openTitlePicker"
      />

      <!-- 医院：仅展示/选择医院名称（无级别与FE编码）；选择系统讲师时只读展示 -->
      <template v-if="isManual">
        <HospitalNameOnlyPicker
          v-model="localExpert.hospital"
          :editable="!disableHospital"
          :rules="expertRules.hospitalName"
          @hospital-selected="handleUpdate"
        />
      </template>
      <template v-else>
        <FormField
          label="医院"
          :required="true"
          type="input"
          v-model="localExpert.hospital"
          placeholder="请输入或选择"
          name="hospitalName"
          :rules="expertRules.hospitalName"
          :disabled="true"
          @input="handleUpdate"
        />
      </template>

      <FormField
        label="科室"
        type="input"
        v-model="localExpert.department"
        placeholder="请输入"
        name="department"
        :rules="expertRules.department"
        :disabled="disableDepartment"
        @input="handleUpdate"
      />

      <FormField
        label="介绍"
        type="textarea"
        v-model="localExpert.introduction"
        placeholder="请输入"
        :max-length="200"
        :rows="4"
        :show-divider="false"
        name="introduce"
        :rules="expertRules.introduce"
        :disabled="disableIntroduction"
        @input="handleUpdate"
      />

      <!-- 职称选择弹窗 -->
      <van-popup v-model:show="showTitlePopup" position="bottom" round>
        <van-picker
          :columns="titleOptions"
          @confirm="onTitleConfirm"
          @cancel="() => (showTitlePopup = false)"
          :default-index="titleDefaultIndex"
          title="选择职称"
        />
      </van-popup>
    </div>

    <!-- 删除按钮 -->
    <div v-if="showRemove" class="remove-section">
      <button class="remove-btn" @click="handleRemove">
        删除讲师
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'
import HospitalNameOnlyPicker from '@/components/activity/HospitalNameOnlyPicker.vue'
import ExpertSearchPicker from '@/components/activity/ExpertSearchPicker.vue'
import ExpertPhotoUploader from '@/components/activity/ExpertPhotoUploader.vue'

// 预览域名：优先使用环境变量，其次使用默认域名（与后端返回一致）
const PREVIEW_BASE = import.meta?.env?.VITE_FILE_BASE_URL || 'http://a1.qoss.tkuat.com/group-msnp/'

const props = defineProps({
  expert: { type: Object, required: true },
  index: { type: Number, required: true },
  showRemove: { type: Boolean, default: false },
  editable: { type: Boolean, default: true }
})

const emit = defineEmits(['update', 'remove'])

// 照片上传状态（用于控制父级 UI，如禁用提交按钮等）
const isPhotoUploading = ref(false)

// 本地表单数据
const localExpert = reactive({ ...props.expert })

// 模式：manual 手动录入；select 选择讲师
const entryMode = ref('manual')

// 职称选择弹窗
const showTitlePopup = ref(false)
const titleOptions = ref([
  { text: '知名专家', value: '知名专家' },
  { text: '主任医师', value: '主任医师' },
  { text: '副主任医师', value: '副主任医师' },
  { text: '主治医师', value: '主治医师' },
  { text: '住院医师', value: '住院医师' }
])

// 计算属性
const isManual = computed(() => entryMode.value === 'manual')
const nameFilled = computed(() => (localExpert.name || '').trim().length > 0)
const disableTitle = computed(() => {
  if (!props.editable) return true
  if (!nameFilled.value) return true
  return isManual.value ? false : true
})
const disableHospital = computed(() => {
  if (!props.editable) return true
  if (!nameFilled.value) return true
  return isManual.value ? false : true
})
const disableDepartment = computed(() => {
  if (!props.editable) return true
  if (!nameFilled.value) return true
  return isManual.value ? false : true
})
const disableIntroduction = computed(() => !props.editable || !nameFilled.value)

const titleDefaultIndex = computed(() => {
  const idx = titleOptions.value.findIndex(o => String(o.value) === String(localExpert.title))
  return idx >= 0 ? idx : 0
})

const expertRules = computed(() => {
  const lengthMax = (max, triggers = ['onChange']) =>
    triggers.map(tr => ({
      validator: val => !val || String(val).length <= max,
      message: `不能超过${max}个字符`,
      trigger: tr
    }))

  const makeRequired = (message, triggers = ['onChange']) =>
    triggers.map(tr => ({ required: true, message, trigger: tr }))

  return {
    // 专家姓名规则：必填 + 最长30（change）
    doctorName: [
      ...makeRequired('请输入', ['onChange']),
      ...lengthMax(30, ['onChange'])
    ],
    // 职称规则：必填 + 最长30（change、blur）
    titleType: [
      ...makeRequired('请输入', ['onChange', 'onBlur']),
      ...lengthMax(30, ['onChange', 'onBlur'])
    ],
    // 科室规则：非必填，若填写最长30（change、blur）
    department: [...lengthMax(30, ['onChange', 'onBlur'])],
    // 所属医院规则：必填（change、blur）
    hospitalName: [...makeRequired('请选择', ['onChange', 'onBlur'])],
    // 介绍规则：非必填，若填写最长200（change、blur）
    introduce: [...lengthMax(200, ['onChange', 'onBlur'])],
    // 医生照片规则：非必填（保留占位）
    photoKey: []
  }
})

// 监听父级传入的 expert，保持本地副本同步
watch(
  () => props.expert,
  newVal => {
    Object.assign(localExpert, newVal || {})
  },
  { deep: true }
)

// 根据是否有 id 自动切换模式（并发出更新）
watch(
  () => localExpert.id,
  newVal => {
    const mode = newVal ? 'select' : 'manual'
    if (entryMode.value !== mode) {
      entryMode.value = mode
      handleUpdate()
    } else {
      entryMode.value = mode
    }
  },
  { immediate: true }
)

function openTitlePicker() {
  if (disableTitle.value) return
  showTitlePopup.value = true
}

function onTitleConfirm({ selectedOptions }) {
  const sel = selectedOptions && selectedOptions[0]
  if (sel && sel.value) {
    // 标题使用编码值；同时写入 title 与 titleType，保存时以 titleType 提交
    localExpert.title = sel.value
    localExpert.titleType = sel.value
    handleUpdate()
  }
  showTitlePopup.value = false
}

function onNameSearchCleared() {
  // 清空搜索时切换为手动模式，允许用户创建
  entryMode.value = 'manual'
  // 清空已选讲师 id，避免 watcher 将模式切回 select
  localExpert.id = ''
}

function handleUpdate() {
  // 向父组件同步当前讲师信息与模式
  emit('update', props.index, { ...localExpert, mode: entryMode.value })
}

function handleRemove() {
  emit('remove', props.index)
}

function onPhotoUploadStart() {
  isPhotoUploading.value = true
}
function onPhotoUploadDone(payload) {
  // payload 可能是字符串 url，或 { url, id }
  try {
    if (payload && typeof payload === 'object') {
      localExpert.photo = payload.url || localExpert.photo
      localExpert.photoKey = payload.id || localExpert.photoKey
    } else if (typeof payload === 'string') {
      localExpert.photo = payload
      // 从 url 末段兜底提取 key 作为 id
      try {
        const parts = payload.split('/')
        localExpert.photoKey = parts[parts.length - 1]
      } catch {}
    }
  } catch {}
  isPhotoUploading.value = false
  handleUpdate()
}

function onExpertSelected(payload) {
  if (payload && payload.isCustom) {
    // 手动录入：清空自动带出的字段，由用户自行填写
    entryMode.value = 'manual'
    localExpert.title = ''
    localExpert.hospital = ''
    localExpert.department = ''
    localExpert.introduction = ''
  } else if (payload && payload.expertData) {
    // 选择系统讲师：带出信息并锁定部分字段
    entryMode.value = 'select'
    const e = payload.expertData || {}
    localExpert.title = e.title || ''
    localExpert.hospital = e.hospital || ''
    localExpert.department = e.department || ''
    // 介绍可编辑，来源于擅长课程
    localExpert.introduction = e.expertise || ''
  }
  handleUpdate()
}
</script>

<style scoped>
.expert-form {
  padding: 16px 20px;
}

.photo-section {
  margin-bottom: 16px;
}

.photo-label {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  margin-bottom: 8px;
}

.photo-upload {
  width: 94px;
  height: 94px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.expert-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: rgba(153, 153, 153, 1);
}

.info-section {
  margin-bottom: 16px;
}

.remove-section {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.remove-btn {
  background: transparent;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
  padding: 8px 16px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

/* 模式切换样式 */
.mode-switch {
  display: flex;
  gap: 12px;
  margin: 8px 0 12px 0;
}
.mode-tab {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  user-select: none;
}
.mode-tab.active {
  border-color: #ff811a;
  color: #ff811a;
  background: rgba(255, 129, 26, 0.08);
}

/* 搜索弹窗占位样式 */
.search-panel {
  padding: 24px 16px;
}
.search-panel .placeholder {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.search-panel .actions {
  display: flex;
  gap: 12px;
}
.search-panel .btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.search-panel .btn:hover {
  background: #f6f6f6;
}
</style>
