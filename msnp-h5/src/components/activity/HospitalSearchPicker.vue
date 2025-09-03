<template>
  <div class="hospital-search-picker">
    <FormField label="医院名称" :required="true" type="select" :placeholder="editable ? '请选择或输入医院名称' : hospitalName" :disabled="!editable" :model-value="hospitalName" @select-click="showHospitalSearchPopup" />

    <FormField label="医院级别" :required="true" type="select" :placeholder="editable ? '请选择' : ''" :disabled="!editable || disableHospitalLevel" :model-value="hospitalLevel" :options="hospitalLevelOptions" @select-click="showHospitalLevelPicker" />

    <FormField label="医院fe编码" type="input" v-model="feHospitalId" placeholder="请输入医院fe编码" :disabled="true" />

    <!-- 医院级别选择器弹窗 -->
    <van-popup v-model:show="showHospitalLevelPickerPopup" position="bottom" round>
      <van-picker :columns="hospitalLevelOptions" @confirm="onHospitalLevelConfirm" @cancel="onHospitalLevelCancel" :default-index="hospitalLevelDefaultIndex" title="选择医院级别" />
    </van-popup>

    <!-- 医院搜索结果选择器弹窗 -->
    <van-popup v-model:show="showHospitalSearchResultsPopup" position="bottom" round>
      <div class="hospital-picker-content">
        <div class="picker-header">
          <van-button type="default" size="small" @click="onHospitalSearchCancel">取消</van-button>
          <div class="picker-title">选择医院</div>
          <van-button type="primary" size="small" @click="onHospitalSearchConfirm">确定</van-button>
        </div>
        <div class="search-section">
          <van-search v-model="searchKeyword" placeholder="搜索医院名称或输入自定义名称" @input="onSearchInput" @clear="onSearchClear" />
        </div>
        <div class="options-section">
          <!-- 自定义输入选项 -->
          <div v-if="showCustomOption" class="custom-option" :class="{ active: selectedHospital && selectedHospital.isCustom }" @click="selectCustomHospital">
            <van-icon name="add-o" />
            <span>自己创建：{{ searchKeyword }}</span>
          </div>

          <!-- 搜索结果列表 -->
          <div class="hospital-list">
            <div v-for="hospital in filteredHospitals" :key="hospital.feHospitalId || hospital.hospitalName" class="hospital-item" :class="{ active: selectedHospital && (selectedHospital.feHospitalId || selectedHospital.hospitalName) === (hospital.feHospitalId || hospital.hospitalName) }" @click="selectHospital(hospital)">
              <div class="hospital-main-info">
                <div class="hospital-name">{{ hospital.hospitalName }}</div>
                <div class="hospital-details">
                  <span v-if="hospital.hospitalLevel">级别: {{ hospital.hospitalLevel }}</span>
                  <span v-if="hospital.location">{{ hospital.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredHospitals.length === 0 && !showCustomOption" class="empty-state">
            <van-empty description="暂无匹配的医院" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, defineProps, defineEmits, onMounted } from 'vue'
import { showLoadingToast, closeToast, showFailToast } from 'vant'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  hospitalName: { type: String, default: '' },
  hospitalLevel: { type: String, default: '' },
  feHospitalId: { type: String, default: '' },
  disableHospitalLevel: { type: Boolean, default: false },
  editable: { type: Boolean, default: true }
})

const emit = defineEmits([
  'update:hospitalName',
  'update:hospitalLevel',
  'update:feHospitalId',
  'update:disableHospitalLevel',
  'hospital-selected'
])

const showHospitalLevelPickerPopup = ref(false)
const showHospitalSearchResultsPopup = ref(false)
const hospitalLevelOptions = ref([])
const hospitalSearchData = ref([])
const hospitalSearchTimer = ref(null)
const searchKeyword = ref('')
const selectedHospital = ref(null)

const hospitalName = computed({
  get: () => props.hospitalName,
  set: (val) => emit('update:hospitalName', val)
})

const hospitalLevel = computed({
  get: () => props.hospitalLevel,
  set: (val) => emit('update:hospitalLevel', val)
})

const feHospitalId = computed({
  get: () => props.feHospitalId,
  set: (val) => emit('update:feHospitalId', val)
})

const disableHospitalLevel = computed({
  get: () => props.disableHospitalLevel,
  set: (val) => emit('update:disableHospitalLevel', val)
})

// 移除 hospitalLevelText，展示由 FormField + options 负责

const hospitalLevelDefaultIndex = computed(() => {
  const idx = hospitalLevelOptions.value.findIndex(o => o.value === props.hospitalLevel)
  return idx >= 0 ? idx : 0
})

const filteredHospitals = computed(() => {
  if (!searchKeyword.value.trim()) {
    return hospitalSearchData.value
  }

  const keyword = searchKeyword.value.toLowerCase()
  return hospitalSearchData.value.filter(hospital =>
    hospital.hospitalName.toLowerCase().includes(keyword)
  )
})

const showCustomOption = computed(() => {
  return searchKeyword.value.trim() &&
    !filteredHospitals.value.some(hospital =>
      hospital.hospitalName.toLowerCase() === searchKeyword.value.trim().toLowerCase()
    )
})



// Immediately load hospital level options on component setup
// queryHospitalLevel()

const showHospitalLevelPicker = async () => {
  if (!props.editable) return
  // Data is already loaded or is loading, just show the popup
  if (hospitalLevelOptions.value.length === 0) {
    showFailToast('医院级别数据仍在加载中')
    return
  }
  showHospitalLevelPickerPopup.value = true
}

const onHospitalLevelConfirm = ({ selectedOptions }) => {
  const selectLevel = selectedOptions && selectedOptions[0]
  if (selectLevel && selectLevel.text) {
    hospitalLevel.value = selectLevel.value
  }
  showHospitalLevelPickerPopup.value = false
}

