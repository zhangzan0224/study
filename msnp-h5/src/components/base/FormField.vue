<template>
  <div class="form-field" :class="{ 'has-required': required }">
    <!-- 普通输入框 -->
    <template v-if="type === 'input'">
      <van-field v-model="inputValue" :required="required" :label="label" :placeholder="placeholder" :maxlength="maxLength" :disabled="disabled" :show-word-limit="showCounter && maxLength" :label-width="labelWidth" input-align="right" @input="handleInput" @blur="handleBlur" :name="name" :rules="computedRules" :class="fieldClasses" />
    </template>

    <!-- 文本域 -->
    <template v-else-if="type === 'textarea'">
      <div class="textarea-field">
        <div class="textarea-label" :class="{ 'required': required }">
          {{ label }}
        </div>
        <van-field v-model="inputValue" type="textarea" :placeholder="placeholder" :maxlength="maxLength" :disabled="disabled" :rows="rows" :show-word-limit="showCounter && maxLength" :label-width="labelWidth" @input="handleInput" @blur="handleBlur" :name="name" :rules="computedRules" :class="['textarea-control', fieldClasses]" />
      </div>
    </template>

    <!-- 选择器 -->
    <template v-else-if="type === 'select'">
      <van-field :model-value="selectDisplayValue" :required="required" :label="label" :placeholder="placeholder" readonly is-link input-align="right" :label-width="labelWidth" @click="handleSelectClick" :name="name" :rules="computedRules" :class="[fieldClasses, { 'field-placeholder': !modelValue }, 'select-field']" />
    </template>

    <!-- 只读文本 -->
    <template v-else-if="type === 'text'">
      <van-field :model-value="modelValue || placeholder" :required="required" :label="label" readonly input-align="right" :label-width="labelWidth" :name="name" :rules="computedRules" :class="[fieldClasses, { 'field-placeholder': !modelValue }]" />
    </template>

    <div v-if="showDivider" class="field-divider"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'input', // input, textarea, select, text
    validator: value => ['input', 'textarea', 'select', 'text'].includes(value)
  },
  placeholder: {
    type: String,
    default: '请输入'
  },
  labelWidth: {
    type: String,
    default: '150px'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number,
    default: null
  },
  showCounter: {
    type: Boolean,
    default: true
  },
  showDivider: {
    type: Boolean,
    default: true
  },
  rows: {
    type: Number,
    default: 3
  },
  options: {
    type: Array,
    default: () => []
  },
  name: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'select-click', 'input', 'blur'])

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// 已由 selectDisplayValue 取代

// 选择器展示值：当未选择时给空字符串，避免用占位符占位，从而使校验正常识别为空
const selectDisplayValue = computed(() => {
  if (props.type !== 'select') return props.modelValue || props.placeholder
  if (!props.modelValue) return ''
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option ? option.text : String(props.modelValue)
})

const fieldClasses = computed(() => {
  return {
    'custom-field': true,
    'field-disabled': props.disabled
  }
})

const computedRules = computed(() => {
  if (props.rules && props.rules.length) return props.rules
  if (!props.required) return []
  if (props.type === 'select') {
    const message = `请选择${props.label}`
    return [{ validator: () => !!props.modelValue, message }]
  }
  const message = `请输入${props.label}`
  return [{ required: true, message }]
})

const handleSelectClick = () => {
  if (props.type === 'select' && !props.disabled) {
    emit('select-click')
  }
}

const handleInput = (value) => {
  emit('input', value)
}

const handleBlur = (value) => {
  emit('blur', value)
}
</script>

<style scoped>
.form-field {
  background-color: #ffffff;
}

/* 覆盖 Vant Field 样式以匹配设计稿 */
.form-field :deep(.van-field) {
  padding: 15px 0;
  background-color: transparent;
}

.form-field :deep(.van-field__label) {
  color: rgba(51, 51, 51, 1);
  font-size: 15px;
  font-weight: normal;
  line-height: 21px;
  margin-right: 20px;
}

.form-field :deep(.van-field__control) {
  color: rgba(51, 51, 51, 1);
  font-size: 15px;
  font-weight: normal;
  line-height: 21px;
  text-align: right;
}

.form-field :deep(.van-field__control::placeholder) {
  color: rgba(153, 153, 153, 1);
}

/* 选择器校验错误信息右对齐 */
.select-field :deep(.van-field__error-message) {
  text-align: right;
}

/* 选择器占位符样式 */
.field-placeholder :deep(.van-field__control) {
  color: rgba(153, 153, 153, 1) !important;
}

/* 文本域容器样式 */
.textarea-field {
  padding: 15px 0;
  background-color: #ffffff;
}

/* 文本域标签样式 */
.textarea-label {
  color: rgba(51, 51, 51, 1);
  font-size: 15px;
  font-weight: normal;
  line-height: 21px;
  margin-bottom: 11px;
}

.textarea-label.required::before {
  content: '*';
  color: rgba(255, 0, 0, 0.9);
  margin-right: 4px;
}

/* 文本域控件样式 */
.textarea-control {
  padding: 0 !important;
}

.textarea-control :deep(.van-field) {
  padding: 0 !important;
  background-color: transparent;
}

.textarea-control :deep(.van-field__control) {
  background-color: rgba(250, 250, 250, 1);
  border-radius: 8px;
  padding: 14px 15px;
  text-align: left;
  width: 100%;
  color: rgba(51, 51, 51, 1);
  font-size: 15px;
  font-weight: normal;
  line-height: 21px;
}

.textarea-control :deep(.van-field__control::placeholder) {
  color: rgba(153, 153, 153, 1);
}

/* 字符计数样式 */
.form-field :deep(.van-field__word-limit) {
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  line-height: 20px;
  margin-top: 11px;
}

/* 文本域字符计数位置调整 */
.textarea-control :deep(.van-field__word-limit) {
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  line-height: 20px;
  margin-top: 11px;
  text-align: right;
}

/* 必填标记样式 */
/* .form-field.has-required :deep(.van-field__label) {
  color: rgba(51, 51, 51, 1);
}

.form-field.has-required :deep(.van-field__label::first-letter) {
  color: rgba(255, 0, 0, 0.9);
} */

/* 选择器箭头 */
.form-field :deep(.van-field--clickable .van-field__right-icon) {
  width: 18px;
  height: 18px;
}

/* 禁用状态 */
.field-disabled :deep(.van-field__control) {
  color: rgba(153, 153, 153, 1);
}

/* 分割线 */
.field-divider {
  background-color: rgba(242, 242, 242, 1);
  width: 100%;
  height: 1px;
  margin: 0 auto;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .form-field :deep(.van-field) {
    /* padding: 15px 10px; */
  }

  .textarea-field {
    padding: 15px 0;
  }

  .field-divider {
    width: calc(100% - 30px);
    margin: 0 15px;
  }
}
</style>
