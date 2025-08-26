<template>
  <div class="navigation-bar">
    <div class="nav-left" @click="handleBack" v-if="showBack">
      <img src="@/assets/img/arrow-left.png" alt="返回" class="back-icon" />
    </div>
    <div class="nav-center">
      <span class="nav-title">{{ title }}</span>
    </div>
    <div class="nav-right">
      <slot name="right">
        <div class="nav-action" v-if="rightText" @click="handleRightClick">
          <img v-if="rightIcon" :src="rightIcon" alt="" class="action-icon" />
          <span class="action-text">{{ rightText }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    },
    rightText: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleBack() {
      this.$emit('back');
      // 默认行为：返回上一页
      if (this.$router) {
        this.$router.back();
      }
    },
    handleRightClick() {
      this.$emit('right-click');
    }
  }
}
</script>

<style scoped>
.navigation-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 12px 16px;
  min-height: 44px;
}

.nav-left {
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  font-family: 'PingFang SC', sans-serif;
}

.nav-right {
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav-action {
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}

.action-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}

.action-text {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}
</style>
