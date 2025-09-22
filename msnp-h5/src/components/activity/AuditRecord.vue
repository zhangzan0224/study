<template>
  <div class="audit-record-page">
    <!-- 内容区域 -->
    <div class="content">

      <!-- 审核记录列表 -->
      <div class="audit-records">
        <div v-for="(record, index) in auditRecords" :key="index" class="audit-record-item">
          <!-- 时间线 -->
          <div class="timeline">
            <div class="timeline-line" v-if="index < auditRecords.length - 1"></div>
            <div class="timeline-dot" :class="record.status"></div>
          </div>

          <!-- 记录内容 -->
          <div class="record-content">
            <div class="record-time">审核时间：{{ formatTime(record.time) }}</div>

            <div class="record-card">
              <div class="record-info">
                <div class="info-row">
                  <span class="label">审核结论</span>
                  <span class="value">{{ record.conclusion }}</span>
                </div>
                <div class="info-row info-row--comment">
                  <span class="label">审核意见</span>
                  <span class="value">
                    <span class="status-badge" :class="record.status">
                      <span>{{ record.statusText }}</span>
                    </span>
                    {{ record.comment || '无' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <EmptyState v-if="auditRecords.length === 0" text="暂无审核记录" />
    </div>
  </div>
</template>

<script>
import EmptyState from '@/components/base/EmptyState.vue'

export default {
  name: 'AuditRecord',
  components: {
    EmptyState
  },
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      auditRecords: [
        {
          round: 1,
          status: 'approved',
          statusText: '审核通过',
          time: '2025-01-01 14:00:00',
          auditor: '张三',
          conclusion: '审核通过',
          comment: '请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整请重新调整'
        },
        {
          round: 2,
          status: 'rejected',
          statusText: '审核不通过',
          time: '2025-01-01 14:00:00',
          auditor: '李四',
          conclusion: '审核不通过',
          comment: '请重新调整'
        }
      ]
    }
  },
  mounted() {
    this.loadAuditRecords();
  },
  methods: {
    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    },
    loadAuditRecords() {
      console.log('Loading audit records for activity:', this.activity.id);
    }
  }
}
</script>

<style scoped>
.audit-record-page {
  background-color: #f1f3f6;
}

/* 内容区域 */
.content {
}

/* 审核记录列表 */
.audit-records {
  padding-right: 10px;
}

.audit-record-item {
  display: flex;
  margin-bottom: 10px;
  position: relative; /* 新增 */
}

/* 时间线 */
.timeline {
  position: relative;
  width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-line {
  width: 1px;
  background: none;
  border-left: #cdcdcd dashed 1px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: calc(100% - 12px); /* 让线高度自适应内容 */
  z-index: 0;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
  border: 3px solid #cdcdcd;
  z-index: 1;
}
/* 
.timeline-dot.approved {
  background-color: #52c41a;
}

.timeline-dot.rejected {
  background-color: #ff4d4f;
} */

/* 记录内容 */
.record-content {
  flex: 1;
  margin-left: 15px;
}

.record-time {
  color: #666666;
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  margin-bottom: 10px;
}

.record-card {
  background-color: #ffffff;
  border-radius: 8px;
  /* 绝对定位徽章 + 仅让“审核意见”一行绕排徽章 */
  padding: 12px 12px 12px 20px;
  position: relative;
  display: block;
}

.record-info {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

/* 审核意见一行的布局：左侧固定标签，右侧文本包裹徽章，文字绕排且在徽章下方占满整行 */
.info-row--comment {
  display: flex;
  align-items: flex-start;
}
.info-row--comment .label {
  width: 60px;
  line-height: 30px;
}
.info-row--comment .value-wrap {
  flex: 1;
  min-width: 0;
}
.info-row--comment .status-badge {
  float: right;
  margin-left: 12px;
}
.info-row--comment .value {
  display: block;
  line-height: 30px;
  word-break: break-word;
}
.info-row--comment .value-wrap::after {
  content: "";
  display: block;
  clear: both;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  width: 60px;
  color: #666666;
  font-size: 15px;
  font-weight: normal;
  line-height: 30px;
}

.value {
  color: #333333;
  font-size: 15px;
  font-weight: normal;
  line-height: 30px;
  margin-left: 15px;
  flex: 1;
}

/* 状态标签 */
.status-badge {
  float: right;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: normal;
  margin-left: 12px;
  white-space: nowrap;
}

.status-badge.approved {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.rejected {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.status-badge.pending {
  background-color: #fffbe6;
  color: #faad14;
}
</style>
