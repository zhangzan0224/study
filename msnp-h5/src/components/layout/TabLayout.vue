<template>
  <div class="tab-layout">
    <div class="tab-header">
      <div class="tab-items">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="handleTabClick(tab.key)"
        >
          <span class="tab-text">{{ tab.label }}</span>
          <div v-if="activeTab === tab.key" class="tab-indicator"></div>
        </div>
      </div>
    </div>
    
    <div class="tab-content">
      <slot :activeTab="activeTab"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabLayout',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  computed: {
    activeTab: {
      get() {
        return this.modelValue || (this.tabs.length > 0 ? this.tabs[0].key : '');
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    handleTabClick(tabKey) {
      this.activeTab = tabKey;
      this.$emit('tab-change', tabKey);
    }
  }
}
</script>

<style scoped>
.tab-layout {
  background-color: #ffffff;
}

.tab-header {
  background-color: #ffffff;
}

.tab-items {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 8px 0;
  cursor: pointer;
  position: relative;
}

.tab-text {
  font-size: 16px;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
  line-height: 22px;
  transition: color 0.3s;
}

.tab-item.active .tab-text {
  color: #333333;
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background-color: #ff811a;
  border-radius: 2px;
}

.tab-content {
  background-color: #f1f3f6;
  min-height: calc(100vh - 140px);
}
</style>
