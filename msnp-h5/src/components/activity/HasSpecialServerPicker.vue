<template>
  <div class="has-special-server-picker">
    <FormField
      name="hasSpecialServer"
      :rules="props.rules"
      label="活是否包含中医特色服务"
      :required="true"
      type="select"
      :placeholder="displayText"
      :disabled="true"
      :model-value="displayText"
      :show-divider="false"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  rules: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { text: '是', value: '1' },
  { text: '否', value: '0' }
]

const displayText = computed(() => {
  const found = options.find(o => String(o.value) === String(props.modelValue))
  return found ? found.text : '否'
})

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

