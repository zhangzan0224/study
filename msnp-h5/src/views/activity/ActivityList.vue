<template>
  <div class="activity-list-page">
    <!-- 导航栏 -->
    <NavigationBar 
      title="活动管理" 
      :show-back="false"
      right-text="新建活动"
      :right-icon="addIcon"
      @right-click="handleNewActivity"
    />
    
    <!-- 搜索和筛选 -->
    <FilterSection 
      search-placeholder="活动"
      :filters="filters"
      @search="handleSearch"
      @advanced-filter="handleAdvancedFilter"
      @filter-tag-click="handleFilterTagClick"
    />
    
    <!-- 状态标签 -->
    <TabsBar 
      :items="statusItems"
      :active-status="activeStatus"
      @status-change="handleStatusChange"
    />
    
    <!-- 活动列表 -->
    <div class="activity-content">
      <template v-if="activities.length > 0">
        <ActivityCard 
          v-for="activity in activities" 
          :key="activity.id"
          :activity="activity"
          @detail="handleDetailActivity"
          @edit="handleEditActivity"
        />
      </template>
      <EmptyState v-else text="暂无内容" />
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/base/NavigationBar.vue'
import FilterSection from '@/components/base/FilterSection.vue'
import TabsBar from '@/components/base/TabsBar.vue'
import ActivityCard from '@/components/base/ActivityCard.vue'
import EmptyState from '@/components/base/EmptyState.vue'

export default {
  name: 'ActivityList',
  components: {
    NavigationBar,
    FilterSection,
    TabsBar,
    ActivityCard,
    EmptyState
  },
  data() {
    return {
      addIcon: require('@/assets/img/add-icon.png'),
      activeStatus: 'all',
      searchKeyword: '',
      filters: [
        { key: 'branch', label: '分公司', value: null },
        { key: 'department', label: '中支', value: null },
        { key: 'startTime', label: '活动开始时间', value: null },
        { key: 'endTime', label: '活动结束时间', value: null }
      ],
      statusItems: [
        { key: 'all', label: '全部', count: 15 },
        { key: 'pending', label: '待审核', count: 7 },
        { key: 'feedback', label: '待反馈', count: 7 },
        { key: 'update', label: '待更新', count: 0 },
        { key: 'draft', label: '草稿箱', count: 20 }
      ],
      activities: [
        {
          id: 1,
          name: '活动名称活动名称活动名称',
          strategy: '高客战略',
          category: '理赔发布会',
          startTime: '2025-01-02 08:00:00',
          endTime: '2025-01-02 12:00:00',
          code: '8-20250701-0006',
          branch: '北京分公司',
          department: '北京本部',
          tags: ['高客战略', '个险', '超体场景', '理赔发布会'],
          hospital: '-',
          status: '发布待审核'
        }
      ]
    }
  },
  methods: {
    handleNewActivity() {
      this.$router.push('/activity/new');
    },
    handleSearch(keyword) {
      this.searchKeyword = keyword;
      this.loadActivities();
    },
    handleAdvancedFilter() {
      this.$router.push('/activity/filter');
    },
    handleFilterTagClick(filter) {
      // 处理筛选标签点击
      console.log('Filter tag clicked:', filter);
    },
    handleStatusChange(status) {
      this.activeStatus = status;
      if (status === 'draft') {
        this.$router.push('/activity/draft');
      } else {
        this.loadActivities();
      }
    },
    handleDetailActivity(activity) {
      this.$router.push(`/activity/detail/${activity.id}`);
    },
    handleEditActivity(activity) {
      this.$router.push(`/activity/detail/${activity.id}`);
    },
    loadActivities() {
      // 根据筛选条件加载活动列表
      // 这里应该调用API获取数据
    }
  },
  mounted() {
    this.loadActivities();
  }
}
</script>

<style scoped>
.activity-list-page {
  background-color: #f1f3f6;
  min-height: 100vh;
}

.activity-content {
  padding-bottom: 20px;
}
</style>
