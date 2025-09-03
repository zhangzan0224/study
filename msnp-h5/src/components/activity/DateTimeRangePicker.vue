<template>
  <div class="datetime-range-picker">
    <!-- 开始时间 -->
    <FormField 
      label="活动开始时间" 
      name="startTime" 
      :required="true" 
      type="select" 
      :placeholder="editable ? '请选择' : startTime" 
      :disabled="!editable" 
      :rules="[
        { required: true, message: '请选择开始时间' },
        { validator: validateStartBeforeEnd }
      ]"
      :value="startTime"
      @select-click="showStartTimePicker" 
    />

    <!-- 结束时间 -->
    <FormField 
      label="活动结束时间" 
      name="endTime" 
      :required="true" 
      type="select" 
      :placeholder="editable ? '请选择' : endTime" 
      :disabled="!editable" 
      :rules="[
        { required: true, message: '请选择结束时间' },
        { validator: validateEndAfterStart }
      ]"
      :value="endTime"
      @select-click="showEndTimePicker" 
    />

    <!-- 开始时间 PickerGroup 弹窗（日期+时间） -->
    <van-popup v-model:show="showStartTimePopup" position="bottom" round>
      <van-picker-group 
        title="选择开始时间" 
        :tabs="['选择日期','选择时间']" 
        @confirm="onStartTimeConfirm" 
        @cancel="onStartTimeCancel"
      >
        <van-date-picker v-model="startDateArray" :columns-type="['year','month','day']" />
        <van-time-picker v-model="startTimeArray" :columns-type="['hour','minute']" />
      </van-picker-group>
    </van-popup>

    <!-- 结束时间 PickerGroup 弹窗（日期+时间） -->
    <van-popup v-model:show="showEndTimePopup" position="bottom" round>
      <van-picker-group 
        title="选择结束时间" 
        :tabs="['选择日期','选择时间']" 
        @confirm="onEndTimeConfirm" 
        @cancel="onEndTimeCancel"
      >
        <van-date-picker v-model="endDateArray" :columns-type="['year','month','day']" />
        <van-time-picker v-model="endTimeArray" :columns-type="['hour','minute']" />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  editable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:startTime', 'update:endTime'])

// 响应式数据
const showStartTimePopup = ref(false)
const showEndTimePopup = ref(false)
const startDateArray = ref([])
const endDateArray = ref([])
const startTimeArray = ref([0, 0])
const endTimeArray = ref([0, 0])

// 计算属性
const startTime = computed({
  get: () => props.startTime,
  set: (val) => emit('update:startTime', val)
})

const endTime = computed({
  get: () => props.endTime,
  set: (val) => emit('update:endTime', val)
})

// 时间工具函数
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

// 校验函数
const validateEndAfterStart = (val) => {
  const endVal = val || ''
  const startVal = props.startTime || ''
  if (!endVal || !startVal) return true
  const { d: sd, t: st } = splitDateTime(startVal)
  const { d: ed, t: et } = splitDateTime(endVal)
  const sDate = toDateObj(sd, st)
  const eDate = toDateObj(ed, et)
  return eDate.getTime() > sDate.getTime() || '结束时间需晚于开始时间'
}

const validateStartBeforeEnd = (val) => {
  const startVal = val || ''
  const endVal = props.endTime || ''
  if (!startVal || !endVal) return true
  const { d: sd, t: st } = splitDateTime(startVal)
  const { d: ed, t: et } = splitDateTime(endVal)
  const sDate = toDateObj(sd, st)
  const eDate = toDateObj(ed, et)
  return sDate.getTime() < eDate.getTime() || '开始时间需早于结束时间'
}

// 方法
const showStartTimePicker = () => {
  if (!props.editable) return
  showStartTimePopup.value = true
}

const showEndTimePicker = () => {
  if (!props.editable) return
  showEndTimePopup.value = true
}

const onStartTimeConfirm = async () => {
  const ymd = `${startDateArray.value[0]}-${pad2(startDateArray.value[1])}-${pad2(startDateArray.value[2])}`
  const hh = pad2(startTimeArray.value[0])
  const mm = pad2(startTimeArray.value[1])
  const startStr = `${ymd} ${hh}:${mm}`
  startTime.value = startStr
  
  // 触发结束时间字段的校验（若已填）
  await nextTick()
  // 这里可以通过事件通知父组件进行表单校验
  emit('validate-field', 'endTime')
  
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
  endTime.value = endStr
  
  // 触发开始时间字段的校验（若已填）
  await nextTick()
  // 这里可以通过事件通知父组件进行表单校验
  emit('validate-field', 'startTime')
  
  showEndTimePopup.value = false
}

const onEndTimeCancel = () => {
  showEndTimePopup.value = false
}

// 生命周期
onMounted(() => {
  // 不设置默认开始/结束日期，若已有值仅同步时间部分
  if (props.startTime) {
    const { t: st } = splitDateTime(props.startTime)
    startTimeArray.value = st
  }
  if (props.endTime) {
    const { t: et } = splitDateTime(props.endTime)
    endTimeArray.value = et
  }
})

// 监听器 - 当props变化时同步时间数组
watch(() => props.startTime, (newVal) => {
  if (newVal) {
    const { t: st } = splitDateTime(newVal)
    startTimeArray.value = st
  }
})

watch(() => props.endTime, (newVal) => {
  if (newVal) {
    const { t: et } = splitDateTime(newVal)
    endTimeArray.value = et
  }
})
</script>

<style scoped>
.datetime-range-picker { padding: 0; }
</style>
