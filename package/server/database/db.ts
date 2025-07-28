import type { stageBonusInterface, bonusInterface } from '../type/stageBonus';
import * as fs from 'fs';
import * as path from 'path';
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
export const getperPersonBonus = (): number => {
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

// 修改人均奖金,并进行数据修改
export const setPerPersonBonus = (value: number): void => {
  const data = readBonusData();
  data.perPersonBonus = value;
  data.totalBonus = calculateTotalBonus(data);
  writeBonusData(data);
};

// 修改第 index 个挡位的人数,并进行数据修改
export const setStagePeopleSize = (index: number, peopleSize: number): void => {
    const data = readBonusData();
    data.stageBonus[index].peopleSize = peopleSize;
    data.totalBonus = calculateTotalBonus(data);
    writeBonusData(data);
}

//修改第 index 个挡位的权重,并进行数据修改
export const setStageWeight = (index: number, weight: number): void => {
    const data = readBonusData();
    data.stageBonus[index].weight = weight;
    data.totalBonus = calculateTotalBonus(data);
    writeBonusData(data);
}