<template>
  <div class="sign-qrcode-picker">
    <FormField
      name="signQrcode"
      :rules="props.rules"
      label="是否生成签到二维码"
      :required="true"
      type="select"
      :placeholder="editable ? '请选择' : displayText"
      :disabled="!editable"
      :model-value="displayText"
      @select-click="onOpen"
    />

    <!-- 预览：当选择生成二维码且传入了链接与海报模板时，展示合成预览 -->
    <div v-if="modelValue === '1' && qrLink && posterImage" class="qr-poster">
      <div class="poster-bg" :style="posterStyle">
        <div class="qr-box" :style="qrBoxStyle">
          <img :src="qrImageUrl" alt="二维码" class="qr-img" />
        </div>
      </div>
    </div>

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="pickerColumns"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="defaultIndex"
        title="选择是否生成签到二维码"
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
  // 新增：二维码链接与海报模板
  qrLink: { type: String, default: '' },
  posterImage: { type: String, default: '' },
  // 可配置的二维码生成 API（默认使用开源在线接口；生产可切换为自有服务）
  qrApiBase: { type: String, default: 'https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=' },
  // 新增：二维码在模板中的位置（百分比），默认基于示例图估算
  qrBox: {
    type: Object,
    default: () => ({ left: 0.12, top: 0.34, width: 0.76, height: 0.44 })
  }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)

// 固定选项：是/否，对应值 1/0
const options = [
  { text: '是', value: '1' },
  { text: '否', value: '0' }
]

const pickerColumns = computed(() => options)

const displayText = computed(() => {
  const found = options.find(o => o.value === props.modelValue)
  return found ? found.text : ''
})

const defaultIndex = computed(() => {
  const idx = options.findIndex(o => o.value === props.modelValue)
  return idx >= 0 ? idx : 0
})

const qrImageUrl = computed(() => props.qrLink ? `${props.qrApiBase}${encodeURIComponent(props.qrLink)}` : '')

const posterStyle = computed(() => ({
  backgroundImage: props.posterImage ? `url(${props.posterImage})` : 'none'
}))

const qrBoxStyle = computed(() => {
  const b = props.qrBox || { left: 0, top: 0, width: 1, height: 1 }
  const toPct = (n) => `${Math.max(0, Math.min(1, Number(n) || 0)) * 100}%`
  return {
    left: toPct(b.left),
    top: toPct(b.top),
    width: toPct(b.width),
    height: toPct(b.height)
  }
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
.sign-qrcode-picker { padding: 0; }

/* 预览容器：宽度 100%，按模板纵横比占位；如未知比，可固定高度 */
.qr-poster { margin-top: 12px; }
.poster-bg {
  position: relative;
  width: 100%;
  /* 若已知模板纵横比，可用 padding-bottom 百分比来保持比例；这里用固定高度作为示例 */
  height: 420px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
}
/* 二维码所在的白色框位置 - 用百分比精确定位，确保始终在框内
   以下参数需要根据你的模板来微调（当前基于示例图估算）： */
.qr-box {
  position: absolute;
  /* 这些数值用于将二维码放入白色方框内（约略居中） */
  left: 12%;
  top: 34%;
  width: 76%;
  height: 44%;
  /* 保证截断在框内 */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保证完整显示且不溢出 */
}
</style>

