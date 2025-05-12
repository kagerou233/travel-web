
import { defineStore } from 'pinia'
import axios from 'axios'


export const useTravelNotesStore = defineStore('travelNotes', {
    state: () => ({
        travelNotesList: [],
        currentFilter: 'pending', // pending, approved, rejected
        loading: false,
        error: null,
        total: 0,
        totalPages: 0
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
                
            } catch (error) {
                console.error('请求API时出错:', error);
                this.error = error.message || '请求失败'
                throw error
            } finally {
                this.loading = false
            }
        },

        async approveNote(noteId) {
            try {
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
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        async rejectNote(noteId, reason) {
            try {
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
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        async deleteNote(noteId) {
            try {
                
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