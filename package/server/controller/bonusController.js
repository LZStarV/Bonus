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
const bonusOperation = __importStar(require("../database/db"));
const setLog_1 = require("../config/setLog");
class BonusController {
    // 获取人均奖金
    getPerPersonBonus(_req, res) {
        try {
            const perPersonBonus = bonusOperation.getperPersonBonus();
            return res.status(200).json({ data: perPersonBonus, msg: '成功获取人均奖金数!' });
        }
        catch (error) {
            setLog_1.logger.error('获取人均奖金失败', error);
            return res.status(500).json({ data: 0, msg: '获取数据失败,请通过日志查看详细错误信息!' });
        }
    }
    // 获取总奖金
    getTotalBonus(_req, res) {
        try {
            const totalBonus = bonusOperation.getTotalBonus();
            return res.status(200).json({ data: totalBonus, msg: '成功获取总奖金!' });
        }
        catch (error) {
            setLog_1.logger.error('获取总奖金失败', error);
            return res.status(500).json({ data: 0, msg: '获取数据失败,请通过日志查看详细错误信息!' });
        }
    }
    // 获取各挡位奖金分配情况
    getStageBonus(_req, res) {
        try {
            const stageBonus = bonusOperation.getStageBonus();
            return res.status(200).json({ data: stageBonus, msg: '成功获取各挡位奖金分配情况!' });
        }
        catch (error) {
            setLog_1.logger.error('获取各挡位奖金分配情况失败', error);
            return res.status(500).json({ data: [], msg: '获取数据失败,请通过日志查看详细错误信息!' });
        }
    }
    // 修改人均奖金
    setPerPersonBonus(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: '请求体不能为空!' });
            }
            const value = req.body.value;
            if (value === null || value === undefined) {
                return res.status(400).json({ msg: '未获取到数据!' });
            }
            bonusOperation.setPerPersonBonus(value);
            return res.status(200).json({ msg: '成功修改人均奖金!' });
        }
        catch (error) {
            setLog_1.logger.error('修改人均奖金失败', error);
            return res.status(500).json({ msg: '修改失败,请通过日志查看详细错误信息!' });
        }
    }
    // 修改第 index 个挡位的人数,并进行数据修改
    setStagePeopleSize(req, res) {
        try {
            const index = parseInt(req.params.index, 10);
            if (isNaN(index) || index < 0) {
                return res.status(400).json({ msg: '无效的挡位索引!' });
            }
            if (!req.body) {
                return res.status(400).json({ msg: '请求体不能为空!' });
            }
            const peopleSize = req.body.peopleSize;
            if (peopleSize === null || peopleSize === undefined) {
                return res.status(400).json({ msg: '未获取到人数信息!' });
            }
            bonusOperation.setStagePeopleSize(index, peopleSize);
            return res.status(200).json({ msg: '成功修改挡位人数!' });
        }
        catch (error) {
            if (error.message === '未找到对应序号') {
                return res.status(404).json({ msg: '未找到对应序号!' });
            }
            setLog_1.logger.error('修改挡位人数失败', error);
            return res.status(500).json({ msg: '修改失败,请通过日志查看详细错误信息!' });
        }
    }
    //修改第 index 个挡位的权重,并进行数据修改
    setStageWeight(req, res) {
        try {
            const index = parseInt(req.params.index, 10);
            if (isNaN(index) || index < 0) {
                return res.status(400).json({ msg: '无效的挡位索引!' });
            }
            if (!req.body) {
                return res.status(400).json({ msg: '请求体不能为空!' });
            }
            const weight = req.body.weight;
            if (weight === null || weight === undefined) {
                return res.status(400).json({ msg: '未获取到权重信息!' });
            }
            bonusOperation.setStageWeight(index, weight);
            return res.status(200).json({ msg: '成功修改挡位权重!' });
        }
        catch (error) {
            if (error.message === '未找到对应序号') {
                return res.status(404).json({ msg: '未找到对应序号!' });
            }
            setLog_1.logger.error('修改挡位权重失败', error);
            return res.status(500).json({ msg: '修改失败,请通过日志查看详细错误信息!' });
        }
    }
    // 新增挡位
    createStage(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ msg: '请求体不能为空!' });
            }
            const { peopleSize, weight } = req.body;
            if (peopleSize === null || peopleSize === undefined) {
                return res.status(400).json({ msg: '未获取到人数信息!' });
            }
            if (weight === null || weight === undefined) {
                return res.status(400).json({ msg: '未获取到权重信息!' });
            }
            bonusOperation.createStage(peopleSize, weight);
            return res.status(200).json({ msg: '成功新增挡位!' });
        }
        catch (error) {
            setLog_1.logger.error('新增挡位失败', error);
            return res.status(500).json({ msg: '修改失败,请通过日志查看详细错误信息!' });
        }
    }
    // 移除挡位
    removeStage(req, res) {
        try {
            if (!req.params) {
                return res.status(400).json({ msg: '请求参数不能为空!' });
            }
            const index = parseInt(req.params.index, 10);
            if (isNaN(index) || index < 0) {
                return res.status(400).json({ msg: '无效的挡位索引!' });
            }
            bonusOperation.removeStage(index);
            return res.status(200).json({ msg: '成功移除挡位!' });
        }
        catch (error) {
            if (error.message === '未找到对应序号') {
                return res.status(404).json({ msg: '未找到对应序号!' });
            }
            setLog_1.logger.error('移除挡位失败', error);
            return res.status(500).json({ msg: '修改失败,请通过日志查看详细错误信息!' });
        }
    }
}
exports.default = BonusController;
