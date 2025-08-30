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
          <FormField name="branchCode" :rules="[{ required: true, message: '请选择分公司' }]" label="分公司" :required="true" type="select" v-model="localFormData.branchCode" :placeholder="editable ? '请选择' : localFormData.branchCode" :disabled="!editable" :options="branchOptions" @select-click="showBranchPicker" />

          <FormField name="subbranchCode" :rules="[{ required: true, message: '请选择中支' }]" label="中支" :required="true" type="select" v-model="localFormData.subbranchCode" :placeholder="editable ? '请选择' : localFormData.subbranchCode" :disabled="!editable" :options="subBranchOption" @select-click="showSubBranchPicker" />

          <FormField label="战略划分" :required="true" type="select" v-model="localFormData.strategy" :placeholder="editable ? '请选择' : localFormData.strategy" :disabled="!editable" @select-click="showStrategyPicker" />

          <FormField label="活动名称" :required="true" type="textarea" v-model="localFormData.name" placeholder="请输入活动名称" :max-length="30" :disabled="!editable" :rows="2" name="name" />

          <FormField label="活动渠道" :required="true" type="select" v-model="localFormData.channel" :placeholder="editable ? '请选择' : localFormData.channel" :disabled="!editable" @select-click="showChannelPicker" />

          <FormField label="活动开始时间" name="startTime" :required="true" type="select" v-model="localFormData.startTime" :placeholder="editable ? '请选择' : localFormData.startTime" :disabled="!editable" :rules="[
              { required: true, message: '请选择开始时间' },
              { validator: validateStartBeforeEnd }
            ]" @select-click="showStartTimePicker" />

          <FormField label="活动结束时间" name="endTime" :required="true" type="select" v-model="localFormData.endTime" :placeholder="editable ? '请选择' : localFormData.endTime" :disabled="!editable" :rules="[
              { required: true, message: '请选择结束时间' },
              { validator: validateEndAfterStart }
            ]" @select-click="showEndTimePicker" />

          <FormField label="活动类别" :required="true" type="select" v-model="localFormData.category" :placeholder="editable ? '请选择' : localFormData.category" :disabled="!editable" :options="categoryOptions" @select-click="showCategoryPicker" />

          <FormField label="是否健保通相关" :required="true" type="select" v-model="localFormData.healthRelate" :placeholder="editable ? '请选择' : localFormData.healthRelate" :disabled="!editable" :options="healthRelateOptions" @select-click="showHealthRelatePicker" />

          <FormField label="活动场地" :required="true" type="select" v-model="localFormData.activeVenue" :placeholder="editable ? '请选择' : localFormData.activeVenue" :disabled="!editable" :options="venueOptions" @select-click="showVenuePicker" />

          <!-- 活动位置相关字段 - 仅在活动场地选择为健保通医院时显示 -->
          <template v-if="showActiveLocationFields">
            <FormField label="活动位置" :required="true" type="select" v-model="localFormData.activeLocation" :placeholder="editable ? '请选择' : localFormData.activeLocation" :disabled="!editable" :options="activeLocationOptions" @select-click="showActiveLocationPicker" />
            <FormField label="医院名称" :required="true" type="input" v-model="localFormData.hospitalName" placeholder="请输入医院名称搜索" @input="onHospitalInput" />
            <FormField label="医院级别" :required="true" type="select" v-model="localFormData.hospitalLevel" :placeholder="editable ? '请选择' : localFormData.hospitalLevel" :disabled="!editable || localFormData._disableHospitalLevel" :options="hospitalLevelOptions" @select-click="showHospitalLevelPicker" />
            <FormField label="医院fe编码" type="input" v-model="localFormData.feHospitalId" placeholder="请输入医院fe编码" :disabled="true" />
          </template>

          <!-- 健财中心时展示 场馆名称 -->
          <template v-if="showVenueNameField">
            <FormField label="场馆名称" :required="true" type="input" v-model="localFormData.centerName" placeholder="请输入场馆名称搜索" @input="onVenueNameInput" />
          </template>

          <!-- 养老社区、拜博、职场、酒店、其他 时展示 场地信息 -->
          <template v-if="showSiteInfoField">
            <FormField label="场地信息" type="textarea" v-model="localFormData.activeVenueDetail" placeholder="请输入场地信息" :rows="3" />
          </template>

          <!-- 新规则：当为 养老社区 时展示 社区名称 -->
          <template v-if="showCommunityNameField">
            <FormField label="社区名称" type="input" v-model="localFormData.communityName" placeholder="请输入社区名称" />
          </template>

          <FormField label="活动省市" :required="true" :type="locationFieldType" v-model="localFormData.location" :placeholder="locationPlaceholder" :disabled="locationDisabled" @select-click="showLocationPicker" />

          <!-- 扩展字段 - 仅在 NewActivity 中显示 -->
          <template v-if="showExtendedFields">
            <FormField label="详细地址" :required="true" type="textarea" v-model="localFormData.detailAddress" placeholder="请输入" :max-length="300" :rows="3" name="detailAddress" />

            <FormField label="活动内容" :required="true" type="select" v-model="localFormData.content" placeholder="健康讲座" @select-click="showContentPicker" />

            <FormField label="活动方式" :required="true" type="select" v-model="localFormData.method" placeholder="请选择" @select-click="showMethodPicker" />

            <FormField label="是否生成签到二维码" :required="true" type="select" v-model="localFormData.generateQRCode" placeholder="请选择" @select-click="showQRCodePicker" />

            <FormField label="活动说明" type="textarea" v-model="localFormData.description" placeholder="请输入" :max-length="30" :rows="2" />

            <FormField label="直播链接" type="input" v-model="localFormData.liveLink" placeholder="请输入" :show-divider="false" />

            <FormField label="是否对外发布" :required="true" type="select" v-model="localFormData.publicRelease" placeholder="请选择" @select-click="showPublicReleasePicker" />

            <FormField label="活是否包含中医特色服务" :required="true" label-width="200px" type="select" v-model="localFormData.traditionalMedicine" placeholder="请选择" @select-click="showTraditionalMedicinePicker" :show-divider="false" />
          </template>
        </div>
      </van-form>
    </div>

    <!-- 分公司选择器弹窗 -->
    <van-popup v-model:show="showBranchPickerPopup" position="bottom" round>
      <van-picker :columns="branchOptions" @confirm="onBranchConfirm" @cancel="onBranchCancel" :default-index="0" title="选择分公司" />
    </van-popup>

    <!-- 中支选择器弹窗 -->
    <van-popup v-model:show="showsubBranchPickerPopup" position="bottom" round>
      <van-picker :columns="subBranchOption" @confirm="onSubBranchConfirm" @cancel="onSubBranchCancel" :default-index="0" title="选择中支" />
    </van-popup>

    <!-- 活动类别选择器弹窗 -->
    <van-popup v-model:show="showCategoryPickerPopup" position="bottom" round>
      <van-picker :columns="categoryOptions" @confirm="onCategoryConfirm" @cancel="onCategoryCancel" :default-index="0" title="选择活动类别" />
    </van-popup>

    <!-- 健保通相关选择器弹窗 -->
    <van-popup v-model:show="showHealthRelatePickerPopup" position="bottom" round>
      <van-picker :columns="healthRelateOptions" @confirm="onHealthRelateConfirm" @cancel="onHealthRelateCancel" :default-index="0" title="选择是否健保通相关" />
    </van-popup>

    <!-- 活动场地选择器弹窗 -->
    <van-popup v-model:show="showVenuePickerPopup" position="bottom" round>
      <van-picker :columns="venueOptions" @confirm="onVenueConfirm" @cancel="onVenueCancel" :default-index="0" title="选择活动场地" />
    </van-popup>

    <!-- 活动位置选择器弹窗 -->
    <van-popup v-model:show="showActiveLocationPickerPopup" position="bottom" round>
      <van-picker :columns="activeLocationOptions" @confirm="onActiveLocationConfirm" @cancel="onActiveLocationCancel" :default-index="0" title="选择活动位置" />
    </van-popup>

    <!-- 医院级别选择器弹窗 -->
    <van-popup v-model:show="showHospitalLevelPickerPopup" position="bottom" round>
      <van-picker :columns="hospitalLevelOptions" @confirm="onHospitalLevelConfirm" @cancel="onHospitalLevelCancel" :default-index="0" title="选择医院级别" />
    </van-popup>

    <!-- 医院搜索结果选择器弹窗 -->
    <van-popup v-model:show="showHospitalSearchResultsPopup" position="bottom" round>
      <van-picker :columns="hospitalSearchResults" @confirm="onHospitalSearchResultConfirm" @cancel="onHospitalSearchResultCancel" :default-index="0" title="选择医院" @open="onHospitalSearchPickerOpen" />
    </van-popup>

    <!-- 场馆名称搜索结果选择器弹窗 -->
    <van-popup v-model:show="showVenueNameSearchResultsPopup" position="bottom" round>
      <van-picker :columns="venueNameSearchResults" @confirm="onVenueNameSearchResultConfirm" @cancel="onVenueNameSearchResultCancel" :default-index="0" title="选择场馆名称" @open="onVenueNameSearchPickerOpen" />
    </van-popup>

    <!-- 开始时间 PickerGroup 弹窗（日期+时间） -->
    <van-popup v-model:show="showStartTimePopup" position="bottom" round>
      <van-picker-group title="选择开始时间" :tabs="['选择日期','选择时间']" @confirm="onStartTimeConfirm" @cancel="onStartTimeCancel">
        <van-date-picker v-model="startDateArray" :columns-type="['year','month','day']" />
        <van-time-picker v-model="startTimeArray" :columns-type="['hour','minute']" />
      </van-picker-group>
    </van-popup>

    <!-- 结束时间 PickerGroup 弹窗（日期+时间） -->
    <van-popup v-model:show="showEndTimePopup" position="bottom" round>
      <van-picker-group title="选择结束时间" :tabs="['选择日期','选择时间']" @confirm="onEndTimeConfirm" @cancel="onEndTimeCancel">
        <van-date-picker v-model="endDateArray" :columns-type="['year','month','day']" />
        <van-time-picker v-model="endTimeArray" :columns-type="['hour','minute']" />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineExpose, defineProps, defineEmits, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { showFailToast, showLoadingToast, closeToast } from 'vant'
