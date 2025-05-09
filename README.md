# Travel Web 项目


## 技术栈

- Vue 3
- Vite
- Element Plus
- Pinia (状态管理)
- Vue Router
- Axios

## 项目结构

```
travel-web/
├── src/                # 源代码目录
│   ├── api/           # API 接口
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 状态管理
│   ├── views/         # 页面视图
│   ├── App.vue        # 根组件
│   ├── main.js        # 入口文件
│   └── style.css      # 全局样式
├── public/            # 公共资源目录
├── index.html         # HTML 模板
└── vite.config.js     # Vite 配置文件
```

## 开发环境要求

- Node.js (推荐使用最新的 LTS 版本)
- npm 或 yarn

## 安装和运行

1. 克隆项目
```bash
git clone [项目地址]
cd travel-web
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

4. 构建生产版本
```bash
npm run build
# 或
yarn build
```

5. 预览生产构建
```bash
npm run preview
# 或
yarn preview
```

## 主要功能

- 旅游目的地展示
- 旅游攻略
- 用户交互功能
- 响应式设计

## 开发规范

- 使用 Vue 3 组合式 API
- 遵循 Vue 3 官方风格指南
- 使用 ESLint 进行代码规范检查
- 使用 Prettier 进行代码格式化

## 许可证

[MIT License](LICENSE)
