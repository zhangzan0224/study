<template>
  <div class="branch-subbranch-picker">
    <FormField
      name="branchCode"
      :rules="[{ required: true, message: '请选择分公司' }]"
      label="分公司"
      :required="true"
      type="select"
      :model-value="branchDisplayValue"
      :placeholder="editable ? '请选择' : branchDisplayValue"
      :disabled="!editable"
      :options="branchOptions"
      @select-click="showBranchPicker"
    />

    <FormField
      name="subbranchCode"
      :rules="[{ required: true, message: '请选择中支' }]"
      label="中支"
      :required="true"
      type="select"
      :model-value="subbranchDisplayValue"
      :placeholder="editable ? '请选择' : subbranchDisplayValue"
      :disabled="!editable"
      :options="subBranchOption"
      @select-click="showSubBranchPicker"
    />

    <!-- 分公司选择器弹窗 -->
    <van-popup v-model:show="showBranchPickerPopup" position="bottom" round>
      <van-picker
        :columns="branchOptions"
        @confirm="onBranchConfirm"
        @cancel="onBranchCancel"
        :default-index="0"
        title="选择分公司"
      />
    </van-popup>

    <!-- 中支选择器弹窗 -->
    <van-popup v-model:show="showsubBranchPickerPopup" position="bottom" round>
      <van-picker
        :columns="subBranchOption"
        @confirm="onSubBranchConfirm"
        @cancel="onSubBranchCancel"
        :default-index="0"
        title="选择中支"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
import { showLoadingToast, closeToast, showFailToast } from 'vant'
import FormField from '@/components/base/FormField.vue'