import FormField from '@/components/base/FormField.vue'

const formRef = ref(null)
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
  }
})

// 定义 emits
const emit = defineEmits([
  'update:formData',
  'form-change'
])

// 响应式数据
const localFormData = ref({ ...props.formData })
// 确保本地表单包含内部控制字段的默认值
if (localFormData.value._disableHospitalLevel === undefined) {
  localFormData.value._disableHospitalLevel = false
}

// 还原本地选项与弹窗控制
const showBranchPickerPopup = ref(false)
const branchOptions = ref([])
const branchOptionsBack = ref([])
const showsubBranchPickerPopup = ref(false)
const subBranchOption = ref([])
// 时间选择弹窗与值（日期+时间）
const showStartTimePopup = ref(false)
const showEndTimePopup = ref(false)
// 时间选择器日期数组（不设默认值）
const startDateArray = ref([])
const endDateArray = ref([])
const startTimeArray = ref([0, 0])
const endTimeArray = ref([0, 0])

// 弹窗控制变量
const showCategoryPickerPopup = ref(false)
const showHealthRelatePickerPopup = ref(false)
const showVenuePickerPopup = ref(false)
const showActiveLocationPickerPopup = ref(false)
const showHospitalLevelPickerPopup = ref(false)
const showHospitalSearchResultsPopup = ref(false)
const showVenueNameSearchResultsPopup = ref(false) // 新增：场馆名称搜索结果弹窗

// 活动类别选项
const categoryOptions = ref([
  { text: '超体场景', value: '1' },
  { text: '服务行销', value: '2' }
])

// 健保通相关选项
const healthRelateOptions = ref([
  { text: '否', value: '0' },
  { text: '是', value: '1' }
])

// 活动场地选项
const venueOptions = ref([])

// 活动位置相关选项
const activeLocationOptions = ref([])

// 医院级别选项
const hospitalLevelOptions = ref([])

// 医院搜索选项
const hospitalSearchOptions = ref([])

// 医院搜索相关
const hospitalSearchTimer = ref(null)
const hospitalSearchResults = ref([])
const hospitalSearchData = ref([]) // 存储完整的医院数据

// 场馆名称搜索相关
const venueNameSearchTimer = ref(null)
const venueNameSearchResults = ref([])
const venueNameSearchData = ref([]) // 存储完整的场馆名称数据

