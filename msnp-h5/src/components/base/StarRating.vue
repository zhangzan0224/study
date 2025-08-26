<!-- 评分组件 使用 <van-rate v-model="value" /> 实现 -->
<template>
  <div class="star-rating">
    <van-rate
      color="#ffd21e"
      :model-value="modelValue"
      @update:model-value="handleRateChange"
      :count="maxStars"
      :disabled="disabled"
      :size="25"
      :gutter="4"
    />
    <span v-if="showScore && modelValue > 0" class="score-text">{{ modelValue }}分</span>
  </div>
</template>

<script>
import { Rate } from 'vant';

export default {
  name: 'StarRating',
  components: {
    'van-rate': Rate
  },
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    maxStars: {
      type: Number,
      default: 5
    },
    showScore: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleRateChange(value) {
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    }
  }
}
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-text {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  margin-left: 4px;
}
</style>
