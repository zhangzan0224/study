<template>
  <div class="expert-form">
    <!-- 照片上传（封装为组件，使用 Vant Uploader） -->
    <ExpertPhotoUploader
      v-model="localExpert.photo"
      :editable="true"
      @update:modelValue="handleUpdate"
    />
    
    <!-- 模式切换：选择讲师 / 手动录入 -->


    <!-- 基本信息 -->
    <div class="info-section">
      <ExpertSearchPicker
        v-model="localExpert.name"
        :rules="expertRules.doctorName"
        @expert-selected="onExpertSelected"
      />
      
      <FormField 
        label="职称"
        :required="true"
        type="select"
        v-model="localExpert.title"
        placeholder="请选择"
        name="titleType"
        :rules="expertRules.titleType"
        :disabled="disableTitle"
        @select-click="openTitlePicker"
      />
      
      <!-- 医院：仅展示/选择医院名称（无级别与FE编码）；选择系统讲师时只读展示 -->
      <template v-if="isManual">
        <HospitalNameOnlyPicker
          v-model="localExpert.hospital"
          :editable="!disableHospital"
          :rules="expertRules.hospitalName"
          @hospital-selected="handleUpdate"
        />
      </template>
      <template v-else>
        <FormField 
          label="医院"
          :required="true"
          type="input"
          v-model="localExpert.hospital"
          placeholder="请输入或选择"
          name="hospitalName"
          :rules="expertRules.hospitalName"
          :disabled="true"
          @input="handleUpdate"
        />
      </template>
      
      <FormField 
        label="科室"
        type="input"
        v-model="localExpert.department"
        placeholder="请输入"
        name="department"
        :rules="expertRules.department"
        :disabled="disableDepartment"
        @input="handleUpdate"
      />
      
      <FormField 
        label="介绍"
        type="textarea"
        v-model="localExpert.introduction"
        placeholder="请输入"
        :max-length="200"
        :rows="4"
        :show-divider="false"
        name="introduce"
        :rules="expertRules.introduce"
        :disabled="disableIntroduction"
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
    
    <!-- 删除按钮 -->
    <div v-if="showRemove" class="remove-section">
      <button class="remove-btn" @click="handleRemove">
        删除讲师
      </button>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/base/FormField.vue'
import HospitalNameOnlyPicker from '@/components/activity/HospitalNameOnlyPicker.vue'
import ExpertSearchPicker from '@/components/activity/ExpertSearchPicker.vue'
import ExpertPhotoUploader from '@/components/activity/ExpertPhotoUploader.vue'