// 活动场地选项配置 - 使用字典代码
// 这样设计的好处：
// 1. 支持后端字典数据，更灵活
// 2. 支持国际化，不依赖硬编码中文
// 3. 配置清晰，易于维护
const venueOptionsConfig = {
  // 超体场景和健保通相关，使用code
  activeVenueNameArr1: ['HEALTH_HOSP', 'WEALTH_CENTER', 'COMMUNITY', 'BYBO'], // '健保通医院', '健财中心', '养老社区','拜博'
  // 超体场景和非健保通相关
  activeVenueNameArr2: ['WEALTH_CENTER', 'COMMUNITY', 'BYBO'], // '健财中心', '养老社区', '拜博'
  // 服务行销 健保通相关与非相关
  activeVenueNameArr3: ['WORK_PLACE', 'HOTEL', 'OTHER'] // '职场', '酒店', '其他'
}

// 活动场地数据存储
const activeVenueAll = ref([]) // 活动场地全部
const activeVenueArr1 = ref([]) // 超体场景和健保通相关
const activeVenueArr2 = ref([]) // 超体场景和非健保通相关
const activeVenueArr3 = ref([]) // 服务行销 健保通相关与非相关



// 生命周期
onMounted(() => {
  // 初始化时如果有分公司数据，加载对应的中支数据
  if (localFormData.value.branchCode) {
    loadSubBranchOptionByBranchCode(localFormData.value.branchCode)
  }
  // 不设置默认开始/结束日期，若已有值仅同步时间部分
  if (localFormData.value.startTime) {
    const { t: st } = splitDateTime(localFormData.value.startTime)
    startTimeArray.value = st
  }
  if (localFormData.value.endTime) {
    const { t: et } = splitDateTime(localFormData.value.endTime)
    endTimeArray.value = et
  }

  // 预加载活动场地数据
  queryActiveVenue()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (hospitalSearchTimer.value) {
    clearTimeout(hospitalSearchTimer.value)
  }
  if (venueNameSearchTimer.value) {
    clearTimeout(venueNameSearchTimer.value)
  }
})

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

// 是否显示活动位置相关字段
const showActiveLocationFields = computed(() => {
  // 当活动场地选择为健保通医院时显示
  return localFormData.value.activeVenue === 'HEALTH_HOSP'
})

// 是否显示场馆名称（健财中心）
const showVenueNameField = computed(() => {
  return localFormData.value.activeVenue === 'WEALTH_CENTER'
})

// 是否显示场地信息（养老社区、拜博、职场、酒店、其他）
const showSiteInfoField = computed(() => {
  const siteInfoVenues = ['COMMUNITY', 'BYBO', 'WORK_PLACE', 'HOTEL', 'OTHER']
  return siteInfoVenues.includes(localFormData.value.activeVenue)
})

// 是否显示社区名称（仅 养老社区）
const showCommunityNameField = computed(() => {
  return localFormData.value.activeVenue === 'COMMUNITY'
})



// 监听器
const isSyncingFromProps = ref(false)

watch(() => props.formData, (newVal) => {
  isSyncingFromProps.value = true
  localFormData.value = { ...newVal }
  // 同步 props 时也补齐内部控制字段默认值
  if (localFormData.value._disableHospitalLevel === undefined) {
    localFormData.value._disableHospitalLevel = false
  }
  nextTick(() => {
    isSyncingFromProps.value = false
  })
}, { deep: true })

watch(localFormData, (newVal) => {
  if (isSyncingFromProps.value) return
  emit('update:formData', newVal)
  emit('form-change', newVal)
}, { deep: true })

watch(() => props.editable, (newVal) => {
  if (newVal) {
    localFormData.value = { ...props.formData }
  }
})
watch(() => localFormData.value.branchCode, (newVal, oldVal) => {
  // 如果分公司从有值变为无值，需清空中支数据
  if (oldVal && !newVal) {
    clearSubBranchData()
  }
})

// 监听活动类别和是否健保通相关变化，清空活动场地选择
watch([() => localFormData.value.category, () => localFormData.value.healthRelate], ([newCategory, newHealthRelate], [oldCategory, oldHealthRelate]) => {
  // 如果活动类别或是否健保通相关发生变化，清空活动场地选择
  if (newCategory !== oldCategory || newHealthRelate !== oldHealthRelate) {
    localFormData.value.activeVenue = ''
    // 清空活动场地选项，等待用户重新选择时通过接口获取
    venueOptions.value = []
    // 清空活动位置相关字段
    clearActiveLocationFields()
  }
})

// 监听活动场地变化，清空活动位置相关字段
watch(() => localFormData.value.activeVenue, (newVenue, oldVenue) => {
  // 当选择为 健保通医院 时，预先拉取医院等级列表
  if (newVenue === 'HEALTH_HOSP' && hospitalLevelOptions.value.length === 0) {
    queryHospitalLevel()
  }
  if (newVenue !== oldVenue && newVenue !== 'HEALTH_HOSP') {
    clearActiveLocationFields()
  }
  // 非健财中心时清空场馆名称
  if (newVenue !== oldVenue && newVenue !== 'WEALTH_CENTER') {
    clearVenueNameField()
  }
  // 非需要展示场地信息的场地时清空场地信息
  const needSiteInfo = ['COMMUNITY', 'BYBO', 'WORK_PLACE', 'HOTEL', 'OTHER']
  if (newVenue !== oldVenue && !needSiteInfo.includes(newVenue)) {
    clearSiteInfoField()
  }
  // 非养老社区时清空社区名称
  if (newVenue !== oldVenue && newVenue !== 'COMMUNITY') {
    clearCommunityNameField()
  }
})

