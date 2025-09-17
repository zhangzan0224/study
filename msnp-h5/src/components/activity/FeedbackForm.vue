<template>
  <div class="feedback-form">
    <!-- 活动标题卡片 -->
    <div class="activity-header-card">
      <div class="gradient-bar"></div>
      <h3 class="activity-title">{{ activity?.name }}</h3>
      
      <!-- 统计数据 -->
      <div class="stats-section">
        <div class="main-stat">
          <span class="stat-number">62</span>
          <span class="stat-label">签到反馈总人数</span>
        </div>
        
        <div class="sub-stats">
          <div class="stat-item">
            <span class="stat-number">36</span>
            <span class="stat-label">签到客户人数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">签到代理人人数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">27</span>
            <span class="stat-label">反馈客户人数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">10</span>
            <span class="stat-label">反馈代理人人数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">16</span>
            <span class="stat-label">签到反馈客户总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">5</span>
            <span class="stat-label">签到反馈代理人总数</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 活动数据 -->
    <div class="data-section">
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-title">活动数据</span>
          <span class="section-subtitle">数据将用于统计分析,请务必准确提供</span>
        </div>
      </div>
      
      <div class="data-form">
        <div class="form-item">
          <div class="item-row">
            <span class="item-label">报名人数(人)</span>
            <span class="item-value">{{ formData.registrationCount }}</span>
          </div>
          <div class="item-divider"></div>
        </div>
        
        <div class="form-item">
          <div class="item-row">
            <span class="item-label">现场实际客户人数(人)</span>
            <span class="item-value" :class="{ placeholder: !formData.actualCustomerCount }">
              {{ formData.actualCustomerCount || '请输入' }}
            </span>
          </div>
          <div class="item-divider"></div>
        </div>
        
        <div class="form-item">
          <div class="item-row">
            <span class="item-label">现场实际代理人人数(人)</span>
            <span class="item-value" :class="{ placeholder: !formData.actualAgentCount }">
              {{ formData.actualAgentCount || '请输入' }}
            </span>
          </div>
          <div class="item-divider"></div>
        </div>
        
        <div class="form-item">
          <div class="item-row">
            <div class="item-label-group">
              <span class="required-asterisk">*</span>
              <span class="item-label">现上参与人数(人)</span>
            </div>
            <span class="item-value">{{ formData.onlineParticipantCount }}</span>
          </div>
          <div class="item-divider"></div>
        </div>
        
        <div class="form-item">
          <div class="item-row">
            <div class="item-label-group">
              <span class="required-asterisk">*</span>
              <span class="item-label">该活动是否录入其他系统</span>
            </div>
            <div class="select-group">
              <span class="item-value" :class="{ placeholder: !formData.recordedInOtherSystem }">
                {{ formData.recordedInOtherSystem || '请选择' }}
              </span>
              <img src="@/assets/img/arrow-down.png" alt="" class="select-icon" />
            </div>
          </div>
          <div class="item-divider"></div>
        </div>
        
        <div class="form-item">
          <div class="item-row">
            <div class="item-label-group">
              <span class="required-asterisk">*</span>
              <span class="item-label">活动费用(元)</span>
            </div>
            <span class="item-value" :class="{ placeholder: !formData.activityCost }">
              {{ formData.activityCost || '请输入' }}
            </span>
          </div>
          <div class="item-divider"></div>
        </div>
        
        <div class="form-item">
          <div class="textarea-field">
            <span class="textarea-label">活动费用用途</span>
            <div class="textarea-container">
              <div class="textarea-content">
                <span class="textarea-placeholder">{{ formData.costPurpose || '请输入' }}</span>
              </div>
              <div class="char-count">{{ (formData.costPurpose || '').length }}/300</div>
            </div>
          </div>
          <div class="item-divider"></div>
        </div>
      </div>
      
      <!-- 是否现场签单 -->
      <div class="signing-section">
        <div class="signing-label">
          <span class="required-mark">*</span>
          <span class="label-text">是否现场签单</span>
        </div>
        <div class="signing-options">
          <button 
            class="option-btn"
            :class="{ active: formData.onSiteSigning === true }"
            @click="toggleOnSite(true)"
          >
            是
          </button>
          <button 
            class="option-btn"
            :class="{ active: formData.onSiteSigning === false }"
            @click="toggleOnSite(false)"
          >
            否
          </button>
        </div>
      </div>
    </div>
    
    <!-- 活动评价 -->
    <div class="evaluation-section">
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-title">活动评价</span>
          <span class="section-subtitle">1-5分从差到优排序</span>
        </div>
      </div>

      <div class="section-body">
        <div class="evaluation-items">
          <div class="evaluation-item">
            <div class="evaluation-question">
              <span class="required-mark">*</span>
              <span class="question-text">讲座内容设置是否符合听众的健康需求:</span>
            </div>
            <StarRating v-model="formData.evaluation.contentSuitability" />
          </div>
          
          <div class="evaluation-item">
            <div class="evaluation-question">
              <span class="required-mark">*</span>
              <span class="question-text">专家演讲方式是否有效调动现场气氛:</span>
            </div>
            <StarRating v-model="formData.evaluation.presentationEffectiveness" />
          </div>
          
          <div class="evaluation-item">
            <div class="evaluation-question">
              <span class="required-mark">*</span>
              <span class="question-text">讲座内容是否符合主办单位的业务需求:</span>
            </div>
            <StarRating v-model="formData.evaluation.businessNeedAlignment" />
          </div>
          
          <div class="evaluation-item">
            <div class="evaluation-question">
              <span class="required-mark">*</span>
              <span class="question-text">专家演讲方式是否符合主办单位的预期:</span>
            </div>
            <StarRating v-model="formData.evaluation.expectationAlignment" />
          </div>
          
          <div class="total-score">
            <span class="score-label">活动总分</span>
            <span class="score-value">{{ totalScore }} 分</span>
          </div>
          
          <div class="suggestion-field">
            <span class="suggestion-label">其他意见或建议</span>
            <div class="textarea-container">
              <div class="textarea-content">
                <span class="textarea-placeholder">{{ formData.evaluation.suggestions || '请输入' }}</span>
              </div>
              <div class="char-count">{{ (formData.evaluation.suggestions || '').length }}/300</div>
              </div>
            </div>
        </div>
      </div>
    </div>
    
    <!-- 活动文件 -->
    <div class="file-section">
      <div class="section-header">
        <div class="section-title-group">
          <span class="section-title">活动文件</span>
          <span class="section-subtitle">
            最多可上传10个文件,单个非视频文件不能超过20M;<br/>
            单个视频文件不能超过500M
          </span>
        </div>
      </div>
      
      <div class="section-body">
        <FileUploader
          v-model="uploadedFiles"
          :max-count="10"
          :max-file-size="20"
          :max-video-size="500"
          @change="handleFileChange"
          @upload-success="handleFileUploadSuccess"
          @upload-error="handleFileUploadError"
          @delete="handleFileDelete"
          @download="handleFileDownload"
        />
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div v-if="!hideActions" class="action-buttons">
      <button class="btn btn-save" @click="handleSave">
        保存
      </button>
      <button class="btn btn-submit" @click="handleSubmit">
        提交
      </button>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/base/FormField.vue'
