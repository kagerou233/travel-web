import { defineStore } from 'pinia'
import axios from 'axios'

// 模拟游记数据
const mockTravelNotes = [
    {
        id: 1,
        title: '美丽的西湖之旅',
        author: '张三',
        createTime: '2024-03-15 10:00:00',
        status: 'pending',
        content: '西湖的美景让人流连忘返...'
    },
    {
        id: 2,
        title: '北京故宫一日游',
        author: '李四',
        createTime: '2024-03-14 15:30:00',
        status: 'approved',
        content: '故宫的宏伟建筑令人震撼...'
    },
    {
        id: 3,
        title: '上海外滩夜景',
        author: '王五',
        createTime: '2024-03-13 20:00:00',
        status: 'rejected',
        content: '外滩的夜景美不胜收...'
    },
    {
        id: 4,
        title: '成都美食之旅',
        author: '赵六',
        createTime: '2024-03-12 18:45:00',
        status: 'pending',
        content: '成都的美食让人回味无穷...'
    }
]

export const useTravelNotesStore = defineStore('travelNotes', {
    state: () => ({
        travelNotesList: [],
        currentFilter: 'pending', // pending, approved, rejected
        loading: false,
        error: null
    }),

    getters: {
        filteredTravelNotes: (state) => {
            return state.travelNotesList.filter(note => note.status === state.currentFilter)
        }
    },

    actions: {
        async fetchTravelNotes() {
            this.loading = true
            try {
                // 模拟API请求
                await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟
                this.travelNotesList = mockTravelNotes
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async approveNote(noteId) {
            try {
                // 模拟API请求
                await new Promise(resolve => setTimeout(resolve, 300))
                const note = this.travelNotesList.find(n => n.id === noteId)
                if (note) {
                    note.status = 'approved'
                }
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async rejectNote(noteId, reason) {
            try {
                // 模拟API请求
                await new Promise(resolve => setTimeout(resolve, 300))
                const note = this.travelNotesList.find(n => n.id === noteId)
                if (note) {
                    note.status = 'rejected'
                }
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        async deleteNote(noteId) {
            try {
                // 模拟API请求
                await new Promise(resolve => setTimeout(resolve, 300))
                this.travelNotesList = this.travelNotesList.filter(note => note.id !== noteId)
            } catch (error) {
                this.error = error.message
                throw error
            }
        },

        setFilter(filter) {
            this.currentFilter = filter
        }
    }
}) 