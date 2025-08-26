<template>
  <div class="filter-section">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-input">
        <img src="@/assets/img/search.png" alt="搜索" class="search-icon" />
        <input 
          type="text" 
          :placeholder="searchPlaceholder"
          v-model="searchValue"
          @input="handleSearchInput"
          class="search-field"
        />
        <img src="@/assets/img/filter.png" alt="筛选" class="filter-icon" @click="handleFilterClick" />
      </div>
    </div>
    
    <!-- 筛选标签 -->
    <div class="filter-tags" v-if="showFilterTags">
      <div class="filter-tags-wrapper">
        <div class="filter-tag" 
           v-for="(filter, index) in activeFilters" 
           :key="index"
           @click="handleFilterTagClick(filter)">
          <span class="filter-text">{{ filter.label }}</span>
          <img src="@/assets/img/arrow-down.png" alt="" class="filter-arrow" />
        </div>
      </div>
      <div class="filter-action" @click="handleAdvancedFilter">
        <div class="filter-action-inner">
          <span class="filter-action-text">筛选</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSection',
  props: {
    searchPlaceholder: {
      type: String,
      default: '活动'
    },
    showFilterTags: {
      type: Boolean,
      default: true
    },
    filters: {
      type: Array,
      default: () => [
        { key: 'branch', label: '分公司', value: null },
        { key: 'department', label: '中支', value: null },
        { key: 'startTime', label: '活动开始时间', value: null },
        { key: 'endTime', label: '活动结束时间', value: null }
      ]
    }
  },
  data() {
    return {
      searchValue: ''
    };
  },
  computed: {
    activeFilters() {
      return this.filters.filter(filter => filter.value || !filter.value);
    }
  },
  methods: {
    handleSearchInput() {
      this.$emit('search', this.searchValue);
    },
    handleFilterClick() {
      this.$emit('filter-click');
    },
    handleFilterTagClick(filter) {
      this.$emit('filter-tag-click', filter);
    },
    handleAdvancedFilter() {
      this.$emit('advanced-filter');
    }
  }
}
</script>

<style scoped>
.filter-section {
  background-color: #ffffff;
}

.search-section {
  padding: 6px 11px 6px 10px;
}

.search-input {
  background-color: #fafafa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 10px 15px 9px 14px;
  gap: 10px;
}

.search-icon {
  width: 14px;
  height: 14px;
}

.search-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #000000;
  font-family: 'PingFang SC', sans-serif;
  line-height: 21px;
  outline: none;
}

.search-field::placeholder {
  color: #999999;
}

.filter-icon {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.filter-tags {
  padding: 8px 39px 8px 10px;
  position: relative;
}

.filter-tags-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  overflow: auto;
}

.filter-tag {
  background-color: #f8f7fb;
  padding: 3px 7px 2px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.filter-text {
  font-size: 12px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  line-height: 17px;
}

.filter-arrow {
  width: 7px;
  height: 7px;
}

.filter-action {
  position: absolute;
  right: 0;
  top: 0;
  height: 38px;
  width: 47px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.filter-action-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 47px;
  box-shadow: -2px 0px 6px 0px rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
}

.filter-action-text {
  font-size: 12px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  line-height: 17px;
}
</style>
