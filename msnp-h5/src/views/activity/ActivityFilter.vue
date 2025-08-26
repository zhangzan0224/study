<template>
  <div class="activity-filter-page">
    <!-- 导航栏 -->
    <NavigationBar title="活动搜索" @back="handleBack" />
    
    <!-- 筛选表单 -->
    <div class="filter-form">
      <!-- 活动编码 -->
      <FormField
        label="活动编码"
        type="input"
        v-model="filterData.code"
        placeholder="请输入"
        label-width="80px"
      />
      
      <!-- 分公司 -->
      <FormField
        label="分公司"
        type="select"
        v-model="filterData.branch"
        placeholder="请选择"
        label-width="80px"
        :options="branchOptions"
        @select-click="showBranchPicker"
      />
      
      <!-- 中支 -->
      <FormField
        label="中支"
        type="select"
        v-model="filterData.department"
        placeholder="请选择"
        label-width="80px"
        :options="departmentOptions"
        @select-click="showDepartmentPicker"
      />
      
      <!-- 战略划分 -->
      <FormField
        label="战略划分"
        type="select"
        v-model="filterData.strategy"
        placeholder="请选择"
        label-width="80px"
        :options="strategyOptions"
        @select-click="showStrategyPicker"
      />
      
      <!-- 更多字段省略号 -->
      <FormField
        label="……"
        type="text"
        model-value=""
        placeholder="请输入"
        label-width="80px"
      />
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="btn btn-reset" @click="handleReset">
        重置
      </button>
      <button class="btn btn-search" @click="handleSearch">
        查询
      </button>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/base/NavigationBar.vue'
import FormField from '@/components/base/FormField.vue'

export default {
  name: 'ActivityFilter',
  components: {
    NavigationBar,
    FormField
  },
  data() {
    return {
      filterData: {
        code: '',
        branch: '',
        department: '',
        strategy: ''
      },
      branchOptions: [
        { label: '上海分公司', value: 'shanghai' },
        { label: '北京分公司', value: 'beijing' },
        { label: '广东分公司', value: 'guangdong' }
      ],
      departmentOptions: [
        { label: '徐汇中支', value: 'xuhui' },
        { label: '浦东中支', value: 'pudong' },
        { label: '静安中支', value: 'jingan' }
      ],
      strategyOptions: [
        { label: '重点客户', value: 'vip' },
        { label: '普通客户', value: 'normal' },
        { label: '潜在客户', value: 'potential' }
      ]
    }
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    showBranchPicker() {
      // 显示分公司选择器
      console.log('Show branch picker');
    },
    showDepartmentPicker() {
      // 显示中支选择器
      console.log('Show department picker');
    },
    showStrategyPicker() {
      // 显示战略划分选择器
      console.log('Show strategy picker');
    },
    handleReset() {
      this.filterData = {
        code: '',
        branch: '',
        department: '',
        strategy: ''
      };
    },
    handleSearch() {
      // 返回筛选结果
      this.$router.back();
      // 在实际应用中，这里应该将筛选条件传递给活动列表页面
    }
  }
}
</script>

<style scoped>
.activity-filter-page {
  background-color: #ffffff;
  min-height: 100vh;
}

.filter-form {
  padding: 0 20px;
  padding-top: 10px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  padding: 20px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-family: 'PingFang SC', sans-serif;
  border: none;
  cursor: pointer;
}

.btn-reset {
  background-color: #f5f5f5;
  color: #666666;
}

.btn-search {
  background-color: #ff811a;
  color: #ffffff;
}

.btn:active {
  opacity: 0.8;
}
</style>
