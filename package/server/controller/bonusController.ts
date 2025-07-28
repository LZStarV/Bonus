import { Request, Response } from "express";
import * as bonusOperation from '../database/db';
import { logger } from '../config/setLog';


export default class BonusController {

    // 获取人均奖金
    getPerPersonBonus(_req: Request, res: Response) {
        try {
            const perPersonBonus: number = bonusOperation.getperPersonBonus();
            return res.status(200).json({ data: perPersonBonus, msg: '成功获取人均奖金数!' });
        } catch (error) {
            logger.error('获取人均奖金失败', error);
            return res.status(500).json({ data: 0, msg: '获取数据失败,请通过日志查看详细错误信息!' });
        }
    }

    // 获取总奖金
    getTotalBonus(_req: Request, res: Response) {
        try {
            const totalBonus: number = bonusOperation.getTotalBonus();
            return res.status(200).json({ data: totalBonus, msg: '成功获取总奖金!' });
        } catch (error) {
            logger.error('获取总奖金失败', error);
            return res.status(500).json({ data: 0, msg: '获取数据失败,请通过日志查看详细错误信息!' });
        }
    }

    // 获取各挡位奖金分配情况
    getStageBonus(_req: Request, res: Response) {
        try {
            const stageBonus = bonusOperation.getStageBonus();
            return res.status(200).json({ data: stageBonus, msg: '成功获取各挡位奖金分配情况!' });
        } catch (error) {
            logger.error('获取各挡位奖金分配情况失败', error);
            return res.status(500).json({ data: [], msg: '获取数据失败,请通过日志查看详细错误信息!' });
        }
    }

    // 修改人均奖金
    setPerPersonBonus (req: Request, res: Response) {
        try {
            const value: number = req.body.value;
            if (!value) {
                return res.status(400).json({msg: '未获取到数据!'});
            }
            bonusOperation.setPerPersonBonus(value);
            return res.status(200).json({ msg: '成功修改人均奖金!' });
        } catch (error) {
            logger.error('修改人均奖金失败', error);
            return res.status(500).json({msg: '修改失败,请通过日志查看详细错误信息!'})
        }
    }

    // 修改第 index 个挡位的人数,并进行数据修改
    setStagePeopleSize (req: Request, res: Response) {
        try {
            const index: number = req.body.index;
            const peopleSize: number = req.body.value;
            if (!index) {
                return res.status(400).json({msg: '未获取到挡位编号!'});
            }
            if (!peopleSize) {
                return res.status(400).json({msg: '未获取到人数信息!'});
            }
            bonusOperation.setStagePeopleSize(index, peopleSize);
            return res.status(200).json({ msg: '成功修改人均奖金!' });
        } catch (error) {
            logger.error('修改挡位人数失败', error);
            return res.status(500).json({msg: '修改失败,请通过日志查看详细错误信息!'});
        }
    }

    //修改第 index 个挡位的权重,并进行数据修改
    setStageWeight (req: Request, res: Response) {
        try {
            const index: number = req.body.index;
            const weight: number = req.body.value;
            if (!index) {
                return res.status(400).json({msg: '未获取到挡位编号!'});
            }
            if (!weight) {
                return res.status(400).json({msg: '未获取到权重信息!'});
            }
            bonusOperation.setStageWeight(index, weight);
            return res.status(200).json({ msg: '成功修改人均奖金!' });
        } catch (error) {
            logger.error('修改挡位权重失败', error);
            return res.status(500).json({msg: '修改失败,请通过日志查看详细错误信息!'});
        }
    }
}