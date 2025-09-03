<template>
  <div class="strategy-picker">
    <FormField
      label="战略划分"
      :required="true"
      type="text"
      :placeholder="displayText || (editable ? '自动生成' : '')"
      :disabled="true"
      :model-value="displayText"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  editable: { type: Boolean, default: true },
  branchCode: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

// 分公司到战略的映射
// 01: 北京分公司 -> 1/一战略
// 02: 湖北分公司 -> 2/二战略
const branchToStrategy = (branchCode) => {
  switch (branchCode) {
    case '01':
      return { value: '1', text: '一战略' }
    case '02':
      return { value: '2', text: '二战略' }
    default:
      return { value: '', text: '' }
  }
}

// 根据当前 modelValue 计算展示文本
const displayText = computed(() => {
  if (!props.branchCode) return ''
  const mapped = branchToStrategy(props.branchCode)
  if (!mapped.value) return ''
  return mapped.text
})

// 监听分公司变化，自动更新战略值（不可修改）
watch(
  () => props.branchCode,
  (newVal) => {
    const mapped = branchToStrategy(newVal)
    emit('update:modelValue', mapped.value)
  },
  { immediate: true }
)
</script>

<style scoped>
.strategy-picker { padding: 0; }
</style>


