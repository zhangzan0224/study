<template>
  <div class="venue-name-picker">
    <FormField 
      label="场馆名称" 
      :required="true" 
      type="select" 
      :placeholder="editable ? '请选择或输入场馆名称' : centerName" 
      :disabled="!editable" 
      :model-value="centerName"
      @select-click="showVenueNamePicker" 
    />

    <!-- 场馆名称选择器弹窗 -->
    <van-popup v-model:show="showVenueNamePickerPopup" position="bottom" round>
      <div class="venue-name-picker-content">
        <div class="picker-header">
          <van-button 
            type="default" 
            size="small" 
            @click="onVenueNameCancel"
          >
            取消
          </van-button>
          <div class="picker-title">选择场馆名称</div>
          <van-button 
            type="primary" 
            size="small" 
            @click="onVenueNameConfirm"
          >
            确定
          </van-button>
        </div>
        
        <div class="search-section">
          <van-search
            v-model="searchKeyword"
            placeholder="搜索场馆名称或输入自定义名称"
            @input="onSearchInput"
            @clear="onSearchClear"
          />
        </div>

        <div class="options-section">
          <!-- 自定义输入选项 -->
          <div 
            v-if="showCustomOption"
            class="custom-option"
            :class="{ active: selectedVenue && selectedVenue.isCustom }"
            @click="selectCustomVenue"
          >
            <van-icon name="add-o" />
            <span>自己创建：{{ searchKeyword }}</span>
          </div>

          <!-- 搜索结果列表 -->
          <div class="venue-list">
            <div 
              v-for="venue in filteredVenues" 
              :key="venue.centerName"
              class="venue-item"
              :class="{ active: selectedVenue && selectedVenue.centerName === venue.centerName }"
              @click="selectVenue(venue)"
            >
              <div class="venue-main-info">
                <div class="venue-name">{{ venue.centerName }}</div>
                <div class="venue-details">
                  <span class="branch">{{ venue.branchName }}</span>
                  <span class="city">{{ venue.centerCity }}</span>
                  <span class="status">{{ venue.build }}</span>
                </div>
              </div>
              <div class="venue-meta">
                <div class="build-year">{{ venue.buildYear }}</div>
                <div class="version">{{ venue.version }}</div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredVenues.length === 0 && !showCustomOption" class="empty-state">
            <van-empty description="暂无匹配的场馆" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue'
import { showLoadingToast, closeToast, showFailToast } from 'vant'
import FormField from '@/components/base/FormField.vue'
import { getVenueList } from '@/api/activity.js'

const props = defineProps({
  centerName: { type: String, default: '' },
  editable: { type: Boolean, default: true }
})

const emit = defineEmits([
  'update:centerName',
  'venue-selected'
])

// 响应式数据
const showVenueNamePickerPopup = ref(false)
const searchKeyword = ref('')
const selectedVenue = ref(null)
const venueList = ref([])
const loading = ref(false)
const venueSearchTimer = ref(null)

// 计算属性
const centerName = computed({
  get: () => props.centerName,
  set: (val) => emit('update:centerName', val)
})

const filteredVenues = computed(() => {
  if (!searchKeyword.value.trim()) {
    return venueList.value
  }
  
  const keyword = searchKeyword.value.toLowerCase()
  return venueList.value.filter(venue => 
    venue.centerName.toLowerCase().includes(keyword) ||
    venue.branchName.toLowerCase().includes(keyword) ||
    venue.centerCity.toLowerCase().includes(keyword)
  )
})

const showCustomOption = computed(() => {
  return searchKeyword.value.trim() && 
         !filteredVenues.value.some(venue => 
           venue.centerName === searchKeyword.value.trim()
         )
})

// 方法
const showVenueNamePicker = () => {
  if (!props.editable) return

  // Reset state when opening the popup
  searchKeyword.value = props.centerName || ''
  venueList.value = []
  initializeSelectedVenue()
  
  showVenueNamePickerPopup.value = true
}

