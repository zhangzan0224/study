<template>
  <div class="venue-section">
    <!-- 活动场地 -->
    <FormField 
      label="活动场地" 
      :required="true" 
      type="select" 
      :placeholder="editable ? '请选择' : venueDisplayText" 
      :disabled="!editable" 
      :model-value="venueDisplayText"
      @select-click="showVenuePicker" 
    />

    <!-- 活动位置相关字段 - 仅在活动场地选择为健保通医院时显示 -->
    <template v-if="showActiveLocationFields">
      <FormField 
        label="活动位置" 
        :required="true" 
        type="select" 
        :placeholder="editable ? '请选择' : activeLocationDisplayText" 
        :disabled="!editable" 
        :model-value="activeLocationDisplayText"
        @select-click="showActiveLocationPicker" 
      />
      <HospitalSearchPicker
        v-model:hospitalName="hospitalName"
        v-model:hospitalLevel="hospitalLevel"
        v-model:feHospitalId="feHospitalId"
        v-model:disableHospitalLevel="disableHospitalLevel"
        :editable="editable"
        @hospital-selected="handleHospitalSelected"
      />
    </template>

    <!-- 健财中心时展示 场馆名称 -->
    <template v-if="showVenueNameField">
      <VenueNamePicker
        v-model:centerName="centerName"
        :editable="editable"
        @venue-selected="handleVenueSelected"
      />
    </template>

    <!-- 养老社区、拜博、职场、酒店、其他 时展示 场地信息 -->
    <template v-if="showSiteInfoField">
      <FormField 
        label="场地信息" 
        type="textarea" 
        v-model="activeVenueDetail" 
        placeholder="请输入场地信息" 
        :rows="3" 
        :disabled="!editable"
      />
    </template>

    <!-- 新规则：当为 养老社区 时展示 社区名称 -->
    <template v-if="showCommunityNameField">
      <CommunityNamePicker
        v-model="communityName"
        :editable="editable"
        @community-selected="handleCommunitySelected"
      />
    </template>

    <!-- 活动省市和详细地址 - 任何场地选择后都显示 -->
    <template v-if="showAddressFields">
      <LocationPicker v-model="location" :editable="editable" />
      <FormField 
        label="详细地址" 
        :required="true" 
        type="textarea" 
        v-model="detailAddress" 
        placeholder="请输入详细地址" 
        :rows="3" 
        :disabled="!editable"
      />
    </template>

    <!-- 活动场地选择器弹窗 -->
    <van-popup v-model:show="showVenuePickerPopup" position="bottom" round>
      <van-picker
        :columns="venueOptions"
        @confirm="onVenueConfirm"
        @cancel="onVenueCancel"
        :default-index="venueDefaultIndex"
        title="选择活动场地"
      />
    </van-popup>

    <!-- 活动位置选择器弹窗 -->
    <van-popup v-model:show="showActiveLocationPickerPopup" position="bottom" round>
      <van-picker
        :columns="activeLocationOptions"
        @confirm="onActiveLocationConfirm"
        @cancel="onActiveLocationCancel"
        :default-index="activeLocationDefaultIndex"
        title="选择活动位置"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue'
import { showLoadingToast, closeToast, showFailToast } from 'vant'
import FormField from '@/components/base/FormField.vue'
import HospitalSearchPicker from '@/components/activity/HospitalSearchPicker.vue'
import LocationPicker from '@/components/activity/LocationPicker.vue'
import VenueNamePicker from '@/components/activity/VenueNamePicker.vue'
import CommunityNamePicker from '@/components/activity/CommunityNamePicker.vue'

const props = defineProps({
  activeVenue: { type: String, default: '' },
  activeLocation: { type: String, default: '' },
  hospitalName: { type: String, default: '' },
  hospitalLevel: { type: String, default: '' },
  feHospitalId: { type: String, default: '' },
  disableHospitalLevel: { type: Boolean, default: false },
  centerName: { type: String, default: '' },
  activeVenueDetail: { type: String, default: '' },
  communityName: { type: String, default: '' },
  category: { type: String, default: '' },
  healthRelate: { type: String, default: '' },
  editable: { type: Boolean, default: true },
  location: { type: String, default: '' },
  detailAddress: { type: String, default: '' }
})

const emit = defineEmits([
  'update:activeVenue',
  'update:activeLocation', 
  'update:hospitalName',
  'update:hospitalLevel',
  'update:feHospitalId',
  'update:disableHospitalLevel',
  'update:centerName',
  'update:activeVenueDetail',
  'update:communityName',
  'update:location',
  'update:detailAddress'
])

// 响应式数据
const showVenuePickerPopup = ref(false)
const showActiveLocationPickerPopup = ref(false)
const venueOptions = ref([])
const activeLocationOptions = ref([])

// 活动场地数据存储
const activeVenueAll = ref([])
const activeVenueArr1 = ref([])
const activeVenueArr2 = ref([])
const activeVenueArr3 = ref([])

