<template>
  <div class="audit-activity-page">
    <!-- 导航栏 -->
    <NavigationBar title="审核活动" @back="handleBack" />
    
    <!-- 审核表单 -->
    <div class="audit-form">
      <div class="form-section">
        <!-- 审核结论 -->
        <div class="field-group">
          <div class="field-label">
            <span class="required-mark">*</span>
            <span class="label-text">审核结论</span>
          </div>
          
          <div class="conclusion-options">
            <button 
              class="conclusion-btn"
              :class="{ active: formData.conclusion === 'rejected', rejected: formData.conclusion === 'rejected' }"
              @click="selectConclusion('rejected')"
            >
              不通过
            </button>
            <button 
              class="conclusion-btn"
              :class="{ active: formData.conclusion === 'approved', approved: formData.conclusion === 'approved' }"
              @click="selectConclusion('approved')"
            >
              通过
            </button>
          </div>
        </div>
        
        <!-- 审核意见 -->
        <div class="field-group">
          <div class="field-label">
            <span class="required-mark">*</span>
            <span class="label-text">审核意见</span>
          </div>
          
          <div class="comment-section">
            <textarea 
              v-model="formData.comment"
              placeholder="请输入"
              class="comment-textarea"
              :maxlength="300"
            ></textarea>
            <div class="char-counter">
              {{ formData.comment.length }}/300
            </div>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <button 
          class="submit-btn"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          提交
        </button>
      </div>
    </div>
    
    <!-- 历史审核记录 -->
    <div class="history-section" v-if="auditHistory.length > 0">
      <div class="history-header">
        <span class="history-title">历史审核记录</span>
      </div>
      
      <div class="history-list">
        <div 
          v-for="(record, index) in auditHistory" 
          :key="index"
          class="history-item"
        >
          <div class="history-meta">
            <span class="history-round">第{{ record.round }}轮审核</span>
            <span class="history-time">{{ formatTime(record.time) }}</span>
          </div>
          
          <div class="history-content">
            <div class="history-field">
              <span class="field-name">审核人：</span>
              <span class="field-value">{{ record.auditor }}</span>
            </div>
            
            <div class="history-field">
              <span class="field-name">审核结论：</span>
              <span class="field-value" :class="record.conclusion">{{ record.conclusionText }}</span>
            </div>
            
            <div class="history-field" v-if="record.comment">
              <span class="field-name">审核意见：</span>
              <span class="field-value">{{ record.comment }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/base/NavigationBar.vue'

export default {
  name: 'AuditActivity',
  components: {
    NavigationBar
  },
  data() {
    return {
      activityId: null,
      formData: {
        conclusion: '', // 'approved' | 'rejected'
        comment: ''
      },
      auditHistory: [
        {
          round: 1,
          time: '2025-01-01 10:30:00',
          auditor: '张三',
          conclusion: 'rejected',
          conclusionText: '不通过',
          comment: '活动时间安排不合理，需要重新调整活动时间，建议避开节假日。'
        }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.formData.conclusion && this.formData.comment.trim();
    }
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    
    selectConclusion(conclusion) {
      this.formData.conclusion = conclusion;
    },
    
    handleSubmit() {
      if (!this.canSubmit) return;
      
      const auditData = {
        activityId: this.activityId,
        conclusion: this.formData.conclusion,
        comment: this.formData.comment,
        timestamp: new Date().toISOString()
      };
      
      // 提交审核结果
      console.log('Submit audit:', auditData);
      
      // 提交成功后返回
      this.$router.back();
    },
    
    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    loadAuditHistory() {
      // 加载审核历史记录
      console.log('Loading audit history for activity:', this.activityId);
    }
  },
  mounted() {
    // 获取活动ID
    this.activityId = this.$route.params.id || this.$route.query.id;
    
    // 加载审核历史
    this.loadAuditHistory();
  }
}
</script>

<style scoped>
.audit-activity-page {
  background-color: #f1f3f6;
  min-height: 100vh;
}

.audit-form {
  padding: 10px 20px;
}

.form-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
}

.field-group {
  margin-bottom: 24px;
}

.field-group:last-child {
  margin-bottom: 0;
}

.field-label {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.required-mark {
  color: #ff0000;
  font-size: 14px;
  margin-right: 2px;
}

.label-text {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
}

.conclusion-options {
  display: flex;
  gap: 12px;
}

.conclusion-btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  color: #666666;
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
  cursor: pointer;
  transition: all 0.3s;
}

.conclusion-btn.active.approved {
  background-color: #52c41a;
  color: #ffffff;
  border-color: #52c41a;
}

.conclusion-btn.active.rejected {
  background-color: #ff4d4f;
  color: #ffffff;
  border-color: #ff4d4f;
}

.comment-section {
  position: relative;
}

.comment-textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}

.comment-textarea::placeholder {
  color: #999999;
}

.comment-textarea:focus {
  border-color: #ff811a;
}

.char-counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
}

.submit-btn {
  width: 100%;
  height: 44px;
  background-color: #ff811a;
  color: #ffffff;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  font-family: 'PingFang SC', sans-serif;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):active {
  opacity: 0.8;
}

.history-section {
  margin: 10px 20px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.history-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.history-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.history-list {
  padding: 0;
}

.history-item {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-round {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.history-time {
  font-size: 12px;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
}

.history-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-field {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.field-name {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
  min-width: 80px;
}

.field-value {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  flex: 1;
  line-height: 20px;
}

.field-value.rejected {
  color: #ff4d4f;
}

.field-value.approved {
  color: #52c41a;
}
</style>
