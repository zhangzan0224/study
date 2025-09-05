<template>
  <div class="has-special-server-picker">
    <FormField
      name="hasSpecialServer"
      :rules="props.rules"
      label="活是否包含中医特色服务"
      :required="true"
      type="select"
      :placeholder="editable ? '请选择' : displayText"
      :disabled="!editable"
      :model-value="displayText"
      :show-divider="false"
      @select-click="onOpen"
    />

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="pickerColumns"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="defaultIndex"
        title="选择是否包含中医特色服务"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  editable: { type: Boolean, default: true },
  rules: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const options = [
  { text: '是', value: '1' },
  { text: '否', value: '0' }
]

const pickerColumns = computed(() => options)

const displayText = computed(() => {
  const found = options.find(o => String(o.value) === String(props.modelValue))
  return found ? found.text : ''
})

const defaultIndex = computed(() => {
  const idx = options.findIndex(o => String(o.value) === String(props.modelValue))
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

onMounted(() => {
  // 默认值为否（0），若父级未传值则自动回填
  if (props.modelValue === '' || props.modelValue === undefined || props.modelValue === null) {
    emit('update:modelValue', '0')
  }
})
</script>

<style scoped>
.has-special-server-picker { padding: 0; }
</style>

