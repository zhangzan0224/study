<template>
  <div class="status-tabs">
    <div class="status-items">
      <div 
        v-for="(item, index) in statusItems" 
        :key="index"
        class="status-item"
        :class="{ active: activeStatus === item.key }"
        @click="handleStatusClick(item.key)"
      >
        <span class="status-text">{{ item.label }}{{ item.count }}</span>
        <div class="status-indicator" v-if="activeStatus === item.key"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabsBar',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    activeStatus: {
      type: String,
      default: 'all'
    }
  },
  computed: {
    statusItems() {
      return this.items;
    }
  },
  methods: {
    handleStatusClick(statusKey) {
      this.$emit('status-change', statusKey);
    }
  }
}
</script>

<style scoped>
.status-tabs {
  display: flex;
  width: 100%;
}

.status-items {
  display: flex;
  flex: 1;
}

.status-item {
  flex: 1;
  background-color: #ffffff;
  padding-top: 12px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status-text {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
  text-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.5);
}

.status-item.active .status-text {
  color: #333333;
}

.status-indicator {
  background-color: #ff811a;
  border-radius: 2px;
  width: 37px;
  height: 4px;
  margin-top: 8px;
}

</style>
