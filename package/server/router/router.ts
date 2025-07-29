import express from 'express';
import BonusController from '../controller/bonusController';

/**
 * @swagger
 * tags:
 *   name: Bonus
 *   description: 奖金计算相关接口
 */

export const getRouter = () => {
    const bonusController = new BonusController();
    const router = express.Router();

    /**
     * @swagger
     * /api/getPerPersonBonus:
     *   get:
     *     summary: 获取人均奖金
     *     tags: [Bonus]
     *     description: 返回人均奖金金额
     *     responses:
     *       200:
     *         description: 成功返回人均奖金
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   description: 人均奖金金额
     *                   example: 5000
     *                 msg:
     *                   type: string
     *                   example: 成功获取人均奖金数!
     *       500:
     *         description: 获取数据失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   example: 0
     *                 msg:
     *                   type: string
     *                   example: 获取数据失败,请通过日志查看详细错误信息!
     */
    router.get('/getPerPersonBonus', bonusController.getPerPersonBonus);

    /**
     * @swagger
     * /api/getTotalBonus:
     *   get:
     *     summary: 获取总奖金
     *     tags: [Bonus]
     *     description: 计算并返回总奖金金额
     *     responses:
     *       200:
     *         description: 成功返回总奖金
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   description: 总奖金金额
     *                   example: 50000
     *                 msg:
     *                   type: string
     *                   example: 成功获取总奖金!
     *       500:
     *         description: 获取数据失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: number
     *                   example: 0
     *                 msg:
     *                   type: string
     *                   example: 获取数据失败,请通过日志查看详细错误信息!
     */
    router.get('/getTotalBonus', bonusController.getTotalBonus);

    /**
     * @swagger
     * /api/getStageBonus:
     *   get:
     *     summary: 获取各挡位奖金分配情况
     *     tags: [Bonus]
     *     description: 返回挡位奖金分配情况
     *     responses:
     *       200:
     *         description: 成功返回阶段奖金
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       peopleSize:
     *                         type: number
     *                         description: 当前挡位人数
     *                         example: 10
     *                       weight:
     *                         type: number
     *                         description: 当前挡位权重
     *                         example: 1
     *                       bonus:
     *                         type: number
     *                         description: 当前挡位分配奖金
     *                         example: 3000
     *                 msg:
     *                   type: string
     *                   example: 成功获取各挡位奖金分配情况!
     *       500:
     *         description: 获取数据失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   example: []
     *                 msg:
     *                   type: string
     *                   example: 获取数据失败,请通过日志查看详细错误信息!
     */
    router.get('/getStageBonus', bonusController.getStageBonus);

    /**
     * @swagger
     * /api/setPerPersonBonus:
     *   post:
     *     summary: 设置人均奖金
     *     tags: [Bonus]
     *     description: 设置人均奖金金额
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - value
     *             properties:
     *               value:
     *                 type: number
     *                 description: 人均奖金金额
     *                 example: 1000
     *     responses:
     *       200:
     *         description: 设置成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功修改人均奖金!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未获取到数据!
     *       500:
     *         description: 设置失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.post('/setPerPersonBonus', bonusController.setPerPersonBonus);

    /**
     * @swagger
     * /api/setStagePeopleSize:
     *   post:
     *     summary: 设置指定挡位人数
     *     tags: [Bonus]
     *     description: 设置指定挡位人数
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - index
     *               - value
     *             properties:
     *               index:
     *                 type: number
     *                 description: 挡位编号
     *                 example: 0
     *               peopleSize:
     *                 type: number
     *                 description: 人数
     *                 example: 20
     *             peopleSize:
     *               type: number
     *               description: 挡位人数
     *               example: 20
     *     responses:
     *       200:
     *         description: 设置成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功修改挡位人数!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未获取到挡位编号! 或 未获取到人数信息!
     *       500:
     *         description: 设置失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.post('/setStagePeopleSize', bonusController.setStagePeopleSize);

    /**
     * @swagger
     * /api/setStageWeight:
     *   post:
     *     summary: 设置挡位权重
     *     tags: [Bonus]
     *     description: 设置挡位权重
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - index
     *               - value
     *             properties:
     *               index:
     *                 type: number
     *                 description: 挡位索引
     *                 example: 0
     *               weight:
     *                 type: number
     *                 description: 权重值
     *                 example: 1.6
     *     responses:
     *       200:
     *         description: 设置成功
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 成功修改挡位权重!
     *       400:
     *         description: 参数错误
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 未获取到挡位编号! 或 未获取到权重信息!
     *       500:
     *         description: 设置失败
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 msg:
     *                   type: string
     *                   example: 修改失败,请通过日志查看详细错误信息!
     */
    router.post('/setStageWeight', bonusController.setStageWeight);

    return router;
};