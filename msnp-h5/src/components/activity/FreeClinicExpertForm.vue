<template>
  <div class="free-clinic-expert-form">
    <!-- 照片（最多1张，重复上传即替换） -->
    <ExpertPhotoUploader
      v-model="localExpert.photo"
      :editable="editable"
      :preview-base-url="PREVIEW_BASE"
      @upload-success="onPhotoUploaded"
    />

    <div class="info-section">
      <!-- 姓名：输入，必填，最长30字符 -->
      <FormField
        label="姓名"
        :required="true"
        type="input"
        v-model="localExpert.name"
        placeholder="请输入"
        :name="`doctorName_${index}`"
        :rules="expertRules.doctorName"
        :disabled="!editable"
        @input="handleUpdate"
      />

      <!-- 职称：选择，必填，固定枚举 -->
      <FormField
        label="职称"
        :required="true"
        type="select"
        v-model="localExpert.title"
        placeholder="请选择"
        :name="`titleType_${index}`"
        :rules="expertRules.titleType"
        :disabled="!editable"
        @select-click="openTitlePicker"
      />

      <!-- 医院：模糊查询选择，必填 -->
      <HospitalNameOnlyPicker
        v-model="localExpert.hospital"
        :editable="editable"
        :rules="expertRules.hospitalName"
        :allowCustom="false"
        :name="`hospitalName_${index}`"
        @hospital-selected="handleUpdate"
      />

      <!-- 科室：输入，非必填，最长30字符 -->
      <FormField
        label="科室"
        type="input"
        v-model="localExpert.department"
        placeholder="请输入"
        name="department"
        :rules="expertRules.department"
        @input="handleUpdate"
      />

      <!-- 介绍：输入，非必填，最长400字符 -->
      <FormField
        label="介绍"
        type="textarea"
        v-model="localExpert.introduction"
        placeholder="请输入"
        :max-length="400"
        :rows="4"
        :show-divider="false"
        name="introduce"
        :rules="expertRules.introduce"
        @input="handleUpdate"
      />

      <!-- 职称选择弹窗 -->
      <van-popup v-model:show="showTitlePopup" position="bottom" round>
        <van-picker
          :columns="titleOptions"
          @confirm="onTitleConfirm"
          @cancel="() => showTitlePopup=false"
          :default-index="titleDefaultIndex"
          title="选择职称"
        />
      </van-popup>
    </div>

    <!-- 删除按钮（可选） -->
    <div v-if="showRemove" class="remove-section">
      <button class="remove-btn" @click="handleRemove">删除讲师</button>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/base/FormField.vue'
import HospitalNameOnlyPicker from '@/components/activity/HospitalNameOnlyPicker.vue'
import ExpertPhotoUploader from '@/components/activity/ExpertPhotoUploader.vue'

export default {
  name: 'FreeClinicExpertForm',
  components: {
    FormField,
    HospitalNameOnlyPicker,
    ExpertPhotoUploader
  },
  props: {
    expert: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    showRemove: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      localExpert: { ...this.expert },
      showTitlePopup: false,
      titleOptions: [
        { text: '知名专家', value: '知名专家' },
        { text: '主任医师', value: '主任医师' },
        { text: '副主任医师', value: '副主任医师' },
        { text: '主治医师', value: '主治医师' },
        { text: '住院医师', value: '住院医师' }
      ]
    }
  },
  computed: {
    titleDefaultIndex() {
      const idx = this.titleOptions.findIndex(o => String(o.value) === String(this.localExpert.title))
      return idx >= 0 ? idx : 0
    },
    expertRules() {
      const charLen = (s) => Array.from(String(s || '')).length
      const lengthMax = (max, triggers = ['onChange']) =>
        triggers.map(tr => ({
          validator: (val) => !val || charLen(val) <= max,
          message: `不能超过${max}个字符`,
          trigger: tr
        }))
      const makeRequired = (message, triggers = ['onChange']) =>
        triggers.map(tr => ({ required: true, message, trigger: tr }))

      return {
        // 姓名：必填 + 最长30
        doctorName: [
          ...makeRequired('请输入', ['onChange', 'onBlur']),
          ...lengthMax(30, ['onChange', 'onBlur'])
        ],
        // 职称：必填（固定枚举，由选择器保证）
        titleType: [
          ...makeRequired('请选择', ['onChange', 'onBlur'])
        ],
        // 医院：必填（使用模糊搜索选择）
        hospitalName: [
          ...makeRequired('请选择', ['onChange', 'onBlur'])
        ],
        // 科室：非必填，若填则最长30
        department: [
          ...lengthMax(30, ['onChange', 'onBlur'])
        ],
        // 介绍：非必填，若填则最长400
        introduce: [
          ...lengthMax(400, ['onChange', 'onBlur'])
        ],
        photoKey: []
      }
    }
  },
  watch: {
    expert: {
      handler(newVal) {
        this.localExpert = { ...newVal }
      },
      deep: true
    }
  },
  methods: {
    handleUpdate() {
      this.$emit('update', this.index, { ...this.localExpert })
    },
    handleRemove() {
      this.$emit('remove', this.index)
    },
    openTitlePicker() {
      this.showTitlePopup = true
    },
    onTitleConfirm({ selectedOptions }) {
      const sel = selectedOptions && selectedOptions[0]
      if (sel && sel.value) {
        // 标题使用编码值；同时写入 title 与 titleType，保存时以 titleType 提交
        this.localExpert.title = sel.value
        this.localExpert.titleType = sel.value
        this.handleUpdate()
      }
      this.showTitlePopup = false
    },
    onPhotoUploaded(payload) {
      // 支持两种返回：字符串 url 或 { url, id }
      try {
        if (payload && typeof payload === 'object') {
          this.localExpert.photo = payload.url || this.localExpert.photo
          this.localExpert.photoKey = payload.id || this.localExpert.photoKey
        } else if (typeof payload === 'string') {
          this.localExpert.photo = payload
          // 从 url 末段兜底提取 key 作为 id
          try { const parts = payload.split('/'); this.localExpert.photoKey = parts[parts.length - 1] } catch {}
        }
      } catch {}
      this.handleUpdate()
    }
  }
}
</script>

<style scoped>
.free-clinic-expert-form { padding: 16px 20px; }
.info-section { margin-top: 8px; }
.remove-section { padding-top: 16px; border-top: 1px solid #f0f0f0; }
.remove-btn {
  background: transparent;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
  padding: 8px 16px;
  cursor: pointer;
}
.remove-btn:hover { background-color: rgba(255, 77, 79, 0.08); }
</style>

