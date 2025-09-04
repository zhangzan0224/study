<template>
  <div class="community-name-picker">
    <FormField 
      name="communityName"
      :rules="props.rules"
      label="社区名称" 
      :required="true" 
      type="select" 
      :placeholder="editable ? '请选择社区' : modelValue" 
      :disabled="!editable" 
      :model-value="selectedCommunityName"
      @select-click="showPickerPopup" 
    />

    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        :columns="communityOptions"
        @confirm="onConfirm"
        @cancel="onCancel"
        title="选择社区"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import FormField from '@/components/base/FormField.vue';
import { showLoadingToast, closeToast, showFailToast } from 'vant';

const props = defineProps({
  modelValue: { type: String, default: '' },
  editable: { type: Boolean, default: true },
  rules: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'community-selected']);

const showPicker = ref(false);
const communityOptions = ref([]);
const communityList = ref([]);

const selectedCommunityName = computed(() => {
  const found = communityList.value.find(c => c.id === props.modelValue);
  return found ? found.communityName : '';
});

const getCommunityList = async () => {
  // Simulate API call with the provided data
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          { "id": "1", "communityName": "泰康之家·燕园" },
          { "id": "10", "communityName": "泰康之家·沈园" },
          { "id": "11", "communityName": "泰康之家·湘园" },
          { "id": "12", "communityName": "泰康之家·鹭园" },
          { "id": "13", "communityName": "泰康之家·三亚海棠湾康养度假村" },
          { "id": "14", "communityName": "泰康之家·桂园" },
          { "id": "15", "communityName": "泰康之家·甬园" },
          { "id": "16", "communityName": "泰康之家·徽园" },
          { "id": "17", "communityName": "泰康之家·鹏园" },
          { "id": "18", "communityName": "泰康之家·渝园" },
          { "id": "19", "communityName": "泰康之家·苏园" },
          { "id": "2", "communityName": "泰康之家·申园" },
          { "id": "20", "communityName": "泰康之家·豫园" },
          { "id": "21", "communityName": "泰康之家·琴园" },
          { "id": "22", "communityName": "泰康之家·福园" },
          { "id": "23", "communityName": "泰康之家·瓯园" },
          { "id": "24", "communityName": "泰康之家·津园" },
          { "id": "25", "communityName": "泰康之家·儒园" },
          { "id": "27", "communityName": "泰康之家·蒙园" },
          { "id": "28", "communityName": "泰康之家·静安府" },
          { "id": "29", "communityName": "泰康之家·浙园" },
          { "id": "3", "communityName": "泰康之家·锦绣府" },
          { "id": "30", "communityName": "泰康之家·锦官府" },
          { "id": "31", "communityName": "泰康之家·滇园" },
          { "id": "32", "communityName": "泰康之家·秦园" },
          { "id": "33", "communityName": "泰康之家·禅园" },
          { "id": "34", "communityName": "泰康之家·吉园" },
          { "id": "35", "communityName": "泰康之家·龙园" },
          { "id": "36", "communityName": "泰康之家·锡园" },
          { "id": "37", "communityName": "泰康之家·黔园" },
          { "id": "38", "communityName": "泰康之家·鲤园" },
          { "id": "39", "communityName": "泰康之家·冀园" },
          { "id": "4", "communityName": "泰康之家·粤园" },
          { "id": "40", "communityName": "泰康之家·北清府" },
          { "id": "41", "communityName": "泰康之家·通园" },
          { "id": "42", "communityName": "泰康之家·和平府" },
          { "id": "43", "communityName": "泰康之家·西北旺养老项目" },
          { "id": "44", "communityName": "泰康之家大连养老社区" },
          { "id": "5", "communityName": "泰康之家·蜀园" },
          { "id": "6", "communityName": "泰康之家·吴园" },
          { "id": "7", "communityName": "泰康之家·楚园" },
          { "id": "8", "communityName": "泰康之家·大清谷" },
          { "id": "9", "communityName": "泰康之家·赣园" }
        ]
      });
    }, 300);
  });
};

const loadCommunityData = async () => {
  if (communityOptions.value.length > 0) return;
  try {
    showLoadingToast({ message: '加载中...', forbidClick: true, duration: 0 });
    const res = await getCommunityList();
    if (res.success && res.data) {
      communityList.value = res.data;
      communityOptions.value = res.data.map(item => ({ text: item.communityName, value: item.id }));
    }
    closeToast();
  } catch (error) {
    closeToast();
    showFailToast('加载失败');
  }
};

const showPickerPopup = () => {
  if (!props.editable) return;
  loadCommunityData();
  showPicker.value = true;
};

const onConfirm = ({ selectedOptions }) => {
  const selected = selectedOptions[0];
  if (selected) {
    emit('update:modelValue', selected.value);
    const selectedCommunity = communityList.value.find(c => c.id === selected.value);
    emit('community-selected', selectedCommunity);
  }
  showPicker.value = false;
};

const onCancel = () => {
  showPicker.value = false;
};

onMounted(() => {
  loadCommunityData();
});

</script>

<style scoped>
.community-name-picker {
  padding: 0;
}
</style>
