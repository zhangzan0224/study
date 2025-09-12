<template>
  <div class="activity-basic-form">
    <!-- 基本信息标题 -->
    <div class="section-header" v-if="showHeader">
      <span class="section-title">活动基本信息</span>
      <span class="section-reminder">所有在医院（无论是否健保通医院）举办的活动，活动分类需选择超体场景，活动场地选择健保通医院；对于医护群体开展的活动，活动内容请录入医院圈层相关</span>
      <div class="header-divider"></div>
    </div>

    <!-- 表单字段 -->
    <div class="section-body">
      <van-form ref="formRef" :show-error="true" :show-error-message="true" :scroll-to-error="true">
        <div class="form-section">
          <BranchSubbranchPicker 
            v-model:branchCode="localFormData.branchCode"
            v-model:subbranchCode="localFormData.subbranchCode"
            :branch-rules="formRules.branchCode"
            :subbranch-rules="formRules.subbranchCode"
            :editable="editable"
            @branch-selected="handleBranchSelected"
            @branch-changed="handleBranchChanged"
            @branch-cleared="handleBranchCleared"
          />

          <StrategyPicker v-model="localFormData.strategy" :editable="editable" :branch-code="localFormData.branchCode" :rules="formRules.strategy" />

          <FormField label="活动名称" :required="true" type="textarea" v-model="localFormData.name" placeholder="请输入活动名称" :max-length="30" :disabled="!editable" :rows="2" name="activeName" :rules="formRules.activeName" />

          <ChannelPicker v-model="localFormData.activeChannel" :editable="editable" :rules="formRules.activeChannel" name="activeChannel" />

          <DateTimeRangePicker
            v-model:startTime="localFormData.startTime"
            v-model:endTime="localFormData.endTime"
            :editable="editable"
            :start-time-rules="formRules.startTime"
            :end-time-rules="formRules.endTime"
            @validate-field="handleValidateField"
          />

          <CategoryPicker v-model="localFormData.activeCategory" :editable="editable" :rules="formRules.activeCategory" name="activeCategory" />

          <HealthRelatePicker v-model="localFormData.healthRelate" :editable="editable" :rules="formRules.healthRelate" name="healthRelate" />

          <VenueSection
            v-model:activeVenue="localFormData.activeVenue"
            v-model:activeLocation="localFormData.activeLocation"
            v-model:hospitalName="localFormData.hospitalName"
            v-model:hospitalLevel="localFormData.hospitalLevel"
            v-model:feHospitalId="localFormData.feHospitalId"
            v-model:disableHospitalLevel="localFormData._disableHospitalLevel"
            v-model:centerName="localFormData.centerName"
            v-model:activeVenueDetail="localFormData.activeVenueDetail"
            v-model:communityName="localFormData.communityName"
            :category="localFormData.activeCategory"
            :healthRelate="localFormData.healthRelate"
            :editable="editable"
            v-model:location="localFormData.location"
            v-model:detailAddress="localFormData.detailAddress"
            :heldType="localFormData.heldType"
            :rules="{
              activeVenue: formRules.activeVenue,
              activeLocation: formRules.activeLocation,
              hospitalName: formRules.hospitalName,
              hospitalLevel: formRules.hospitalLevel,
              centerName: formRules.centerName,
              activeVenueDetail: formRules.activeVenueDetail,
              communityName: formRules.communityName,
              location: formRules.location,
              address: formRules.address
            }"
          />

          <!-- 扩展字段 - 仅在 NewActivity 中显示 -->
          <template v-if="showExtendedFields">

            <ActiveTypePicker v-model="localFormData.activeType" :editable="editable" :rules="formRules.activeType" />

            <HeldTypePicker v-model="localFormData.heldType" :editable="heldTypeEditable" :rules="formRules.heldType" />

            <SignQrcodePicker v-model="localFormData.signQrcode" :editable="editable" :rules="formRules.signQrcode" />

            <FormField label="活动说明" :required="isActiveRemarkRequired" type="textarea" v-model="localFormData.activeRemark" placeholder="请输入" :max-length="50" :rows="2" name="activeRemark" :rules="formRules.activeRemark" />

            <FormField label="直播链接" type="input" v-model="localFormData.liveUrl" placeholder="请输入" :show-divider="false" name="liveUrl" :rules="formRules.liveUrl" />

            <IsPublishPicker v-model="localFormData.isPublish" :editable="editable" :rules="formRules.isPublish" />

            <HasSpecialServerPicker v-model="localFormData.hasSpecialServer" :editable="editable" :rules="formRules.hasSpecialServer" />
            
            <!-- 试点中支 子组件 (Assuming no validation rule was provided for this) -->
            <TrialSubbranchPicker v-model="localFormData.trialSubbranch" :editable="editable" :is-admin="isAdmin" :subbranch-code="localFormData.subbranchCode" />
          </template>
        </div>
      </van-form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, defineExpose, defineProps, defineEmits, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { showFailToast, showLoadingToast, closeToast } from 'vant'
