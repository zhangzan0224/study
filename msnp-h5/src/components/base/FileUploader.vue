<template>
  <div class="file-uploader">
    <!-- 已上传文件列表 -->
    <div class="uploaded-files" v-if="uploadedFiles.length > 0">
      <div 
        class="file-item" 
        v-for="(file, index) in uploadedFiles" 
        :key="index"
      >
        <div class="file-header">
          <div class="file-info">
            <div class="file-icon" :class="getFileIconClass(file.type)"></div>
            <span class="file-name">{{ file.name }}</span>
          </div>
          <div class="file-actions">
            <!-- 下载图标 -->
            <svg 
              class="action-icon download-icon"
              @click="downloadFile(file)"
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 15L7 10H17L12 15Z" fill="#666"/>
              <path d="M12 3V13" stroke="#666" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="#666" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- 删除图标 -->
            <svg 
              class="action-icon delete-icon"
              @click="deleteFile(index)"
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 6L6 18M6 6L18 18" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div class="file-details">
          <span class="file-meta">{{ file.size }} {{ file.uploadTime }}</span>
          <span class="file-uploader">上传人：{{ file.uploader }}</span>
        </div>
      </div>
    </div>
    
    <!-- 上传按钮 -->
    <van-uploader
      v-model="fileList"
      :max-count="maxCount"
      :max-size="maxFileSize * 1024 * 1024"
      :accept="acceptedTypes"
      :before-upload="beforeUpload"
      :after-read="afterRead"
      upload-text="+ 添加文件"
      class="custom-uploader"
      :show-upload="uploadedFiles.length < maxCount"
    >
      <template #default>
        <div class="upload-btn">
          <span class="upload-text">+ 添加文件</span>
        </div>
      </template>
    </van-uploader>
    
    <div class="file-tips">
      {{ tipText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  props: {
    // 最大上传文件数量
    maxCount: {
      type: Number,
      default: 10
    },
    // 已上传的文件列表
    value: {
      type: Array,
      default: () => []
    },
    // 支持的文件类型
    acceptedTypes: {
      type: String,
      default: '.pdf,.jpg,.jpeg,.png,.tif,.bmp,.doc,.docx,.xlsx,.xls,.mp4,.mov,.avi'
    },
    // 提示文本
    tipText: {
      type: String,
      default: '支持扩展名:pdf.jpg.jpeg.png.tif.bmp.doc.docx.xlsx.xls.mp4.mov.avi'
    },
    // 非视频文件大小限制(MB)
    maxFileSize: {
      type: Number,
      default: 20
    },
    // 视频文件大小限制(MB)
    maxVideoSize: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      fileList: [],
      uploadedFiles: [...this.value]
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.uploadedFiles = [...newVal];
      },
      deep: true
    },
    uploadedFiles: {
      handler(newVal) {
        this.$emit('input', newVal);
        this.$emit('change', newVal);
      },
      deep: true
    }
  },
  methods: {
    getFileIconClass(fileType) {
      const iconMap = {
        'pdf': 'file-icon-pdf',
        'doc': 'file-icon-doc',
        'docx': 'file-icon-doc',
        'xlsx': 'file-icon-excel',
        'xls': 'file-icon-excel',
        'jpg': 'file-icon-image',
        'jpeg': 'file-icon-image',
        'png': 'file-icon-image',
        'tif': 'file-icon-image',
        'bmp': 'file-icon-image',
        'mp4': 'file-icon-video',
        'mov': 'file-icon-video',
        'avi': 'file-icon-video'
      };
      return iconMap[fileType] || 'file-icon-default';
    },
    beforeUpload(file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      const allowedTypes = this.acceptedTypes.replace(/\./g, '').split(',');
      
      if (!allowedTypes.includes(fileType)) {
        this.$toast('不支持的文件格式');
        return false;
      }
      
      const videoTypes = ['mp4', 'mov', 'avi'];
      const maxSize = videoTypes.includes(fileType) 
        ? this.maxVideoSize * 1024 * 1024 
        : this.maxFileSize * 1024 * 1024;
      
      if (file.size > maxSize) {
        this.$toast(videoTypes.includes(fileType) 
          ? `视频文件不能超过${this.maxVideoSize}M` 
          : `文件不能超过${this.maxFileSize}M`);
        return false;
      }
      
      if (this.uploadedFiles.length >= this.maxCount) {
        this.$toast(`最多只能上传${this.maxCount}个文件`);
        return false;
      }
      
      return true;
    },
    async afterRead(file) {
      try {
        // 这里应该调用实际的上传API
        // const uploadResult = await this.uploadFile(file.file);
        
        // 模拟上传成功后添加到已上传列表
        const newFile = {
          name: file.file.name,
          size: this.formatFileSize(file.file.size),
          uploadTime: this.formatDate(new Date()),
          uploader: '当前用户',
          type: file.file.name.split('.').pop().toLowerCase(),
          url: file.content, // 这里应该是服务器返回的文件URL
          id: Date.now() // 临时ID，实际应该使用服务器返回的ID
        };
        
        this.uploadedFiles.push(newFile);
        this.fileList = []; // 清空 van-uploader 的文件列表
        this.$emit('upload-success', newFile);
      } catch (error) {
        this.$toast('上传失败，请重试');
        this.$emit('upload-error', error);
      }
    },
    downloadFile(file) {
      // 实现文件下载逻辑
      if (file.url) {
        window.open(file.url, '_blank');
      } else {
        this.$toast('文件链接不存在');
      }
      this.$emit('download', file);
    },
    deleteFile(index) {
      this.$dialog.confirm({
        title: '确认删除',
        message: '确定要删除这个文件吗？'
      }).then(() => {
        const deletedFile = this.uploadedFiles[index];
        this.uploadedFiles.splice(index, 1);
        this.$emit('delete', deletedFile, index);
      }).catch(() => {});
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 供外部调用的方法
    clearFiles() {
      this.uploadedFiles = [];
    },
    addFile(file) {
      this.uploadedFiles.push(file);
    }
  }
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.uploaded-files {
  margin: 15px 0 0 0;
}

.file-item {
  background-color: rgba(243, 245, 246, 1);
  border-radius: 8px;
  padding: 10px 12px 9px 12px;
  margin-bottom: 9px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-icon {
  width: 17px;
  height: 13px;
  margin-right: 8px;
  flex-shrink: 0;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: bold;
  color: white;
}

/* 文件类型图标样式 */
.file-icon-pdf {
  background-color: #e74c3c;
}

.file-icon-pdf::before {
  content: 'PDF';
}

.file-icon-doc {
  background-color: #2980b9;
}

.file-icon-doc::before {
  content: 'DOC';
}

.file-icon-excel {
  background-color: #27ae60;
}

.file-icon-excel::before {
  content: 'XLS';
}

.file-icon-image {
  background-color: #9b59b6;
}

.file-icon-image::before {
  content: 'IMG';
}

.file-icon-video {
  background-color: #f39c12;
}

.file-icon-video::before {
  content: 'VID';
}

.file-icon-default {
  background-color: #95a5a6;
}

.file-icon-default::before {
  content: 'FILE';
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 17px;
}

.action-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.action-icon:hover {
  opacity: 0.7;
}

.download-icon {
  width: 17px;
  height: 13px;
}

.file-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-meta,
.file-uploader {
  font-size: 11px;
  color: rgba(153, 153, 153, 1);
  line-height: 16px;
  white-space: nowrap;
}

.file-meta {
    margin-right: 10px;
}

.custom-uploader {
  margin: 15px 0 0 0;
  width: 100%;
}

.custom-uploader :deep(.van-uploader__wrapper) {
  width: 100%;
}

.custom-uploader :deep(.van-uploader__input-wrapper) {
  width: 100%;
}

.upload-btn {
  background-color: #ffffff;
  border: 1px dashed rgba(187, 187, 187, 1);
  border-radius: 8px;
  padding: 19px 0 18px 0;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: border-color 0.2s, background-color 0.2s;
  box-sizing: border-box;
}

.upload-btn:hover {
  border-color: rgba(255, 129, 26, 1);
  background-color: rgba(255, 249, 246, 1);
}

.upload-text {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
}

.file-tips {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
  line-height: 17px;
  padding: 15px 0 21px 0;
  word-break: break-all;
  white-space: normal;
}
</style>