<template>
  <div class="hospital-name-only-picker">
    <FormField
      :name="name"
      :rules="props.rules"
      label="医院"
      :required="true"
      type="select"
      :placeholder="editable ? (allowCustom ? '请选择或输入医院名称' : '请选择医院名称') : modelValue"
      :disabled="!editable"
      :model-value="modelValue"
      @select-click="openPopup"
    />

    <van-popup v-model:show="showPopup" position="bottom" round>
      <div class="picker-content">
        <div class="picker-header">
          <van-button type="default" size="small" @click="onCancel">取消</van-button>
          <div class="picker-title">选择医院</div>
          <van-button type="primary" size="small" @click="onConfirm">确定</van-button>
        </div>
        <div class="search-section">
          <van-search v-model="keyword" placeholder="搜索医院名称或输入自定义名称" @input="onSearchInput" @clear="onSearchClear" />
        </div>
        <div class="options-section">
          <!-- 自定义输入选项 -->
          <div v-if="allowCustom && showCustomOption" class="custom-option" :class="{ active: selected && selected.isCustom }" @click="selectCustom">
            <van-icon name="add-o" />
            <span>自己创建：{{ keyword }}</span>
          </div>

          <!-- 搜索结果列表 -->
          <div class="hospital-list">
            <div v-for="item in filtered" :key="item.id || item.hospitalName" class="hospital-item" :class="{ active: selected && (selected.id || selected.hospitalName) === (item.id || item.hospitalName) }" @click="selectHospital(item)">
              <div class="hospital-name">{{ item.hospitalName }}</div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filtered.length === 0 && !showCustomOption" class="empty-state">
            <van-empty description="暂无匹配的医院" />
          </div>
        </div>
      </div>
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
  allowCustom: { type: Boolean, default: true },
  name: { type: String, default: 'hospitalName' }
})

const emit = defineEmits(['update:modelValue', 'hospital-selected'])

const showPopup = ref(false)
const keyword = ref('')
const selected = ref(null)
const list = ref([])
let searchTimer = null

const openPopup = () => {
  if (!props.editable) return
  keyword.value = props.modelValue || ''
  if (!keyword.value) {
    list.value = []
    selected.value = null
  }
  showPopup.value = true
}

const filtered = computed(() => {
  if (!keyword.value.trim()) return list.value
  const kw = keyword.value.trim().toLowerCase()
  return list.value.filter(i => (i.hospitalName || '').toLowerCase().includes(kw))
})

const showCustomOption = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return false
  return !filtered.value.some(i => (i.hospitalName || '').toLowerCase() === kw.toLowerCase())
})

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  if (!keyword.value.trim()) {
    selected.value = null
  }
  searchTimer = setTimeout(doSearch, 400)
}

const onSearchClear = () => {
  keyword.value = ''
  selected.value = null
}

function selectHospital(item) {
  selected.value = item
}

function selectCustom() {
  selected.value = { isCustom: true, hospitalName: keyword.value.trim() }
}

function onCancel() {
  showPopup.value = false
}

function onConfirm() {
  if (!selected.value) return
  const name = selected.value.hospitalName
  if (!name && !selected.value.isCustom) return
  emit('update:modelValue', selected.value.isCustom ? selected.value.hospitalName : name)
  emit('hospital-selected', {
    hospitalName: selected.value.isCustom ? selected.value.hospitalName : name,
    isCustom: !!selected.value.isCustom,
    hospitalData: selected.value.isCustom ? null : selected.value
  })
  showPopup.value = false
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) {
    list.value = []
    return
  }
  // Mock：根据关键字返回示例数据
  list.value = [
    { id: 'H001', hospitalName: `${kw}第一医院` },
    { id: 'H002', hospitalName: `${kw}中心医院` },
    { id: 'H003', hospitalName: `${kw}人民医院` }
  ]
}
</script>

<style scoped>
.hospital-name-only-picker { padding: 0; }
.picker-content { height: 60vh; display: flex; flex-direction: column; }
.picker-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #eee; flex-shrink: 0; }
.picker-title { font-size: 16px; font-weight: 500; color: #323233; }
.search-section { padding: 12px 16px; border-bottom: 1px solid #eee; flex-shrink: 0; }
.options-section { flex: 1; overflow-y: auto; padding: 8px 0; }
.hospital-list { padding: 0; }
.hospital-item { padding: 12px 16px; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.hospital-item.active { background-color: #e8f4ff; color: #1989fa; }
.hospital-name { font-size: 14px; font-weight: 500; color: #323233; }
.custom-option { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f5f5f5; cursor: pointer; }
.custom-option.active { background-color: #e8f4ff; color: #1989fa; }
.empty-state { padding: 40px 16px; text-align: center; }
</style>

