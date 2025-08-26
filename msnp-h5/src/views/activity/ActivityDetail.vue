<template>
  <div class="activity-detail-page">
    <!-- 导航栏 -->
    <NavigationBar title="活动详情" @back="handleBack" />
    
    <!-- 标签页 -->
    <TabsBar 
      :items="tabItems"
      :active-status="activeTab"
      @status-change="handleTabChange"
    />
    
    <!-- 标签页内容 -->
    <div class="tab-content-container">
      <!-- 活动信息 -->
      <div v-if="activeTab === 'info'" class="tab-content">
        <ActivityInfo :activity="activity" :editable="infoEditable" @edit="handleEditInfo" @save="handleSaveInfo" />
      </div>
      
      <!-- 评价反馈 -->
      <div v-else-if="activeTab === 'feedback'" class="tab-content">
        <FeedbackForm :activity="activity" @submit="handleFeedbackSubmit" />
      </div>
      
      <!-- 审核记录 -->
      <div v-else-if="activeTab === 'audit'" class="tab-content">
        <AuditRecord :activity="activity" />
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/base/NavigationBar.vue'
import TabsBar from '@/components/base/TabsBar.vue'
import ActivityInfo from '@/components/activity/ActivityInfo.vue'
import FeedbackForm from '@/components/activity/FeedbackForm.vue'
import AuditRecord from '@/components/activity/AuditRecord.vue'

export default {
  name: 'ActivityDetail',
  components: {
    NavigationBar,
    TabsBar,
    ActivityInfo,
    FeedbackForm,
    AuditRecord
  },
  data() {
    return {
      activeTab: 'info',
      infoEditable: false,
      tabItems: [
        { key: 'info', label: '活动信息', count: '' },
        { key: 'feedback', label: '评价反馈', count: '' },
        { key: 'audit', label: '审核记录', count: '' }
      ],
      activity: {
        id: 1,
        name: '活动名称活动名称活动名称',
        branch: '北京分公司',
        department: '北京本部',
        strategy: '高客战略',
        channel: '线上',
        startTime: '2025-01-02 08:00:00',
        endTime: '2025-01-02 12:00:00',
        category: '服务行销',
        healthInsurance: '否',
        venue: '职场',
        location: '北京市/北京市',
        status: '发布待审核'
      }
    }
  },

  mounted() {
    // 根据路由参数加载活动详情
    const activityId = this.$route.params.id;
    if (activityId) {
      this.loadActivityDetail(activityId);
    }
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    handleTabChange(tabKey) {
      this.activeTab = tabKey;
    },
    handleEditInfo() {
      this.infoEditable = true;
    },
    handleSaveInfo(activityData) {
      // 保存活动信息
      this.activity = { ...this.activity, ...activityData };
      this.infoEditable = false;
    },
    handleFeedbackSubmit(feedbackData) {
      // 提交评价反馈
      console.log('Feedback submitted:', feedbackData);
    },
    loadActivityDetail(id) {
      // 调用API加载活动详情
      console.log('Loading activity detail for id:', id);
    }
  }
}
</script>

<style scoped>
.activity-detail-page {
  background-color: #f1f3f6;
  min-height: 100vh;
}

.tab-content-container {
  background-color: #f1f3f6;
}

.tab-content {
  padding: 10px;
}
</style>
