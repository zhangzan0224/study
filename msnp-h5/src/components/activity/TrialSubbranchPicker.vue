<template>
  <div class="trial-subbranch-picker">
    <FormField
      label="试点中支"
      type="select"
      :disabled="!editable || !isAdmin"
      :placeholder="'请选择'"
      :show-divider="false"
      :model-value="displayText"
      @select-click="onOpenPicker"
    />

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="options"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="defaultIndex"
        title="选择试点中支"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'
import { getTrialSubbranchValue } from '@/api/activity.js'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  editable: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  // 中支编码，用于按中支拉取当前值
  subbranchCode: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
// 固定选项：0=否，1=一期，2=二期
const options = ref([
  { text: '否', value: '0' },
  { text: '一期', value: '1' },
  { text: '二期', value: '2' }
])

const valueToText = (val) => {
  const found = options.value.find(o => String(o.value) === String(val))
  return found ? found.text : ''
}

const displayText = computed(() => valueToText(props.modelValue))

const defaultIndex = computed(() => {
  const idx = options.value.findIndex(o => String(o.value) === String(props.modelValue))
  return idx >= 0 ? idx : 0
})

const onOpenPicker = () => {
  if (!props.editable || !props.isAdmin) return
  showPicker.value = true
}

const onConfirm = ({ selectedOptions }) => {
  const selectItem = selectedOptions && selectedOptions[0]
  if (selectItem && selectItem.value !== undefined) {
    emit('update:modelValue', selectItem.value)
  }
  showPicker.value = false
}

const onCancel = () => { showPicker.value = false }

const fetchCurrent = async (subbranchCode) => {
  // 选项固定，不随接口变化；仅获取当前值
  if (!subbranchCode) {
    if (props.modelValue === '' || props.modelValue === undefined || props.modelValue === null) {
      emit('update:modelValue', '0')
    }
    return
  }
  try {
    const res = await getTrialSubbranchValue(subbranchCode)
    const current = res?.data?.current ?? '0'
    if (props.modelValue === '' || props.modelValue === undefined || props.modelValue === null || String(props.modelValue) !== String(current)) {
      emit('update:modelValue', String(current))
    }
  } catch (e) {
    // 接口失败则默认“0”
    if (props.modelValue === '' || props.modelValue === undefined || props.modelValue === null) {
      emit('update:modelValue', '0')
    }
  }
}

watch(() => props.subbranchCode, (val) => {
  fetchCurrent(val)
}, { immediate: true })

onMounted(() => {
  if (props.subbranchCode) fetchCurrent(props.subbranchCode)
})
</script>

<style scoped>
.trial-subbranch-picker { }
</style>