// 监听医院名称变化，当手动输入时重置字段可编辑性
watch(() => localFormData.value.hospitalName, (newName, oldName) => {
  // 如果医院名称变化且不是从搜索结果选择的，重置可编辑性
  if (newName !== oldName && !hospitalSearchResults.value.some(option => option.text === newName)) {
    localFormData.value._disableHospitalLevel = false
    // 医院fe编码字段始终禁用，不需要重置
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

// 分公司和中支选择器方法
const showBranchPicker = () => {
  if (!props.editable) return
  showLoadingToast({
    message: '加载分公司数据...',
    forbidClick: true,
  })
  loadBranchData().then(() => {
    closeToast()
    showBranchPickerPopup.value = true
  }).catch(error => {
    closeToast()
    showFailToast('加载失败，请重试')
    console.error('Failed to load branch data:', error)
  })
}

const showSubBranchPicker = () => {
  if (!props.editable) return
  showsubBranchPickerPopup.value = true
}

// 活动类别选择器方法
const showCategoryPicker = () => {
  if (!props.editable) return
  showCategoryPickerPopup.value = true
}



// 分公司选择器确认
const onBranchConfirm = ({ selectedOptions }) => {
  const selectBranch = selectedOptions[0]
  if (selectBranch && selectBranch.text) {
    localFormData.value.branchCode = selectBranch.value
    clearSubBranchData()
    loadSubBranchOptionByBranchCode(selectBranch.value)
  }
  showBranchPickerPopup.value = false
}

// 分公司选择器取消
const onBranchCancel = () => {
  showBranchPickerPopup.value = false
}

// 中支选择器确认
const onSubBranchConfirm = ({ selectedOptions }) => {
  const selectSubBranch = selectedOptions[0]
  if (selectSubBranch && selectSubBranch.text) {
    localFormData.value.subbranchCode = selectSubBranch.value
  }
  showsubBranchPickerPopup.value = false
}

// 中支选择器取消
const onSubBranchCancel = () => {
  showsubBranchPickerPopup.value = false
}

// 活动类别选择器确认
const onCategoryConfirm = ({ selectedOptions }) => {
  const selectCategory = selectedOptions[0]
  if (selectCategory && selectCategory.text) {
    localFormData.value.category = selectCategory.value
  }
  showCategoryPickerPopup.value = false
}

// 活动类别选择器取消
const onCategoryCancel = () => {
  showCategoryPickerPopup.value = false
}

// 健保通相关选择器确认
const onHealthRelateConfirm = ({ selectedOptions }) => {
  const selectHealthRelate = selectedOptions[0]
  if (selectHealthRelate && selectHealthRelate.text) {
    localFormData.value.healthRelate = selectHealthRelate.value
  }
  showHealthRelatePickerPopup.value = false
}

// 健保通相关选择器取消
const onHealthRelateCancel = () => {
  showHealthRelatePickerPopup.value = false
}

// 活动场地选择器方法
const showVenuePicker = () => {
  if (!props.editable) return
  // 通过后端接口获取活动场地选项
  loadVenueOptions()
}



// 查询活动场地列表
const queryActiveVenue = async () => {
  try {
    // 调用后端接口获取活动场地列表
    // 实际使用时，请替换为真实的API调用，例如：
    // const { code, data } = await getActiveVenueList()
    // 
    // 后端返回的数据格式应该类似：
    // {
    //   code: 200,
    //   data: [
    //     { dictName: '健保通医院', dictCd: 'HEALTH_HOSP' },
    //     { dictName: '健财中心', dictCd: 'WEALTH_CENTER' },
    //     { dictName: '养老社区', dictCd: 'COMMUNITY' },
    //     { dictName: '拜博', dictCd: 'BYBO' },
    //     { dictName: '职场', dictCd: 'WORK_PLACE' },
    //     { dictName: '酒店', dictCd: 'HOTEL' },
    //     { dictName: '其他', dictCd: 'OTHER' }
    //   ]
    // }

    // 模拟后端接口调用，实际使用时请替换为真实的API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    // 模拟返回数据
    const mockData = [
      { dictName: '健保通医院', dictCd: 'HEALTH_HOSP' },
      { dictName: '健财中心', dictCd: 'WEALTH_CENTER' },
      { dictName: '养老社区', dictCd: 'COMMUNITY' },
      { dictName: '拜博', dictCd: 'BYBO' },
      { dictName: '职场', dictCd: 'WORK_PLACE' },
      { dictName: '酒店', dictCd: 'HOTEL' },
      { dictName: '其他', dictCd: 'OTHER' }
    ]

    const code = 200
    const data = mockData

    if (code === 200 && data) {
      activeVenueAll.value = data.map(item => ({ text: item.dictName, value: item.dictCd }))
      const activeVenueMap = new Map()
      activeVenueAll.value.forEach(item => activeVenueMap.set(item.value, item))

      activeVenueArr1.value = venueOptionsConfig.activeVenueNameArr1.map(n => {
        const find = activeVenueMap.get(n)
        return find || null
      }).filter(Boolean)

      activeVenueArr2.value = venueOptionsConfig.activeVenueNameArr2.map(n => {
        const find = activeVenueMap.get(n)
        return find || null
      }).filter(Boolean)

      activeVenueArr3.value = venueOptionsConfig.activeVenueNameArr3.map(n => {
        const find = activeVenueMap.get(n)
        return find || null
      }).filter(Boolean)
    }
  } catch (error) {
    console.error('Failed to query active venue:', error)
    showFailToast('获取活动场地列表失败')
  }
}

// 查询医院级别数据
const queryHospitalLevel = async () => {
  try {
    // 模拟API调用
    // const { code, data } = await getHospitalLevelList()

    // 模拟数据 - 使用你提供的数据结构
    const mockData = [
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "10", dictName: "一级" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "1a", dictName: "一级甲等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "1b", dictName: "一级乙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "1c", dictName: "一级丙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "20", dictName: "二级" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "2a", dictName: "二级甲等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "2b", dictName: "二级乙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "2c", dictName: "二级丙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "30", dictName: "三级" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3a", dictName: "三级甲等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3b", dictName: "三级乙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3c", dictName: "三级丙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "00", dictName: "其他" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3d", dictName: "三级特等" }
    ]

    const code = 200
    const data = mockData

    if (code === 200 && data) {
      hospitalLevelOptions.value = data.map(item => ({ text: item.dictName, value: item.dictCd }))
    }
  } catch (error) {
    console.error('Failed to query hospital level:', error)
    showFailToast('获取医院级别列表失败')
  }
}

// 查询活动位置数据
const queryActiveLocation = async () => {
  try {
    // 模拟API调用
    // const { code, data } = await getActiveLocationList()

    // 模拟数据 - 使用你提供的数据结构
    const mockData = [
      { catId: "activeLocation", catName: "活动位置", dictCd: "1", dictName: "院内" },
      { catId: "activeLocation", catName: "活动位置", dictCd: "2", dictName: "驿站" },
      { catId: "activeLocation", catName: "活动位置", dictCd: "3", dictName: "VIP室" }
    ]

    const code = 200
    const data = mockData

    if (code === 200 && data) {
      activeLocationOptions.value = data.map(item => ({ text: item.dictName, value: item.dictCd }))
    }
  } catch (error) {
    console.error('Failed to query active location:', error)
    showFailToast('获取活动位置列表失败')
  }
}

// 加载活动场地选项
const loadVenueOptions = async () => {
  try {
    showLoadingToast({
      message: '加载活动场地选项...',
      forbidClick: true,
    })

    // 获取当前的活动类别和是否健保通相关
    const category = localFormData.value.category
    const healthRelate = localFormData.value.healthRelate

    // 如果还没有加载过活动场地数据，先加载
    if (activeVenueAll.value.length === 0) {
      await queryActiveVenue()
    }

    // 根据配置动态组合活动场地选项
    if (category === '1') { // 超体场景
      if (healthRelate === '1') { // 是健保通相关
        venueOptions.value = [...activeVenueArr1.value]
      } else if (healthRelate === '0') { // 否健保通相关
        venueOptions.value = [...activeVenueArr2.value]
      } else {
        venueOptions.value = []
      }
    } else if (category === '2') { // 服务行销
      venueOptions.value = [...activeVenueArr3.value]
    } else {
      venueOptions.value = []
    }

    closeToast()
    showVenuePickerPopup.value = true

  } catch (error) {
    closeToast()
    showFailToast('加载活动场地选项失败')
    console.error('Failed to load venue options:', error)
  }
}

// 活动场地选择器确认（只使用 selectedOptions）
const onVenueConfirm = ({ selectedOptions }) => {
  const selectVenue = selectedOptions && selectedOptions[0]
  if (!selectVenue) {
    showVenuePickerPopup.value = false
    return
  }

  localFormData.value.activeVenue = selectVenue.value
  // 按照显隐规则同步清空或预取：
  // 健保通医院：预取医院等级；否则清空活动位置相关字段
  if (selectVenue.value === 'HEALTH_HOSP') {
    if (hospitalLevelOptions.value.length === 0) {
      queryHospitalLevel()
    }
  } else {
    clearActiveLocationFields()
  }
  // 非健财中心清空场馆名称
  if (selectVenue.value !== 'WEALTH_CENTER') {
    clearVenueNameField()
  }
  // 非需展示场地信息类别清空场地信息
  const needSiteInfo = ['COMMUNITY', 'BYBO', 'WORK_PLACE', 'HOTEL', 'OTHER']
  if (!needSiteInfo.includes(selectVenue.value)) {
    clearSiteInfoField()
  }
  // 非养老社区清空社区名称
  if (selectVenue.value !== 'COMMUNITY') {
    clearCommunityNameField()
  }
  showVenuePickerPopup.value = false
}

// 活动场地选择器取消
const onVenueCancel = () => {
  showVenuePickerPopup.value = false
}

// 活动位置选择器方法
const showActiveLocationPicker = async () => {
  if (!props.editable) return

  try {
    // 如果还没有加载过活动位置数据，先加载
    if (activeLocationOptions.value.length === 0) {
      showLoadingToast({
        message: '加载活动位置数据...',
        forbidClick: true,
      })
      await queryActiveLocation()
      closeToast()
    }

    showActiveLocationPickerPopup.value = true
  } catch (error) {
    closeToast()
    showFailToast('加载活动位置数据失败')
    console.error('Failed to load active location options:', error)
  }
}

const onActiveLocationConfirm = ({ selectedOptions }) => {
  const selectLocation = selectedOptions && selectedOptions[0]

  if (selectLocation && selectLocation.text) {
    localFormData.value.activeLocation = selectLocation.value
  }
  showActiveLocationPickerPopup.value = false
}

const onActiveLocationCancel = () => {
  showActiveLocationPickerPopup.value = false
}

// 医院级别选择器方法
const showHospitalLevelPicker = async () => {
  if (!props.editable) return

  try {
    // 如果还没有加载过医院级别数据，先加载
    if (hospitalLevelOptions.value.length === 0) {
      showLoadingToast({
        message: '加载医院级别数据...',
        forbidClick: true,
      })
      await queryHospitalLevel()
      closeToast()
    }

    showHospitalLevelPickerPopup.value = true
  } catch (error) {
    closeToast()
    showFailToast('加载医院级别数据失败')
    console.error('Failed to load hospital level options:', error)
  }
}

const onHospitalLevelConfirm = (event) => {
  console.log('医院级别确认事件:', event)

  // 处理不同的事件数据结构
  let selectLevel
  if (event && event.selectedOptions && event.selectedOptions[0]) {
    selectLevel = event.selectedOptions[0]
  } else if (event && event.value) {
    selectLevel = event.value
  } else if (event && event.text) {
    selectLevel = event
  } else {
    console.error('无法解析医院级别选择结果:', event)
    showHospitalLevelPickerPopup.value = false
    return
  }

  if (selectLevel && selectLevel.text) {
    localFormData.value.hospitalLevel = selectLevel.value
  }
  showHospitalLevelPickerPopup.value = false
}

const onHospitalLevelCancel = () => {
  showHospitalLevelPickerPopup.value = false
}

// 医院搜索相关方法
const onHospitalInput = async (inputValue) => {
  console.log('=== 医院名称输入事件 ===')
  console.log('原始 inputValue:', inputValue)
  console.log('inputValue 类型:', typeof inputValue)

  // 处理 InputEvent 对象，获取实际输入值
  let searchValue
  if (inputValue && typeof inputValue === 'object' && inputValue.target) {
    // 如果是 InputEvent 对象，从 target.value 获取值
    searchValue = String(inputValue.target.value || '').trim()
  } else if (inputValue && typeof inputValue === 'object' && inputValue.detail) {
    // 如果是 Vant 的事件对象，从 detail 获取值
    searchValue = String(inputValue.detail || '').trim()
  } else {
    // 如果是直接的值，直接使用
    searchValue = String(inputValue || '').trim()
  }

  console.log('处理后的 searchValue:', searchValue)

  // 清空之前的定时器
  if (hospitalSearchTimer.value) {
    clearTimeout(hospitalSearchTimer.value)
  }

  // 如果输入为空，清空搜索结果
  if (!searchValue) {
    hospitalSearchResults.value = []
    console.log('输入为空，清空搜索结果')
    return
  }

  console.log('开始防抖搜索，500ms后执行...')
  // 防抖搜索：用户停止输入500ms后才执行搜索
  hospitalSearchTimer.value = setTimeout(async () => {
    console.log('执行搜索，搜索值:', searchValue)
    await searchHospital(searchValue)
  }, 500)
}

// 搜索医院
const searchHospital = async (searchValue) => {
  try {
    showLoadingToast({
      message: '搜索医院中...',
      forbidClick: true,
    })

    // 模拟API调用
    // const { code, data } = await searchHospitalAPI(searchValue)

    // 模拟后端数据 - 这里应该是从后端API获取的真实数据
    const backendData = [
      {
        hospitalName: `${searchValue}分院`,
        hospitalLevel: '2a',
        feHospitalId: 'H002',
        isCustom: false
      },
      {
        hospitalName: `${searchValue}总院`,
        hospitalLevel: '3a',
        feHospitalId: 'H003',
        isCustom: false
      },
      {
        hospitalName: `${searchValue}人民医院`,
        hospitalLevel: '3a',
        feHospitalId: 'H004',
        isCustom: false
      }
    ]

    // 检查后端数据中是否已经存在用户输入的医院名称
    const existingHospital = backendData.find(hospital =>
      hospital.hospitalName.toLowerCase() === searchValue.toLowerCase()
    )

    // 构建最终的数据
    let mockData = [...backendData]

    // 如果后端数据中没有相同的医院名称，才添加用户输入的作为自定义选项
    if (!existingHospital) {
      mockData.unshift({
        hospitalName: searchValue,
        hospitalLevel: '', // 自定义医院没有等级
        feHospitalId: '', // 自定义医院没有fe编码
        isCustom: true
      })
    }

    const code = 200
    const data = mockData

    if (code === 200 && data) {
      console.log('=== 搜索医院结果处理 ===')
      console.log('原始数据 data:', data)

      // 存储完整的医院数据
      hospitalSearchData.value = data
      console.log('存储的完整数据 hospitalSearchData.value:', hospitalSearchData.value)

      // 为 van-picker 创建简化的选项格式（只包含 text 和 value）
      const pickerOptions = data.map(item => ({
        text: item.hospitalName,
        value: item.feHospitalId // 使用 fe编码 作为 value
      }))

      console.log('转换后的 pickerOptions:', pickerOptions)
      console.log('pickerOptions 类型:', typeof pickerOptions)
      console.log('pickerOptions 是否为数组:', Array.isArray(pickerOptions))

      // 显示搜索结果选择器
      showHospitalSearchResults(pickerOptions)
    }

    closeToast()
  } catch (error) {
    closeToast()
    showFailToast('搜索医院失败')
    console.error('Failed to search hospital:', error)
  }
}

// 显示医院搜索结果选择器
const showHospitalSearchResults = (options) => {
  console.log('=== 显示医院搜索结果选择器 ===')
  console.log('传入的 options:', options)
  console.log('options 类型:', typeof options)
  console.log('options 是否为数组:', Array.isArray(options))

  // 使用 vant 的 Picker 组件显示搜索结果
  // 确保数据格式正确：van-picker 需要 columns 格式
  hospitalSearchResults.value = options

  console.log('设置后的 hospitalSearchResults.value:', hospitalSearchResults.value)
  console.log('hospitalSearchResults.value 类型:', typeof hospitalSearchResults.value)
  console.log('hospitalSearchResults.value 是否为数组:', Array.isArray(hospitalSearchResults.value))

  showHospitalSearchResultsPopup.value = true
}

// 医院搜索结果选择器确认
const onHospitalSearchResultConfirm = (event) => {
  console.log('医院搜索结果确认事件:', event)

  // 处理不同的事件数据结构
  let selectedOption
  if (event && event.selectedOptions && event.selectedOptions[0]) {
    selectedOption = event.selectedOptions[0]
  } else if (event && event.value) {
    selectedOption = event.value
  } else if (event && event.text) {
    selectedOption = event
  } else {
    console.error('无法解析选择结果:', event)
    showHospitalSearchResultsPopup.value = false
    return
  }

  console.log('选中的医院选项:', selectedOption)

  if (selectedOption) {
    // 根据选中的 fe编码 找到完整的医院数据
    const selectedHospital = hospitalSearchData.value.find(
      hospital => hospital.feHospitalId === selectedOption.value
    )

    if (selectedHospital) {
      localFormData.value.hospitalName = selectedHospital.hospitalName
      localFormData.value.hospitalLevel = selectedHospital.hospitalLevel || ''
      localFormData.value.feHospitalId = selectedHospital.feHospitalId || ''

      // 根据是否自定义医院设置字段可编辑性
      updateHospitalFieldsEditability(selectedHospital.isCustom)

      console.log('选中的医院信息:', {
        name: selectedHospital.hospitalName,
        level: selectedHospital.hospitalLevel,
        feCode: selectedHospital.feHospitalId,
        isCustom: selectedHospital.isCustom
      })
    } else {
      console.error('未找到对应的医院数据:', selectedOption)
    }
  }
  showHospitalSearchResultsPopup.value = false
}

// 医院搜索结果选择器取消
const onHospitalSearchResultCancel = () => {
  showHospitalSearchResultsPopup.value = false
}

// 医院搜索结果选择器打开时的调试信息
const onHospitalSearchPickerOpen = () => {
  console.log('=== 医院搜索结果选择器打开 ===')
  console.log('当前 hospitalSearchResults.value:', hospitalSearchResults.value)
  console.log('当前 hospitalSearchResults.value 类型:', typeof hospitalSearchResults.value)
  console.log('当前 hospitalSearchResults.value 是否为数组:', Array.isArray(hospitalSearchResults.value))
  if (Array.isArray(hospitalSearchResults.value)) {
    console.log('数组长度:', hospitalSearchResults.value.length)
    console.log('第一个元素:', hospitalSearchResults.value[0])
    console.log('第一个元素类型:', typeof hospitalSearchResults.value[0])
  }
}

// 更新医院字段的可编辑性
const updateHospitalFieldsEditability = (isCustom) => {
  console.log('更新医院字段可编辑性，isCustom:', isCustom)

  if (!isCustom) {
    // 从后端搜索结果选择，禁用医院级别
    localFormData.value._disableHospitalLevel = true
    console.log('后端医院：禁用医院级别字段')
  } else {
    // 自定义输入，允许修改医院级别
    localFormData.value._disableHospitalLevel = false
    console.log('自定义医院：允许修改医院级别字段')
  }

  // 医院fe编码字段始终禁用，不需要动态控制
}

// 场馆名称搜索相关方法
const onVenueNameInput = async (inputValue) => {
  console.log('=== 场馆名称输入事件 ===')
  console.log('原始 inputValue:', inputValue)
  console.log('inputValue 类型:', typeof inputValue)

  // 处理 InputEvent 对象，获取实际输入值
  let searchValue
  if (inputValue && typeof inputValue === 'object' && inputValue.target) {
    // 如果是 InputEvent 对象，从 target.value 获取值
    searchValue = String(inputValue.target.value || '').trim()
  } else if (inputValue && typeof inputValue === 'object' && inputValue.detail) {
    // 如果是 Vant 的事件对象，从 detail 获取值
    searchValue = String(inputValue.detail || '').trim()
  } else {
    // 如果是直接的值，直接使用
    searchValue = String(inputValue || '').trim()
  }

  console.log('处理后的 searchValue:', searchValue)

  // 清空之前的定时器
  if (venueNameSearchTimer.value) {
    clearTimeout(venueNameSearchTimer.value)
  }

  // 如果输入为空，清空搜索结果
  if (!searchValue) {
    venueNameSearchResults.value = []
    console.log('输入为空，清空搜索结果')
    return
  }

  console.log('开始防抖搜索，500ms后执行...')
  // 防抖搜索：用户停止输入500ms后才执行搜索
  venueNameSearchTimer.value = setTimeout(async () => {
    console.log('执行搜索，搜索值:', searchValue)
    await searchVenueName(searchValue)
  }, 500)
}

// 搜索场馆名称
const searchVenueName = async (searchValue) => {
  try {
    showLoadingToast({
      message: '搜索场馆中...',
      forbidClick: true,
    })

    // 模拟API调用
    // const { code, data } = await searchVenueNameAPI(searchValue)

    // 模拟后端数据 - 这里应该是从后端API获取的真实数据
    const backendData = [
      {
        centerName: `${searchValue}分部`,
        isCustom: false
      },
      {
        centerName: `${searchValue}总部`,
        isCustom: false
      },
      {
        centerName: `${searchValue}中心`,
        isCustom: false
      }
    ]

    // 检查后端数据中是否已经存在用户输入的场馆名称
    const existingVenue = backendData.find(venue =>
      venue.centerName.toLowerCase() === searchValue.toLowerCase()
    )

    // 构建最终的数据
    let mockData = [...backendData]

    // 如果后端数据中没有相同的场馆名称，才添加用户输入的作为自定义选项
    if (!existingVenue) {
      mockData.unshift({
        centerName: searchValue,
        isCustom: true
      })
    }

    const code = 200
    const data = mockData

    if (code === 200 && data) {
      console.log('=== 搜索场馆名称结果处理 ===')
      console.log('原始数据 data:', data)

      // 存储完整的场馆名称数据
      venueNameSearchData.value = data
      console.log('存储的完整数据 venueNameSearchData.value:', venueNameSearchData.value)

      // 为 van-picker 创建简化的选项格式（只包含 text 和 value）
      const pickerOptions = data.map(item => ({
        text: item.centerName,
        value: item.centerName // 使用场馆名称作为 value
      }))

      console.log('转换后的 pickerOptions:', pickerOptions)
      console.log('pickerOptions 类型:', typeof pickerOptions)
      console.log('pickerOptions 是否为数组:', Array.isArray(pickerOptions))

      // 显示搜索结果选择器
      showVenueNameSearchResults(pickerOptions)
    }

    closeToast()
  } catch (error) {
    closeToast()
    showFailToast('搜索场馆名称失败')
    console.error('Failed to search venue name:', error)
  }
}

// 显示场馆名称搜索结果选择器
const showVenueNameSearchResults = (options) => {
  console.log('=== 显示场馆名称搜索结果选择器 ===')
  console.log('传入的 options:', options)
  console.log('options 类型:', typeof options)
  console.log('options 是否为数组:', Array.isArray(options))

  // 使用 vant 的 Picker 组件显示搜索结果
  // 确保数据格式正确：van-picker 需要 columns 格式
  venueNameSearchResults.value = options

  console.log('设置后的 venueNameSearchResults.value:', venueNameSearchResults.value)
  console.log('venueNameSearchResults.value 类型:', typeof venueNameSearchResults.value)
  console.log('venueNameSearchResults.value 是否为数组:', Array.isArray(venueNameSearchResults.value))

  showVenueNameSearchResultsPopup.value = true
}

// 场馆名称搜索结果选择器确认
const onVenueNameSearchResultConfirm = (event) => {
  console.log('场馆名称搜索结果确认事件:', event)

  // 处理不同的事件数据结构
  let selectedOption
  if (event && event.selectedOptions && event.selectedOptions[0]) {
    selectedOption = event.selectedOptions[0]
  } else if (event && event.value) {
    selectedOption = event.value
  } else if (event && event.text) {
    selectedOption = event
  } else {
    console.error('无法解析选择结果:', event)
    showVenueNameSearchResultsPopup.value = false
    return
  }

  console.log('选中的场馆名称选项:', selectedOption)

  if (selectedOption) {
    // 根据选中的场馆名称找到完整的场馆数据
    const selectedVenue = venueNameSearchData.value.find(
      venue => venue.centerName === selectedOption.value
    )

    if (selectedVenue) {
      localFormData.value.centerName = selectedVenue.centerName

      console.log('选中的场馆信息:', {
        name: selectedVenue.centerName,
        isCustom: selectedVenue.isCustom
      })
    } else {
      console.error('未找到对应的场馆名称数据:', selectedOption)
    }
  }
  showVenueNameSearchResultsPopup.value = false
}

// 场馆名称搜索结果选择器取消
const onVenueNameSearchResultCancel = () => {
  showVenueNameSearchResultsPopup.value = false
}

// 场馆名称搜索结果选择器打开时的调试信息
const onVenueNameSearchPickerOpen = () => {
  console.log('=== 场馆名称搜索结果选择器打开 ===')
  console.log('当前 venueNameSearchResults.value:', venueNameSearchResults.value)
  console.log('当前 venueNameSearchResults.value 类型:', typeof venueNameSearchResults.value)
  console.log('当前 venueNameSearchResults.value 是否为数组:', Array.isArray(venueNameSearchResults.value))
  if (Array.isArray(venueNameSearchResults.value)) {
    console.log('数组长度:', venueNameSearchResults.value.length)
    console.log('第一个元素:', venueNameSearchResults.value[0])
    console.log('第一个元素类型:', typeof venueNameSearchResults.value[0])
  }
}

// 数据加载与处理
const loadBranchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      branchOptionsBack.value = [
        {
          branchCode: '1',
          branchName: '北京分公司',
          id: '01',
          itemList: [
            { id: '0101', subbranchCode: '10', subbranchName: '北京本部' }
          ]
        },
        {
          branchCode: '2',
          branchName: '湖北分公司',
          id: '02',
          itemList: [
            { id: '0201', subbranchCode: '10', subbranchName: '武汉本部' },
            { id: '0211', subbranchCode: '20', subbranchName: '宜昌中心支公司' },
            { id: '0212', subbranchCode: '30', subbranchName: '襄阳中心支公司' },
            { id: '0213', subbranchCode: '50', subbranchName: '十堰中心支公司' },
            { id: '0214', subbranchCode: '60', subbranchName: '黄石中心支公司' },
            { id: '0215', subbranchCode: '40', subbranchName: '荆州中心支公司' },
            { id: '0216', subbranchCode: '70', subbranchName: '荆门中心支公司' },
            { id: '0217', subbranchCode: 'A0', subbranchName: '黄冈中心支公司' },
            { id: '0218', subbranchCode: '80', subbranchName: '孝感中心支公司' },
            { id: '0219', subbranchCode: '90', subbranchName: '咸宁中心支公司' },
            { id: '0220', subbranchCode: 'D0', subbranchName: '恩施中心支公司' },
            { id: '0221', subbranchCode: 'C0', subbranchName: '鄂州中心支公司' },
            { id: '0222', subbranchCode: 'G0', subbranchName: '天门中心支公司' },
            { id: '0223', subbranchCode: 'F0', subbranchName: '仙桃中心支公司' },
            { id: '0224', subbranchCode: 'B0', subbranchName: '随州中心支公司' },
            { id: '0225', subbranchCode: 'K0', subbranchName: '武汉本部业务管理二部' },
            { id: '0226', subbranchCode: 'J0', subbranchName: '武汉本部业务管理三部' },
            { id: '0227', subbranchCode: 'E0', subbranchName: '潜江中心支公司' }
          ]
        }
      ]
      branchOptions.value = branchOptionsBack.value.map(item => ({ text: item.branchName, value: item.id }))
      resolve()
    }, 300)
  })
}