const loadVenueData = async (searchValue) => {
  const searchTerm = String(searchValue || '').trim()

  if (!searchTerm) {
    venueList.value = []
    return
  }

  try {
    showLoadingToast({ message: '正在搜索...', forbidClick: true, duration: 0 })
    
    // Simulate a backend API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockData = [
      {
        centerName: `${searchTerm} 体育中心`,
        branchName: '市中心分馆',
        centerCity: '上海',
        build: '在用',
        buildYear: '2020',
        version: 'V2'
      },
      {
        centerName: `${searchTerm} 健身房`,
        branchName: '东区分馆',
        centerCity: '北京',
        build: '在用',
        buildYear: '2018',
        version: 'V1'
      }
    ]
    
    venueList.value = mockData
    closeToast()
  } catch (error) {
    closeToast()
    showFailToast('搜索失败')
    console.error('Failed to load venue data:', error)
  }
}

const initializeSelectedVenue = () => {
  if (props.centerName) {
    // 检查是否在列表中
    const venue = venueList.value.find(v => v.centerName === props.centerName)
    if (venue) {
      selectedVenue.value = venue
    } else {
      // 自定义场馆名称
      selectedVenue.value = {
        centerName: props.centerName,
        isCustom: true
      }
    }
  } else {
    selectedVenue.value = null
  }
}

const selectVenue = (venue) => {
  selectedVenue.value = venue
}

const selectCustomVenue = () => {
  selectedVenue.value = {
    centerName: searchKeyword.value.trim(),
    isCustom: true
  }
}

const onSearchInput = () => {
  // 搜索时清除选中状态，让用户重新选择
  if (selectedVenue.value && !selectedVenue.value.isCustom) {
    const stillExists = filteredVenues.value.some(venue => 
      venue.centerName === selectedVenue.value.centerName
    )
    if (!stillExists) {
      selectedVenue.value = null
    }
  }
}

const onSearchClear = () => {
  searchKeyword.value = ''
  selectedVenue.value = null
}

const onVenueNameConfirm = () => {
  if (!selectedVenue.value) {
    showFailToast('请选择或输入场馆名称')
    return
  }
  
  // 更新数据
  centerName.value = selectedVenue.value.centerName
  
  // 触发选择事件
  emit('venue-selected', {
    centerName: selectedVenue.value.centerName,
    isCustom: selectedVenue.value.isCustom || false,
    venueData: selectedVenue.value.isCustom ? null : selectedVenue.value
  })
  
  showVenueNamePickerPopup.value = false
}

const onVenueNameCancel = () => {
  showVenueNamePickerPopup.value = false
  // 恢复原始搜索关键词
  searchKeyword.value = props.centerName || ''
  initializeSelectedVenue()
}

// 监听搜索关键词变化
watch(searchKeyword, (newValue) => {
  if (venueSearchTimer.value) {
    clearTimeout(venueSearchTimer.value)
  }
  venueSearchTimer.value = setTimeout(() => {
    loadVenueData(newValue)
  }, 500)
})


</script>

<style scoped>
.venue-name-picker-content {
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

.venue-list {
  padding: 0;
}

.venue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.venue-item:hover {
  background-color: #f8f8f8;
}

.venue-item.active {
  background-color: #e8f4ff;
  color: #1989fa;
}

.venue-main-info {
  flex: 1;
}

.venue-name {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 4px;
}

.venue-item.active .venue-name {
  color: #1989fa;
}

.venue-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #969799;
}

.venue-details span {
  padding: 2px 6px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.venue-item.active .venue-details span {
  background-color: #e8f4ff;
  color: #1989fa;
}

.venue-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.build-year,
.version {
  font-size: 11px;
  color: #c8c9cc;
  padding: 2px 4px;
  background-color: #f7f8fa;
  border-radius: 2px;
}

.venue-item.active .build-year,
.venue-item.active .version {
  background-color: #e8f4ff;
  color: #1989fa;
}

.empty-state {
  padding: 40px 16px;
  text-align: center;
}
</style>
