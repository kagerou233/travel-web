import { defineStore } from 'pinia'
import axios from 'axios'

// 模拟游记数据
const mockTravelNotes = [
    {
        "id": 1,
        "title": "桂林山水诗意游",
        "author": "小张",
        "createTime": "2025-04-25 10:15:00",
        "status": "pending",
        "content": "桂林的山水简直就是大自然谱写的一首绝美诗篇呀，漓江的水清澈碧绿，两岸山峦起伏，乘船游览其中，仿佛人在画中游，每一处景色都让人陶醉不已。"
    },
    {
        "id": 2,
        "title": "杭州西湖春日赏",
        "author": "小陈",
        "createTime": "2025-04-24 13:30:00",
        "status": "approved",
        "content": "春日的西湖别有一番韵味，湖边垂柳依依，桃花盛开，湖面上波光粼粼，各种游船穿梭其中，微风拂过，带来阵阵花香，实在是美不胜收。"
    },
    {
        "id": 3,
        "title": "哈尔滨冰雪奇观",
        "author": "小赵",
        "createTime": "2025-04-23 15:45:00",
        "status": "rejected",
        "content": "本想着去哈尔滨看那壮观的冰雪大世界，可去的时候有些冰雕已经开始融化了，有点小遗憾，不过那些还完好的冰雕依然很惊艳，晶莹剔透，造型各异。"
    },
    {
        "id": 4,
        "title": "厦门环岛路骑行记",
        "author": "小孙",
        "createTime": "2025-04-22 17:20:00",
        "status": "pending",
        "content": "沿着厦门环岛路骑行简直太惬意了，一边是浩瀚的大海，一边是美丽的城市风光，海风呼呼吹过脸颊，看着沿途的椰林沙滩，心情格外舒畅呢。"
    },
    {
        "id": 5,
        "title": "敦煌莫高窟探秘行",
        "author": "小钱",
        "createTime": "2025-04-21 11:50:00",
        "status": "approved",
        "content": "踏入莫高窟，就像走进了一座艺术的宝库，那精美的壁画、栩栩如生的佛像，承载着千年的历史文化，每一个洞窟都让人惊叹古人的智慧和技艺。"
    },
    {
        "id": 6,
        "title": "黄山云海奇观遇",
        "author": "小周",
        "createTime": "2025-04-20 14:10:00",
        "status": "rejected",
        "content": "去黄山就是为了看那壮观的云海，可惜运气不太好，等了好久只看到了一点点云海的影子，不过山上的其他景色倒是也还不错啦。"
    },
    {
        "id": 7,
        "title": "昆明滇池观鸟趣",
        "author": "小吴",
        "createTime": "2025-04-19 16:30:00",
        "status": "pending",
        "content": "到昆明滇池看鸟可太有意思了，各种各样的鸟儿在这里栖息，它们时而展翅高飞，时而在水面嬉戏，看着它们自由自在的样子，感觉整个画面都充满了生机呢。"
    },
    {
        "id": 8,
        "title": "拉萨布达拉宫瞻仰记",
        "author": "小郑",
        "createTime": "2025-04-18 18:40:00",
        "status": "approved",
        "content": "布达拉宫矗立在红山之巅，雄伟壮观，那红白相间的建筑在阳光的照耀下显得格外神圣，走进它，能感受到浓厚的宗教氛围和深厚的历史底蕴。"
    },
    {
        "id": 9,
        "title": "长沙美食打卡行",
        "author": "小冯",
        "createTime": "2025-04-17 13:25:00",
        "status": "rejected",
        "content": "去长沙就是冲着美食去的，可有些网红美食店排的队太长了，没能都吃到，不过吃到的那些小吃味道确实挺独特的，就是感觉没吃尽兴呀。"
    },
    {
        "id": 10,
        "title": "南京夫子庙夜游",
        "author": "小蒋",
        "createTime": "2025-04-16 15:10:00",
        "status": "pending",
        "content": "夜晚的夫子庙热闹非凡，古色古香的建筑在灯光的映衬下别具韵味，秦淮河上的游船来来往往，两岸的小吃摊香气扑鼻，在这里既能感受历史文化，又能享受美食，真的很棒。"
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