const loadSubBranchOptionByBranchCode = (branchCode) => {
  const branch = branchOptionsBack.value.find(item => item.id === branchCode)
  if (branch && branch.itemList) {
    subBranchOption.value = branch.itemList.map(it => ({ text: it.subbranchName, value: it.id }))
  } else {
    subBranchOption.value = []
  }
}

const clearSubBranchData = () => {
  localFormData.value.subbranchCode = ''
  subBranchOption.value = []
}

// 清空活动位置相关字段
const clearActiveLocationFields = () => {
  localFormData.value.activeLocation = ''
  localFormData.value.hospitalName = ''
  localFormData.value.hospitalLevel = ''
  localFormData.value.feHospitalId = ''
  // 重置字段可编辑性
  localFormData.value._disableHospitalLevel = false
  // 医院fe编码字段始终禁用，不需要重置
}

// 清空场馆名称
const clearVenueNameField = () => {
  localFormData.value.centerName = ''
}

// 清空场地信息
const clearSiteInfoField = () => {
  localFormData.value.activeVenueDetail = ''
}

// 清空社区名称
const clearCommunityNameField = () => {
  localFormData.value.communityName = ''
}

const showStrategyPicker = () => {
  if (!props.editable) return
  console.log('Show strategy picker')
}

const showChannelPicker = () => {
  if (!props.editable) return
  console.log('Show channel picker')
}

