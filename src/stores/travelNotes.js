import { defineStore } from 'pinia'
import axios from 'axios'

// 模拟数据
const mockTravelNotes = [
    {
        note_id: 1,
        title: '美丽的西湖之旅',
        content: '西湖的美景让人流连忘返...',
        status: 'pending',
        created_at: '2025-03-15T10:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop'
        ],
        User: {
            username: '张三',
            avatar_url: ''
        }
    },
    {
        note_id: 2,
        title: '黄山日出观赏攻略',
        content: '凌晨4点起床，只为那一抹朝阳...',
        status: 'approved',
        created_at: '2025-03-14T15:30:00Z',
        images: [
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop'
        ],
        User: {
            username: '李四',
            avatar_url: ''
        }
    },
    {
        note_id: 3,
        title: '三亚海滩度假体验',
        content: '阳光、沙滩、海浪，尽享夏日时光...',
        status: 'rejected',
        created_at: '2025-03-13T09:15:00Z',
        images: [
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop'
        ],
        User: {
            username: '王五',
            avatar_url: ''
        }
    },
    {
        note_id: 4,
        title: '北京故宫一日游',
        content: '感受中华五千年文明的瑰宝...',
        status: 'pending',
        created_at: '2025-03-12T14:20:00Z',
        images: [
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop'
        ],
        User: {
            username: '赵六',
            avatar_url: ''
        }
    },
    {
        note_id: 5,
        title: '成都美食探索之旅',
        content: '火锅、串串、小吃，舌尖上的成都...',
        status: 'approved',
        created_at: '2025-03-11T11:45:00Z',
        images: [
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop'
        ],
        User: {
            username: '钱七',
            avatar_url: ''
        }
    },
    {
        note_id: 6,
        title: '云南大理古城游记',
        content: '漫步在古城的青石板路上，感受白族文化的魅力...',
        status: 'pending',
        created_at: '2025-03-16T08:30:00Z',
        images: [
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?q=80&w=2070&auto=format&fit=crop'
        ],
        User: {
            username: '孙八',
            avatar_url: ''
        }
    }
]

export const useTravelNotesStore = defineStore('travelNotes', {
    state: () => ({
        travelNotesList: [],
        currentFilter: 'pending', // pending, approved, rejected
        loading: false,
        error: null,
        total: 0,
        totalPages: 0,
        previewVisible: false,
        currentPreviewNote: null
    }),

    getters: {
        filteredTravelNotes: (state) => {
            return state.travelNotesList.filter(note => note.status === state.currentFilter)
        }
    },

    actions: {
        async fetchTravelNotes(page = 1, pageSize = 10) {
            this.loading = true
            try {
                // 使用模拟数据
                this.travelNotesList = mockTravelNotes
                this.total = mockTravelNotes.length
                this.totalPages = Math.ceil(this.total / pageSize)

                /* 原来的API请求代码
                console.log('正在发送请求到API...', { page, pageSize });
                const response = await axios({
                    url: 'http://localhost:3000/api/audit/allTravelNotes',
                    method: 'GET',
                    data: { page, pageSize },
                    timeout: 10000
                })

                if (response.data.success) {
                    this.travelNotesList = response.data.data.list
                    console.log('API响应成功:', this.travelNotesList);
                    this.total = response.data.data.total
                    this.totalPages = Math.ceil(this.total / pageSize)
                } else {
                    console.warn('API响应不成功:', response.data);
                }
                */
            } catch (error) {
                console.error('获取数据时出错:', error);
                this.error = error.message || '获取数据失败'
                throw error
            } finally {
                this.loading = false
            }
        },

        setFilter(filter) {
            this.currentFilter = filter
        },

        showPreview(note) {
            this.closePreview()
            this.currentPreviewNote = { ...note }
            this.previewVisible = true
        },

        closePreview() {
            this.previewVisible = false
            this.currentPreviewNote = null
        },

        async approveNote(noteId) {
            try {
                // 使用模拟数据
                const note = this.travelNotesList.find(n => n.note_id === noteId)
                if (note) {
                    note.status = 'approved'
                }

                /* 原来的API请求代码
                console.log(noteId);
                const response = await axios({
                    url: `http://localhost:3000/api/audit/updateNoteStatus/${noteId}`,
                    method: 'POST',
                    data: { status: 'approved' },
                    timeout: 10000
                });

                if (response.data.success) {
                    const note = this.travelNotesList.find(n => n.id === noteId);
                    if (note) {
                        note.status = 'approved';
                    }
                } else {
                    throw new Error(response.data.message || '更新状态失败');
                }
                */
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        async rejectNote(noteId, reason) {
            try {
                // 使用模拟数据
                const note = this.travelNotesList.find(n => n.note_id === noteId)
                if (note) {
                    note.status = 'rejected'
                }

                /* 原来的API请求代码
                const response = await axios({
                    url: `http://localhost:3000/api/audit/updateNoteStatus/${noteId}`,
                    method: 'POST',
                    data: {
                        status: 'rejected',
                        reject_reason: reason
                    },
                    timeout: 10000
                });

                if (response.data.success) {
                    const note = this.travelNotesList.find(n => n.id === noteId);
                    if (note) {
                        note.status = 'rejected';
                    }
                } else {
                    throw new Error(response.data.message || '更新状态失败');
                }
                */
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        async deleteNote(noteId) {
            try {
                // 使用模拟数据
                this.travelNotesList = this.travelNotesList.filter(note => note.note_id !== noteId)
                this.total = this.travelNotesList.length
                this.totalPages = Math.ceil(this.total / 10)
            } catch (error) {
                this.error = error.message
                throw error
            }
        }
    }
})