const venueOptionsConfig = {
  activeVenueNameArr1: ['HEALTH_HOSP', 'WEALTH_CENTER', 'COMMUNITY', 'BYBO'],
  activeVenueNameArr2: ['WEALTH_CENTER', 'COMMUNITY', 'BYBO'],
  activeVenueNameArr3: ['WORK_PLACE', 'HOTEL', 'OTHER']
}

// 计算属性
const activeVenue = computed({
  get: () => props.activeVenue,
  set: (val) => emit('update:activeVenue', val)
})

const activeLocation = computed({
  get: () => props.activeLocation,
  set: (val) => emit('update:activeLocation', val)
})

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

const centerName = computed({
  get: () => props.centerName,
  set: (val) => emit('update:centerName', val)
})

const activeVenueDetail = computed({
  get: () => props.activeVenueDetail,
  set: (val) => emit('update:activeVenueDetail', val)
})

const communityName = computed({
  get: () => props.communityName,
  set: (val) => emit('update:communityName', val)
})

const location = computed({
  get: () => props.location,
  set: (val) => emit('update:location', val)
})

const detailAddress = computed({
  get: () => props.detailAddress,
  set: (val) => emit('update:detailAddress', val)
})

const venueDisplayText = computed(() => {
  const found = activeVenueAll.value.find(o => o.value === props.activeVenue)
  return found ? found.text : ''
})

const activeLocationDisplayText = computed(() => {
  const found = activeLocationOptions.value.find(o => o.value === props.activeLocation)
  return found ? found.text : ''
})

const venueDefaultIndex = computed(() => {
  const idx = venueOptions.value.findIndex(o => o.value === props.activeVenue)
  return idx >= 0 ? idx : 0
})

const activeLocationDefaultIndex = computed(() => {
  const idx = activeLocationOptions.value.findIndex(o => o.value === props.activeLocation)
  return idx >= 0 ? idx : 0
})

const showActiveLocationFields = computed(() => props.activeVenue === 'HEALTH_HOSP')
const showVenueNameField = computed(() => props.activeVenue === 'WEALTH_CENTER')
const showSiteInfoField = computed(() => ['COMMUNITY', 'BYBO', 'WORK_PLACE', 'HOTEL', 'OTHER'].includes(props.activeVenue))
const showCommunityNameField = computed(() => props.activeVenue === 'COMMUNITY')
// 活动省市和详细地址一直显示
const showAddressFields = computed(() => true)

// 方法
const showVenuePicker = () => {
  if (!props.editable) return
  loadVenueOptions()
}

const showActiveLocationPicker = async () => {
  if (!props.editable) return
  try {
    if (activeLocationOptions.value.length === 0) {
      showLoadingToast({ message: '加载活动位置数据...', forbidClick: true })
      await queryActiveLocation()
      closeToast()
    }
    showActiveLocationPickerPopup.value = true
  } catch (error) {
    closeToast()
    showFailToast('加载活动位置数据失败')
    console.error('Failed to load active location options:', error)
  }
}

const onVenueConfirm = ({ selectedOptions }) => {
  const selectVenue = selectedOptions && selectedOptions[0]
  if (!selectVenue) {
    showVenuePickerPopup.value = false
    return
  }
  activeVenue.value = selectVenue.value
  if (selectVenue.value !== 'HEALTH_HOSP') clearActiveLocationFields()
  if (selectVenue.value !== 'WEALTH_CENTER') clearVenueNameField()
  if (!['COMMUNITY', 'BYBO', 'WORK_PLACE', 'HOTEL', 'OTHER'].includes(selectVenue.value)) clearSiteInfoField()
  if (selectVenue.value !== 'COMMUNITY') clearCommunityNameField()
  showVenuePickerPopup.value = false
}

const onVenueCancel = () => { showVenuePickerPopup.value = false }

const onActiveLocationConfirm = ({ selectedOptions }) => {
  const selectLocation = selectedOptions && selectedOptions[0]
  if (selectLocation && selectLocation.text) activeLocation.value = selectLocation.value
  showActiveLocationPickerPopup.value = false
}

const onActiveLocationCancel = () => { showActiveLocationPickerPopup.value = false }

// 只展示省份的行政区划代码
const onlyProvince = ['810000', '820000', '710000']

// ... existing code ...

const handleHospitalSelected = (hospital) => {
  if (hospital) {
    // 处理医院基本信息
    if (hospital.hospitalName) {
      hospitalName.value = hospital.hospitalName
    }
    
    // 处理医院级别 - 使用 levelnum 字段
    if (hospital.levelnum) {
      hospitalLevel.value = hospital.levelnum
    }
    
    // 处理 fe 编码 - 使用 id 字段
    if (hospital.id) {
      feHospitalId.value = hospital.id
    }
    
    // 处理地址回显逻辑
    if (hospital.city && hospital.city.trim() !== '') {
      // 如果存在city码值，直接使用city
      location.value = hospital.city
    } else if (hospital.province) {
      // 如果不存在city码值，判断是否只展示省
      if (onlyProvince.includes(hospital.province)) {
        // 只展示省的情况
        location.value = hospital.province
      } else {
        // 其他情况展示city（即使city为空，也应该展示city层级）
        location.value = hospital.city || ''
      }
    }
    
    // 处理详细地址
    if (hospital.hosAddress) {
      detailAddress.value = hospital.hosAddress
    }
  }
}