const onHospitalLevelCancel = () => {
  showHospitalLevelPickerPopup.value = false
}

const showHospitalSearchPopup = () => {
  if (!props.editable) return

  // Reset state when opening the popup
  searchKeyword.value = props.hospitalName || ''
  hospitalSearchData.value = []
  initializeSelectedHospital()

  showHospitalSearchResultsPopup.value = true
}

const initializeSelectedHospital = () => {
  if (props.hospitalName) {
    const hospital = hospitalSearchData.value.find(h => h.hospitalName === props.hospitalName)
    if (hospital) {
      selectedHospital.value = hospital
    } else {
      selectedHospital.value = {
        hospitalName: props.hospitalName,
        isCustom: true
      }
    }
  } else {
    selectedHospital.value = null
  }
}

const selectHospital = (hospital) => {
  selectedHospital.value = hospital
}

const selectCustomHospital = () => {
  selectedHospital.value = {
    hospitalName: searchKeyword.value.trim(),
    isCustom: true
  }
}

const onSearchInput = () => {
  // Clear selection when searching
  if (selectedHospital.value && !selectedHospital.value.isCustom) {
    const stillExists = filteredHospitals.value.some(h =>
      (h.feHospitalId || h.hospitalName) === (selectedHospital.value.feHospitalId || selectedHospital.value.hospitalName)
    )
    if (!stillExists) {
      selectedHospital.value = null
    }
  }
}

const onSearchClear = () => {
  searchKeyword.value = ''
  selectedHospital.value = null
}

const onHospitalSearchConfirm = () => {
  if (!selectedHospital.value) {
    showFailToast('请选择或输入医院名称')
    return
  }

  hospitalName.value = selectedHospital.value.hospitalName
  hospitalLevel.value = selectedHospital.value.hospitalLevel || ''
  feHospitalId.value = selectedHospital.value.feHospitalId || ''
  console.log('selectedHospital.value', selectedHospital.value)
  console.log('hospitalLevel.value', hospitalLevel.value)
  console.log('feHospitalId.value', feHospitalId.value)
  console.log('hospitalName.value', hospitalName.value)
  updateHospitalFieldsEditability(selectedHospital.value.isCustom || false)

  emit('hospital-selected', {
    hospitalName: selectedHospital.value.hospitalName,
    isCustom: selectedHospital.value.isCustom || false,
    hospitalData: selectedHospital.value.isCustom ? null : selectedHospital.value
  })

  showHospitalSearchResultsPopup.value = false
}

const onHospitalSearchCancel = () => {
  showHospitalSearchResultsPopup.value = false
  searchKeyword.value = props.hospitalName || ''
  initializeSelectedHospital()
}

const searchHospital = async (searchValue) => {
  const searchTerm = String(searchValue || '').trim()

  if (!searchTerm) {
    hospitalSearchData.value = []
    return
  }

  try {
    showLoadingToast({ message: '正在搜索...', forbidClick: true, duration: 0 })

    // Simulate a backend API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const backendData = [
      {
        hospitalName: `${searchTerm}第一医院`,
        hospitalLevel: '3a',
        feHospitalId: 'H001',
        isCustom: false,
        location: '上海-上海市',
      },
      {
        hospitalName: `${searchTerm}中心医院`,
        hospitalLevel: '2a',
        feHospitalId: 'H002',
        isCustom: false,
        location: '北京-北京市',
      }
    ]
    hospitalSearchData.value = backendData
    closeToast()
  } catch (error) {
    closeToast()
    showFailToast('搜索失败')
    console.error('Failed to search hospital:', error)
  }
}

const updateHospitalFieldsEditability = (isCustom) => {
  disableHospitalLevel.value = !isCustom
}

const queryHospitalLevel = async () => {
  try {
    const mockData = [
      { dictCd: "1a", dictName: "一级甲等" },
      { dictCd: "2a", dictName: "二级甲等" },
      { dictCd: "3a", dictName: "三级甲等" }
    ]
    hospitalLevelOptions.value = mockData.map(item => ({ text: item.dictName, value: item.dictCd }))
  } catch (error) {
    console.error('Failed to query hospital level:', error)
    showFailToast('获取医院级别列表失败')
  }
}

watch(searchKeyword, (newValue) => {
  if (hospitalSearchTimer.value) {
    clearTimeout(hospitalSearchTimer.value)
  }
  hospitalSearchTimer.value = setTimeout(() => {
    searchHospital(newValue)
  }, 500)
})

onMounted(() => {
  queryHospitalLevel()
})

onUnmounted(() => {
  if (hospitalSearchTimer.value) {
    clearTimeout(hospitalSearchTimer.value)
  }
})
</script>

<style scoped>
.hospital-search-picker {
  padding: 0;
}

.hospital-picker-content {
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
  transition: background-color 0.2s;
}

.custom-option:hover {
  background-color: #f8f8f8;
}

.custom-option.active {
  background-color: #e8f4ff;
  color: #1989fa;
}

.custom-option .van-icon {
  margin-right: 8px;
  font-size: 16px;
}

.hospital-list {
  padding: 0;
}

.hospital-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hospital-item:hover {
  background-color: #f8f8f8;
}

.hospital-item.active {
  background-color: #e8f4ff;
  color: #1989fa;
}

.hospital-main-info {
  flex: 1;
}

.hospital-name {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.hospital-item.active .hospital-name {
  color: #1989fa;
}

.hospital-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #969799;
}

.hospital-details span {
  padding: 2px 6px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.hospital-item.active .hospital-details span {
  background-color: #e8f4ff;
  color: #1989fa;
}

.empty-state {
  padding: 40px 16px;
  text-align: center;
}
</style>