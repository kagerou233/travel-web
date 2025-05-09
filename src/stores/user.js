import { defineStore } from 'pinia'
import axios from 'axios'

// 模拟用户数据
const mockUsers = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        userInfo: {
            name: '管理员',
            avatar: ''
        }
    },
    reviewer: {
        username: 'reviewer',
        password: 'reviewer123',
        role: 'reviewer',
        userInfo: {
            name: '审核员',
            avatar: ''
        }
    }
}

export const useUserStore = defineStore('user', {
    state: () => ({
        userRole: null,
        token: localStorage.getItem('token') || null,
        userInfo: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.userRole === 'admin',
        isReviewer: (state) => state.userRole === 'reviewer'
    },

    actions: {
        async login(username, password) {
            try {
                // 模拟登录验证
                const user = mockUsers[username]
                if (user && user.password === password) {
                    const token = `mock-token-${Date.now()}`
                    this.token = token
                    this.userRole = user.role
                    this.userInfo = user.userInfo
                    localStorage.setItem('token', token)
                    return true
                }
                return false
            } catch (error) {
                console.error('Login failed:', error)
                return false
            }
        },

        logout() {
            this.token = null
            this.userRole = null
            this.userInfo = null
            localStorage.removeItem('token')
        }
    }
}) 