const handleVenueSelected = (venueInfo) => {
  if (venueInfo) {
    // 处理场馆基本信息
    centerName.value = venueInfo.centerName
    
    // 如果选择的是系统中的场馆（非自定义），可以处理其他相关信息
    if (!venueInfo.isCustom && venueInfo.venueData) {
      // 可以根据需要处理场馆的其他信息，比如地址等
      // 这里暂时不处理地址，保持现有逻辑
    }
  }
}

const handleCommunitySelected = (community) => {
  if (community) {
    // Auto-fill the detailed address when a community is selected
    if (community.address) {
      detailAddress.value = community.address;
    }
  }
};

const clearActiveLocationFields = () => {
  activeLocation.value = ''
  hospitalName.value = ''
  hospitalLevel.value = ''
  feHospitalId.value = ''
  disableHospitalLevel.value = false
  // 注意：不清空地址，因为其他场地也需要
}

const clearVenueNameField = () => { 
  centerName.value = ''
}
const clearSiteInfoField = () => { activeVenueDetail.value = '' }
const clearCommunityNameField = () => { communityName.value = '' }

const queryActiveVenue = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockData = [
      { dictName: '健保通医院', dictCd: 'HEALTH_HOSP' },
      { dictName: '健财中心', dictCd: 'WEALTH_CENTER' },
      { dictName: '养老社区', dictCd: 'COMMUNITY' },
      { dictName: '拜博', dictCd: 'BYBO' },
      { dictName: '职场', dictCd: 'WORK_PLACE' },
      { dictName: '酒店', dictCd: 'HOTEL' },
      { dictName: '其他', dictCd: 'OTHER' }
    ]
    if (mockData) {
      activeVenueAll.value = mockData.map(item => ({ text: item.dictName, value: item.dictCd }))
      const activeVenueMap = new Map(activeVenueAll.value.map(item => [item.value, item]))
      activeVenueArr1.value = venueOptionsConfig.activeVenueNameArr1.map(n => activeVenueMap.get(n)).filter(Boolean)
      activeVenueArr2.value = venueOptionsConfig.activeVenueNameArr2.map(n => activeVenueMap.get(n)).filter(Boolean)
      activeVenueArr3.value = venueOptionsConfig.activeVenueNameArr3.map(n => activeVenueMap.get(n)).filter(Boolean)
    }
  } catch (error) {
    console.error('Failed to query active venue:', error)
    showFailToast('获取活动场地列表失败')
  }
}

const queryActiveLocation = async () => {
  try {
    const mockData = [
      { dictCd: "1", dictName: "院内" },
      { dictCd: "2", dictName: "驿站" },
      { dictCd: "3", dictName: "VIP室" }
    ]
    if (mockData) {
      activeLocationOptions.value = mockData.map(item => ({ text: item.dictName, value: item.dictCd }))
    }
  } catch (error) {
    console.error('Failed to query active location:', error)
    showFailToast('获取活动位置列表失败')
  }
}

const loadVenueOptions = async () => {
  try {
    showLoadingToast({ message: '加载活动场地选项...', forbidClick: true })
    if (activeVenueAll.value.length === 0) await queryActiveVenue()
    if (props.category === '1') {
      if (props.healthRelate === '1') venueOptions.value = [...activeVenueArr1.value]
      else if (props.healthRelate === '0') venueOptions.value = [...activeVenueArr2.value]
      else venueOptions.value = []
    } else if (props.category === '2') {
      venueOptions.value = [...activeVenueArr3.value]
    } else {
      venueOptions.value = []
    }
    closeToast()
    showVenuePickerPopup.value = true
  } catch (error) {
    closeToast()
    showFailToast('加载活动场地选项失败')
    console.error('Failed to load venue options:', error)
  }
}

watch(() => props.activeVenue, (newVenue, oldVenue) => {
  if (newVenue === oldVenue) return
  if (newVenue !== 'HEALTH_HOSP') clearActiveLocationFields()
  if (newVenue !== 'WEALTH_CENTER') clearVenueNameField()
  if (!['COMMUNITY', 'BYBO', 'WORK_PLACE', 'HOTEL', 'OTHER'].includes(newVenue)) clearSiteInfoField()
  if (newVenue !== 'COMMUNITY') clearCommunityNameField()
})

onMounted(() => {
  queryActiveVenue()
})
</script>

<style scoped>
.venue-section { padding: 0; }
</style>