import FormField from '@/components/base/FormField.vue'
import TrialSubbranchPicker from '@/components/activity/TrialSubbranchPicker.vue'
import BranchSubbranchPicker from '@/components/activity/BranchSubbranchPicker.vue'
import StrategyPicker from '@/components/activity/StrategyPicker.vue'
import HospitalSearchPicker from '@/components/activity/HospitalSearchPicker.vue'
import VenueSection from '@/components/activity/VenueSection.vue'
import DateTimeRangePicker from '@/components/activity/DateTimeRangePicker.vue'
import ActivityNameInput from '@/components/activity/ActivityNameInput.vue'
import HealthRelatePicker from '@/components/activity/HealthRelatePicker.vue'
import ChannelPicker from '@/components/activity/ChannelPicker.vue'
import CategoryPicker from '@/components/activity/CategoryPicker.vue'
import HeldTypePicker from '@/components/activity/HeldTypePicker.vue'
import ActiveTypePicker from '@/components/activity/ActiveTypePicker.vue'
import SignQrcodePicker from '@/components/activity/SignQrcodePicker.vue'
import IsPublishPicker from '@/components/activity/IsPublishPicker.vue'
import HasSpecialServerPicker from '@/components/activity/HasSpecialServerPicker.vue'
import { getFormRules } from './validationRules.js'

const formRef = ref(null)
// Create a computed property to generate reactive rules
const formRules = computed(() => getFormRules(localFormData.value))

const categoryPickerRef = ref(null)
const healthRelatePickerRef = ref(null)

// 定义 props
const props = defineProps({
  // 表单数据
  formData: {
    type: Object,
    required: true
  },
  // 是否可编辑
  editable: {
    type: Boolean,
    default: true
  },
  // 是否显示标题
  showHeader: {
    type: Boolean,
    default: true
  },
  // 是否显示扩展字段（NewActivity中的额外字段）
  showExtendedFields: {
    type: Boolean,
    default: true
  },
  // 活动省市字段的特殊配置
  locationConfig: {
    type: Object,
    default: () => ({
      type: 'select',
      placeholder: '请选择',
      disabled: false
    })
  },
  // 是否为管理员
  isAdmin: {
    type: Boolean,
    default: false
  }
})

// 定义 emits
const emit = defineEmits([
  'update:formData',
  'form-change',
  'branch-selected',
  'branch-changed',
  'branch-cleared'
])

// 响应式数据
const localFormData = ref({ ...props.formData })
// 确保本地表单包含内部控制字段的默认值
if (localFormData.value._disableHospitalLevel === undefined) {
  localFormData.value._disableHospitalLevel = false
}

// 计算属性
const locationFieldType = computed(() => {
  return props.locationConfig.type || 'select'
})

const locationPlaceholder = computed(() => {
  if (props.editable) {
    return props.locationConfig.placeholder || '请选择'
  } else {
    return localFormData.value.location
  }
})

const locationDisabled = computed(() => {
  return !props.editable || props.locationConfig.disabled
})

const heldTypeEditable = computed(() => {
  const t = localFormData.value.activeType
  return t !== 'FREE_CLINIC'
})

// 活动说明是否必填（理赔发布会/其他/体检/客权体检/产说会/医汇通相关/区域绿通相关）
const isActiveRemarkRequired = computed(() => (
  [
    'CLAIM', // 理赔发布会
    'OTHER', // 其他
    'HEALTH_CHECK', // 体检
    'CUSTOMER_CHECK', // 客权体检
    'PRODUCT', // 产说会
    'MEDLINK', // 医汇通相关
    'REGION_GREEN' // 区域绿通相关
  ].includes(localFormData.value.activeType)
))

