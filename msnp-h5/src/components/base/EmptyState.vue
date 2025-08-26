<template>
  <div class="empty-state">
    <img :src="imageUrl" alt="暂无内容" class="empty-image" />
    <span class="empty-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    text: {
      type: String,
      default: '暂无内容'
    },
    imageUrl: {
      type: String,
      default: require('@/assets/img/empty-state.png')
    }
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
  line-height: 20px;
}
</style>
