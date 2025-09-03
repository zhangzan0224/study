<template>
  <div class="location-picker">
    <FormField
      label="活动省市"
      :required="true"
      type="select"
      :placeholder="editable ? '请选择' : displayText"
      :disabled="!editable"
      :model-value="displayText"
      @select-click="onOpen"
    />

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-area
        v-if="areaListLoaded"
        :area-list="areaList"
        :columns-num="currentColumnsNum"
        title="选择省市"
        @confirm="onConfirm"
        @cancel="onCancel"
        :value="currentAreaCode"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
import { showLoadingToast, closeToast, showFailToast } from 'vant'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // e.g., "110100" (城市码值) 或 "810000" (省份码值)
  editable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const areaList = ref({})
const areaListLoaded = ref(false)
const rawAreaData = ref([]) // 存储原始后端数据

// 只展示省份的行政区划代码
const onlyProvince = ['810000', '820000', '710000']

// ... existing code ...

// 将后端返回的省市数据转换为 Vant Area 组件所需的格式
const transformAreaData = (backendData) => {
  const province_list = {}
  const city_list = {}

  backendData.forEach(province => {
    province_list[province.areaCode] = province.areaName
    
    // 对于只显示省份的地区，不添加城市数据
    if (!onlyProvince.includes(province.areaCode) && province.childAreas) {
      province.childAreas.forEach(city => {
        city_list[city.areaCode] = city.areaName
      })
    }
  })

  return { province_list, city_list }
}

// 模拟接口请求，获取省市数据
async function fetchAreaData() {
  try {
    // 模拟后端返回的数据
    const backendData = [
      {
        "areaCode": "110000", "areaName": "北京市", "childAreas": [
          { "areaCode": "110100", "areaName": "北京市", "parentId": "110000" }
        ]
      },
      {
        "areaCode": "120000", "areaName": "天津市", "childAreas": [
          { "areaCode": "120100", "areaName": "天津市", "parentId": "120000" }
        ]
      },
      {
        "areaCode": "130000", "areaName": "河北省", "childAreas": [
          { "areaCode": "130100", "areaName": "石家庄市", "parentId": "130000" },
          { "areaCode": "130200", "areaName": "唐山市", "parentId": "130000" },
          { "areaCode": "130300", "areaName": "秦皇岛市", "parentId": "130000" },
          { "areaCode": "130400", "areaName": "邯郸市", "parentId": "130000" },
          { "areaCode": "130500", "areaName": "邢台市", "parentId": "130000" },
          { "areaCode": "130600", "areaName": "保定市", "parentId": "130000" },
          { "areaCode": "130700", "areaName": "张家口市", "parentId": "130000" },
          { "areaCode": "130800", "areaName": "承德市", "parentId": "130000" },
          { "areaCode": "130900", "areaName": "沧州市", "parentId": "130000" },
          { "areaCode": "131000", "areaName": "廊坊市", "parentId": "130000" },
          { "areaCode": "131100", "areaName": "衡水市", "parentId": "130000" }
        ]
      },
      // 只显示省份的地区
      {
        "areaCode": "710000", "areaName": "台湾省", "childAreas": []
      },
      {
        "areaCode": "810000", "areaName": "香港特别行政区", "childAreas": []
      },
      {
        "areaCode": "820000", "areaName": "澳门特别行政区", "childAreas": []
      }
    ]
    rawAreaData.value = backendData
    areaList.value = transformAreaData(backendData)
    areaListLoaded.value = true
  } catch (error) {
    console.error('Failed to fetch area data:', error)
    showFailToast('获取省市数据失败')
  }
}

onMounted(() => {
  fetchAreaData()
})

// 根据 modelValue（码值）反向查找城市代码，用于 picker 回显
const currentAreaCode = computed(() => {
  if (!props.modelValue || !areaListLoaded.value) return ''
  
  // 检查是否是只显示省份的码值
  if (onlyProvince.includes(props.modelValue)) {
    return props.modelValue
  }
  
  // 检查是否是城市码值
  if (areaList.value.city_list[props.modelValue]) {
    return props.modelValue
  }
  
  return ''
})

// 动态计算列数：只显示省份的地区显示1列，其他显示2列
const currentColumnsNum = computed(() => {
  if (!props.modelValue || !areaListLoaded.value) return 2
  
  // 检查是否是只显示省份的码值
  if (onlyProvince.includes(props.modelValue)) {
    return 1 // 只显示省份
  }
  
  return 2 // 显示省市
})

// 将码值转换为显示文本
const displayText = computed(() => {
  if (!props.modelValue || !areaListLoaded.value) return ''
  
  // 检查是否是只显示省份的码值
  if (onlyProvince.includes(props.modelValue)) {
    return areaList.value.province_list[props.modelValue] || ''
  }
  
  // 检查是否是城市码值，显示为 "省份/城市" 格式
  if (areaList.value.city_list[props.modelValue]) {
    const cityName = areaList.value.city_list[props.modelValue]
    // 根据城市码值找到对应的省份
    const provinceData = rawAreaData.value.find(province => 
      province.childAreas && province.childAreas.some(city => city.areaCode === props.modelValue)
    )
    if (provinceData) {
      return `${provinceData.areaName}/${cityName}`
    }
    return cityName
  }
  
  return ''
})

const onOpen = async () => {
  if (!props.editable) return
  if (!areaListLoaded.value) {
    showLoadingToast({ message: '加载省市数据...', forbidClick: true })
    await fetchAreaData()
    closeToast()
  }
  showPicker.value = true
}

const onConfirm = (result) => {
  const { selectedOptions } = result
  if (selectedOptions && selectedOptions.length >= 1) {
    const province = selectedOptions[0]?.text || ''
    
    // 检查是否是只显示省份的地区
    const provinceEntry = Object.entries(areaList.value.province_list).find(([, name]) => name === province)
    if (provinceEntry) {
      const provinceCode = provinceEntry[0]
      
      if (onlyProvince.includes(provinceCode)) {
        // 只显示省份的情况，返回省份码值
        emit('update:modelValue', provinceCode)
      } else {
        // 显示省市的情况，返回城市码值
        const city = selectedOptions[1]?.text || ''
        const cityEntry = Object.entries(areaList.value.city_list).find(([, name]) => name === city)
        if (cityEntry) {
          emit('update:modelValue', cityEntry[0])
        }
      }
    }
  }
  showPicker.value = false
}

const onCancel = () => {
  showPicker.value = false
}
</script>

<style scoped>
.location-picker { padding: 0; }
</style>

