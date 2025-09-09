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
      // Mock 数据：覆盖不同长度与场景，便于查看列表与对齐效果
      activities: [
        {
          id: 1,
          name: '北京健康讲座（线下）',
          strategy: '高客战略',
          category: '理赔发布会',
          startTime: '2025-09-10T08:00:00',
          endTime: '2025-09-10T11:30:00',
          code: '8-20250910-0001',
          branch: '北京分公司',
          department: '北京本部',
          tags: ['高客战略', '个险'],
          hospital: '北京协和医院',
          status: '发布待审核',
          checkinCount: 36,
          feedbackCount: 22,
          ratingCount: 18
        },
        {
          id: 2,
          name: '长文本测试-分公司名称很长导致自动换行是否对齐',
          strategy: '个险',
          category: '理赔发布会',
          startTime: '2025-09-12T09:00:00',
          endTime: '2025-09-12T17:00:00',
          code: '8-20250912-0002',
          branch: '中国平安人寿保险股份有限公司北京分公司海淀运营服务中心（用于测试极长分公司名称换行效果）',
          department: '北京市海淀区中关村中支',
          tags: ['个险', '超体场景'],
          hospital: '首都医科大学附属北京天坛医院',
          status: '待反馈',
          checkinCount: 120,
          feedbackCount: 64,
          ratingCount: 51
        },
        {
          id: 3,
          name: '中支名称超长测试',
          strategy: '超体场景',
          category: '理赔发布会',
          startTime: '2025-09-15T13:30:00',
          endTime: '2025-09-15T16:30:00',
          code: '8-20250915-0003',
          branch: '上海分公司',
          department: '上海市浦东新区世纪大道金融城第一营业区浦东新区超级无敌长中支名称测试专用',
          tags: ['超体场景'],
          hospital: '上海交通大学医学院附属瑞金医院',
          status: '进行中',
          checkinCount: 45,
          feedbackCount: 20,
          ratingCount: 10
        },
        {
          id: 4,
          name: '医院名称超长测试',
          strategy: '高客战略',
          category: '理赔发布会',
          startTime: '2025-09-18T09:00:00',
          endTime: '2025-09-18T11:00:00',
          code: '8-20250918-0004',
          branch: '广东分公司',
          department: '广州天河中支',
          tags: ['高客战略', '理赔发布会'],
          hospital: '广东省人民医院心血管研究所心内科老年科远程医疗联合中心（用于测试超长医院名称自动换行与对齐）',
          status: '已完成',
          checkinCount: 230,
          feedbackCount: 198,
          ratingCount: 176
        },
        {
          id: 5,
          name: '普通体检宣讲会',
          strategy: '个险',
          category: '理赔发布会',
          startTime: '2025-10-08T10:00:00',
          endTime: '2025-10-08T12:00:00',
          code: '8-20251008-0005',
          branch: '浙江分公司',
          department: '杭州上城中支',
          tags: ['个险'],
          hospital: '-',
          status: '发布待审核',
          checkinCount: 8,
          feedbackCount: 3,
          ratingCount: 1
        },
        {
          id: 6,
          name: '多标签展示与时间跨度',
          strategy: '高客战略',
          category: '理赔发布会',
          startTime: '2025-11-01T09:00:00',
          endTime: '2025-11-03T17:30:00',
          code: '8-20251101-0006',
          branch: '四川分公司',
          department: '成都高新中支',
          tags: ['高客战略', '个险', '超体场景', '理赔发布会'],
          hospital: '四川大学华西医院',
          status: '待反馈',
          checkinCount: 76,
          feedbackCount: 54,
          ratingCount: 40
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
