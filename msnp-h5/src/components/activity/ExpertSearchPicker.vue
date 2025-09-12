<template>
  <div class="expert-search-picker">
    <FormField name="doctorName" :rules="props.rules" label="姓名" :required="true" type="select" :placeholder="editable ? '请选择或输入姓名' : modelValue" :disabled="!editable" :model-value="modelValue" @select-click="openPopup" />

    <van-popup v-model:show="showPopup" position="bottom" round>
      <div class="picker-content">
        <div class="picker-header">
          <van-button type="default" size="small" @click="onCancel">取消</van-button>
          <div class="picker-title">选择讲师</div>
          <van-button type="primary" size="small" @click="onConfirm">确定</van-button>
        </div>
        <div class="search-section">
          <van-search v-model="keyword" placeholder="搜索姓名（可模糊）" @input="onSearchInput" @clear="onSearchClear" />
        </div>
        <div class="options-section">
          <!-- 自定义创建选项 -->
          <div v-if="showCustomOption" class="custom-option" :class="{ active: selected && selected.isCustom }" @click="selectCustom">
            <van-icon name="add-o" />
            <span>自己创建：{{ keyword }}</span>
          </div>

          <!-- 结果列表 -->
          <div class="expert-list">
            <div v-for="item in filtered" :key="item.id" class="expert-item" :class="{ active: selected && selected.id === item.id }" @click="selectExpert(item)">
              <div class="line1">
                <span class="name">{{ item.name }}</span>
                <span class="title" v-if="item.title">{{ item.title }}</span>
              </div>
              <div class="line2">{{ item.hospital }}<span v-if="item.department"> - {{ item.department }}</span></div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filtered.length === 0 && !showCustomOption" class="empty-state">
            <van-empty description="暂无匹配的讲师" />
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
  selectedExpertId: { type: String, default: '' },
  editable: { type: Boolean, default: true },
  allowCustom: { type: Boolean, default: true },
  rules: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'update:selectedExpertId', 'expert-selected', 'search-cleared'])

const showPopup = ref(false)
const keyword = ref('')
const selected = ref(null)
const list = ref([])
let searchTimer = null

const openPopup = async () => {
  if (!props.editable) return
  keyword.value = props.modelValue || ''
  selected.value = null
  showPopup.value = true
  if (keyword.value.trim()) {
    await doSearch(true)
  } else {
    list.value = []
  }
}

const filtered = computed(() => {
  if (!keyword.value.trim()) return list.value
  const kw = keyword.value.trim().toLowerCase()
  return list.value.filter(i =>
    i.name.toLowerCase().includes(kw)
  )
})

const showCustomOption = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return false
  if (!props.allowCustom) return false
  return !filtered.value.some(i => i.name.toLowerCase() === kw.toLowerCase())
})

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  if (!keyword.value.trim()) {
    selected.value = null
    emit('search-cleared')
  }
  searchTimer = setTimeout(doSearch, 400)
}

const onSearchClear = () => {
  keyword.value = ''
  selected.value = null
  emit('search-cleared')
}

function selectExpert(item) {
  selected.value = item
}

function selectCustom() {
  selected.value = { isCustom: true, name: keyword.value.trim() }
}

function onCancel() {
  showPopup.value = false
}

function onConfirm() {
  if (!selected.value) return
  if (selected.value.isCustom) {
    emit('update:modelValue', selected.value.name)
    emit('update:selectedExpertId', '')
    emit('expert-selected', { isCustom: true, expertData: null })
  } else {
    emit('update:modelValue', selected.value.name)
    emit('update:selectedExpertId', selected.value.id)
    emit('expert-selected', { isCustom: false, expertData: selected.value })
  }
  showPopup.value = false
}

async function doSearch(preselect = false) {
  const kw = keyword.value.trim()
  if (!kw) {
    list.value = []
    return
  }
  // TODO: 调用后端接口，根据关键字返回讲师列表
  // Mock 数据：根据关键字返回3条示例数据
  list.value = [
    {
      id: 'E001',
      name: `${kw}医生`,
      title: '主任医师',
      hospital: '北京协和医院',
      department: '心内科',
      expertise: '心血管疾病诊疗与预防'
    },
    {
      id: 'E002',
      name: `${kw}教授`,
      title: '副主任医师',
      hospital: '上海瑞金医院',
      department: '内分泌科',
      expertise: '糖尿病、甲状腺疾病管理'
    },
    {
      id: 'E003',
      name: `${kw}专家`,
      title: '主治医师',
      hospital: '北京天坛医院',
      department: '神经内科',
      expertise: '脑血管病急救与康复'
    }
  ]

  if (preselect) {
    tryPreselect()
  }
}

function tryPreselect() {
  // 1) 优先根据已选中的唯一ID进行预选
  const id = (props.selectedExpertId || '').trim()
  if (id) {
    const byId = list.value.find(i => String(i.id) === String(id))
    if (byId) {
      selected.value = byId
      return
    }
  }
  // 2) 其次根据当前姓名进行匹配（先精确，再模糊唯一）
  const name = (props.modelValue || '').trim()
  if (!name) return
  const lower = name.toLowerCase()
  const exact = list.value.find(i => i.name && i.name.toLowerCase() === lower)
  if (exact) {
    selected.value = exact
    return
  }
  const fuzzy = list.value.filter(i => i.name && i.name.toLowerCase().includes(lower))
  if (fuzzy.length === 1) {
    selected.value = fuzzy[0]
  }
}
</script>

<style scoped>
.expert-search-picker {
  padding: 0;
}
.picker-content {
  height: 60vh;
  display: flex;
  flex-direction: column;
}
.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.picker-title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}
.search-section {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.options-section {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.custom-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.custom-option.active {
  background-color: #e8f4ff;
  color: #1989fa;
}
.expert-list {
  padding: 0;
}
.expert-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.expert-item.active {
  background-color: #e8f4ff;
  color: #1989fa;
}
.line1 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.name {
  font-size: 14px;
  font-weight: 600;
}
.title {
  font-size: 12px;
  color: #666;
}
.line2 {
  font-size: 12px;
  color: #666;
}
.empty-state {
  padding: 40px 16px;
  text-align: center;
}
</style>

