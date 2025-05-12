const express = require('express');
const router = express.Router();
const TravelNote = require('../models/TravelNote');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RejectReason = require('../models/RejectReason');




// 获取所有游记
router.get('/allTravelNotes', async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    
    const notes = await TravelNote.findAndCountAll({
      
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      include: [{
        model: User,
        attributes: ['username', 'avatar_url']
      }]
    });
    res.json({
      success: true,
      data: {
        total: notes.count,
        list: notes.rows,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取已审核游记列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取游记列表失败'
    });
  }
});
// 获取图片
router.get('/getNoteImages/:note_id', async (req, res) => {
  try {
    const { note_id } = req.params;
    const images = await image.findAll({
      where: {
        note_id: note_id
      }
    });

    if (!images || images.length === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到相关图片'
      });
    }

    res.json({
      success: true,
      data: {
        imageInfo: {
          avatar: images
        }
      }
    });
  } catch (error) {
    console.error('获取游记图片失败:', error);
    res.status(500).json({
      success: false,
      message: '获取游记图片失败'
    });
  }
});





// 更新游记状态
router.post('/updateNoteStatus/:note_id', async (req, res) => {
  try {
    const { note_id } = req.params;
    const { status } = req.body;
    const { reject_reason } = req.body;
    const updated = await TravelNote.update(
      { status },
      { where: { note_id: note_id } }
    );
    
    if (updated[0] === 0) {
      return res.status(404).json({
        success: false,
        message: '未找到指定游记'
      });
    }
    
    if (status === 'rejected') {
      if (!reject_reason) {
        return res.status(400).json({
          success: false,
          message: '拒绝原因不能为空'
        });
      }
      await RejectReason.create({ note_id, reason:reject_reason });
    }
    
    res.json({
      success: true,
      message: '状态更新成功'
    });
  } catch (error) {
    console.error('更新游记状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新游记状态失败'
    });
  }
});

module.exports = router;