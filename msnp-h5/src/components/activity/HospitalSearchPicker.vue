<template>
  <div class="hospital-search-picker">
    <FormField 
      label="医院名称" 
      :required="true" 
      type="input" 
      v-model="hospitalName" 
      placeholder="请输入医院名称搜索" 
      :disabled="!editable"
      @input="onHospitalInput" 
    />
    
    <FormField 
      label="医院级别" 
      :required="true" 
      type="select" 
      :placeholder="editable ? '请选择' : hospitalLevelText" 
      :disabled="!editable || disableHospitalLevel" 
      :model-value="hospitalLevelText"
      @select-click="showHospitalLevelPicker" 
    />
    
    <FormField 
      label="医院fe编码" 
      type="input" 
      v-model="feHospitalId" 
      placeholder="请输入医院fe编码" 
      :disabled="true" 
    />

    <!-- 医院级别选择器弹窗 -->
    <van-popup v-model:show="showHospitalLevelPickerPopup" position="bottom" round>
      <van-picker
        :columns="hospitalLevelOptions"
        @confirm="onHospitalLevelConfirm"
        @cancel="onHospitalLevelCancel"
        :default-index="hospitalLevelDefaultIndex"
        title="选择医院级别"
      />
    </van-popup>

    <!-- 医院搜索结果选择器弹窗 -->
    <van-popup v-model:show="showHospitalSearchResultsPopup" position="bottom" round>
      <van-picker
        :columns="hospitalSearchResults"
        @confirm="onHospitalSearchResultConfirm"
        @cancel="onHospitalSearchResultCancel"
        :default-index="0"
        title="选择医院"
        @open="onHospitalSearchPickerOpen"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
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
  'hospital-selected' // 当医院被选中时发出
])

// 响应式数据
const showHospitalLevelPickerPopup = ref(false)
const showHospitalSearchResultsPopup = ref(false)
const hospitalLevelOptions = ref([])
const hospitalSearchResults = ref([])
const hospitalSearchData = ref([])
const hospitalSearchTimer = ref(null)

// 计算属性
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

const hospitalLevelText = computed(() => {
  const found = hospitalLevelOptions.value.find(o => o.value === props.hospitalLevel)
  return found ? found.text : ''
})

const hospitalLevelDefaultIndex = computed(() => {
  const idx = hospitalLevelOptions.value.findIndex(o => o.value === props.hospitalLevel)
  return idx >= 0 ? idx : 0
})

// 方法
const showHospitalLevelPicker = async () => {
  if (!props.editable) return
  
  try {
    if (hospitalLevelOptions.value.length === 0) {
      showLoadingToast({
        message: '加载医院级别数据...',
        forbidClick: true,
      })
      await queryHospitalLevel()
      closeToast()
    }
    
    showHospitalLevelPickerPopup.value = true
  } catch (error) {
    closeToast()
    showFailToast('加载医院级别数据失败')
    console.error('Failed to load hospital level options:', error)
  }
}

const onHospitalLevelConfirm = (event) => {
  let selectLevel
  if (event && event.selectedOptions && event.selectedOptions[0]) {
    selectLevel = event.selectedOptions[0]
  } else if (event && event.value) {
    selectLevel = event.value
  } else if (event && event.text) {
    selectLevel = event
  } else {
    console.error('无法解析医院级别选择结果:', event)
    showHospitalLevelPickerPopup.value = false
    return
  }
  
  if (selectLevel && selectLevel.text) {
    hospitalLevel.value = selectLevel.value
  }
  showHospitalLevelPickerPopup.value = false
}

const onHospitalLevelCancel = () => {
  showHospitalLevelPickerPopup.value = false
}

const onHospitalInput = async (inputValue) => {
  // 处理 InputEvent 对象，获取实际输入值
  let searchValue
  if (inputValue && typeof inputValue === 'object' && inputValue.target) {
    searchValue = String(inputValue.target.value || '').trim()
  } else if (inputValue && typeof inputValue === 'object' && inputValue.detail) {
    searchValue = String(inputValue.detail || '').trim()
  } else {
    searchValue = String(inputValue || '').trim()
  }
  
  // 清空之前的定时器
  if (hospitalSearchTimer.value) {
    clearTimeout(hospitalSearchTimer.value)
  }
  
  // 如果输入为空，清空搜索结果和相关字段
  if (!searchValue) {
    hospitalSearchResults.value = []
    // 清空医院级别和 fe 编码
    hospitalLevel.value = ''
    feHospitalId.value = ''
    // 重置字段可编辑性
    disableHospitalLevel.value = false
    return
  }
  
  // 防抖搜索：用户停止输入500ms后才执行搜索
  hospitalSearchTimer.value = setTimeout(async () => {
    await searchHospital(searchValue)
  }, 500)
}