// 规则：根据活动内容规范 heldType；避免被父组件同步时“清空”覆盖
const resolveHeldTypeByActiveType = (type) => {
  switch (type) {
    case 'FREE_CLINIC': // 义诊
      return 'OFFLINE'
    case 'OTHER': // 其他
      return ''
    case 'HEALTH_CHECK': // 体检
    case 'CUSTOMER_CHECK': // 客权体检
    case 'PRODUCT': // 产说会
      return 'OFFLINE'
    case 'MEDLINK': // 医汇通相关
    case 'REGION_GREEN': // 区域绿通相关
      return 'ONLINE'
    default:
      return undefined // 不强制
  }
}

// 当活动内容或 heldType 变化时，对齐到规范值，防止外部同步把值置空
watch([
  () => localFormData.value.activeType,
  () => localFormData.value.heldType
], ([newType, currHeld]) => {
  const desired = resolveHeldTypeByActiveType(newType)
  if (desired !== undefined && desired !== currHeld) {
    localFormData.value.heldType = desired
  }
}, { immediate: true })

// 监听器
// 不再深度监听父 formData，避免子改父再反推回来的抖动/覆盖。
// 仅在初始化时从 props 拷贝，之后以本地为准并通过 v-model 同步给父级。
watch(localFormData, (newVal) => {
  emit('update:formData', newVal)
  emit('form-change', newVal)
}, { deep: true })

// 监听活动类别和是否健保通相关变化，清空活动场地选择
watch([() => localFormData.value.category, () => localFormData.value.healthRelate], ([newCategory, newHealthRelate], [oldCategory, oldHealthRelate]) => {
  // 如果活动类别或是否健保通相关发生变化，清空活动场地选择
  if (newCategory !== oldCategory || newHealthRelate !== oldHealthRelate) {
    localFormData.value.activeVenue = ''
  }
})

// 方法
// 重置表单数据
const resetForm = () => {
  localFormData.value = { ...props.formData }
}

// 获取表单数据
const getFormData = () => {
  return localFormData.value
}

// 处理字段校验事件
const handleValidateField = async (fieldName) => {
  if (formRef.value?.validate) {
    try { 
      await formRef.value.validate(fieldName) 
    } catch (e) { 
      // 校验失败，忽略错误
    }
  }
}

// 分公司选择事件处理
const handleBranchSelected = (branchData) => {
  console.log('ActivityBasicForm - 分公司已选择:', branchData)
  console.log('ActivityBasicForm - 分公司数据详情:', {
    text: branchData.text,
    value: branchData.value,
    branchCode: localFormData.value.branchCode,
    subbranchCode: localFormData.value.subbranchCode
  })
  emit('branch-selected', branchData)
}

// 分公司变更事件处理
const handleBranchChanged = (branchCode) => {
  console.log('ActivityBasicForm - 分公司已变更，代码:', branchCode)
  emit('branch-changed', branchCode)
}

// 分公司清空事件处理
const handleBranchCleared = () => {
  console.log('ActivityBasicForm - 分公司已清空')
  emit('branch-cleared')
}

const showLocationPicker = () => {
  if (!props.editable) return
  console.log('Show location picker')
}

const showContentPicker = () => {
  if (!props.editable) return
  console.log('Show content picker')
}

const showMethodPicker = () => {
  if (!props.editable) return
  console.log('Show method picker')
}

const showQRCodePicker = () => {
  if (!props.editable) return
  console.log('Show QR code picker')
}

const showPublicReleasePicker = () => {
  if (!props.editable) return
  console.log('Show public release picker')
}

const showTraditionalMedicinePicker = () => {
  if (!props.editable) return
  console.log('Show traditional medicine picker')
}

// 暴露方法给父组件使用
defineExpose({
  resetForm,
  getFormData,
  // 允许父组件按字段名校验（支持 Vant Form 的 validate(name)）
  validate: (name) => formRef.value?.validate?.(name)
})
</script>

<style scoped>
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

.form-section {
  padding: 0;
}

/* 保持校验错误信息在一行显示，超出省略 */
:deep(.van-field__error-message) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
