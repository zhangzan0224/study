<template>
  <div class="activity-detail-page">
    <!-- 导航栏 -->
    <NavigationBar title="活动详情" @back="handleBack" :right-text="showSubmitRight ? '提交' : ''" @right-click="handleNavSubmitClick" />
    
    <!-- 标签页 -->
    <TabsBar 
      :items="tabItems"
      :active-status="activeTab"
      @status-change="handleTabChange"
    />
    
    <!-- 标签页内容 -->
    <div class="tab-content-container">
      <!-- 活动信息：改为复用 NewActivity 组件进行渲染（隐藏其内部导航） -->
      <div v-show="activeTab === 'info'" class="tab-content">
        <NewActivity ref="newActiveRef" :hideNav="true" entryMode="detail" @loaded="onActivityLoaded" />
      </div>
      
      <!-- 评价反馈 -->
      <div v-show="activeTab === 'feedback'" class="tab-content">
        <FeedbackForm ref="feedbackRef" :activity="activity" entryMode="detail" :hideActions="true" @submit="handleFeedbackSubmit" />
      </div>
      
      <!-- 审核记录 -->
      <div v-show="activeTab === 'audit'" class="tab-content">
        <AuditRecord :activity="activity" />
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/base/NavigationBar.vue'
import TabsBar from '@/components/base/TabsBar.vue'
import NewActivity from '@/views/activity/NewActivity.vue'
import FeedbackForm from '@/components/activity/FeedbackForm.vue'
import AuditRecord from '@/components/activity/AuditRecord.vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'

export default {
  name: 'ActivityDetail',
  components: {
    NavigationBar,
    TabsBar,
    NewActivity,
    FeedbackForm,
    AuditRecord
  },
  data() {
    return {
      activeTab: 'info',
      tabItems: [
        { key: 'info', label: '活动信息', count: '' },
        { key: 'feedback', label: '评价反馈', count: '' },
        { key: 'audit', label: '审核记录', count: '' }
      ],
      activity: null,
      showSubmitRight: false
    }
  },


  methods: {
    handleBack() {
      this.$router.back();
    },
    handleTabChange(tabKey) {
      this.activeTab = tabKey;
    },
    handleFeedbackSubmit(feedbackData) {
      // 提交评价反馈
      console.log('Feedback submitted:', feedbackData);
    },
    // 子组件加载完成回调：依据后端返回的审核/评价状态决定是否展示右侧“提交”按钮
    onActivityLoaded(raw) {
      this.activity = raw
      this.showSubmitRight = this.computeShowSubmitRight(raw)
    },
    computeShowSubmitRight(raw) {
      if (!raw) return false
      // 兼容后端返回结构：优先从 activeBaseDetail 中读取活动基础状态
      const base = raw.activeBaseDetail || raw.base || raw

      // 评价/反馈相关状态（如果有的话）
      const flags = [
        raw.evaluationAuditStatus, raw.evaluateStatus,
        raw.feedbackAuditStatus, raw.feedbackStatus
      ].map(v => (v || '').toString().toUpperCase())
      const names = [
        raw.evaluationAuditStatusName, raw.evaluateStatusName,
        raw.feedbackAuditStatusName, raw.feedbackStatusName
      ]

      // 活动整体状态（如 activeState/activeStateDesc 存在“评价审核不通过”）
      const activeStateCode = (base.activeState || '').toString().toUpperCase()
      const activeStateName = base.activeStateDesc || base.activeStateName || ''

      const codeRejected = flags.some(v => [
        'REJECT', 'REJECTED', 'NOT_PASS', 'NOTPASSED', 'FAIL', 'FAILED', 'REFUSE', 'REFUSED'
      ].includes(v))
      const textRejected = names.some(n => typeof n === 'string' && /不通过|拒绝|失败/.test(n))
      // 对 activeStateDesc 的中文判定：包含“不通过/拒绝/失败”则视为需展示提交
      const activeStateRejected = typeof activeStateName === 'string' && /不通过|拒绝|失败/.test(activeStateName)

      return !!(codeRejected || textRejected || activeStateRejected)
    },
    async handleNavSubmitClick() {
      // 先检查是否存在编辑态
      const infoComp = this.$refs.newActiveRef
      const feedbackComp = this.$refs.feedbackRef
      const infoEditing = !!(infoComp && infoComp.isEditing)
      const feedbackEditing = !!(feedbackComp && typeof feedbackComp.isEditing === 'function' ? feedbackComp.isEditing() : false)

      if (infoEditing && feedbackEditing) {
        showFailToast('活动信息与评价反馈页面正在编辑中，无法提交')
        return
      } else if (infoEditing) {
        showFailToast('活动信息页面正在编辑中，无法提交')
        return
      } else if (feedbackEditing) {
        showFailToast('评价反馈页面正在编辑中，无法提交')
        return
      }

      try {
        await showConfirmDialog({
          title: '请确认',
          message: '请确认活动信息与评价反馈信息均编辑完成再提交',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      } catch (e) {
        // 取消
        return
      }

      // 并行校验并提交两个页签
      const tasks = []
      if (infoComp && typeof infoComp.submit === 'function') tasks.push(infoComp.submit(true))
      if (feedbackComp && typeof feedbackComp.submit === 'function') tasks.push(feedbackComp.submit(true))

      const results = await Promise.all(tasks.map(p => Promise.resolve(p)))
      const allOk = results.every(r => r === true)
      if (!allOk) return

      showSuccessToast('提交成功')
      // 关闭当前页面，待办任务消失由后端状态更新后列表刷新实现
      this.$router.back()
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
