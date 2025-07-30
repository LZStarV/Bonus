"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStage = exports.createStage = exports.setStageWeight = exports.setStagePeopleSize = exports.setPerPersonBonus = exports.getStageBonus = exports.getTotalBonus = exports.getperPersonBonus = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jsonPath = path.join(__dirname, 'bonus.json');
// 读取 JSON 数据
const readBonusData = () => {
    const data = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(data);
};
// 修改 JSON 数据
const writeBonusData = (data) => {
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
};
// 获取人均奖金
const getperPersonBonus = () => {
    return readBonusData().perPersonBonus;
};
exports.getperPersonBonus = getperPersonBonus;
// 获取总奖金
const getTotalBonus = () => {
    return readBonusData().totalBonus;
};
exports.getTotalBonus = getTotalBonus;
// 获取各挡位奖金分配情况
const getStageBonus = () => {
    return readBonusData().stageBonus;
};
exports.getStageBonus = getStageBonus;
// 计算总奖金(不进行数据修改)
const calculateTotalBonus = (data) => {
    const perPersonBonus = data.perPersonBonus;
    const stageBonus = data.stageBonus;
    let totalPeopleSize = 0;
    stageBonus.forEach((element) => {
        totalPeopleSize += element.peopleSize;
    });
    return perPersonBonus * totalPeopleSize;
};
// 计算各挡位分配金额情况(不进行数据修改)
const calculateStageBonus = (data) => {
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
const setPerPersonBonus = (value) => {
    const data = readBonusData();
    data.perPersonBonus = value;
    data.totalBonus = calculateTotalBonus(data);
    const stageAmounts = calculateStageBonus(data);
    data.stageBonus.forEach((stage, index) => {
        stage.bonus = stageAmounts[index];
    });
    writeBonusData(data);
};
exports.setPerPersonBonus = setPerPersonBonus;
// 修改第 index 个挡位的人数,并进行数据修改
const setStagePeopleSize = (index, peopleSize) => {
    const data = readBonusData();
    data.stageBonus[index].peopleSize = peopleSize;
    data.totalBonus = calculateTotalBonus(data);
    const stageAmounts = calculateStageBonus(data);
    data.stageBonus.forEach((stage, index) => {
        stage.bonus = stageAmounts[index];
    });
    writeBonusData(data);
};
exports.setStagePeopleSize = setStagePeopleSize;
//修改第 index 个挡位的权重,并进行数据修改
const setStageWeight = (index, weight) => {
    const data = readBonusData();
    data.stageBonus[index].weight = weight;
    data.totalBonus = calculateTotalBonus(data);
    const stageAmounts = calculateStageBonus(data);
    data.stageBonus.forEach((stage, index) => {
        stage.bonus = stageAmounts[index];
    });
    writeBonusData(data);
};
exports.setStageWeight = setStageWeight;
// 新增挡位
const createStage = (peopleSize, weight) => {
    const data = readBonusData();
    // 创建新挡位对象，bonus初始化为0
    const newStage = {
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
};
exports.createStage = createStage;
// 移除挡位
const removeStage = (index) => {
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
};
exports.removeStage = removeStage;