const props = defineProps({
  branchCode: { type: String, default: '' },
  subbranchCode: { type: String, default: '' },
  editable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:branchCode', 'update:subbranchCode', 'branch-selected'])

const showBranchPickerPopup = ref(false)
const showsubBranchPickerPopup = ref(false)
const branchOptions = ref([])
const branchOptionsBack = ref([])
const subBranchOption = ref([])

// 计算属性：分公司显示值
const branchDisplayValue = computed(() => {
  if (!props.branchCode) return ''
  const option = branchOptions.value.find(opt => opt.value === props.branchCode)
  return option ? option.text : props.branchCode
})

// 计算属性：中支显示值
const subbranchDisplayValue = computed(() => {
  if (!props.subbranchCode) return ''
  const option = subBranchOption.value.find(opt => opt.value === props.subbranchCode)
  return option ? option.text : props.subbranchCode
})

// 监听分公司代码变化，清空中支选项
watch(() => props.branchCode, (newVal, oldVal) => {
  console.log('BranchSubbranchPicker - 分公司代码变化:', { oldVal, newVal })
  if (!newVal && oldVal) {
    // 如果分公司被清空，清空中支选项
    console.log('BranchSubbranchPicker - 分公司被清空，清空中支选项')
    subBranchOption.value = []
  } else if (newVal && newVal !== oldVal) {
    // 如果分公司发生变化，重新加载中支选项
    console.log('BranchSubbranchPicker - 分公司发生变化，重新加载中支选项')
    loadSubBranchOptionByBranchCode(newVal)
  }
})

const showBranchPicker = () => {
  if (!props.editable) return
  showLoadingToast({ message: '加载分公司数据...', forbidClick: true })
  loadBranchData()
    .then(() => {
      closeToast()
      showBranchPickerPopup.value = true
    })
    .catch((error) => {
      closeToast()
      showFailToast('加载失败，请重试')
      console.error('Failed to load branch data:', error)
    })
}

const showSubBranchPicker = () => {
  if (!props.editable) return
  showsubBranchPickerPopup.value = true
}

const onBranchConfirm = ({ selectedOptions }) => {
  const selectBranch = selectedOptions[0]
  console.log('BranchSubbranchPicker - 分公司选择确认:', selectBranch)
  
  if (selectBranch && selectBranch.text) {
    console.log('BranchSubbranchPicker - 更新分公司代码:', selectBranch.value)
    emit('update:branchCode', selectBranch.value)
    console.log('BranchSubbranchPicker - 清空中支值')
    emit('update:subbranchCode', '')
    console.log('BranchSubbranchPicker - 重新加载中支选项')
    loadSubBranchOptionByBranchCode(selectBranch.value)
    console.log('BranchSubbranchPicker - 发出branch-selected事件:', selectBranch)
    emit('branch-selected', selectBranch)
  } else {
    console.log('BranchSubbranchPicker - 没有选择分公司')
  }
  showBranchPickerPopup.value = false
}

const onBranchCancel = () => {
  showBranchPickerPopup.value = false
}

const onSubBranchConfirm = ({ selectedOptions }) => {
  const selectSubBranch = selectedOptions[0]
  if (selectSubBranch && selectSubBranch.text) {
    emit('update:subbranchCode', selectSubBranch.value)
  }
  showsubBranchPickerPopup.value = false
}

const onSubBranchCancel = () => {
  showsubBranchPickerPopup.value = false
}

const loadBranchData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      branchOptionsBack.value = [
        {
          branchCode: '1',
          branchName: '北京分公司',
          id: '01',
          itemList: [
            { id: '0101', subbranchCode: '10', subbranchName: '北京本部' }
          ]
        },
        {
          branchCode: '2',
          branchName: '湖北分公司',
          id: '02',
          itemList: [
            { id: '0201', subbranchCode: '10', subbranchName: '武汉本部' },
            { id: '0211', subbranchCode: '20', subbranchName: '宜昌中心支公司' },
            { id: '0212', subbranchCode: '30', subbranchName: '襄阳中心支公司' },
            { id: '0213', subbranchCode: '50', subbranchName: '十堰中心支公司' },
            { id: '0214', subbranchCode: '60', subbranchName: '黄石中心支公司' },
            { id: '0215', subbranchCode: '40', subbranchName: '荆州中心支公司' },
            { id: '0216', subbranchCode: '70', subbranchName: '荆门中心支公司' },
            { id: '0217', subbranchCode: 'A0', subbranchName: '黄冈中心支公司' },
            { id: '0218', subbranchCode: '80', subbranchName: '孝感中心支公司' },
            { id: '0219', subbranchCode: '90', subbranchName: '咸宁中心支公司' },
            { id: '0220', subbranchCode: 'D0', subbranchName: '恩施中心支公司' },
            { id: '0221', subbranchCode: 'C0', subbranchName: '鄂州中心支公司' },
            { id: '0222', subbranchCode: 'G0', subbranchName: '天门中心支公司' },
            { id: '0223', subbranchCode: 'F0', subbranchName: '仙桃中心支公司' },
            { id: '0224', subbranchCode: 'B0', subbranchName: '随州中心支公司' },
            { id: '0225', subbranchCode: 'K0', subbranchName: '武汉本部业务管理二部' },
            { id: '0226', subbranchCode: 'J0', subbranchName: '武汉本部业务管理三部' },
            { id: '0227', subbranchCode: 'E0', subbranchName: '潜江中心支公司' }
          ]
        }
      ]
      branchOptions.value = branchOptionsBack.value.map(item => ({ text: item.branchName, value: item.id }))
      resolve()
    }, 300)
  })
}

const loadSubBranchOptionByBranchCode = (branchCode) => {
  console.log('BranchSubbranchPicker - 加载中支选项，分公司代码:', branchCode)
  const branch = branchOptionsBack.value.find(item => item.id === branchCode)
  console.log('BranchSubbranchPicker - 找到的分公司数据:', branch)
  
  if (branch && branch.itemList) {
    console.log('BranchSubbranchPicker - 中支列表:', branch.itemList)
    subBranchOption.value = branch.itemList.map(it => ({ text: it.subbranchName, value: it.id }))
    console.log('BranchSubbranchPicker - 处理后的中支选项:', subBranchOption.value)
  } else {
    console.log('BranchSubbranchPicker - 未找到分公司或中支列表为空')
    subBranchOption.value = []
  }
}
</script>

<style scoped>
.branch-subbranch-picker { padding: 0; }
</style>


