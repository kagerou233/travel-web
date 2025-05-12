const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const app = express();
const port = 3000;
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

app.use(cors());
app.use(express.json());

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testConnection();
const TravelNote = require('./models/TravelNote');
const User = require('./models/User');
const RejectReason = require('./models/RejectReason');
RejectReason.belongsTo(TravelNote, { foreignKey: 'note_id' });
TravelNote.belongsTo(User, { foreignKey: 'user_id' });
const audit = require('./routes/audit');
app.use('/api/audit', audit);
app.get('/', (req, res) => {
  res.send('Travel Web 后端服务已启动');
});


app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});