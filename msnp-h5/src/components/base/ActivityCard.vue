<template>
  <div class="activity-card">
    <!-- 橙色渐变条 -->
    <div class="gradient-bar"></div>
    
    <!-- 活动标题 -->
    <div class="card-header">
      <h3 class="activity-title">{{ activity.name }}</h3>
    </div>
    
    <!-- 活动标签 -->
    <div class="activity-tags">
      <span class="tag" :class="tagHash[tag]" v-for="tag in activity.tags" :key="tag">{{ tag }}</span>
    </div>
    
    <!-- 活动时间 -->
    <div class="activity-time">
      <div class="time-group">
        <span class="time-value">{{ formatTime(activity.startTime) }}</span>
        <span class="time-date">{{ formatDate(activity.startTime) }}</span>
      </div>
      <div class="time-connector">
        <div class="connector-dot"></div>
        <div class="connector-dot"></div>
        <div class="connector-dot"></div>
        <div class="connector-dot"></div>
        <div class="connector-dot"></div>
        <div class="connector-dot"></div>
      </div>
      <div class="time-group">
        <span class="time-value">{{ formatTime(activity.endTime) }}</span>
        <span class="time-date">{{ formatDate(activity.endTime) }}</span>
      </div>
    </div>
    
    <!-- 活动详情信息 -->
    <div class="activity-details">
      <div class="detail-labels">
        <div class="detail-item">活动编号</div>
        <div class="detail-item">分公司</div>
        <div class="detail-item">中支</div>
        <div class="detail-item">医院名称</div>
        <div class="detail-item">活动状态</div>
      </div>
      <div class="detail-values">
        <div class="detail-item">{{ activity.code }}</div>
        <div class="detail-item">{{ activity.branch }}</div>
        <div class="detail-item">{{ activity.department }}</div>
        <div class="detail-item">{{ activity.hospital || '-' }}</div>
        <div class="detail-item status-item">
          {{ activity.status }}
          <img v-if="activity.statusIcon" :src="activity.statusIcon" alt="" class="status-icon" />
        </div>
      </div>
    </div>
    
    <!-- 签到反馈 -->
    <div class="feedback-section">
      <div class="feedback-title">签到反馈</div>
      <div class="feedback-data">
        <div 
          class="feedback-item" 
          v-for="(item, index) in feedbackData" 
          :key="index"
        >
          <span class="feedback-label">{{ item.label }}</span>
          <span class="feedback-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="card-actions">
      <button class="detail-btn" @click="handleDetail">
        详情
      </button>
      <button class="qr-btn checkin-qr-btn" @click="handleCheckinQR">
        签到二维码
      </button>
      <button class="qr-btn feedback-qr-btn" @click="handleFeedbackQR">
        反馈二维码
      </button>
    </div>
  </div>
</template>

<script>
const tagHash = {
    '高客战略': 'tag-highend',
    '个险': 'tag-insurance',
    '超体场景': 'tag-experience',
    '理赔发布会': 'tag-claim'
}
export default {
  name: 'ActivityCard',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      tagHash
    }
  },
  computed: {
    feedbackData() {
      return [
        { label: '签到人数', value: this.activity.checkinCount || '0' },
        { label: '反馈人数', value: this.activity.feedbackCount || '0' },
        { label: '评价人数', value: this.activity.ratingCount || '0' }
      ];
    }
  },
  methods: {
    formatTime(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toTimeString().slice(0, 5);
    },
    formatDate(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toLocaleDateString('zh-CN').replace(/\//g, '/');
    },
    handleDetail() {
      this.$emit('detail', this.activity);
    },
    handleCheckinQR() {
      this.$emit('checkin-qr', this.activity);
    },
    handleFeedbackQR() {
      this.$emit('feedback-qr', this.activity);
    },
    handleEdit() {
      this.$emit('edit', this.activity);
    }
  }
}
</script>

