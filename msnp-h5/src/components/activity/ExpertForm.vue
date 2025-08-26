<template>
  <div class="expert-form">
    <!-- 照片上传 -->
    <div class="photo-section">
      <div class="photo-label">照片</div>
      <div class="photo-upload" @click="handlePhotoUpload">
        <img 
          v-if="expert.photo" 
          :src="expert.photo" 
          alt="专家照片" 
          class="expert-photo"
        />
        <div v-else class="upload-placeholder">
          <span class="iconfont upload-icon">+</span>
        </div>
      </div>
    </div>
    
    <!-- 基本信息 -->
    <div class="info-section">
      <FormField 
        label="姓名"
        :required="true"
        type="input"
        v-model="localExpert.name"
        placeholder="请输入"
        @input="handleUpdate"
      />
      
      <FormField 
        label="职称"
        :required="true"
        type="select"
        v-model="localExpert.title"
        placeholder="请选择"
        @select-click="showTitlePicker"
      />
      
      <FormField 
        label="医院"
        :required="true"
        type="input"
        v-model="localExpert.hospital"
        placeholder="请输入"
        @input="handleUpdate"
      />
      
      <FormField 
        label="科室"
        type="input"
        v-model="localExpert.department"
        placeholder="请输入"
        @input="handleUpdate"
      />
      
      <FormField 
        label="介绍"
        type="textarea"
        v-model="localExpert.introduction"
        placeholder="请输入"
        :max-length="400"
        :rows="4"
        :show-divider="false"
        @input="handleUpdate"
      />
    </div>
    
    <!-- 删除按钮 -->
    <div v-if="showRemove" class="remove-section">
      <button class="remove-btn" @click="handleRemove">
        删除讲师
      </button>
    </div>
  </div>
</template>

<script>
import FormField from '@/components/base/FormField.vue'

export default {
  name: 'ExpertForm',
  components: {
    FormField
  },
  props: {
    expert: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    showRemove: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localExpert: { ...this.expert }
    }
  },
  watch: {
    expert: {
      handler(newVal) {
        this.localExpert = { ...newVal };
      },
      deep: true
    }
  },
  methods: {
    handlePhotoUpload() {
      // 触发照片上传
      console.log('Upload photo for expert:', this.index);
      // 这里应该调用文件上传组件或API
    },
    
    showTitlePicker() {
      // 显示职称选择器
      console.log('Show title picker');
    },
    
    handleUpdate() {
      this.$emit('update', this.index, this.localExpert);
    },
    
    handleRemove() {
      this.$emit('remove', this.index);
    }
  }
}
</script>

<style scoped>
.expert-form {
  padding: 16px 20px;
}

.photo-section {
  margin-bottom: 16px;
}

.photo-label {
  font-size: 14px;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
  margin-bottom: 8px;
}

.photo-upload {
  width: 94px;
  height: 94px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.expert-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: rgba(153, 153, 153, 1);
}

.info-section {
  margin-bottom: 16px;
}

.remove-section {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.remove-btn {
  background: transparent;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
  padding: 8px 16px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: rgba(255, 77, 79, 0.1);
}
</style>