const showStartTimePicker = () => {
  if (!props.editable) return
  // 打开开始时间选择，不在此时同步 startTimeArray
  showStartTimePopup.value = true
}

const showEndTimePicker = () => {
  if (!props.editable) return
  // 打开结束时间选择并同步当前值
  // 不在此时同步 endTimeArray
  showEndTimePopup.value = true
}

const showHealthRelatePicker = () => {
  if (!props.editable) return
  showHealthRelatePickerPopup.value = true
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

// 时间工具与事件
const pad2 = (n) => String(n).padStart(2, '0')
const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
const splitDateTime = (val) => {
  // 输入: 'YYYY-MM-DD HH:mm'
  const [dateStr, timeStr] = (val || '').split(' ')
  const [y, m, d] = (dateStr || getToday()).split('-')
  const [hh, mm] = (timeStr || '00:00').split(':')
  return {
    d: [parseInt(y, 10), parseInt(m, 10), parseInt(d, 10)],
    t: [parseInt(hh, 10), parseInt(mm, 10)]
  }
}
const toDateObj = (dArr, tArr) => {
  const y = parseInt(dArr[0], 10)
  const m = parseInt(dArr[1], 10) - 1
  const d = parseInt(dArr[2], 10)
  const hh = parseInt(tArr[0], 10)
  const mm = parseInt(tArr[1], 10)
  return new Date(y, m, d, hh, mm, 0, 0)
}

// 校验：结束时间需晚于开始时间
const validateEndAfterStart = (val) => {
  const endVal = val || ''
  const startVal = localFormData.value.startTime || ''
  if (!endVal || !startVal) return true
  const { d: sd, t: st } = splitDateTime(startVal)
  const { d: ed, t: et } = splitDateTime(endVal)
  const sDate = toDateObj(sd, st)
  const eDate = toDateObj(ed, et)
  return eDate.getTime() > sDate.getTime() || '结束时间需晚于开始时间'
}

// 校验：开始时间需早于结束时间
const validateStartBeforeEnd = (val) => {
  const startVal = val || ''
  const endVal = localFormData.value.endTime || ''
  if (!startVal || !endVal) return true
  const { d: sd, t: st } = splitDateTime(startVal)
  const { d: ed, t: et } = splitDateTime(endVal)
  const sDate = toDateObj(sd, st)
  const eDate = toDateObj(ed, et)
  return sDate.getTime() < eDate.getTime() || '开始时间需早于结束时间'
}

const onStartTimeConfirm = async () => {
  const ymd = `${startDateArray.value[0]}-${pad2(startDateArray.value[1])}-${pad2(startDateArray.value[2])}`
  const hh = pad2(startTimeArray.value[0])
  const mm = pad2(startTimeArray.value[1])
  const startStr = `${ymd} ${hh}:${mm}`
  localFormData.value.startTime = startStr
  // 选择开始时间后，主动触发结束时间字段的校验（若已填）
  await nextTick()
  if (formRef.value?.validate && localFormData.value.endTime) {
    try { await formRef.value.validate('endTime') } catch (e) { }
  }
  showStartTimePopup.value = false
}
const onStartTimeCancel = () => {
  showStartTimePopup.value = false
}

const onEndTimeConfirm = async () => {
  const ymd = `${endDateArray.value[0]}-${pad2(endDateArray.value[1])}-${pad2(endDateArray.value[2])}`
  const hh = pad2(endTimeArray.value[0])
  const mm = pad2(endTimeArray.value[1])
  const endStr = `${ymd} ${hh}:${mm}`
  localFormData.value.endTime = endStr
  // 选择结束时间后，主动触发开始时间字段的校验（若已填）
  await nextTick()
  if (formRef.value?.validate && localFormData.value.startTime) {
    try { await formRef.value.validate('startTime') } catch (e) { }
  }
  showEndTimePopup.value = false
}
const onEndTimeCancel = () => {
  showEndTimePopup.value = false
}

// 暴露方法给父组件使用
defineExpose({
  resetForm,
  getFormData,
  validate: () => formRef.value?.validate?.()
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