<style scoped>
.activity-card {
  background-color: #ffffff;
  border-radius: 8px;
  width: 355px;
  margin: 12px auto;
  padding: 10px 0 16px 0;
  position: relative;
  overflow: hidden;
}

.gradient-bar {
  position: absolute;
  left: 0;
  top: 24px;
  width: 4px;
  height: 18px;
  background-color: #ff811a;
  border-radius: 0 28px 28px 0;
}

.card-header {
  padding: 0 20px 10px 18px;
}

.activity-title {
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  font-family: 'PingFang SC', sans-serif;
  line-height: 30px;
}

.activity-tags {
  display: flex;
  gap: 8px;
  padding: 0 20px 12px 18px;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 17px;
}

.tag-highend {
  background-color: #fff2e8;
  color: #ff811a;
}

.tag-insurance {
  background-color: #E7F5F4;
  color: #159D93;
}

.tag-experience {
  background-color: #EBF0FD;
  color: #3C6EEE;
}

.tag-claim {
  background-color: #efebfd;
  color: #5e3def;
}

.activity-time {
  background-color: #fafafa;
  border-radius: 8px;
  margin: 1px 20px 9px 20px;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-value {
  font-size: 33px;
  font-weight: 700;
  color: #333333;
  font-family: 'DIN Alternate', sans-serif;
  line-height: 38px;
}

.time-date {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
  margin-top: 4px;
}

.time-connector {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 20px;
}

.connector-dot {
  width: 4px;
  height: 4px;
  background-color: rgba(216, 216, 216, 0.5);
  border-radius: 50%;
}

.activity-details {
  display: flex;
  padding: 0 20px;
}

.detail-labels,
.detail-values {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-labels {
  width: 56px;
}

.detail-values {
  flex: 1;
  margin-left: 20px;
}

.detail-item {
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 30px;
}

.detail-labels .detail-item {
  color: #666666;
}

.detail-values .detail-item {
  color: #333333;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  width: 11px;
  height: 12px;
}

.divider {
  background-color: #f2f2f2;
  height: 1px;
  margin: 9px 20px 16px 20px;
}

.card-actions {
  padding: 0 20px 18px 20px;
}

.edit-btn {
  border: 1px solid #ff811a;
  border-radius: 33px;
  background-color: transparent;
  color: #ff811a;
  font-size: 13px;
  line-height: 18px;
  padding: 4px 11px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: rgba(255, 129, 26, 0.1);
}

/* 签到反馈样式 */
.feedback-section {
  margin: 16px 20px 0 20px;
}

.feedback-title {
  color: #666666;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 12px;
}

.feedback-data {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.feedback-item {
  background-color: #fafafa;
  border-radius: 4px;
  padding: 8px 12px 7px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 65px;
  box-sizing: border-box;
  width: 100%;
}

.feedback-label {
  color: #666666;
  font-size: 13px;
  font-family: 'PingFang SC', sans-serif;
  line-height: 18px;
  white-space: nowrap;
}

.feedback-value {
  color: #333333;
  font-size: 24px;
  font-family: 'DIN Alternate', sans-serif;
  font-weight: 700;
  line-height: 28px;
  margin-top: 5px;
}

/* 更新操作按钮样式 */
.card-actions {
  padding: 1px 20px 0 20px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.detail-btn {
  border: 1px solid #ff811a;
  border-radius: 33px;
  background-color: transparent;
  color: #ff811a;
  font-size: 13px;
  line-height: 18px;
  padding: 4px 11px;
  cursor: pointer;
}

.detail-btn:hover {
  background-color: rgba(255, 129, 26, 0.1);
}

.qr-btn {
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 13px;
  line-height: 18px;
  padding: 5px 12px;
  cursor: pointer;
  border-radius: 20px;
  background: linear-gradient(135deg, #ff9a4d 0%, #ff811a 100%);
}

.qr-btn:hover {
  opacity: 0.9;
}

.checkin-qr-btn,
.feedback-qr-btn {
  white-space: nowrap;
}
</style>