export default {
  name: 'ExpertForm',
  components: {
    FormField,
    HospitalNameOnlyPicker,
    ExpertSearchPicker,
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
    }
  },
  data() {
    return {
      localExpert: { ...this.expert },
      // 选择讲师 或 手动录入
      entryMode: 'manual',
      // 职称选择弹窗
      showTitlePopup: false,
      titleOptions: [
        { text: '知名专家', value: '知名专家' },
        { text: '主任医师', value: '主任医师' },
        { text: '副主任医师', value: '副主任医师' },
        { text: '主治医师', value: '主治医师' },
        { text: '住院医师', value: '住院医师' }
      ],
      // 讲师搜索弹窗（选择模式预留）
      showLecturerSearch: false,
      // 复用医院选择器的额外字段（不入库，仅内部使用）
      expertHospitalLevel: '',
      expertFeHospitalId: '',
      expertDisableHospitalLevel: false
    }
  },
  computed: {
    isManual() {
      return this.entryMode === 'manual'
    },
    nameFilled() {
      return (this.localExpert.name || '').trim().length > 0
    },
    disableTitle() {
      if (!this.nameFilled) return true
      return this.isManual ? false : true
    },
    disableHospital() {
      if (!this.nameFilled) return true
      return this.isManual ? false : true
    },
    disableDepartment() {
      if (!this.nameFilled) return true
      return this.isManual ? false : true
    },
    disableIntroduction() {
      return !this.nameFilled
    },
    titleDefaultIndex() {
      const idx = this.titleOptions.findIndex(o => String(o.value) === String(this.localExpert.title))
      return idx >= 0 ? idx : 0
    },
    expertRules() {
      const lengthMax = (max, triggers = ['onChange']) =>
        triggers.map(tr => ({
          validator: (val) => !val || String(val).length <= max,
          message: `不能超过${max}个字符`,
          trigger: tr
        }))

      const makeRequired = (message, triggers = ['onChange']) =>
        triggers.map(tr => ({ required: true, message, trigger: tr }))

      return {
        // 专家姓名规则：必填 + 最长30（change）
        doctorName: [
          ...makeRequired('请输入', ['onChange']),
          ...lengthMax(30, ['onChange'])
        ],
        // 职称规则：必填 + 最长30（change、blur）
        titleType: [
          ...makeRequired('请输入', ['onChange', 'onBlur']),
          ...lengthMax(30, ['onChange', 'onBlur'])
        ],
        // 科室规则：非必填，若填写最长30（change、blur）
        department: [
          ...lengthMax(30, ['onChange', 'onBlur'])
        ],
        // 所属医院规则：必填（change、blur）
        hospitalName: [
          ...makeRequired('请选择', ['onChange', 'onBlur'])
        ],
        // 介绍规则：非必填，若填写最长400（change、blur）
        introduce: [
          ...lengthMax(200, ['onChange', 'onBlur'])
        ],
        // 医生照片规则：非必填（保留占位）
        photoKey: []
      }
    }
  },
  watch: {
    expert: {
      handler(newVal) {
        this.localExpert = { ...newVal };
      },
      deep: true
    }
  },
  methods: {
    setMode(mode) {
      if (this.entryMode === mode) return
      this.entryMode = mode
      if (mode === 'select') {
        // 切到选择模式，清空姓名以外字段，等待选择讲师后自动带出
        this.localExpert.title = ''
        this.localExpert.hospital = ''
        this.localExpert.department = ''
        // 介绍在选择后可由擅长课程带出，这里清空
        this.localExpert.introduction = ''
      }
      this.handleUpdate()
    },

    handlePhotoUpload() {
      // 触发照片上传（仅保留占位，供接入上传组件）
      console.log('Upload photo for expert:', this.index)
      // TODO: 接入上传组件/接口，成功后：this.localExpert.photo = url; this.handleUpdate()
    },

    openTitlePicker() {
      if (this.disableTitle) return
      this.showTitlePopup = true
    },

    onTitleConfirm({ selectedOptions }) {
      const sel = selectedOptions && selectedOptions[0]
      if (sel && sel.value) {
        this.localExpert.title = sel.value
        this.handleUpdate()
      }
      this.showTitlePopup = false
    },

    onNameInput() {
      // 手动录入姓名
      this.handleUpdate()
    },

    onNameSelectClick() {
      // 选择讲师模式：打开搜索弹窗
      if (this.entryMode !== 'select') return
      this.showLecturerSearch = true
    },

    mockPickLecturer() {
      // 模拟选择讲师：选择后带出职称/医院/科室；介绍可编辑
      const mock = {
        id: 'L001',
        name: '张三',
        title: '主任医师',
        hospital: '北京协和医院',
        department: '心内科',
        expertise: '心血管疾病诊疗与预防'
      }
      this.localExpert.name = mock.name
      this.localExpert.title = mock.title
      this.localExpert.hospital = mock.hospital
      this.localExpert.department = mock.department
      this.localExpert.introduction = mock.expertise || ''
      this.showLecturerSearch = false
      this.handleUpdate()
    },

    handleUpdate() {
      this.$emit('update', this.index, { ...this.localExpert, mode: this.entryMode })
    },

    handleRemove() {
      this.$emit('remove', this.index)
    },

    onExpertSelected(payload) {
      if (payload && payload.isCustom) {
        // 手动录入：清空自动带出的字段，由用户自行填写
        this.entryMode = 'manual'
        this.localExpert.title = ''
        this.localExpert.hospital = ''
        this.localExpert.department = ''
        this.localExpert.introduction = ''
      } else if (payload && payload.expertData) {
        // 选择系统讲师：带出信息并锁定部分字段
        this.entryMode = 'select'
        const e = payload.expertData || {}
        this.localExpert.title = e.title || ''
        this.localExpert.hospital = e.hospital || ''
        this.localExpert.department = e.department || ''
        // 介绍可编辑，来源于擅长课程
        this.localExpert.introduction = e.expertise || ''
      }
      this.handleUpdate()
    }
  }
}
</script>

<style scoped>
.expert-form {
  padding: 16px 20px;
}

.photo-section {
  margin-bottom: 16px;
}

.photo-label {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  margin-bottom: 8px;
}

.photo-upload {
  width: 94px;
  height: 94px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.expert-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: rgba(153, 153, 153, 1);
}

.info-section {
  margin-bottom: 16px;
}

.remove-section {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

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

.remove-btn:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

/* 模式切换样式 */
.mode-switch {
  display: flex;
  gap: 12px;
  margin: 8px 0 12px 0;
}
.mode-tab {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  user-select: none;
}
.mode-tab.active {
  border-color: #ff811a;
  color: #ff811a;
  background: rgba(255, 129, 26, 0.08);
}

/* 搜索弹窗占位样式 */
.search-panel {
  padding: 24px 16px;
}
.search-panel .placeholder {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
.search-panel .actions {
  display: flex;
  gap: 12px;
}
.search-panel .btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.search-panel .btn:hover {
  background: #f6f6f6;
}
</style>
