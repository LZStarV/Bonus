const { Request, Response } = require('express');
const bonusOperation = require('../database/db.js');

// 获取人均奖金
const getPerPersonBonus = (req, res) => {
  try {
    const bonus = bonusOperation.getPerPersonBonus();
    res.status(200).json({
      status: 'success',
      data: bonus,
    });
  } catch (error) {
    console.error('获取人均奖金失败', error);
    res.status(500).json({
      status: 'error',
      message: '获取人均奖金失败',
    });
  }
};

// 获取总奖金
const getTotalBonus = (req, res) => {
  try {
    const bonus = bonusOperation.getTotalBonus();
    res.status(200).json({
      status: 'success',
      data: bonus,
    });
  } catch (error) {
    console.error('获取总奖金失败', error);
    res.status(500).json({
      status: 'error',
      message: '获取总奖金失败',
    });
  }
};

// 获取各挡位奖金分配情况
const getStageBonuses = (req, res) => {
  try {
    const stages = bonusOperation.getStageBonuses();
    res.status(200).json({
      status: 'success',
      data: stages,
    });
  } catch (error) {
    console.error('获取各挡位奖金分配情况失败', error);
    res.status(500).json({
      status: 'error',
      message: '获取各挡位奖金分配情况失败',
    });
  }
};

// 设置人均奖金
const setPerPersonBonus = (req, res) => {
  try {
    const { bonus } = req.body;
    if (typeof bonus !== 'number' || bonus < 0) {
      return res.status(400).json({
        status: 'error',
        message: '无效的奖金金额!',
      });
    }
    bonusOperation.setPerPersonBonus(bonus);
    res.status(200).json({
      status: 'success',
      message: '人均奖金设置成功',
      data: bonus,
    });
  } catch (error) {
    console.error('修改人均奖金失败', error);
    res.status(500).json({
      status: 'error',
      message: '修改人均奖金失败',
    });
  }
};

// 设置挡位人数
const setStagePeopleSize = (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const { peopleSize } = req.body;

    // 验证参数
    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        status: 'error',
        message: '无效的挡位索引!',
      });
    }
    if (typeof peopleSize !== 'number' || peopleSize < 0 || !Number.isInteger(peopleSize)) {
      return res.status(400).json({
        status: 'error',
        message: '人数必须是非负整数!',
      });
    }

    bonusOperation.setStagePeopleSize(index, peopleSize);
    res.status(200).json({
      status: 'success',
      message: '挡位人数设置成功',
      data: {
        index,
        peopleSize,
      },
    });
  } catch (error) {
    if (error.message === '未找到对应序号的挡位') {
      return res.status(404).json({
        status: 'error',
        message: error.message,
      });
    }
    console.error('修改挡位人数失败', error);
    res.status(500).json({
      status: 'error',
      message: '修改挡位人数失败',
    });
  }
};

// 设置挡位权重
const setStageWeight = (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const { weight } = req.body;

    // 验证参数
    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        status: 'error',
        message: '无效的挡位索引!',
      });
    }
    if (typeof weight !== 'number' || weight <= 0) {
      return res.status(400).json({
        status: 'error',
        message: '权重必须是正数!',
      });
    }

    bonusOperation.setStageWeight(index, weight);
    res.status(200).json({
      status: 'success',
      message: '挡位权重设置成功',
      data: {
        index,
        weight,
      },
    });
  } catch (error) {
    if (error.message === '未找到对应序号的挡位') {
      return res.status(404).json({
        status: 'error',
        message: error.message,
      });
    }
    console.error('修改挡位权重失败', error);
    res.status(500).json({
      status: 'error',
      message: '修改挡位权重失败',
    });
  }
};

// 新增挡位
const createStage = (req, res) => {
  try {
    const { peopleSize, weight } = req.body;

    // 验证参数
    if (typeof peopleSize !== 'number' || peopleSize < 0 || !Number.isInteger(peopleSize)) {
      return res.status(400).json({
        status: 'error',
        message: '人数必须是非负整数!',
      });
    }
    if (typeof weight !== 'number' || weight <= 0) {
      return res.status(400).json({
        status: 'error',
        message: '权重必须是正数!',
      });
    }

    bonusOperation.createStage(peopleSize, weight);
    res.status(200).json({
      status: 'success',
      message: '新增挡位成功',
      data: bonusOperation.getStageBonuses(),
    });
  } catch (error) {
    console.error('新增挡位失败', error);
    res.status(500).json({
      status: 'error',
      message: '新增挡位失败',
    });
  }
};

// 移除挡位
const removeStage = (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);

    // 验证参数
    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        status: 'error',
        message: '无效的挡位索引!',
      });
    }

    bonusOperation.removeStage(index);
    res.status(200).json({
      status: 'success',
      message: '移除挡位成功',
      data: bonusOperation.getStageBonuses(),
    });
  } catch (error) {
    if (error.message === '未找到对应序号的挡位') {
      return res.status(404).json({
        status: 'error',
        message: error.message,
      });
    }
    console.error('移除挡位失败', error);
    res.status(500).json({
      status: 'error',
      message: '移除挡位失败',
    });
  }
};

module.exports = {
  getPerPersonBonus,
  getTotalBonus,
  getStageBonuses,
  setPerPersonBonus,
  setStagePeopleSize,
  setStageWeight,
  createStage,
  removeStage
};
