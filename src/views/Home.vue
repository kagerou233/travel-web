<template>
  <div class="home-container">
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>游记审核管理系统</h2>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      
      <el-container>
        <el-aside width="120px">
          <el-menu
            :default-active="currentFilter"
            @select="handleFilterChange"
          >
            <el-menu-item index="pending">
              <el-icon><Clock /></el-icon>
              <span>待审核</span>
            </el-menu-item>
            <el-menu-item index="approved">
              <el-icon><CircleCheck /></el-icon>
              <span>已通过</span>
            </el-menu-item>
            <el-menu-item index="rejected">
              <el-icon><CircleClose /></el-icon>
              <span>未通过</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        
        <el-main>
          <div v-loading="loading" class="table-container">
            <el-table :data="filteredTravelNotes" style="width: 100%">
              <el-table-column prop="title" label="标题" min-width="300">
                <template #default="{ row }">
                  <el-button 
                    link 
                    type="primary" 
                    @click="handlePreview(row)"
                  >
                    {{ row.title }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="User.username" label="作者" min-width="120" />
              <el-table-column prop="created_at" label="发布时间" min-width="180">
                <template #default="{ row }">
                  {{ formatDateTime(row.created_at) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" min-width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="200" fixed="right">
                <template #default="{ row }">
                  <el-button
                    v-if="row.status === 'pending'"
                    type="success"
                    size="small"
                    @click="handleApprove(row)"
                  >
                    通过
                  </el-button>
                  <el-button
                    v-if="row.status === 'pending'"
                    type="danger"
                    size="small"
                    @click="handleReject(row)"
                  >
                    拒绝
                  </el-button>
                  <el-button
                    v-if="isAdmin"
                    type="danger"
                    size="small"
                    @click="handleDelete(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 拒绝原因对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒绝原因"
      width="30%"
    >
      <el-form :model="rejectForm">
        <el-form-item label="拒绝原因">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            rows="3"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmReject">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      :title="currentPreviewNote?.title"
      width="60%"
      class="preview-dialog"
      @close="handlePreviewClose"
    >
      <div class="preview-content">
        <div class="preview-header">
          <div class="author-info">
            <span class="author-name">作者：{{ currentPreviewNote?.User?.username }}</span>
          </div>
          <div class="publish-time">
            发布时间：{{ formatDateTime(currentPreviewNote?.created_at) }}
          </div>
        </div>
        <div class="preview-body">
          <div class="content-title">游记内容：</div>
          <div class="content-text">{{ currentPreviewNote?.content }}</div>
          <div v-if="currentPreviewNote?.images?.length" class="content-images">
            <div class="images-title">游记图片：</div>
            <div class="images-container">
              <div 
                v-for="(url, index) in currentPreviewNote.images" 
                :key="index"
                class="image-wrapper"
                @click="handleImagePreview(index)"
              >
                <img
                  :src="url"
                  class="preview-image"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="preview-footer">
          <el-tag :type="getStatusType(currentPreviewNote?.status)">
            {{ getStatusText(currentPreviewNote?.status) }}
          </el-tag>
        </div>
      </div>
    </el-dialog>

    <el-image-viewer
      v-if="showViewer"
      :url-list="currentPreviewNote?.images || []"
      :initial-index="previewImageIndex"
      @close="showViewer = false"
      :hide-on-click-modal="false"
      :z-index="3000"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useTravelNotesStore } from '../stores/travelNotes'
import { ElMessage, ElMessageBox, ElImageViewer } from 'element-plus'
import { Clock, CircleCheck, CircleClose } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const travelNotesStore = useTravelNotesStore()

const loading = computed(() => travelNotesStore.loading)
const filteredTravelNotes = computed(() => travelNotesStore.filteredTravelNotes)
const currentFilter = computed(() => travelNotesStore.currentFilter)
const isAdmin = computed(() => userStore.isAdmin)

const rejectDialogVisible = ref(false)
const rejectForm = ref({
  noteId: null,
  reason: ''
})

const previewVisible = computed(() => travelNotesStore.previewVisible)
const currentPreviewNote = computed(() => travelNotesStore.currentPreviewNote)

const showViewer = ref(false)
const previewImageIndex = ref(0)

onMounted(async () => {
  await travelNotesStore.fetchTravelNotes()
})

const handleFilterChange = (filter) => {
  travelNotesStore.setFilter(filter)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const handleApprove = async (note) => {
  try {
    
    await travelNotesStore.approveNote(note.note_id)
    ElMessage.success('审核通过成功')
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  }
}

const handleReject = (note) => {
  rejectForm.value = {
    noteId: note.note_id,
    reason: ''
  }
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectForm.value.reason) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    await travelNotesStore.rejectNote(rejectForm.value.noteId, rejectForm.value.reason)
    ElMessage.success('已拒绝该游记')
    rejectDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  }
}

const handleDelete = async (note) => {
  try {
    await ElMessageBox.confirm('您确定要删除这篇游记吗？', '删除确认', {
      type: 'warning',
      confirmButtonText: '确定删除',
      cancelButtonText: '取消'
    })
    await travelNotesStore.deleteNote(note.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

const handlePreview = (note) => {
  travelNotesStore.showPreview(note)
}

const handlePreviewClose = () => {
  travelNotesStore.closePreview()
}

const handleImagePreview = (index) => {
  previewImageIndex.value = index
  showViewer.value = true
}

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审核',
    approved: '已通过',
    rejected: '未通过'
  }
  return texts[status] || status
}
</script>

<style scoped>
.home-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #dcdfe6;
  width: 120px !important;
  height: calc(100vh - 60px);
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
  width: calc(100% - 120px);
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 1000px;
  max-width: 1400px;
  margin: 0 auto;
}

:deep(.el-table) {
  margin-top: 10px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
}

:deep(.el-menu) {
  border-right: none;
  height: 100%;
}

:deep(.el-menu-item) {
  padding-left: 20px !important;
}

:deep(.el-container) {
  width: 100%;
  height: 100%;
}

:deep(.el-main::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-main::-webkit-scrollbar-thumb) {
  background-color: #dcdfe6;
  border-radius: 3px;
}

:deep(.el-main::-webkit-scrollbar-track) {
  background-color: #f5f7fa;
}

.preview-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.publish-time {
  color: #909399;
  font-size: 14px;
}

.preview-body {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
  min-height: 200px;
}

.content-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
  text-align: left;
}

.content-text {
  white-space: pre-wrap;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: left;
}

.preview-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.content-images {
  margin-top: 20px;
}

.images-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
  text-align: left;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-wrapper {
  width: 200px;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  background-color: #f5f7fa;
}

.image-wrapper:hover {
  transform: scale(1.05);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 移除之前的预览相关样式 */
</style>