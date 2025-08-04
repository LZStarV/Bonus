import type { stageBonusInterface, bonusInterface } from '../type/stageBonus.js';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'bonus.json');

// 读取 JSON 数据
const readBonusData = (): bonusInterface => {
  const data = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(data);
};

// 修改 JSON 数据
const writeBonusData = (data: any): void => {
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
};

// 获取人均奖金
export const getPerPersonBonus = (): number => {
  return readBonusData().perPersonBonus;
};

// 获取总奖金
export const getTotalBonus = (): number => {
  return readBonusData().totalBonus;
};

// 获取各挡位奖金分配情况
export const getStageBonus = (): stageBonusInterface[] => {
  return readBonusData().stageBonus;
};

// 计算总奖金(不进行数据修改)
const calculateTotalBonus = (data: bonusInterface): number => {
  const perPersonBonus: number = data.perPersonBonus;
  const stageBonus: stageBonusInterface[] = data.stageBonus;
  let totalPeopleSize: number = 0;
  stageBonus.forEach((element: stageBonusInterface) => {
    totalPeopleSize += element.peopleSize;
  });
  return perPersonBonus * totalPeopleSize;
};

// 计算各挡位分配金额情况(不进行数据修改)
const calculateStageBonus = (data: bonusInterface): Array<number> => {
  const stageBonus = data.stageBonus;
  const totalBonus = data.totalBonus;
  let sumProduct = 0;
  stageBonus.forEach(stage => {
    sumProduct += stage.peopleSize * stage.weight;
  });
  return stageBonus.map(stage => {
    const stageProduct = stage.peopleSize * stage.weight;
    return totalBonus * stageProduct / sumProduct;
  });
};

// 修改人均奖金,并进行数据修改
export const setPerPersonBonus = (value: number): void => {
  const data = readBonusData();
  data.perPersonBonus = value;
  data.totalBonus = calculateTotalBonus(data);
  const stageAmounts = calculateStageBonus(data);
  data.stageBonus.forEach((stage, index) => {
    stage.bonus = stageAmounts[index];
  });
  writeBonusData(data);
};

// 修改第 index 个挡位的人数,并进行数据修改
export const setStagePeopleSize = (index: number, peopleSize: number): void => {
  const data = readBonusData();
  data.stageBonus[index].peopleSize = peopleSize;
  data.totalBonus = calculateTotalBonus(data);
  const stageAmounts = calculateStageBonus(data);
  data.stageBonus.forEach((stage, index) => {
    stage.bonus = stageAmounts[index];
  });
  writeBonusData(data);
}

//修改第 index 个挡位的权重,并进行数据修改
export const setStageWeight = (index: number, weight: number): void => {
  const data = readBonusData();
  data.stageBonus[index].weight = weight;
  data.totalBonus = calculateTotalBonus(data);
  const stageAmounts = calculateStageBonus(data);
  data.stageBonus.forEach((stage, index) => {
    stage.bonus = stageAmounts[index];
  });
  writeBonusData(data);
}

// 新增挡位
export const createStage = (peopleSize: number, weight: number): void => {
  const data = readBonusData();
  // 创建新挡位对象，bonus初始化为0
  const newStage: stageBonusInterface = {
    peopleSize,
    weight,
    bonus: 0
  };
  data.stageBonus.push(newStage);
  data.totalBonus = calculateTotalBonus(data);
  const stageAmounts = calculateStageBonus(data);
  data.stageBonus.forEach((stage, index) => {
    stage.bonus = stageAmounts[index];
  });
  writeBonusData(data);
}

// 移除挡位
export const removeStage = (index: number): void => {
  const data = readBonusData();
  const { stageBonus } = data;

  // 验证索引是否有效
  if (typeof index !== 'number' || index < 0 || index >= stageBonus.length || !Number.isInteger(index)) {
    throw new Error(`未找到对应序号: ${index}`);
  }

  // 删除指定索引的挡位
  stageBonus.splice(index, 1);

  // 重新计算总奖金和各挡位金额
  data.totalBonus = calculateTotalBonus(data);
  const stageAmounts = calculateStageBonus(data);
  data.stageBonus.forEach((stage, i) => {
    stage.bonus = stageAmounts[i];
  });

  writeBonusData(data);
}