<template>
  <div class="expert-photo-uploader">
    <div class="label">照片（最多1张）</div>
    <van-uploader
      :max-count="1"
      :after-read="onAfterRead"
      :before-read="onBeforeRead"
      :deletable="editable && !!modelValue && !uploading"
      :disabled="!editable || uploading"
      :accept="'image/*'"
      :preview-full-image="true"
      :file-list="fileList"
      @delete="onDelete"
      capture="environment"
      image-fit="cover"
    />
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // 当前图片URL（可为本地 blob: 预览或服务端URL）
  editable: { type: Boolean, default: true },
  maxSizeMB: { type: Number, default: 5 }, // 默认限制 5MB
  // 可选：自定义上传函数，接收 File，返回 Promise<string>（图片的服务端 URL）
  uploadFn: { type: Function, default: null },
  // 可选：直接在组件内完成上传（无需在父组件传入函数）
  uploadUrl: { type: String, default: '' }, // 你的上传接口地址
  method: { type: String, default: 'POST' },
  fieldName: { type: String, default: 'file' }, // 后端接收文件的字段名
  requestHeaders: { type: Object, default: null }, // 额外请求头（不要手动设置 Content-Type）
  withCredentials: { type: Boolean, default: false }, // 是否携带凭据（cookie）
  extraData: { type: Object, default: null } // 额外表单字段
})

const emit = defineEmits(['update:modelValue', 'upload-start', 'upload-success', 'upload-error'])

const uploading = ref(false)

// 将单一图片的 url 映射为 van-uploader 的 file-list 结构
const fileList = computed(() => {
  if (!props.modelValue) return []
  const item = { url: props.modelValue }
  if (uploading.value) {
    item.status = 'uploading'
    item.message = '上传中'
  }
  return [item]
})

function onBeforeRead(file) {
  const limit = props.maxSizeMB * 1024 * 1024
  const f = Array.isArray(file) ? file[0] : file
  if (f && f.size > limit) {
    alert(`图片大小不能超过${props.maxSizeMB}MB`)
    return false
  }
  return true
}

async function internalUpload(file) {
  if (!props.uploadUrl) throw new Error('未配置 uploadUrl')
  const form = new FormData()
  form.append(props.fieldName || 'file', file)
  if (props.extraData && typeof props.extraData === 'object') {
    Object.entries(props.extraData).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v)
    })
  }

  const fetchOptions = {
    method: props.method || 'POST',
    body: form,
    headers: props.requestHeaders || undefined,
    credentials: props.withCredentials ? 'include' : 'same-origin'
  }

  const res = await fetch(props.uploadUrl, fetchOptions)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()

  // 适配你提供的返回结构：
  // {
  //   code: 200,
  //   success: true,
  //   data: { url: 'http://...' }
  // }
  if (json?.code === 200 && json?.success === true && json?.data?.url) {
    return json.data.url
  }
  throw new Error(json?.message || '上传失败')
}

async function onAfterRead(item) {
  // 支持一次一张；Vant 会传入 { file, content }
  const f = item?.file
  if (!f) return

  // 先生成本地预览 URL（也可使用 item.content 的 base64）
  const previewUrl = URL.createObjectURL(f)
  emit('update:modelValue', previewUrl)

  // 如果既没有自定义上传函数，也没有配置 uploadUrl，则仅做本地预览
  if (!props.uploadFn && !props.uploadUrl) return

  try {
    uploading.value = true
    emit('upload-start')

    // 执行外部上传函数或组件内置上传逻辑
    const url = props.uploadFn ? await props.uploadFn(f) : await internalUpload(f)
    if (!url || typeof url !== 'string') throw new Error('未获得有效的图片 URL')

    // 用服务端 URL 覆盖预览
    emit('update:modelValue', url)
    emit('upload-success', url)
  } catch (e) {
    console.error(e)
    alert(typeof e?.message === 'string' ? e.message : '上传失败，请重试')
    // 失败时清空，避免预览 URL 泄漏
    emit('update:modelValue', '')
    emit('upload-error', e)
  } finally {
    uploading.value = false
    // 回收本地预览 URL
    try { URL.revokeObjectURL(previewUrl) } catch {}
  }
}

function onDelete() {
  try {
    if (props.modelValue && props.modelValue.startsWith('blob:')) {
      URL.revokeObjectURL(props.modelValue)
    }
  } catch {}
  emit('update:modelValue', '')
}
</script>

<style scoped>
.expert-photo-uploader { padding: 0; }
.label {
  font-size: 14px;
  color: #333;
  margin: 0 0 8px 4px;
}
</style>
