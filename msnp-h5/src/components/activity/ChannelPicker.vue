<template>
  <div class="channel-picker">
    <FormField
      name="activeChannel"
      :rules="props.rules"
      label="活动渠道"
      :required="true"
      type="select"
      :placeholder="editable ? '请选择' : displayText"
      :disabled="!editable"
      :model-value="displayText"
      @select-click="onOpen"
    />

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="options"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="defaultIndex"
        title="选择活动渠道"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  editable: { type: Boolean, default: true },
  rules: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const options = ref([])

// 模拟接口请求，提供渠道选项
async function fetchChannelOptions() {
  // 示例静态数据
  options.value = [
    { text: '线上渠道', value: 'ONLINE' },
    { text: '线下渠道', value: 'OFFLINE' },
    { text: '合作渠道', value: 'PARTNER' }
  ]
}

onMounted(() => {
  fetchChannelOptions()
})

const displayText = computed(() => {
  const found = options.value.find(o => o.value === props.modelValue)
  return found ? found.text : ''
})

const defaultIndex = computed(() => {
  const idx = options.value.findIndex(o => o.value === props.modelValue)
  return idx >= 0 ? idx : 0
})

const onOpen = () => {
  if (!props.editable) return
  showPicker.value = true
}

const onConfirm = ({ selectedOptions }) => {
  const select = selectedOptions && selectedOptions[0]
  if (select) {
    emit('update:modelValue', select.value)
  }
  showPicker.value = false
}

const onCancel = () => { 
  showPicker.value = false 
}
</script>

<style scoped>
.channel-picker { padding: 0; }
</style>
