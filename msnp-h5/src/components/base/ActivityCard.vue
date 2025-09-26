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
    
    <!-- 活动详情信息（逐行渲染，防止长文本导致不对齐） -->
    <div class="activity-details">
      <div
        class="detail-row"
        v-for="item in detailList"
        :key="item.label"
      >
        <div class="detail-label">{{ item.label }}</div>
        <div class="detail-value">
          <!-- 活动编号，增加复制功能 -->
          <template v-if="item.isCode">
            <span class="activity-code-text">{{ item.value }}</span>
            <svg 
              class="copy-icon"
              @click.stop="handleCopyCode(item.value)"
              viewBox="0 0 1024 1024" 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16"
            >
              <path d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z" fill="#666"></path>
              <path d="M832 64H384a128 128 0 0 0-128 128v448a128 128 0 0 0 128 128h448a128 128 0 0 0 128-128V192A128 128 0 0 0 832 64zm64 576a64 64 0 0 1-64 64H384a64 64 0 0 1-64-64V192a64 64 0 0 1 64-64h448a64 64 0 0 1 64 64v448z" fill="#666"></path>
            </svg>
          </template>
          <!-- 活动状态 -->
          <template v-else-if="item.isStatus">
            <span class="status-text">{{ item.value }}</span>
            <img v-if="activity.statusIcon" :src="activity.statusIcon" alt="" class="status-icon" />
          </template>
          <!-- 其他普通文本 -->
          <template v-else>
            <span class="detail-value-text" :class="{ truncate: item.truncate }" :title="item.truncate ? item.value : null">{{ item.value }}</span>
          </template>
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
import { showToast } from 'vant'

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
    },
    // 将详情行转为一行一组，避免左右两列在长文本换行时错位
    detailList() {
      return [
        { label: '活动编号', value: this.activity.code || '-', isCode: true },
        { label: '分公司', value: this.activity.branch || '-', truncate: true },
        { label: '中支', value: this.activity.department || '-' },
        { label: '医院名称', value: this.activity.hospital || '-', truncate: true },
        { label: '活动状态', value: this.activity.status || '-', isStatus: true }
      ];
    }
  },
  methods: {
    // 兼容 iOS 15 对 "YYYY-MM-DD HH:mm:ss" 等格式解析不一致的问题
    // 使用手动解析 + 本地时间构造，避免时区与 NaN 情况
    parseLocalDate(datetime) {
      if (datetime == null || datetime === '') return null
      // 数字或数字字符串（时间戳）
      if (typeof datetime === 'number' || /^\d+$/.test(String(datetime))) {
        const ts = Number(datetime)
        // 10 位视为秒，其他视为毫秒
        return new Date(ts < 1e12 ? ts * 1000 : ts)
      }
      const s = String(datetime).trim()
      // ISO 字符串（含 T）直接交给原生，兼容性较好
      if (s.includes('T')) {
        const d = new Date(s)
        if (!isNaN(d.getTime())) return d
      }
      // 手动解析：YYYY-MM-DD[ HH:mm[:ss]] 或 YYYY/MM/DD ...
      const [datePartRaw, timePartRaw] = s.split(/[ T]/)
      const datePart = (datePartRaw || '').replace(/\./g, '-').replace(/\//g, '-')
      const [y, m, d] = datePart.split('-').map(n => parseInt(n, 10))
      if (!y || !m || !d) {
        const d2 = new Date(s)
        return isNaN(d2.getTime()) ? null : d2
      }
      let hh = 0, mm = 0, ss = 0
      if (timePartRaw) {
        const [h1, m1, s1] = timePartRaw.split(':').map(n => parseInt(n, 10))
        if (!isNaN(h1)) hh = h1
        if (!isNaN(m1)) mm = m1
        if (!isNaN(s1)) ss = s1
      }
      return new Date(y, m - 1, d, hh, mm, ss, 0)
    },
    pad2(n) { return String(n).padStart(2, '0') },
    formatTime(datetime) {
      const date = this.parseLocalDate(datetime)
      if (!date) return ''
      return `${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}`
    },
    formatDate(datetime) {
      const date = this.parseLocalDate(datetime)
      if (!date) return ''
      return `${date.getFullYear()}-${this.pad2(date.getMonth() + 1)}-${this.pad2(date.getDate())}`
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
    },
    // 复制活动编号
    async handleCopyCode(code) {
      if (!code || code === '-') {
        showToast('无活动编号可复制');
        return;
      }
      try {
        await navigator.clipboard.writeText(code);
        showToast('复制成功');
      } catch (err) {
        console.error('Failed to copy: ', err);
        showToast('复制失败，请稍后重试');
      }
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

/* 详情：改为一行一个 label + value，避免换行错位 */
.activity-details {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.detail-row {
  display: grid;
  grid-template-columns: 56px 1fr; /* 与原先 label 宽度保持一致 */
  column-gap: 20px;
}

.detail-label,
.detail-value {
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
  color: #333333;
  line-height: 22px;
  padding: 4px 0; /* 提升可读性并让行高自适应 */
  display: flex; /* 用于对齐复制图标 */
  align-items: center; /* 垂直居中对齐 */
}

.detail-label {
  color: #666666;
}

.detail-value {
  /* 允许中文与长单词换行，避免溢出并保持与 label 对齐 */
  white-space: pre-wrap;
  word-break: break-word; /* 对中文更友好 */
  overflow-wrap: anywhere;
  /* 为了让子元素在网格/弹性容器中可收缩，避免溢出 */
  min-width: 0;
}

/* 普通值文本容器，支持在需要时省略号显示 */
.detail-value-text {
  flex: 1;
  min-width: 0; /* 关键：允许在 flex 下收缩以触发省略号 */
}
.detail-value-text.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.activity-code-text {
  flex-grow: 1; /* 文本占据剩余空间 */
}

.copy-icon {
  cursor: pointer;
  margin-left: 8px;
  flex-shrink: 0; /* 防止图标被压缩 */
}

.status-text { /* 状态文本仍为普通内联元素，可换行 */ }

.status-icon {
  width: 11px;
  height: 12px;
  margin-left: 8px;
  vertical-align: text-bottom;
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