const searchHospital = async (searchValue) => {
  try {
    showLoadingToast({
      message: '搜索医院中...',
      forbidClick: true,
    })
    
    // 模拟后端数据
    const backendData = [
      {
        "city": "110100",
        "cityName": "市辖区",
        "comBranch": "10",
        "comCoy": "1",
        "createTime": "2021-08-17 23:50:01",
        "endTime": null,
        "hosAddress": "北京市东城区东交民巷1号",
        "hosAliasName": "",
        "hosAliass": [],
        "hosState": "1",
        "hospitalLicId": "11",
        "hospitalName": `${searchValue}协和医院`,
        "hospitalType": "",
        "id": "H001",
        "isDepositfreeHos": "N",
        "isDirectHos": "",
        "isEmrAttr": "",
        "isHealthHost": "N",
        "isSelfbuiltHost": "Y",
        "isSocialHos": "",
        "levelname": "",
        "levelnum": "3a",
        "netType": "医院",
        "province": "110000",
        "provinceName": "北京市",
        "startTime": "2021-08-17 00:00:00",
        "stateCode": "1",
        "updatetime": "2021-08-17 15:58:18"
      },
      {
        "city": "420100",
        "cityName": "武汉市",
        "comBranch": "10",
        "comCoy": "1",
        "createTime": "2021-08-17 23:50:01",
        "endTime": null,
        "hosAddress": "湖北省武汉市解放大道1095号",
        "hosAliasName": "",
        "hosAliass": [],
        "hosState": "1",
        "hospitalLicId": "11",
        "hospitalName": `${searchValue}同济医院`,
        "hospitalType": "",
        "id": "H002",
        "isDepositfreeHos": "N",
        "isDirectHos": "",
        "isEmrAttr": "",
        "isHealthHost": "N",
        "isSelfbuiltHost": "Y",
        "isSocialHos": "",
        "levelname": "",
        "levelnum": "3a",
        "netType": "医院",
        "province": "420000",
        "provinceName": "湖北省",
        "startTime": "2021-08-17 00:00:00",
        "stateCode": "1",
        "updatetime": "2021-08-17 15:58:18"
      },
      {
        "city": "",
        "cityName": "",
        "comBranch": "10",
        "comCoy": "1",
        "createTime": "2021-08-17 23:50:01",
        "endTime": null,
        "hosAddress": "西藏自治区拉萨市",
        "hosAliasName": "",
        "hosAliass": [],
        "hosState": "1",
        "hospitalLicId": "11",
        "hospitalName": `${searchValue}西藏军区总医院`,
        "hospitalType": "",
        "id": "H003",
        "isDepositfreeHos": "N",
        "isDirectHos": "",
        "isEmrAttr": "",
        "isHealthHost": "N",
        "isSelfbuiltHost": "Y",
        "isSocialHos": "",
        "levelname": "",
        "levelnum": "3a",
        "netType": "医院",
        "province": "540000",
        "provinceName": "西藏自治区",
        "startTime": "2021-08-17 00:00:00",
        "stateCode": "1",
        "updatetime": "2021-08-17 15:58:18"
      },
      {
        "city": "",
        "cityName": "",
        "comBranch": "10",
        "comCoy": "1",
        "createTime": "2021-08-17 23:50:01",
        "endTime": null,
        "hosAddress": "香港特别行政区中环",
        "hosAliasName": "",
        "hosAliass": [],
        "hosState": "1",
        "hospitalLicId": "11",
        "hospitalName": `${searchValue}香港玛丽医院`,
        "hospitalType": "",
        "id": "H004",
        "isDepositfreeHos": "N",
        "isDirectHos": "",
        "isEmrAttr": "",
        "isHealthHost": "N",
        "isSelfbuiltHost": "Y",
        "isSocialHos": "",
        "levelname": "",
        "levelnum": "3a",
        "netType": "医院",
        "province": "810000",
        "provinceName": "香港特别行政区",
        "startTime": "2021-08-17 00:00:00",
        "stateCode": "1",
        "updatetime": "2021-08-17 15:58:18"
      }
    ]
    
    // 检查后端数据中是否已经存在用户输入的医院名称
    const existingHospital = backendData.find(hospital => 
      hospital.hospitalName.toLowerCase() === searchValue.toLowerCase()
    )
    
    // 构建最终的数据
    let mockData = [...backendData]
    
    // 如果后端数据中没有相同的医院名称，才添加用户输入的作为自定义选项
    if (!existingHospital) {
      mockData.unshift({
        hospitalName: searchValue,
        levelnum: '', // 使用 levelnum 字段
        id: '', // 使用 id 字段
        isCustom: true
      })
    }
    
    const code = 200
    const data = mockData
    
    if (code === 200 && data) {
      // 存储完整的医院数据
      hospitalSearchData.value = data
      
      // 为 van-picker 创建简化的选项格式
      const pickerOptions = data.map(item => ({
        text: item.hospitalName,
        value: item.id || item.feHospitalId || '' // 优先使用 id 字段，兼容 feHospitalId
      }))
      
      // 显示搜索结果选择器
      showHospitalSearchResults(pickerOptions)
    }
    
    closeToast()
  } catch (error) {
    closeToast()
    showFailToast('搜索医院失败')
    console.error('Failed to search hospital:', error)
  }
}