import StarRating from '@/components/base/StarRating.vue'
import FileUploader from '@/components/base/FileUploader.vue'
import { showFailToast, showSuccessToast } from 'vant'

export default {
  name: 'FeedbackForm',
  components: {
    FormField,
    StarRating,
    FileUploader
  },
  props: {
    activity: { type: Object, required: true },
    entryMode: { type: String, default: 'detail' },
    hideActions: { type: Boolean, default: true }
  },
  data() {
    return {
      inPageEditing: this.entryMode !== 'detail',
      uploadedFiles: [],
      formData: {
        registrationCount: 108,
        actualCustomerCount: '',
        actualAgentCount: '',
        onlineParticipantCount: 48,
        recordedInOtherSystem: '',
        activityCost: '',
        costPurpose: '',
        onSiteSigning: null,
        evaluation: {
          contentSuitability: 5,
          presentationEffectiveness: 0,
          businessNeedAlignment: 0,
          expectationAlignment: 0,
          suggestions: '希望可以多多举办活动'
        },
        report: ''
      }
    }
  },
  computed: {
    totalScore() {
      const { evaluation } = this.formData;
      const scores = [
        evaluation.contentSuitability,
        evaluation.presentationEffectiveness,
        evaluation.businessNeedAlignment,
        evaluation.expectationAlignment
      ];
      const total = scores.reduce((sum, score) => sum + score, 0);
      return (total / 4).toFixed(2);
    }
  },
  methods: {
    toggleOnSite(v) {
      if (!this.inPageEditing) return
      this.formData.onSiteSigning = v
    },
    handleSave() {
      this.$emit('save', this.formData);
    },
    handleSubmit() {
      this.$emit('submit', this.formData);
    },
    validate() {
      const msgs = []
      // 必填：是否现场签单
      if (this.formData.onSiteSigning === null || this.formData.onSiteSigning === undefined) {
        msgs.push('请选择是否现场签单')
      }
      // 基础打分至少都给出（这里示例：均需 > 0）
      const ev = this.formData.evaluation || {}
      const keys = ['contentSuitability','presentationEffectiveness','businessNeedAlignment','expectationAlignment']
      keys.forEach(k => {
        if (!ev[k] || Number(ev[k]) <= 0) msgs.push('请完善活动评价打分')
      })
      if (msgs.length) throw new Error(msgs[0])
      return true
    },
    async submitAll(silent = false) {
      try {
        this.validate()
        // TODO: 提交反馈接口
        if (!silent) showSuccessToast('提交成功')
        return true
      } catch (e) {
        showFailToast(e.message || '校验失败')
        return false
      }
    },
    async submit(silent = false) {
      // 统一对外的提交方法
      return await this.submitAll(silent)
    },
    isEditing() { return !!this.inPageEditing },
    setEditing(v) { this.inPageEditing = !!v },
    // 文件上传相关方法
    handleFileChange(files) { this.uploadedFiles = files },
    handleFileUploadSuccess(file) { console.log('文件上传成功:', file) },
    handleFileUploadError(error) { console.error('文件上传失败:', error) },
    handleFileDelete(file, index) { console.log('文件删除:', file, index) },
    handleFileDownload(file) { console.log('文件下载:', file) }
  },
  mounted() {
    // 向父组件暴露编辑查询与方法
    this.$.exposed = {
      get isEditing() { return !!this.inPageEditing },
      setEditing: (v) => (this.inPageEditing = !!v),
      validate: this.validate,
      submit: this.submitAll
    }
  }
}
</script>

