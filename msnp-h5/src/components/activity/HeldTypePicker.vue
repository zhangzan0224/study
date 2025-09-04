<template>
  <div class="method-picker">
    <FormField
      name="heldType"
      :rules="props.rules"
      label="活动方式"
      :required="true"
      type="select"
      :placeholder="editable ? '请选择' : displayText"
      :disabled="!editable"
      :model-value="displayText"
      @select-click="onOpen"
    />

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="pickerColumns"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="defaultIndex"
        title="选择活动方式"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  editable: { type: Boolean, default: true },
  rules: { type: Array, default: () => [] },
  // 可选：允许外部自定义选项；不传则使用默认
  options: {
    type: Array,
    default: () => ([
      { code: 'ONLINE', text: '线上' },
      { code: 'OFFLINE', text: '线下' },
      { code: 'BOTH', text: '线上+线下' }
    ])
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)

const normalizedOptions = computed(() =>
  (props.options || []).map(o => ({
    text: o.text,
    value: o.code
  }))
)

const displayText = computed(() => {
  const found = normalizedOptions.value.find(o => o.value === props.modelValue)
  return found ? found.text : ''
})

const pickerColumns = computed(() => normalizedOptions.value)

const defaultIndex = computed(() => {
  const idx = pickerColumns.value.findIndex(o => o.value === props.modelValue)
  return idx >= 0 ? idx : 0
})

const onOpen = () => {
  if (!props.editable) return
  showPicker.value = true
}

const onConfirm = ({ selectedOptions }) => {
  const select = selectedOptions && selectedOptions[0]
  if (select) emit('update:modelValue', select.value)
  showPicker.value = false
}

const onCancel = () => { showPicker.value = false }
</script>

<style scoped>
.method-picker { padding: 0; }
</style>