const showHospitalSearchResults = (options) => {
  hospitalSearchResults.value = options
  showHospitalSearchResultsPopup.value = true
}

const onHospitalSearchResultConfirm = (event) => {
  let selectedOption
  if (event && event.selectedOptions && event.selectedOptions[0]) {
    selectedOption = event.selectedOptions[0]
  } else if (event && event.value) {
    selectedOption = event.value
  } else if (event && event.text) {
    selectedOption = event
  } else {
    console.error('无法解析选择结果:', event)
    showHospitalSearchResultsPopup.value = false
    return
  }
  
  if (selectedOption) {
    // 根据选中的 fe编码 找到完整的医院数据
    const selectedHospital = hospitalSearchData.value.find(
      hospital => (hospital.id || hospital.feHospitalId) === selectedOption.value
    )
    
    if (selectedHospital) {
      hospitalName.value = selectedHospital.hospitalName
      // 使用 levelnum 字段作为医院级别
      hospitalLevel.value = selectedHospital.levelnum || ''
      // 使用 id 字段作为 fe 编码
      feHospitalId.value = selectedHospital.id || ''
      
      // 根据是否自定义医院设置字段可编辑性
      updateHospitalFieldsEditability(selectedHospital.isCustom)

      // 发出事件，传递完整的医院信息
      emit('hospital-selected', selectedHospital)
    } else {
      console.error('未找到对应的医院数据:', selectedOption)
    }
  }
  showHospitalSearchResultsPopup.value = false
}

const onHospitalSearchResultCancel = () => {
  showHospitalSearchResultsPopup.value = false
}

const onHospitalSearchPickerOpen = () => {
  console.log('=== 医院搜索结果选择器打开 ===')
}

const updateHospitalFieldsEditability = (isCustom) => {
  if (!isCustom) {
    // 从后端搜索结果选择，禁用医院级别
    disableHospitalLevel.value = true
  } else {
    // 自定义输入，允许修改医院级别
    disableHospitalLevel.value = false
  }
}

const queryHospitalLevel = async () => {
  try {
    // 模拟数据
    const mockData = [
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "10", dictName: "一级" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "1a", dictName: "一级甲等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "1b", dictName: "一级乙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "1c", dictName: "一级丙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "20", dictName: "二级" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "2a", dictName: "二级甲等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "2b", dictName: "二级乙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "2c", dictName: "二级丙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "30", dictName: "三级" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3a", dictName: "三级甲等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3b", dictName: "三级乙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3c", dictName: "三级丙等" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "00", dictName: "其他" },
      { catId: "hospitalLevel", catName: "医院等级", dictCd: "3d", dictName: "三级特等" }
    ]
    
    const code = 200
    const data = mockData
    
    if (code === 200 && data) {
      hospitalLevelOptions.value = data.map(item => ({ text: item.dictName, value: item.dictCd }))
    }
  } catch (error) {
    console.error('Failed to query hospital level:', error)
    showFailToast('获取医院级别列表失败')
  }
}

// 监听医院名称变化，当手动输入时重置字段可编辑性
watch(() => props.hospitalName, (newName, oldName) => {
  if (newName !== oldName && hospitalSearchResults.value && !hospitalSearchResults.value.some(option => option.text === newName)) {
    disableHospitalLevel.value = false
  }
})

// 组件卸载时清理定时器
import { onUnmounted, onMounted } from 'vue'

onMounted(() => {
  // 组件挂载时加载医院级别数据
  queryHospitalLevel()
})

onUnmounted(() => {
  if (hospitalSearchTimer.value) {
    clearTimeout(hospitalSearchTimer.value)
  }
})
</script>

<style scoped>
.hospital-search-picker { padding: 0; }
</style>
