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

          <FormField label="活动类别" :required="true" type="select" v-model="localFormData.category" :placeholder="editable ? '请选择' : localFormData.category" :disabled="!editable" @select-click="showCategoryPicker" />

          <FormField label="是否健保通相关" :required="true" type="select" v-model="localFormData.healthInsurance" :placeholder="editable ? '请选择' : localFormData.healthInsurance" :disabled="!editable" @select-click="showHealthInsurancePicker" />

          <FormField label="活动场地" :required="true" type="select" v-model="localFormData.venue" :placeholder="editable ? '请选择' : localFormData.venue" :disabled="!editable" @select-click="showVenuePicker" />

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
      <van-picker :columns="branchOptions" @confirm="onBranchConfirm" @cancel="onBranchCancel" :default-index="0" />
    </van-popup>

    <!-- 中支选择器弹窗 -->
    <van-popup v-model:show="showsubBranchPickerPopup" position="bottom" round>
      <van-picker :columns="subBranchOption" @confirm="onSubBranchConfirm" @cancel="onSubBranchCancel" :default-index="0" />
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
import { ref, computed, watch, defineExpose, defineProps, defineEmits, reactive, nextTick, onMounted } from 'vue'
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

// 监听器
const isSyncingFromProps = ref(false)

watch(() => props.formData, (newVal) => {
  isSyncingFromProps.value = true
  localFormData.value = { ...newVal }
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

const showCategoryPicker = () => {
  if (!props.editable) return
  console.log('Show category picker')
}

const showHealthInsurancePicker = () => {
  if (!props.editable) return
  console.log('Show health insurance picker')
}

const showVenuePicker = () => {
  if (!props.editable) return
  console.log('Show venue picker')
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