<style scoped>
.feedback-form {
  background-color: rgba(241, 243, 246, 1);
  padding-bottom: 80px;
}

.activity-header-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 21px 11px 14px 0;
  position: relative;
  overflow: hidden;
}

.gradient-bar {
  position: absolute;
  left: 0;
  top: 23px;
  width: 4px;
  height: 18px;
  background-color: rgba(255, 129, 26, 1);
  border-radius: 0 28px 28px 0;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  margin: 0 0 11px 17px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 22px;
}

.stats-section {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  gap: 14px;
}

.main-stat {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 122px;
}

.main-stat .stat-number {
  font-size: 35px;
  font-weight: 700;
  color: rgba(51, 51, 51, 1);
  font-family: 'DIN Alternate', sans-serif;
  line-height: 41px;
}

.main-stat .stat-label {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 17px;
  margin-top: 20px;
}

.stat-number {
  font-size: 22px;
  font-weight: 700;
  color: rgba(51, 51, 51, 1);
  font-family: 'DIN Alternate', sans-serif;
  line-height: 26px;
}

.stat-label {
  font-size: 12px;
  color: rgba(102, 102, 102, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 17px;
  margin-top: 2px;
}

/* 设置为两列三行的 grid */
.sub-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
}

.sub-stats .stat-item {
  background-color: rgba(243, 245, 246, 1);
  border-radius: 4px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.data-section,
.evaluation-section,
.file-section,
.report-section {
  background-color: #ffffff;
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  align-self: center;
}

.section-header {
  padding: 18px 15px 0 15px;
  background-image: linear-gradient(0deg, #FFFFFF 0%, #FDF1E6 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.section-title-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 22px;
}

.section-subtitle {
  font-size: 14px;
  color: rgba(255, 129, 26, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
}

.section-body {
  padding: 0 15px;
}

.data-form {
  padding: 0;
}

.form-item {
  padding: 15px 15px 0 15px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 325px;
}

.item-label-group {
  display: flex;
  align-items: center;
}

.required-asterisk {
  color: rgba(255, 0, 0, 1);
  font-size: 15px;
  margin-right: 2px;
  line-height: 21px;
}

.item-label {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.item-value {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
  text-align: right;
}

.item-value.placeholder {
  color: rgba(153, 153, 153, 1);
}

.select-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-icon {
  width: 18px;
  height: 18px;
}

.item-divider {
  background-color: rgba(242, 242, 242, 1);
  width: 100%;
  height: 1px;
  margin-top: 13px;
}

.textarea-field {
  width: 100%;
}

.textarea-label {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
  display: block;
  margin-bottom: 11px;
}

.textarea-container {
  background-color: rgba(250, 250, 250, 1);
  border-radius: 8px;
  padding: 14px 15px 15px 15px;
  position: relative;
}

.textarea-content {
  margin-bottom: 70px;
}

.textarea-placeholder {
  font-size: 15px;
  color: rgba(153, 153, 153, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.char-count {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
}

.suggestion-field {
  padding: 15px 0 0 0;
}

.suggestion-label {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
  display: block;
  margin-bottom: 11px;
}

/* .suggestion-content {
  margin-bottom: 70px;
}

.suggestion-text {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.suggestion-count {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
} */

.signing-section {
  padding: 15px 15px 22px 15px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.signing-label {
  display: flex;
  align-items: center;
}

.required-mark {
  color: rgba(255, 0, 0, 1);
  font-size: 15px;
  margin-right: 2px;
}

.label-text {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.signing-options {
  display: flex;
  gap: 0;
  align-self: center;
  width: 100%;
}

.option-btn {
  height: 30px;
  border-radius: 15px;
  border: none;
  background-color: rgba(244, 244, 244, 1);
  color: rgba(51, 51, 51, 1);
  font-size: 15px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
  cursor: pointer;
  padding: 4px 70px 5px 70px;
  margin-right: 15px;
}

.option-btn:last-child {
  margin-right: 0;
}

.option-btn.active {
  background-color: rgba(254, 238, 231, 1);
  color: rgba(255, 129, 26, 1);
  border: 1px solid rgba(255, 129, 26, 1);
  padding: 3px 69px 4px 69px;
}

.evaluation-items {
  padding: 0 0 24px 0;
}

.evaluation-item {
  margin-bottom: 12px;
}

.evaluation-item:first-child {
  padding: 15px 0 14px 0;
}

.evaluation-item:not(:first-child) {
  margin-top: 12px;
  padding: 15px 0 14px 0;
}

.evaluation-question {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 0 58px 0 0;
}

.question-text {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.total-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0 0 0;
  border-top: 1px solid rgba(242, 242, 242, 1);
  margin-top: 15px;
  width: 100%;
}

.score-label {
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.score-value {
  font-size: 15px;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.upload-btn {
  background-color: #ffffff;
  border: 1px dashed rgba(187, 187, 187, 1);
  border-radius: 8px;
  padding: 19px 0 18px 0;
  margin: 15px auto 0;
  width: 100%;
  cursor: pointer;
  display: block;
}

.upload-text {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
}

.file-tips {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
  line-height: 17px;
  padding: 15px 0 21px 0;
  word-break: break-all;
}

.ai-btn {
  background: linear-gradient(90deg, rgba(254, 199, 117, 1) 0%, rgba(255, 129, 26, 1) 100%);
  color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 40px;
  padding: 5px 17px;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  margin: 6px 0 9px 0;
}

.report-field {
  padding: 13px 0 16px 0;
}

/* .report-content {
  margin-bottom: 70px;
}

.report-placeholder {
  font-size: 15px;
  color: rgba(153, 153, 153, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
}

.report-count {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
} */

.action-buttons {
  box-shadow: 0px -3px 4px 0px rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  gap: 0;
  padding: 15px 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.btn {
  height: 38px;
  border-radius: 40px;
  font-size: 16px;
  font-family: 'PingFang SC', sans-serif;
  border: none;
  cursor: pointer;
  line-height: 22px;
}

.btn-save {
  background-color: rgba(255, 255, 255, 1);
  color: rgba(255, 129, 26, 1);
  border: 1px solid rgba(255, 129, 26, 1);
  padding: 8px 71px 8px 69px;
  margin-right: 10px;
}

.btn-submit {
  background: linear-gradient(90deg, rgba(254, 199, 117, 1) 0%, rgba(255, 129, 26, 1) 100%);
  color: rgba(255, 255, 255, 1);
  padding: 8px 70px;
}

.btn:active {
  opacity: 0.8;
}
</style>
