<template>
  <div class="expert-photo-uploader">
    <div class="label">照片（最多1张）</div>
    <van-uploader
      :max-count="1"
      :multiple="false"
      :after-read="onAfterRead"
      :before-read="onBeforeRead"
      :deletable="false"
      :disabled="!editable || uploading"
      :accept="'image/*'"
      :preview-full-image="true"
      v-model:file-list="uploaderList"
      @delete="onDelete"
      capture="environment"
      image-fit="cover"
    >
      <!-- Vant 4 自定义单图预览覆盖层 -->
      <template #preview-cover="{ file }">
        <div class="custom-cover">
          <van-icon name="eye-o" class="cover-btn" @click.stop="preview(file)" />
          <van-icon v-if="editable && !uploading" name="delete" class="cover-btn danger" @click.stop="onDelete" />
        </div>
      </template>
    </van-uploader>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { showImagePreview } from 'vant'

const props = defineProps({
  modelValue: { type: String, default: '' }, // 当前图片URL（可为本地 blob: 预览或服务端URL）
  editable: { type: Boolean, default: true },
  maxSizeMB: { type: Number, default: 5 }, // 默认限制 5MB
  // 可选：自定义上传函数，接收 File，返回 Promise<string | {url:string,id?:string}>
  uploadFn: { type: Function, default: null },
  // 可选：直接在组件内完成上传（无需在父组件传入函数）
  uploadUrl: { type: String, default: '' }, // 你的上传接口地址
  method: { type: String, default: 'POST' },
  fieldName: { type: String, default: 'file' }, // 后端接收文件的字段名
  requestHeaders: { type: Object, default: null }, // 额外请求头（不要手动设置 Content-Type）
  withCredentials: { type: Boolean, default: false }, // 是否携带凭据（cookie）
  extraData: { type: Object, default: null }, // 额外表单字段
  // 预览域名（可选，当回显仅有 key 时用于拼接预览 URL）
  previewBaseUrl: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'upload-start', 'upload-success', 'upload-error'])

const uploading = ref(false)
// 绑定给 van-uploader 的文件列表（Vant 4 需要用 v-model 绑定）
const uploaderList = ref([])

function buildPreviewUrl(val) {
  if (!val) return ''
  // blob: 或 data: 直接返回
  if (/^(blob:|data:)/i.test(val)) return val
  // 完整 http(s) URL：进行编码，避免空格/中文/括号导致不显示
  if (/^https?:\/\//i.test(val)) return encodeURI(val)
  // 仅有 key 且配置了预览域名
  if (props.previewBaseUrl) {
    // 确保 base 以 / 结尾
    const base = props.previewBaseUrl.endsWith('/') ? props.previewBaseUrl : props.previewBaseUrl + '/'
    return encodeURI(base + val)
  }
  // 回退：原样返回（可能无法显示）
  return val
}

// 同步父级传入的 url 到内部 file-list
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const url = buildPreviewUrl(val)
      uploaderList.value = [{ url, isImage: true }]
    } else {
      uploaderList.value = []
    }
  },
  { immediate: true }
)

function onBeforeRead(file) {
  const limit = props.maxSizeMB * 1024 * 1024
  const f = Array.isArray(file) ? file[0] : file
  if (f && f.size > limit) {
    alert(`图片大小不能超过${props.maxSizeMB}MB`)
    return false
  }
  // 只能上传图片
  if (f && !/^image\//i.test(f.type)) {
    alert('只能上传图片文件')
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
  // { code:200, success:true, data:{ id:'key', url:'http://...' } }
  if (json?.code === 200 && json?.success === true && json?.data?.url) {
    return { url: json.data.url, id: json.data.id || '' }
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
    const result = props.uploadFn ? await props.uploadFn(f) : await internalUpload(f)
    let url, id
    if (typeof result === 'string') {
      url = result
      // 从 URL 兜底提取 key 作为 id（最后一个路径段）
      try { const parts = url.split('/'); id = parts[parts.length - 1] } catch { id = '' }
    } else if (result && typeof result === 'object') {
      url = result.url
      id = result.id || ''
    }
    if (!url || typeof url !== 'string') throw new Error('未获得有效的图片 URL')

    // 用服务端 URL 覆盖预览
    emit('update:modelValue', url)
    // 向父级回传 { url, id }，用于保存时仅提交 id（key）
    emit('upload-success', { url, id })
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

function preview(file) {
  const url = file?.url || buildPreviewUrl(props.modelValue)
  if (!url) return
  showImagePreview({ images: [url] })
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
.custom-cover {
  position: absolute;
  right: 4px;
  bottom: 4px;
  left: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  pointer-events: auto;
}
.cover-btn {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.cover-btn.danger { background: rgba(255, 77, 79, 0.9); }
</style>
