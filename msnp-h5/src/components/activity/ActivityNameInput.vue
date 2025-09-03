<template>
  <FormField 
    label="活动名称" 
    :required="true" 
    type="textarea" 
    :modelValue="modelValue" 
    @update:modelValue="$emit('update:modelValue', $event)"
    placeholder="请输入活动名称" 
    :max-length="30" 
    :disabled="!editable" 
    :rows="2" 
    name="name" 
  />
</template>

<script setup>
import FormField from '@/components/base/FormField.vue'

defineProps({
  modelValue: { type: String, default: '' },
  editable: { type: Boolean, default: true }
})

defineEmits(['update:modelValue'])
</script>
